const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const supabase = require('./lib/supabase');

const app = express();

app.use(cors());
app.use(express.json());

// API Routes

// Health Check - Enhanced Deep Diagnostic
app.get('/api/health', async (req, res) => {
  try {
    const health = {
      status: 'ok',
      version: '1.1.0',
      timestamp: new Date().toISOString(),
      env: {
        has_url: !!process.env.SUPABASE_URL,
        has_key: !!(process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_KEY)
      },
      tables: {}
    };

    // Deep Schema Check
    const checkTableSchema = async (tableName, requiredColumns) => {
      try {
        const { data, error } = await supabase.from(tableName).select('*').limit(1);
        if (error) return { exists: false, error: error.message };
        
        const existingColumns = data.length > 0 ? Object.keys(data[0]) : [];
        if (data.length === 0) {
            // Table exists but is empty, we can't easily check columns without data 
            // but we can trust the select * didn't fail
            return { exists: true, isEmpty: true };
        }
        
        const missing = requiredColumns.filter(c => !existingColumns.includes(c));
        return { exists: true, missing_columns: missing, ok: missing.length === 0 };
      } catch (e) {
        return { exists: false, error: e.message };
      }
    };

    health.tables.diagnostic_results = await checkTableSchema('diagnostic_results', ['organization_name', 'overall_score', 'region']);
    health.tables.company_research = await checkTableSchema('company_research', ['company_name', 'adaptiveness_score', 'region']);
    health.tables.research_queue = await checkTableSchema('research_queue', ['company_name', 'status']);
    health.tables.scraper_logs = await checkTableSchema('scraper_logs', ['status', 'summary']);

    res.json(health);
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Diagnostic Results
app.post('/api/diagnostic', async (req, res) => {
  const { 
    organization_name, industry, region,
    overall_score, signal_score, emotional_score, resource_score, decision_score, execution_score 
  } = req.body;
  
  if (!organization_name) {
    return res.status(400).json({ error: 'Organization name is required' });
  }
  
  try {
    const { data, error } = await supabase
      .from('diagnostic_results')
      .insert([{
        organization_name,
        industry,
        region: region || 'Global',
        overall_score: overall_score || 0,
        signal_score: signal_score || 0,
        emotional_score: emotional_score || 0,
        resource_score: resource_score || 0,
        decision_score: decision_score || 0,
        execution_score: execution_score || 0
      }])
      .select();

    if (error) throw error;
    res.status(201).json({ id: data[0].id });
  } catch (err) {
    console.error('Supabase Save Error:', err.message);
    res.status(500).json({ error: `Save failed: ${err.message}` });
  }
});

// Global Analytics (Unified Diagnostic + Research)
app.get('/api/analytics/global', async (req, res) => {
  try {
    // Graceful fetch - don't crash if one table is missing
    const results = await Promise.allSettled([
      supabase.from('diagnostic_results').select('region, overall_score'),
      supabase.from('company_research').select('region, adaptiveness_score')
    ]);

    const diagData = results[0].status === 'fulfilled' ? results[0].value.data : [];
    const researchData = results[1].status === 'fulfilled' ? results[1].value.data : [];

    // Aggregate by region
    const regions = {};
    
    const processEntry = (row, scoreKey) => {
      if (!row || !row.region) return;
      if (!regions[row.region]) {
        regions[row.region] = { region: row.region, count: 0, total_score: 0 };
      }
      const r = regions[row.region];
      r.count++;
      r.total_score += row[scoreKey] || 0;
    };

    if (Array.isArray(diagData)) diagData.forEach(row => processEntry(row, 'overall_score'));
    if (Array.isArray(researchData)) researchData.forEach(row => processEntry(row, 'adaptiveness_score'));

    const analytics = Object.values(regions).map(r => ({
      region: r.region,
      participants: r.count,
      avg_score: Math.round(r.total_score / r.count) || 0
    }));

    res.json(analytics);
  } catch (err) {
    console.error('Analytics Error:', err);
    res.json([]); // Fallback to empty instead of 500
  }
});

// Demo Request
app.post('/api/demo-request', async (req, res) => {
  const { name, email, organization } = req.body;
  try {
    const { data, error } = await supabase
      .from('demo_requests')
      .insert([{ name, email, organization }])
      .select();

    if (error) throw error;
    res.status(201).json({ id: data[0].id });
  } catch (err) {
    console.error('Supabase Error:', err);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

// Live Research Signals
app.get('/api/research/live', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('company_research')
      .select('*')
      .order('last_researched', { ascending: false })
      .limit(10);

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Supabase Error (Research Feed):', err);
    // Return empty array instead of 500 so UI doesn't break if table isn't seeded yet
    res.json([]);
  }
});

module.exports.handler = serverless(app);
