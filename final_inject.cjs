const https = require('https');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL.trim().replace(/\/$/, '');
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

// Apple ID from previous audit logs or we use name-based fallback as I updated api.js
const signals = [
  {
    organization_name: 'Apple',
    source_type: 'RESEARCH',
    overall_lai_score: 84,
    cognitive_score: 88,
    signal_detection_score: 82,
    resource_reallocation_score: 79,
    decision_alignment_score: 85,
    execution_responsiveness_score: 88,
    region: 'North America',
    industry: 'Technology',
    session_date: new Date().toISOString(),
    is_published: true
  },
  {
    organization_name: 'NVIDIA',
    source_type: 'RESEARCH',
    overall_lai_score: 91,
    cognitive_score: 94,
    signal_detection_score: 89,
    resource_reallocation_score: 92,
    decision_alignment_score: 90,
    execution_responsiveness_score: 95,
    region: 'North America',
    industry: 'Semiconductors',
    session_date: new Date().toISOString(),
    is_published: true
  }
];

const url = new URL(supabaseUrl + '/rest/v1/diagnostic_results');
const options = {
  method: 'POST',
  headers: {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=minimal'
  }
};

const req = https.request(url, options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    if (res.statusCode >= 200 && res.statusCode < 300) {
      console.log('✅ Apple & NVIDIA signals injected!');
    } else {
      console.error('❌ Injection Failed:', data);
    }
  });
});

req.on('error', err => console.error(err));
req.write(JSON.stringify(signals));
req.end();
