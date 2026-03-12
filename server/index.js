const express = require('express');
const cors = require('cors');
const path = require('path');
const supabase = require('./supabase');
const db = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    'http://localhost:5173', 
    'https://leadershipadaptiveness.institute', 
    'https://www.leadershipadaptiveness.institute',
    'https://lai.institute',
    'https://www.lai.institute',
    'https://adaptiveness.institute',
    'https://www.adaptiveness.institute'
  ]
}));
app.use(express.json());

// Serve the built React frontend
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// API Routes

// Get Global Index Stats (still from local SQLite seed data)
app.get('/api/stats', (req, res) => {
  try {
    const data = db.prepare('SELECT * FROM global_index_data ORDER BY score DESC').all();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch global stats' });
  }
});

// Submit Diagnostic Result → Supabase
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
    console.error('Supabase insert error:', err);
    res.status(500).json({ error: 'Failed to save diagnostic outcome' });
  }
});

// Submit Demo Request → Supabase
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
    console.error('Supabase insert error:', err);
    res.status(500).json({ error: 'Failed to process demo request' });
  }
});

// Get Global Analytics (Heatmap/Regional Data) → Supabase
app.get('/api/analytics/global', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('diagnostic_results')
      .select('region, overall_score, signal_score, emotional_score, resource_score, decision_score, execution_score')
      .not('region', 'is', null)
      .neq('region', '');

    if (error) throw error;

    // Aggregate by region in JS
    const regionMap = {};
    for (const row of data) {
      if (!regionMap[row.region]) {
        regionMap[row.region] = { region: row.region, participants: 0, totals: { overall: 0, signal: 0, emotional: 0, resource: 0, decision: 0, execution: 0 } };
      }
      const r = regionMap[row.region];
      r.participants++;
      r.totals.overall += row.overall_score;
      r.totals.signal += row.signal_score;
      r.totals.emotional += row.emotional_score;
      r.totals.resource += row.resource_score;
      r.totals.decision += row.decision_score;
      r.totals.execution += row.execution_score;
    }

    const result = Object.values(regionMap).map(r => ({
      region: r.region,
      participants: r.participants,
      avg_score: +(r.totals.overall / r.participants).toFixed(1),
      avg_signal: +(r.totals.signal / r.participants).toFixed(1),
      avg_emotional: +(r.totals.emotional / r.participants).toFixed(1),
      avg_resource: +(r.totals.resource / r.participants).toFixed(1),
      avg_decision: +(r.totals.decision / r.participants).toFixed(1),
      avg_execution: +(r.totals.execution / r.participants).toFixed(1),
    })).sort((a, b) => b.avg_score - a.avg_score);

    res.json(result);
  } catch (err) {
    console.error('Supabase analytics error:', err);
    res.status(500).json({ error: 'Failed to fetch global analytics' });
  }
});

// SPA catch-all: any route not handled by API returns the React app
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`LAI Backend running on http://0.0.0.0:${PORT}`);
});
