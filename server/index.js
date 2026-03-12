const express = require('express');
const cors = require('cors');
const path = require('path');
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

// Get Global Analytics (Heatmap/Regional Data)
app.get('/api/analytics/global', (req, res) => {
  try {
    const data = db.prepare(`
      SELECT 
        region, 
        COUNT(*) as participants,
        ROUND(AVG(overall_score), 1) as avg_score,
        ROUND(AVG(signal_score), 1) as avg_signal,
        ROUND(AVG(emotional_score), 1) as avg_emotional,
        ROUND(AVG(resource_score), 1) as avg_resource,
        ROUND(AVG(decision_score), 1) as avg_decision,
        ROUND(AVG(execution_score), 1) as avg_execution
      FROM diagnostic_results 
      WHERE region IS NOT NULL AND region != ''
      GROUP BY region
      ORDER BY avg_score DESC
    `).all();
    res.json(data);
  } catch (err) {
    console.error(err);
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
