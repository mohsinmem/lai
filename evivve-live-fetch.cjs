const axios = require('axios');

// Simulation/Live Config - To be provided by user
const EVIVVE_API_URL = process.env.EVIVVE_API_URL;
const EVIVVE_TOKEN = process.env.EVIVVE_TOKEN;
const LAI_INGEST_URL = 'https://lai.institute/api/ingest-multiplayer';

async function performLiveIngestion() {
    if (!EVIVVE_API_URL || !EVIVVE_TOKEN) {
        console.error('❌ Missing EVIVVE_API_URL or EVIVVE_TOKEN environment variables.');
        process.exit(1);
    }

    try {
        console.log('📡 Fetching live telemetry from Evivve portal...');
        const response = await axios.get(EVIVVE_API_URL, {
            headers: {
                'Authorization': `Bearer ${EVIVVE_TOKEN}`,
                'Accept': 'application/json'
            }
        });

        const multiplayer_data = response.data;
        console.log(`✅ Data retrieved. Size: ${JSON.stringify(multiplayer_data).length} bytes`);

        console.log('🚀 Pumping data into LAI Ingestion API...');
        const ingestResponse = await axios.post(LAI_INGEST_URL, {
            organization_name: "PG Miners", // Default for now
            region: "Global",
            multiplayer_data: multiplayer_data
        }, {
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        });

        console.log('✨ Ingestion Complete!');
        console.log('AFERR Analytics:', ingestResponse.data);
        
    } catch (err) {
        console.error('❌ Ingestion Failed:', err.response?.data || err.message);
        process.exit(1);
    }
}

performLiveIngestion();
