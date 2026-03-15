import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, Target, Search, RefreshCcw, 
  Shield, Brain, Microscope, Activity,
  Layers, Zap, ArrowRight,
  CheckCircle2, AlertTriangle, Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';
import RelatedPathwaysSection from '../components/RelatedPathwaysSection';

const pageMeta = {
  id: "measurement",
  category: "methodology",
  dimension: null,
  related: ["/methodology", "/completeness", "/flywheel", "/global-index"]
};

const SEC_STYLE = { padding: '8rem 0' };

const LAIMeasurementPage = () => {
  return (
    <div className="measurement-page">
      {/* HERO SECTION */}
      <header className="page-header bg-navy text-white">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="eyebrow text-teal">Methodology</span>
            <h1 className="text-white">How Leadership Behavior Is Measured</h1>
            <p className="hero-lead">From Perception-Based Assessment to Structured Behavioral Observation</p>
          </motion.div>
        </div>
      </header>

      {/* THE TRIANGULATION MODEL */}
      <section style={SEC_STYLE}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-h2">The Triangulation Model</h2>
            <p className="large-p max-w-3xl mx-auto">Most leadership assessments rely on self-reported data. The LAI methodology eliminates this bias by triangulating three independent data streams.</p>
          </div>

          <div className="triangulation-grid">
            <div className="tri-card">
              <div className="tri-icon"><Search /></div>
              <h3>Institutional Signal Ingestion</h3>
              <p>Continuous monitoring of market actions, technological shifts, and external environmental intelligence to detect organizational recognition context.</p>
            </div>
            <div className="tri-card">
              <div className="tri-icon"><Activity /></div>
              <h3>Diagnostic Assessment</h3>
              <p>Evidence-based diagnostics capture how leadership teams believe they are responding to uncertainty and institutional disruption.</p>
            </div>
            <div className="tri-card highlight">
              <div className="tri-icon"><Microscope /></div>
              <h3>Behavioral Observation</h3>
              <p>Ground-truth observation of leadership decisions within dynamic simulation environments (AFERR Platform) and institutional research audits.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CORE FORMULA */}
      <section className="bg-light" style={SEC_STYLE}>
        <div className="container narrow">
          <div className="formula-box">
             <div className="formula-header">The Measurement Confidence Formula</div>
             <div className="formula-visual">
                <span>Measurement Confidence</span>
                <span className="op">=</span>
                <div className="fraction">
                   <div className="top">Evidence (Depth × Diversity × Reliability)</div>
                   <div className="bottom">Structured Observation Scale</div>
                </div>
             </div>
             <p className="formula-desc text-center">Institutional scores are not static. They represent a dynamic confidence level based on the richness and variety of observed behavioral evidence.</p>
          </div>
        </div>
      </section>

      {/* FIVE DIMENSIONS RECAP */}
      <section style={SEC_STYLE}>
        <div className="container">
          <h2 className="section-h2 text-center mb-5">Mapping Behavior to the Framework</h2>
          <div className="dim-row-list">
             {[
               { id: '01', title: 'Signal Detection', desc: 'Measuring the delta between environmental changes and organizational recognition.' },
               { id: '02', title: 'Cognitive Framing', desc: 'Evaluating the cognitive framing (threat vs opportunity) of detected shifts.' },
               { id: '03', title: 'Decision Alignment', desc: 'Quantifying the coherence of decisions across the leadership system.' },
               { id: '04', title: 'Resource Calibration', desc: 'Observing the speed of capital and talent redirection.' },
               { id: '05', title: 'Integrated Responsiveness', desc: 'Measuring the final translation of strategy into systemic behavior.' }
             ].map(dim => (
               <div key={dim.id} className="dim-summary-item">
                  <span className="dim-id">{dim.id}</span>
                  <div className="dim-info">
                     <h4>{dim.title}</h4>
                     <p>{dim.desc}</p>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* DATA INTEGRITY ALERT */}
      <section style={SEC_STYLE} className="bg-slate-900 text-white">
        <div className="container grid-2 items-center">
          <div>
            <h2 className="section-h2 text-white">Institutional Data Integrity</h2>
            <p className="text-slate-400 mb-4">To maintain institutional authority, the LAI system labels every score with a \"Measurement Confidence\" indicator. We reject the false precision of numbers that lack sufficient behavioral evidence.</p>
            <div className="alert-box-dark">
               <AlertTriangle size={20} className="text-amber-500" />
               <p>Organizations with minimal behavioral evidence are marked as "Insufficient Behavioral Data."</p>
            </div>
          </div>
          <div className="visual-placeholder-dark">
             <div className="confidence-meter-visual">
                <div className="meter-label">Data Completeness</div>
                <div className="meter-bar">
                   <div className="meter-fill" style={{ width: '85%' }}></div>
                </div>
                <div className="meter-status">STATE: TRIANGULATED MEASUREMENT</div>
             </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={SEC_STYLE}>
        <div className="container">
           <div className="final-cta-box text-center">
              <Globe size={48} className="text-teal-500 mb-4 mx-auto" />
              <h2 className="section-h2">Explore the Global Observatory Index</h2>
              <p className="max-w-2xl mx-auto mb-5 text-slate-600">Discover how organizations and leadership teams compare across industries and regions through our triangulated dataset.</p>
              <Link to="/global-index" className="btn-institutional">
                 See the Global Observatory Index <ArrowRight size={20} />
              </Link>
           </div>
        </div>
      </section>

      <RelatedPathwaysSection 
        relatedPaths={pageMeta.related}
        eyebrow="Institutional Layer"
        title="Methodology Context"
      />

      <style jsx>{`
        .measurement-page { background: white; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }
        .narrow { max-width: 800px; margin: 0 auto; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; }
        .text-center { text-align: center; }
        .mb-5 { margin-bottom: 4rem; }
        .mx-auto { margin-left: auto; margin-right: auto; }
        
        .page-header { padding: 12rem 0 8rem; text-align: center; }
        .bg-navy { background: #0a192f; }
        .text-white { color: white; }
        .eyebrow { display: block; font-size: 0.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 1rem; }
        .text-teal { color: #2dd4bf; }
        h1 { font-size: 3.5rem; font-weight: 800; margin-bottom: 1rem; color: white; }
        .hero-lead { font-size: 1.5rem; color: #94a3b8; font-weight: 500; }

        .section-h2 { font-size: 2.5rem; font-weight: 800; color: #0a192f; margin-bottom: 2rem; }
        .section-h2.text-white { color: white; }
        .large-p { font-size: 1.25rem; line-height: 1.8; color: #475569; }

        .triangulation-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-top: 4rem; }
        .tri-card { padding: 3rem; background: #f8fafc; border-radius: 24px; border: 1px solid #e2e8f0; transition: transform 0.2s; }
        .tri-card.highlight { background: white; border: 2px solid #0d9488; box-shadow: 0 20px 40px rgba(13, 148, 136, 0.05); }
        .tri-icon { color: #0d9488; margin-bottom: 1.5rem; }
        .tri-card h3 { font-size: 1.5rem; font-weight: 800; color: #0a192f; margin-bottom: 1rem; }
        .tri-card p { color: #64748b; line-height: 1.6; }

        .formula-box { background: white; border: 1px solid #e2e8f0; padding: 4rem; border-radius: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.02); }
        .formula-header { font-size: 0.7rem; font-weight: 900; text-transform: uppercase; letter-spacing: 3px; color: #0d9488; text-align: center; margin-bottom: 3rem; }
        .formula-visual { display: flex; align-items: center; justify-content: center; gap: 1.5rem; font-size: 1.5rem; font-weight: 800; color: #0a192f; margin-bottom: 2rem; }
        .op { color: #94a3b8; font-weight: 400; }
        .fraction { display: flex; flex-direction: column; align-items: center; }
        .fraction .top { padding: 0.5rem 1rem; border-bottom: 2px solid #0a192f; font-size: 1.1rem; }
        .fraction .bottom { padding: 0.5rem 1rem; font-size: 1.1rem; color: #0d9488; }
        .formula-desc { color: #64748b; font-size: 0.95rem; }

        .dim-row-list { display: flex; flex-direction: column; gap: 1rem; max-width: 900px; margin: 0 auto; }
        .dim-summary-item { display: flex; align-items: center; gap: 2rem; padding: 2rem; background: #f8fafc; border-radius: 16px; border: 1px solid #e2e8f0; }
        .dim-id { font-size: 1.5rem; font-weight: 900; color: #cbd5e1; font-family: 'Georgia', serif; }
        .dim-info h4 { font-weight: 800; font-size: 1.1rem; color: #0a192f; margin-bottom: 0.25rem; }
        .dim-info p { color: #64748b; font-size: 0.95rem; }

        .bg-slate-900 { background: #0f172a; }
        .alert-box-dark { display: flex; gap: 1rem; align-items: center; background: rgba(255,193,7,0.1); border: 1px solid rgba(255,193,7,0.2); padding: 1.5rem; border-radius: 12px; margin-top: 2rem; }
        .alert-box-dark p { font-size: 0.9rem; color: #fcd34d; margin: 0; }

        .confidence-meter-visual { background: rgba(255,255,255,0.05); padding: 3rem; border-radius: 24px; border: 1px solid rgba(255,255,255,0.1); }
        .meter-label { font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 1.5rem; }
        .meter-bar { height: 12px; background: rgba(255,255,255,0.1); border-radius: 99px; overflow: hidden; margin-bottom: 1rem; }
        .meter-fill { height: 100%; background: #2dd4bf; border-radius: 99px; }
        .meter-status { font-weight: 800; font-size: 0.8rem; color: #2dd4bf; text-align: right; }

        .final-cta-box { background: #f0fdfa; padding: 6rem 4rem; border-radius: 40px; border: 1px solid #ccfbf1; }
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
          .formula-visual { flex-direction: column; font-size: 1.25rem; }
        }
      `}</style>
    </div>
  );
};

export default LAIMeasurementPage;
