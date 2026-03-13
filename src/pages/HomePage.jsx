import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Signal, Heart, Layers, Target, Zap, TrendingUp, Globe, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import LiveSignalsWidget from '../components/LiveSignalsWidget';

const HomePage = () => {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="container grid-12">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="badge">Established 2024 • Global Research</span>
            <h1>Establishing the Global Standard for <span>Leadership Adaptiveness</span></h1>
            <p className="hero-lead">
              The primary challenge facing modern leaders is not strategy or execution. It is adaptiveness — the defining capability that determines whether organizations survive disruption or fall behind it.
            </p>
            <div className="hero-ctas">
              <Link to="/diagnostic" className="btn-primary">Take the Diagnostic Assessment</Link>
              <Link to="/manifesto" className="btn-secondary">Read the Manifesto</Link>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-value">20k+</span>
                <span className="stat-label">Simulations Run</span>
              </div>
              <div className="stat">
                <span className="stat-value">100k+</span>
                <span className="stat-label">Participants</span>
              </div>
              <div className="stat">
                <span className="stat-value">45</span>
                <span className="stat-label">Countries Indexed</span>
              </div>
            </div>
          </motion.div>
          <motion.div 
            className="hero-image"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="image-wrapper">
              <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000" alt="LAI HQ" />
              <div className="image-overlay"></div>
            </div>
            
            <div className="mt-8">
              <LiveSignalsWidget />
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Adaptiveness Gap */}
      <section className="gap-section">
        <div className="container">
          <div className="grid-12">
            <div className="gap-text">
              <h2 className="section-title">The Adaptiveness Gap</h2>
              <p>
                Across industries, a consistent pattern appears. Leaders recognize change intellectually, but actual decisions lag behind. This creates the <strong>Adaptiveness Gap</strong>: the distance between recognition and action.
              </p>
              <ul className="gap-list">
                <li><ArrowRight size={16} className="text-teal" /> Budgets remain tied to outdated priorities.</li>
                <li><ArrowRight size={16} className="text-teal" /> Teams execute plans with expired assumptions.</li>
                <li><ArrowRight size={16} className="text-teal" /> Strategic drift accumulates into systemic failure.</li>
              </ul>
            </div>
            <div className="gap-visual">
              <div className="gap-gauge">
                <div className="gauge-track"></div>
                <div className="gauge-fill"></div>
                <div className="gauge-labels">
                  <span>Recognition</span>
                  <span className="gap-label">THE GAP</span>
                  <span>Action</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Framework */}
      <section className="framework-preview">
        <div className="container">
          <div className="section-header">
            <h2>The Leadership Adaptiveness Framework</h2>
            <p>Our research identifies five interconnected behavioral dimensions that determine an organization's adaptive capacity.</p>
          </div>
          
          <div className="framework-grid">
            {[
              { icon: <Signal />, title: 'Signal Detection', desc: 'Recognizing early indicators that circumstances are changing.' },
              { icon: <Heart />, title: 'Emotional Framing', desc: 'Interpreting uncertainty with curiosity rather than threat.' },
              { icon: <Layers />, title: 'Resource Reallocation', desc: 'Shifting investment and effort toward emerging priorities.' },
              { icon: <Target />, title: 'Decision Alignment', desc: 'Maintaining coherence among leadership decisions.' },
              { icon: <Zap />, title: 'Execution Responsiveness', desc: 'Translating understanding into operational change.' }
            ].map((dim, i) => (
              <motion.div 
                key={dim.title} 
                className="f-card"
                whileHover={{ y: -10 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="f-icon">{dim.icon}</div>
                <h3>{dim.title}</h3>
                <p>{dim.desc}</p>
                <Link to="/framework" className="f-link">Learn more <ArrowRight size={14} /></Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Index Heatmap Preview */}
      <section className="glai-preview">
        <div className="container grid-12">
          <div className="glai-content">
            <h2 className="section-title">Global Leadership Adaptiveness Index</h2>
            <p>Aggregating behavioral data from organizations worldwide to establish transparency in how the world's leaders respond to change.</p>
            <div className="glai-stats">
              <div className="glai-stat">
                <TrendingUp className="text-teal" />
                <div>
                  <h4>+12%</h4>
                  <p>Global Adaptiveness YOY</p>
                </div>
              </div>
              <div className="glai-stat">
                <Globe className="text-teal" />
                <div>
                  <h4>Region: APAC</h4>
                  <p>Leading in Signal Detection</p>
                </div>
              </div>
            </div>
            <Link to="/global-index" className="btn-primary">View Global Map</Link>
          </div>
          <div className="glai-heatmap">
            <div className="heatmap-mockup">
              <div className="map-blob b1"></div>
              <div className="map-blob b2"></div>
              <div className="map-blob b3"></div>
            </div>
            
            {/* Hierarchy of Truth Legend */}
            <div className="intelligence-legend">
              <h4 className="legend-title">Hierarchy of Truth</h4>
              <div className="legend-items">
                <div className="legend-item">
                  <div className="legend-tier tier-0">Tier 0</div>
                  <div>
                    <strong>Sovereign</strong>
<<<<<<< HEAD
                    <p>Proprietary Research & Expert Overrides (1.5x)</p>
=======
                    <p>Proprietary Research & Expert Overrides (1.2x)</p>
>>>>>>> e4da136a541935dba949a893d5c1a363975726a9
                  </div>
                </div>
                <div className="legend-item">
                  <div className="legend-tier tier-1">Tier 1</div>
                  <div>
                    <strong>Observed</strong>
                    <p>Behavioral Simulation Telemetry (1.0x)</p>
                  </div>
                </div>
                <div className="legend-item">
                  <div className="legend-tier tier-2">Tier 2</div>
                  <div>
                    <strong>Perceived</strong>
                    <p>Internal Diagnostic & Sentiment Surveys (0.8x)</p>
                  </div>
                </div>
                <div className="legend-item">
                  <div className="legend-tier tier-3">Tier 3</div>
                  <div>
                    <strong>Inferred</strong>
                    <p>External Market Intelligence & Digital Signals (0.4x)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .homepage { overflow-x: hidden; }
        
        .hero {
          padding: calc(var(--spacing-xl) + 4rem) 0 var(--spacing-xl);
          min-height: 80vh;
          display: flex;
          align-items: center;
          background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
        }

        .badge {
          display: inline-block;
          padding: 0.5rem 1rem;
          background: rgba(49, 151, 149, 0.1);
          color: var(--teal);
          font-weight: 700;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          border-radius: 100px;
          margin-bottom: 2rem;
        }

        .hero-content { grid-column: span 7; }
        .hero-image { grid-column: span 5; }

        h1 {
          font-size: 4rem;
          margin-bottom: 1.5rem;
          color: var(--navy);
        }

        h1 span {
          display: block;
          color: var(--teal);
          font-style: italic;
        }

        .hero-lead {
          font-size: 1.25rem;
          color: var(--slate);
          margin-bottom: 2.5rem;
          max-width: 600px;
        }

        .hero-ctas {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 4rem;
        }

        .btn-primary {
          background: var(--navy);
          color: white;
          padding: 1rem 2rem;
          border-radius: 4px;
          font-weight: 700;
          transition: all 0.3s ease;
        }

        .btn-primary:hover {
          background: var(--teal);
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }

        .btn-secondary {
          border: 1px solid var(--border-color);
          padding: 1rem 2rem;
          border-radius: 4px;
          font-weight: 600;
          color: var(--navy);
        }

        .hero-stats {
          display: flex;
          gap: 3rem;
          border-top: 1px solid var(--border-color);
          padding-top: 2rem;
        }

        .stat { display: flex; flex-direction: column; }
        .stat-value { font-size: 1.5rem; font-weight: 700; color: var(--navy); }
        .stat-label { font-size: 0.75rem; color: var(--slate-light); text-transform: uppercase; letter-spacing: 1px; }

        .image-wrapper {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 50px 100px -20px rgba(10, 25, 47, 0.1);
        }

        .image-wrapper img { width: 100%; height: auto; display: block; filter: saturate(0.8); }
        .image-overlay {
          position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          background: linear-gradient(to bottom right, rgba(10, 25, 47, 0.2), transparent);
        }

        /* Gap Section */
        .gap-section { padding: var(--section-padding); background: var(--navy); color: white; }
        .gap-text { grid-column: span 6; }
        .gap-visual { grid-column: span 6; display: flex; align-items: center; justify-content: center; }
        
        .section-title { font-size: 2.5rem; color: #fff; margin-bottom: var(--spacing-md); }
        .gap-text p { font-size: 1.2rem; color: var(--slate-light); margin-bottom: 2rem; }
        .gap-list { display: flex; flex-direction: column; gap: 1rem; }
        .gap-list li { display: flex; align-items: center; gap: 1rem; color: #cbd5e0; }

        .gap-gauge {
          width: 100%; max-width: 400px; padding: 2rem; background: rgba(255,255,255,0.05); border-radius: 12px;
        }
        .gauge-track { height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; position: relative; margin: 2rem 0; }
        .gauge-fill { height: 100%; width: 40%; background: var(--teal); border-radius: 4px; }
        .gauge-labels { display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
        .gap-label { color: var(--teal); font-weight: 800; border-bottom: 2px solid var(--teal); padding-bottom: 2px; }

        /* Framework Preview */
        .framework-preview { padding: var(--section-padding); }
        .framework-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 2rem;
          margin-top: 4rem;
        }

        .f-card {
          padding: 2.5rem;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          background: #fff;
          transition: all 0.3s ease;
        }

        .f-icon { color: var(--teal); margin-bottom: 1.5rem; }
        .f-card h3 { font-size: 1.25rem; margin-bottom: 1rem; }
        .f-card p { font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.5rem; line-height: 1.5; }
        .f-link { font-size: 0.8rem; font-weight: 700; color: var(--navy); display: flex; align-items: center; gap: 0.5rem; }

        /* GLAI Preview */
        .glai-preview { padding: var(--section-padding); background: #f8fafc; }
        .glai-content { grid-column: span 6; }
        .glai-heatmap { grid-column: span 6; }
        .glai-content h2 { color: var(--navy); }
        .glai-content p { color: var(--text-muted); margin-bottom: 2rem; font-size: 1.1rem; }
        .glai-stats { display: flex; flex-direction: column; gap: 1.5rem; margin-bottom: 2.5rem; }
        .glai-stat { display: flex; align-items: center; gap: 1.5rem; padding: 1.5rem; background: white; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.02); }
        .glai-stat h4 { margin: 0; font-size: 1.2rem; }
        .glai-stat p { margin: 0; font-size: 0.8rem; }

        .heatmap-mockup {
          width: 100%; height: 350px; background: white; border-radius: 12px; position: relative; overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.05); margin-bottom: 2rem;
        }
        .map-blob { position: absolute; border-radius: 50%; filter: blur(40px); opacity: 0.4; }
        .b1 { width: 300px; height: 300px; background: var(--teal); top: -50px; left: -50px; }
        .b2 { width: 250px; height: 250px; background: var(--navy); bottom: -30px; right: -30px; }
        .b3 { width: 200px; height: 200px; background: var(--slate); top: 50%; left: 50%; }

        .intelligence-legend { 
          background: white; padding: 2rem; border-radius: 12px; 
          border: 1px solid var(--border-color); box-shadow: 0 4px 20px rgba(0,0,0,0.02);
        }
        .legend-title { font-size: 0.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; color: var(--slate-light); margin-bottom: 1.5rem; }
        .legend-items { display: grid; gap: 1.25rem; }
        .legend-item { display: flex; gap: 1rem; align-items: flex-start; }
        .legend-tier { 
          font-size: 0.6rem; font-weight: 800; padding: 0.2rem 0.5rem; border-radius: 4px; 
          color: white; text-transform: uppercase; min-width: 48px; text-align: center; margin-top: 0.2rem;
        }
        .tier-0 { background: #0f172a; }
        .tier-1 { background: #3b82f6; }
        .tier-2 { background: #0d9488; }
        .tier-3 { background: #64748b; }
        .legend-item strong { display: block; font-size: 0.9rem; color: var(--navy); }
        .legend-item p { font-size: 0.75rem; color: var(--text-muted); margin: 0; }

        @media (max-width: 992px) {
          .hero-content, .hero-image, .gap-text, .gap-visual, .glai-content, .glai-heatmap { grid-column: span 12; }
          .hero { padding-top: 8rem; text-align: center; }
          .hero-content { display: flex; flex-direction: column; align-items: center; }
          .hero-stats { justify-content: center; }
          h1 { font-size: 3rem; }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
