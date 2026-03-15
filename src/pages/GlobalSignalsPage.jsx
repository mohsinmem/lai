import React from 'react';
import { motion } from 'framer-motion';
import { 
  Signal, Globe, Zap, AlertTriangle, 
  ArrowRight, Radio, Search, Activity, BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';
import RelatedPathwaysSection from '../components/RelatedPathwaysSection';

const pageMeta = {
  id: "signals",
  category: "observatory",
  dimension: "signal-detection",
  related: ["/global-index", "/methodology", "/simulation", "/library"]
};

const SEC_STYLE = { padding: '8rem 0' };

const GlobalSignalsPage = () => {
  return (
    <div className="signals-page">
      {/* HERO SECTION */}
      <header className="page-header bg-navy text-white">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="eyebrow text-teal">Real-Time Intelligence</span>
            <h1 className="text-white">Global Adaptiveness Signals</h1>
            <p className="hero-lead">The Data Underlying Organizational Response Speed</p>
          </motion.div>
        </div>
      </header>

      {/* CORE NARRATIVE */}
      <section style={SEC_STYLE}>
        <div className="container narrow text-center">
          <h2 className="section-h2">The Pulse of Organizational Recognition</h2>
          <p className="large-p">The Global Adaptiveness Signals engine monitors how organizations around the world respond to specific disruption triggers. By aggregating these signals, the Institute creates a real-time map of leadership recognition speed.</p>
        </div>
      </section>

      {/* SIGNAL TYPES */}
      <section className="bg-light" style={SEC_STYLE}>
        <div className="container">
          <div className="sec-header mb-5 text-center">
            <span className="eyebrow">Taxonomy</span>
            <h2 className="section-h2">Disruption Vectors We Monitor</h2>
          </div>
          
          <div className="vectors-grid">
            {[
              { icon: <Zap />, title: 'Technological Shift', desc: 'Breakthrough innovations causing rapid obsolescence or operational pivoting.' },
              { icon: <Globe />, title: 'Regulatory Volatility', desc: 'Shifting geopolitical and legislative conditions requiring systemic adaptation.' },
              { icon: <Search />, title: 'Competitive Disruption', desc: 'Aggressive market-share movements and business-model evolutions.' },
              { icon: <Activity />, title: 'Macroeconomic Flux', desc: 'Structural shifts in capital markets, labor, and supply chain integrity.' }
            ].map(vector => (
              <div key={vector.title} className="vector-card">
                <div className="vector-icon">{vector.icon}</div>
                <h3>{vector.vector}</h3>
                <p>{vector.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SIGNAL MAP PLACEHOLDER */}
      <section style={SEC_STYLE}>
        <div className="container text-center">
          <h2 className="section-h2">Global Distribution of Disruption</h2>
          <div className="map-placeholder">
             <div className="placeholder-content">
                <Globe size={64} className="text-slate-300 mb-4" />
                <p>Interactive Signal Map (Placeholder)</p>
                <span className="text-sm text-slate-400">Visualization of environmental triggers vs. organizational response speed.</span>
             </div>
          </div>
        </div>
      </section>

      {/* RECENT INSIGHTS / LIVE FEED */}
      <section className="bg-navy text-white" style={SEC_STYLE}>
        <div className="container">
          <div className="grid-2">
            <div>
              <h2 className="section-h2 text-white">Institutional Signal Feed</h2>
              <p className="text-slate-400 mb-5">High-confidence snapshots of organizational adaptation detected through signal ingestion and institutional research.</p>
              
              <div className="signal-feed">
                 {[
                   { date: 'MAR 15', entity: 'Financial Services', trigger: 'AI Governance Shift', status: 'Emergent' },
                   { date: 'MAR 14', entity: 'Energy Sector', trigger: 'Supply Chain Reshoring', status: 'Antifragile' },
                   { date: 'MAR 12', entity: 'Retail Logistics', trigger: 'Labor Market Volatility', status: 'Fragile' }
                 ].map(item => (
                   <div key={item.trigger} className="feed-item">
                      <span className="feed-date">{item.date}</span>
                      <div className="feed-info">
                         <h4>{item.entity}: {item.trigger}</h4>
                         <span className={`status-pill ${item.status.toLowerCase()}`}>{item.status}</span>
                      </div>
                   </div>
                 ))}
              </div>
            </div>
            <div className="chart-placeholder">
               <div className="eyebrow text-teal">Disruption Intensity</div>
               <BarChart3 size={200} className="text-slate-700 opacity-30 mt-5" />
               <p className="text-slate-500 mt-4">Correlation: Trigger Recognition vs. Resource Mobility</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={SEC_STYLE}>
        <div className="container narrow text-center">
          <h2 className="section-h2">Participate in the Observatory</h2>
          <p className="body-p mb-5">While signal ingestion provides the structural foundation, the highest fidelity data comes from directly observed leadership behavior.</p>
          <Link to="/benchmark" className="btn-institutional">
             Contribute Your Behavioral Data <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <RelatedPathwaysSection 
        relatedPaths={pageMeta.related}
        eyebrow="Intelligence Layer"
        title="Further Pathwaus"
      />

      <style jsx>{`
        .signals-page { background: white; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }
        .narrow { max-width: 800px; margin: 0 auto; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; }
        .text-center { text-align: center; }
        .mb-5 { margin-bottom: 4rem; }
        .mt-5 { margin-top: 3rem; }
        
        .page-header { padding: 12rem 0 8rem; text-align: center; }
        .bg-navy { background: #0a192f; }
        .text-white { color: white; }
        .eyebrow { display: block; font-size: 0.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 1rem; }
        .text-teal { color: #2dd4bf; }
        h1 { font-size: 3.5rem; font-weight: 800; margin-bottom: 1rem; }
        .hero-lead { font-size: 1.5rem; color: #94a3b8; font-weight: 500; }

        .section-h2 { font-size: 2.5rem; font-weight: 800; color: #0a192f; margin-bottom: 1.5rem; }
        .section-h2.text-white { color: white; }
        .large-p { font-size: 1.25rem; line-height: 1.8; color: #475569; }
        .body-p { font-size: 1.15rem; line-height: 1.8; color: #64748b; }

        .bg-light { background: #f8fafc; }

        .vectors-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin-top: 4rem; }
        .vector-card { padding: 2.5rem; background: white; border: 1px solid #e2e8f0; border-radius: 20px; transition: all 0.2s; }
        .vector-card:hover { border-color: #0d9488; transform: translateY(-3px); }
        .vector-icon { color: #0d9488; margin-bottom: 1.5rem; }
        .vector-card h3 { font-size: 1.2rem; font-weight: 800; color: #0a192f; margin-bottom: 0.75rem; }
        .vector-card p { font-size: 0.95rem; color: #64748b; line-height: 1.6; }

        .map-placeholder { aspect-ratio: 16/9; background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 32px; display: flex; align-items: center; justify-content: center; margin-top: 3rem; }
        .placeholder-content { display: flex; flex-direction: column; align-items: center; }
        .placeholder-content p { font-weight: 700; color: #475569; margin-bottom: 0.25rem; }

        .signal-feed { display: flex; flex-direction: column; gap: 1rem; }
        .feed-item { display: flex; gap: 1.5rem; align-items: center; padding: 1.5rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; }
        .feed-date { font-family: 'Inter', monospace; font-weight: 900; font-size: 0.75rem; color: #2dd4bf; }
        .feed-info { flex: 1; display: flex; justify-content: space-between; align-items: center; }
        .feed-info h4 { font-size: 0.95rem; weight: 600; }
        .status-pill { font-size: 0.65rem; font-weight: 900; text-transform: uppercase; padding: 4px 10px; border-radius: 4px; border: 1px solid currentColor; }
        .status-pill.emergent { color: #3b82f6; }
        .status-pill.antifragile { color: #10b981; }
        .status-pill.fragile { color: #ef4444; }

        .chart-placeholder { background: rgba(0,0,0,0.2); border-radius: 24px; padding: 3rem; display: flex; flex-direction: column; align-items: center; border: 1px solid rgba(255,255,255,0.05); }

        .btn-institutional { 
          display: inline-flex; 
          align-items: center; 
          gap: 0.75rem; 
          background: #0a192f; 
          color: white !important; 
          padding: 1.25rem 2.5rem; 
          border-radius: 12px; 
          font-weight: 800; 
          text-decoration: none;
          transition: transform 0.2s;
        }
        .btn-institutional:hover { transform: translateY(-2px); }

        @media (max-width: 992px) {
          h1 { font-size: 2.5rem; }
          .grid-2 { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default GlobalSignalsPage;
