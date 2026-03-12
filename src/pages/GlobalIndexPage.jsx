import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, TrendingUp, Search, Filter } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const GlobalIndexPage = () => {
  const [rankings, setRankings] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/stats`)
      .then(res => res.json())
      .then(data => setRankings(data))
      .catch(err => console.error('Failed to fetch stats:', err));
  }, []);
  return (
    <div className="glai-page">
      <header className="page-header">
        <div className="container">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            Global Leadership Adaptiveness Index
          </motion.h1>
          <p className="subtitle">Measuring how the world's organizations respond to change</p>
        </div>
      </header>

      <section className="glai-map-section">
        <div className="container">
          <div className="map-controls">
            <div className="search-bar">
              <Search size={18} />
              <input type="text" placeholder="Search country or region..." />
            </div>
            <div className="filter-group">
              <button className="btn-filter active">Global</button>
              <button className="btn-filter">By Industry</button>
              <button className="btn-filter">By Region</button>
            </div>
          </div>

          <div className="interactive-map-mock">
            <div className="map-graphic">
              {/* Representing a world map with abstract data points */}
              <div className="map-point high" style={{ top: '25%', left: '15%' }}></div>
              <div className="map-point high" style={{ top: '30%', left: '48%' }}></div>
              <div className="map-point mod" style={{ top: '65%', left: '75%' }}></div>
              <div className="map-point risk" style={{ top: '55%', left: '30%' }}></div>
              <div className="map-point high" style={{ top: '20%', left: '80%' }}></div>
              <img src="https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&q=80&w=1200" alt="World Map" />
            </div>
            <div className="map-legend">
              <div className="legend-item"><span className="dot high"></span> Highly Adaptive (80+)</div>
              <div className="legend-item"><span className="dot mod"></span> Moderately Adaptive (60-79)</div>
              <div className="legend-item"><span className="dot risk"></span> Adaptiveness Risk (40-59)</div>
            </div>
          </div>
        </div>
      </section>

      <section className="index-rankings">
        <div className="container">
          <div className="section-header">
            <h2>2024 Global Rankings</h2>
            <p>Aggregate scores based on organizational participation and behavioral simulations.</p>
          </div>

          <div className="ranking-table">
            <div className="table-row head">
              <span>Rank</span>
              <span>Country/Region</span>
              <span>LAI Score</span>
              <span>Trend</span>
              <span>Status</span>
            </div>
            {rankings.map((r) => (
              <motion.div 
                key={r.country}
                className="table-row"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <span className="rank-num">#{r.rank}</span>
                <span className="country-name">{r.country}</span>
                <span className="iai-score">{r.score}</span>
                <span className={`trend ${r.trend.startsWith('+') ? 'up' : 'down'}`}>{r.trend}</span>
                <span className={`status-pill ${r.status.toLowerCase()}`}>{r.status}</span>
              </motion.div>
            ))}
          </div>

          <div className="cta-box">
            <h3>Add Your Organization to the Index</h3>
            <p>Participate in our global research to benchmark your leadership team against industry standards.</p>
            <button className="btn-primary">Register for Measurement</button>
          </div>
        </div>
      </section>

      <style jsx>{`
        .glai-page { padding-bottom: 8rem; }
        
        .page-header {
          padding: 10rem 0 6rem;
          background: #f8fafc;
          text-align: center;
        }

        .page-header h1 { font-size: 3.5rem; margin-bottom: 1rem; color: var(--navy); }
        .subtitle { font-family: var(--font-sans); color: var(--teal); font-weight: 700; text-transform: uppercase; letter-spacing: 2px; }

        .map-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: white;
          border-radius: 8px;
          border: 1px solid var(--border-color);
        }

        .search-bar { display: flex; align-items: center; gap: 1rem; flex: 1; max-width: 400px; }
        .search-bar input { border: none; outline: none; width: 100%; font-size: 0.9rem; }

        .filter-group { display: flex; gap: 1rem; }
        .btn-filter {
          background: none; border: 1px solid var(--border-color); padding: 0.5rem 1rem; border-radius: 4px;
          font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: all 0.2s ease;
        }
        .btn-filter.active { background: var(--navy); color: white; border-color: var(--navy); }

        .interactive-map-mock {
          position: relative; border-radius: 12px; overflow: hidden; background: white;
          box-shadow: 0 30px 60px rgba(0,0,0,0.1); margin-bottom: 6rem;
        }
        .map-graphic { position: relative; height: 500px; overflow: hidden; }
        .map-graphic img { width: 100%; height: 100%; object-fit: cover; opacity: 0.3; filter: grayscale(1); }
        
        .map-point {
          position: absolute; width: 24px; height: 24px; border-radius: 50%; border: 4px solid white;
          box-shadow: 0 0 20px rgba(0,0,0,0.2);
        }
        .map-point.high { background: var(--teal); }
        .map-point.mod { background: var(--navy); }
        .map-point.risk { background: var(--slate); }

        .map-legend {
          position: absolute; bottom: 2rem; left: 2rem; background: white; padding: 1.5rem; border-radius: 8px;
          display: flex; flex-direction: column; gap: 0.75rem; box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .legend-item { display: flex; align-items: center; gap: 1rem; font-size: 0.8rem; font-weight: 600; color: var(--navy); }
        .dot { width: 12px; height: 12px; border-radius: 50%; }
        .dot.high { background: var(--teal); }
        .dot.mod { background: var(--navy); }
        .dot.risk { background: var(--slate); }

        .ranking-table { margin-top: 4rem; background: white; border-radius: 12px; border: 1px solid var(--border-color); overflow: hidden; }
        .table-row { display: grid; grid-template-columns: 80px 1fr 120px 120px 150px; padding: 1.5rem 2rem; border-bottom: 1px solid #f1f5f9; align-items: center; }
        .table-row.head { background: #f8fafc; font-weight: 700; color: var(--slate); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; }
        
        .rank-num { font-weight: 700; color: var(--slate-light); }
        .country-name { font-weight: 600; font-size: 1.1rem; color: var(--navy); }
        .iai-score { font-weight: 800; font-size: 1.2rem; color: var(--teal); }
        .trend.up { color: #38a169; }
        .trend.down { color: #e53e3e; }
        .status-pill {
          padding: 0.25rem 0.75rem; border-radius: 100px; font-size: 0.75rem; font-weight: 700; text-align: center;
        }
        .status-pill.high { background: rgba(49, 151, 149, 0.1); color: var(--teal); }
        .status-pill.moderate { background: rgba(10, 25, 47, 0.1); color: var(--navy); }

        .cta-box {
          margin-top: 5rem; padding: 4rem; background: var(--navy); color: white; border-radius: 12px; text-align: center;
        }
        .cta-box h3 { font-size: 2rem; color: white; margin-bottom: 1rem; }
        .cta-box p { color: #cbd5e0; margin-bottom: 2.5rem; }
        .btn-primary { background: var(--teal); color: white; border: none; padding: 1rem 2.5rem; border-radius: 4px; font-weight: 700; cursor: pointer; }

        @media (max-width: 768px) {
          .table-row { grid-template-columns: 50px 1fr 80px; }
          .trend, .status-pill { display: none; }
          .page-header h1 { font-size: 2.5rem; }
        }
      `}</style>
    </div>
  );
};

export default GlobalIndexPage;
