const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'lai.db');
const db = new Database(dbPath);

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS diagnostic_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    overall_score INTEGER,
    signal_score REAL,
    emotional_score REAL,
    resource_score REAL,
    decision_score REAL,
    execution_score REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS demo_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    organization TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS global_index_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    country TEXT,
    score INTEGER,
    trend TEXT,
    status TEXT
  );
`);

// Seed Global Index Data if empty
const count = db.prepare('SELECT count(*) as count FROM global_index_data').get();
if (count.count === 0) {
  const insert = db.prepare('INSERT INTO global_index_data (country, score, trend, status) VALUES (?, ?, ?, ?)');
  const data = [
    ['Switzerland', 88, '+2', 'High'],
    ['Singapore', 86, '+1', 'High'],
    ['Denmark', 85, '0', 'High'],
    ['USA', 82, '-1', 'High'],
    ['Germany', 81, '+3', 'High'],
    ['South Korea', 79, '+4', 'Moderate'],
    ['Japan', 78, '0', 'Moderate'],
    ['Sweden', 77, '-2', 'Moderate'],
  ];
  const transaction = db.transaction((rows) => {
    for (const row of rows) insert.run(row);
  });
  transaction(data);
}

module.exports = db;
