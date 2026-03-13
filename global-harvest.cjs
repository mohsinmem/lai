const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const MASTER_REGISTRY_URL = 'https://ev3-backend.evivve.com/api/programSessionGames?date=&toDate=';
const GAME_DETAIL_BASE_URL = 'https://ev3-backend.evivve.com/api/gameview/room/';
const LAI_INGEST_URL = 'https://lai.institute/api/ingest-multiplayer';
const LAI_SEED_URL = 'https://lai.institute/.netlify/functions/seed-org'; 

const STATE_FILE = path.join(__dirname, 'harvest-state.json');
const BEARER_TOKEN = process.env.EVIVVE_TOKEN;

async function globalHarvest() {
    if (!BEARER_TOKEN) {
        console.error('❌ Missing EVIVVE_TOKEN environment variable.');
        process.exit(1);
    }

    let state = { ingested_games: [] };
    if (fs.existsSync(STATE_FILE)) {
        state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    }

    try {
        console.log('📡 Fetching Master Registry (High Bandwidth Mode)...');
        const registryResponse = await axios.get(MASTER_REGISTRY_URL, {
            headers: { 'Authorization': `Bearer ${BEARER_TOKEN}` }
        });

        const games = registryResponse.data;
        console.log(`🔍 Found ${games.length} games in registry.`);

        const newGames = games.filter(g => !state.ingested_games.includes(g.id));
        console.log(`🚀 Processing ${newGames.length} new games...`);

        for (const game of newGames) {
            const gameId = game.id;
            try {
                console.log(`\n📦 Ingesting Game: ${gameId}`);
                
                let telemetry;
                if (game.activitiesBinary && game.activitiesBinary.activities) {
                    console.log('⚡ Using cached telemetry from registry.');
                    const events = game.activitiesBinary.activities.flatMap(d => d.activity || []);
                    telemetry = {
                        market_events: events.filter(e => e.activity === 'MV_COST_CHANGE').map(e => ({ ...e, type: e.activity })),
                        actions: events.filter(e => e.activity !== 'MV_COST_CHANGE').map(e => ({ 
                            ...e, 
                            type: e.activity === 'OFFER' ? 'SUBMIT_OFFER' : e.activity,
                            resourceType: e.resource 
                        })),
                        state: {
                            initial_tribe_value: 1000,
                            final_tribe_value: game.activitiesBinary.dashboardData?.tribeValue || 0,
                            completion_at: new Date(game.stoppedAt || game.createdAt).getTime()
                        }
                    };
                } else {
                    console.log('🌐 Fetching detailed telemetry from API fallback...');
                    const detailResponse = await axios.get(`${GAME_DETAIL_BASE_URL}${gameId}`, {
                        headers: { 'Authorization': `Bearer ${BEARER_TOKEN}` }
                    });
                    telemetry = detailResponse.data;
                }

                const tribeName = game.tribeName || "Independent Tribe";
                const sessionDate = game.startedAt || game.createdAt;
                const durationSeconds = game.stoppedAt && game.startedAt ? 
                    Math.round((new Date(game.stoppedAt) - new Date(game.startedAt)) / 1000) : 0;

                // Forward to AFERR Engine
                console.log(`⚙️  Analyzing AFERR scores for ${tribeName}...`);
                const ingestResponse = await axios.post(LAI_INGEST_URL, {
                    organization_name: tribeName,
                    region: game.region || "Global",
                    multiplayer_data: telemetry,
                    session_date: sessionDate,
                    duration_seconds: durationSeconds
                });

                console.log(`✅ Success: ${tribeName} | Score: ${ingestResponse.data.aferr_overall}`);

                // Update State
                state.ingested_games.push(gameId);
                fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));

            } catch (err) {
                console.error(`❌ Error processing game ${gameId}:`, JSON.stringify(err.response?.data || err.message, null, 2));
            }
        }

        console.log('\n✨ Global Harvest Protocol Completed.');
        console.log(`Total Ingested this run: ${newGames.length}`);

    } catch (err) {
        console.error('❌ Master Registry Fetch Failed:', err.message);
        process.exit(1);
    }
}

globalHarvest();
