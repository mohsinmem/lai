import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, TrendingUp, FlaskConical, Microscope, 
  RefreshCcw, ArrowRight, Download, Eye, 
  Brain, Shield, Target, Activity, Search
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AFERR_STAGES = [
  { stage: 'Activation', desc: 'The moment when a signal becomes psychologically meaningful.', question: 'Is this signal important? Does it require action?' },
  { stage: 'Forecasting', desc: 'Forecasting determines how uncertainty is interpreted.', question: 'How significant is this shift? What future scenarios could emerge?' },
  { stage: 'Experimentation', desc: 'Testing responses to determine whether to wait or learn.', question: 'Do we wait and observe or experiment and learn?' },
  { stage: 'Realization', desc: 'Strategic intent becomes operational reality through resource movement.', question: 'Are we shifting budgets? Are legacy projects dying?' },
  { stage: 'Reflection', desc: 'Integrating lessons to refine future response cycles.', question: 'What did we learn? How do we refine the next loop?' }
];

const SEC_STYLE = { padding: '8rem 0' };

const AFERRPage = () => {
  return (
    <div className="aferr-container">
      {/* ── HERO SECTION ──────────────────────────────────────────────────────── */}
      <section className="hero-sec">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="hero-content">
            <div className="badge">Behavioral Integration</div>
            <h1 className="hero-title">The Behavioral Engine</h1>
            <p className="hero-lead">How AFERR Powers the Leadership Adaptiveness Framework.</p>
            <div className="hero-body">
              <p>The Leadership Adaptiveness Framework identifies <strong>where</strong> adaptiveness occurs inside leadership systems.</p>
              <p>AFERR explains <strong>how</strong> leaders psychologically move through those stages.</p>
              <p>Together they form the behavioral engine behind the Leadership Adaptiveness Institute’s measurement system.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 1: WHY TRANSLATION MATTERS ────────────────────────────────── */}
      <section className="bg-light" style={SEC_STYLE}>
        <div className="container">
          <div className="grid-2 gap-8 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="section-h2">Why Behavioral Translation Matters</h2>
              <div className="text-content">
                <p>Organizations frequently detect change early. Leaders discuss disruption. They recognize emerging technologies.</p>
                <p>Yet recognition often fails to produce coordinated action. The problem is not awareness; it is the <strong>behavioral transition</strong> between awareness and response.</p>
                <p>AFERR explains how leaders move through five behavioral stages when facing uncertainty. These stages determine whether organizations adapt or stall.</p>
              </div>
            </motion.div>
            <div className="visual-card">
              <div className="transition-visual">
                <div className="node awareness">Awareness</div>
                <div className="transition-path"><Zap size={24} className="text-teal-400" /></div>
                <div className="node response">Response</div>
                <div className="label">THE BEHAVIORAL VOID</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: THE AFERR CYCLE ────────────────────────────────────────── */}
      <section style={SEC_STYLE}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-h2">AFERR: The Behavioral Cycle of Adaptation</h2>
            <p className="max-w-2xl mx-auto text-slate-600">AFERR is a behavioral research model that explains how leaders process change through five cognitive-behavior stages.</p>
          </div>

          <div className="cycle-grid">
            {['Activation', 'Forecasting', 'Experimentation', 'Realization', 'Reflection'].map((s, i) => (
              <div key={s} className="cycle-card">
                <div className="cycle-idx">0{i+1}</div>
                <h3>{s}</h3>
              </div>
            ))}
          </div>
          
          <div className="cycle-summary mt-5 text-center">
            <p className="text-slate-500 italic">Detect signals → Interpret uncertainty → Experiment with responses → Redirect resources → Integrate learning.</p>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: INTEGRATION ────────────────────────────────────────────── */}
      <section className="bg-navy text-white" style={SEC_STYLE}>
        <div className="container">
          <div className="grid-2 items-center">
            <div>
              <h2 className="section-h2 text-white">Framework {'>'} Behavior Integration</h2>
              <p className="text-slate-400 mb-4">The Leadership Adaptiveness Framework maps the structural stages of organizational adaptation. AFERR explains the behavioral transitions that occur inside each stage.</p>
              <div className="triangulation-badge">Unified Measurement System</div>
            </div>
            <div className="diagram-placeholder">
               {/* Simplified Diagram Representation */}
               <div className="integration-box">
                  <div className="layer-framework">LAI Framework (Structure)</div>
                  <div className="layer-connector"><RefreshCcw className="text-teal-400" /></div>
                  <div className="layer-aferr">AFERR (Cognition)</div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: MAPPING THE FRAMEWORK ──────────────────────────────────── */}
      <section style={SEC_STYLE}>
        <div className="container">
          <h2 className="section-h2 text-center mb-5">Mapping the Framework to AFERR</h2>
          <div className="mapping-list">
            {AFERR_STAGES.map((item, i) => (
              <div key={item.stage} className="mapping-item">
                <div className="mapping-header">
                  <div className="mapping-title">
                    <span className="pill">Stage {i+1}</span>
                    <h3>{item.stage}</h3>
                  </div>
                  <div className="mapping-meta">AFERR Stage: {item.stage}</div>
                </div>
                <div className="mapping-content">
                  <p>{item.desc}</p>
                  <div className="mapping-questions">
                    <strong>Leader Inquiry:</strong> {item.question}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: WHY THIS MATTERS ───────────────────────────────────────── */}
      <section className="bg-light" style={SEC_STYLE}>
        <div className="container grid-2 items-center">
          <div>
            <h2 className="section-h2">Measurable Mechanics</h2>
            <p className="mb-4 text-slate-600">Most leadership frameworks focus on personality, culture, or competencies. The Leadership Adaptiveness Institute studies the behavioral mechanics of adaptation.</p>
            <ul className="impact-list">
              <li>Identify where adaptation fails</li>
              <li>Measure response under uncertainty</li>
              <li>Detect friction between cognition and action</li>
            </ul>
          </div>
          <div className="stat-box">
             <div className="stat-label">Systemic Fidelity</div>
             <div className="stat-value">TRIANGULATED</div>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: FROM RESEARCH TO MEASUREMENT ───────────────────────────── */}
      <section style={SEC_STYLE}>
        <div className="container">
          <div className="cta-gradient-box text-center text-white">
            <h2 className="section-h2 text-white">From Behavioral Research to Measurement</h2>
            <p className="max-w-3xl mx-auto mb-4 opacity-80">The AFERR model is grounded in behavioral research generated through dynamic decision environments and leadership simulations. These behaviors feed directly into the Leadership Adaptiveness Index (LAI).</p>
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ───────────────────────────────────────────────────────── */}
      <section style={{ padding: '6rem 0', borderTop: '1px solid #e2e8f0' }}>
        <div className="container">
          <div className="cta-split-modern">
             <div className="cta-main">
                <h2>Download the Framework Briefing</h2>
                <p className="text-slate-600 mb-4">Explore the complete framework, measurement model, and behavioral integration.</p>
                <a href="https://drive.google.com/file/d/1bTBH2z7KaEoTTXpE9M5IrEPdUO5gYj7N/view" target="_blank" rel="noopener noreferrer" className="btn-primary">
                  <Download size={18} /> Download Full Briefing
                </a>
             </div>
             <div className="cta-accent">
                <h3>See How the LAI Score Is Calculated</h3>
                <p className="text-slate-500 mb-4">Learn how behavioral signals are converted into a measurable index.</p>
                <Link to="/global-index" className="btn-outline">Explore the LAI Scoring Model</Link>
             </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .aferr-container { background: white; color: #0f172a; font-family: 'Inter', sans-serif; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; }
        .bg-light { background: #f8fafc; }
        .bg-navy { background: #0a192f; }
        .text-white { color: white !important; }
        .text-teal-400 { color: #2dd4bf; }
        .text-center { text-align: center; }
        .mb-5 { margin-bottom: 4rem; }
        .mt-5 { margin-top: 4rem; }

        /* Hero */
        .hero-sec { padding: 12rem 0 8rem; background: linear-gradient(to bottom, #f0fdf9, white); }
        .hero-title { font-size: 4rem; font-weight: 800; line-height: 1.1; margin: 1.5rem 0; color: #0f172a; }
        .hero-lead { font-size: 1.5rem; font-weight: 600; color: #0d9488; margin-bottom: 2rem; }
        .badge { display: inline-block; padding: 0.5rem 1rem; background: #0a192f; color: white; font-weight: 800; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 2px; border-radius: 4px; }
        .hero-body p { font-size: 1.125rem; line-height: 1.7; color: #475569; margin-bottom: 1.5rem; max-width: 800px; }

        .section-h2 { font-size: 2.5rem; font-weight: 800; margin-bottom: 1.5rem; letter-spacing: -0.02em; line-height: 1.2; }

        .btn-primary { background: #0d9488; color: white !important; padding: 1rem 1.5rem; border-radius: 8px; font-weight: 700; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 0.5rem; transition: all 0.2s; text-decoration: none; }
        .btn-outline { background: transparent; border: 2px solid #0d9488; color: #0d9488; padding: 0.8rem 1.25rem; border-radius: 8px; font-weight: 700; cursor: pointer; text-decoration: none; display: inline-flex; }

        /* Visuals */
        .visual-card { background: white; padding: 3rem; border-radius: 32px; border: 1px solid #e2e8f0; box-shadow: 0 10px 30px rgba(0,0,0,0.02); }
        .transition-visual { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
        .node { width: 100%; padding: 1.5rem; border-radius: 12px; text-align: center; font-weight: 800; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 2px; }
        .node.awareness { background: #f1f5f9; color: #64748b; }
        .node.response { background: #0a192f; color: white; }
        .label { font-size: 0.65rem; font-weight: 900; color: #ef4444; letter-spacing: 3px; }

        /* Cycle */
        .cycle-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 1.5rem; }
        .cycle-card { background: white; padding: 2.5rem 1.5rem; border-radius: 16px; border: 1px solid #e2e8f0; text-align: center; transition: all 0.3s; }
        .cycle-card:hover { transform: translateY(-5px); border-color: #0d9488; }
        .cycle-idx { font-size: 0.8rem; font-weight: 900; color: #0d9488; margin-bottom: 1rem; }
        .cycle-card h3 { font-size: 1.1rem; font-weight: 800; margin: 0; }

        /* Integration Layer */
        .integration-box { display: flex; flex-direction: column; gap: 1rem; align-items: center; }
        .layer-framework, .layer-aferr { padding: 2rem; border-radius: 16px; width: 100%; text-align: center; font-weight: 800; border: 1px solid rgba(255,255,255,0.1); }
        .layer-framework { background: rgba(255,255,255,0.05); }
        .layer-aferr { background: #0d9488; }

        /* Mapping List */
        .mapping-list { display: flex; flex-direction: column; gap: 2rem; }
        .mapping-item { border-left: 4px solid #0d9488; padding-left: 2rem; }
        .mapping-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .mapping-title { display: flex; align-items: center; gap: 1rem; }
        .mapping-title h3 { font-size: 1.5rem; font-weight: 800; margin: 0; }
        .pill { font-size: 0.65rem; font-weight: 900; background: #f1f5f9; padding: 4px 10px; border-radius: 99px; }
        .mapping-meta { font-size: 0.8rem; color: #0d9488; font-weight: 700; }
        .mapping-questions { margin-top: 1rem; padding: 1rem; background: #f8fafc; border-radius: 8px; font-size: 0.9rem; color: #475569; }

        /* Impact List */
        .impact-list { list-style: none; padding: 0; }
        .impact-list li { margin-bottom: 1rem; font-weight: 600; display: flex; align-items: center; gap: 0.75rem; color: #0f172a; }
        .impact-list li::before { content: '✓'; color: #0d9488; font-weight: 900; }

        /* Stat Box */
        .stat-box { background: #0a192f; color: white; padding: 4rem; border-radius: 32px; text-align: center; }
        .stat-label { font-size: 0.7rem; font-weight: 900; letter-spacing: 3px; color: #2dd4bf; margin-bottom: 1rem; }
        .stat-value { font-size: 2.5rem; font-weight: 900; }

        /* CTA */
        .cta-gradient-box { background: #0a192f; padding: 6rem 4rem; border-radius: 40px; }
        .cta-split-modern { display: grid; grid-template-columns: 1.5fr 1fr; gap: 4rem; background: #f0fdfa; padding: 4rem; border-radius: 40px; }

        @media (max-width: 992px) {
          .grid-2, .cycle-grid, .cta-split-modern { grid-template-columns: 1fr; }
          .hero-title { font-size: 2.5rem; }
          .cycle-card { text-align: left; display: flex; align-items: center; gap: 1.5rem; padding: 1.5rem; }
          .cycle-idx { margin: 0; }
        }
      `}</style>
    </div>
  );
};

export default AFERRPage;
