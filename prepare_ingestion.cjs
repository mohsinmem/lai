const fs = require('fs');
const path = require('path');

const RAW_FILE = 'C:\\Users\\mmemo\\Downloads\\mmemon@evivve.com.ical (1)\\multiplayer.json';
const OUTPUT_FILE = 'C:\\Users\\mmemo\\AppData\\Local\\Temp\\formatted_payload.json';

try {
    const rawData = JSON.parse(fs.readFileSync(RAW_FILE, 'utf8'));
    
    // AFERR Transformation Logic
    // api.js expects: { organization_name: string, region: string, multiplayer_data: { market_events: [], actions: [] } }
    // and market_events/actions should have _at field.
    
    const logs = Array.isArray(rawData) ? rawData : (rawData.logs || []);
    
    const market_events = logs.filter(l => l.type === 'market_event' || l.event_type).map(e => ({
        ...e,
        _at: e._at || e.time || Date.now()
    }));
    
    const actions = logs.filter(l => l.type === 'action' || l.action_type).map(a => ({
        ...a,
        _at: a._at || a.time || Date.now()
    }));
    
    const payload = {
        organization_name: "PG Miners",
        region: "Global",
        multiplayer_data: {
            market_events,
            actions,
            state: rawData.state || {}
        }
    };

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(payload, null, 2));
    console.log(`Successfully prepared nested payload for PG Miners at ${OUTPUT_FILE}`);
} catch (err) {
    console.error('Failed to prepare ingestion:', err.message);
    process.exit(1);
}
