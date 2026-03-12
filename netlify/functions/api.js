const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const supabase = require('./lib/supabase');

const app = express();

app.use(cors());
app.use(express.json());

// API Routes

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

// Global Analytics
app.get('/api/analytics/global', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('diagnostic_results')
      .select('*');

    if (error) throw error;

    // Aggregate by region
    const regions = {};
    data.forEach(row => {
      if (!row.region) return;
      if (!regions[row.region]) {
        regions[row.region] = { 
          region: row.region, 
          participants: 0, 
          scores: { overall: 0, signal: 0, emotional: 0, resource: 0, decision: 0, execution: 0 } 
        };
      }
      const r = regions[row.region];
      r.participants++;
      r.scores.overall += row.overall_score;
      r.scores.signal += row.signal_score;
      r.scores.emotional += row.emotional_score;
      r.scores.resource += row.resource_score;
      r.scores.decision += row.decision_score;
      r.scores.execution += row.execution_score;
    });

    const analytics = Object.values(regions).map(r => ({
      region: r.region,
      participants: r.participants,
      avg_score: Math.round(r.scores.overall / r.participants),
      avg_signal: Math.round(r.scores.signal / r.participants),
      avg_emotional: Math.round(r.scores.emotional / r.participants),
      avg_resource: Math.round(r.scores.resource / r.participants),
      avg_decision: Math.round(r.scores.decision / r.participants),
      avg_execution: Math.round(r.scores.execution / r.participants),
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

module.exports.handler = serverless(app);
