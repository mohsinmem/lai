const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const supabase = require('./lib/supabase');

const app = express();

app.use(cors());
app.use(express.json());

// API Routes

// Health Check
app.get('/api/health', async (req, res) => {
  try {
    const { data: tables, error } = await supabase
      .from('diagnostic_results')
      .select('count', { count: 'exact', head: true });
    
    res.json({ 
      status: 'ok', 
      supabase: !!supabase.auth,
      tables: {
        diagnostic_results: !error
      }
    });
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
  
  try {
    const { data, error } = await supabase
      .from('diagnostic_results')
      .insert([{
        organization_name,
        industry,
        region,
        overall_score,
        signal_score,
        emotional_score,
        resource_score,
        decision_score,
        execution_score
      }])
      .select();

    if (error) throw error;
    res.status(201).json({ id: data[0].id });
  } catch (err) {
    console.error('Supabase Error:', err);
    res.status(500).json({ error: 'Failed to save diagnostic' });
  }
});

// Global Analytics (Unified Diagnostic + Research)
app.get('/api/analytics/global', async (req, res) => {
  try {
    const [{ data: diagData }, { data: researchData }] = await Promise.all([
      supabase.from('diagnostic_results').select('*'),
      supabase.from('company_research').select('*')
    ]);

    // Aggregate by region
    const regions = {};
    
    const processEntry = (row, isResearch = false) => {
      if (!row.region) return;
      if (!regions[row.region]) {
        regions[row.region] = { 
          region: row.region, 
          count: 0, 
          total_score: 0 
        };
      }
      const r = regions[row.region];
      r.count++;
      r.total_score += isResearch ? row.adaptiveness_score : row.overall_score;
    };

    if (diagData) diagData.forEach(row => processEntry(row));
    if (researchData) researchData.forEach(row => processEntry(row, true));

    const analytics = Object.values(regions).map(r => ({
      region: r.region,
      participants: r.count,
      avg_score: Math.round(r.total_score / r.count)
    }));

    res.json(analytics);
  } catch (err) {
    console.error('Supabase Error:', err);
    res.status(500).json({ error: 'Failed to fetch analytics' });
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
