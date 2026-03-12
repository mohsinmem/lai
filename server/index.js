const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes

// Get Global Index Stats
app.get('/api/stats', (req, res) => {
  try {
    const data = db.prepare('SELECT * FROM global_index_data ORDER BY score DESC').all();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch global stats' });
  }
});

// Submit Diagnostic Result
app.post('/api/diagnostic', (req, res) => {
  const { 
    organization_name, industry, region,
    overall_score, signal_score, emotional_score, resource_score, decision_score, execution_score 
  } = req.body;
  
  try {
    const stmt = db.prepare(`
      INSERT INTO diagnostic_results (
        organization_name, industry, region,
        overall_score, signal_score, emotional_score, resource_score, decision_score, execution_score
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      organization_name, industry, region,
      overall_score, signal_score, emotional_score, resource_score, decision_score, execution_score
    );
    res.status(201).json({ id: info.lastInsertRowid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save diagnostic outcome' });
  }
});

// Submit Demo Request
app.post('/api/demo-request', (req, res) => {
  const { name, email, organization } = req.body;
  
  try {
    const stmt = db.prepare('INSERT INTO demo_requests (name, email, organization) VALUES (?, ?, ?)');
    const info = stmt.run(name, email, organization);
    res.status(201).json({ id: info.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: 'Failed to process demo request' });
  }
});

app.listen(PORT, () => {
  console.log(`LAI Backend running on http://localhost:${PORT}`);
});
