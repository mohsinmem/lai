import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, AlertCircle, Info, Database, 
  BarChart3, Microscope, ShieldCheck, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import RelatedPathwaysSection from '../components/RelatedPathwaysSection';

const pageMeta = {
  id: "completeness",
  category: "observatory",
  dimension: null,
  related: ["/global-index", "/observatory", "/how-measured", "/methodology"]
};

const CompletenessPage = () => {
  return (
    <div className="completeness-page">
      {/* HERO SECTION */}
      <header className="page-header bg-light">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="eyebrow">Measurement Integrity</span>
            <h1 className="text-navy">Understanding Data Completeness</h1>
            <p className="hero-lead">Moving beyond data quantity to establish the depth, diversity, and reliability of evidence.</p>
          </motion.div>
        </div>
      </header>

      {/* CORE LOGIC SECTION */}
      <section className="py-20">
        <div className="container narrow">
          <h2 className="section-h2">The Depth of Evidence</h2>
          <p className="large-p">Data completeness is not a measure of how much data we have, but how **complete** our understanding of a leadership system is. High-confidence scores require more than just a high volume of signals; they require a high diversity of evidence types.</p>
          
          <div className="completeness-logic-box mt-10">
             <div className="logic-item">
                <div className="logic-icon"><Microscope className="text-teal" /></div>
                <div>
                   <h3>Behavioral Depth</h3>
                   <p>Is leadership behavior directly observable through high-fidelity simulations and institutional research, or is it rely purely on external telemetry?</p>
                </div>
             </div>
             <div className="logic-item">
                <div className="logic-icon"><Database className="text-teal" /></div>
                <div>
                   <h3>Evidence Diversity</h3>
                   <p>Do we have overlapping confirmation from signals, diagnostics, and direct observation? Triangulation increases completeness.</p>
                </div>
             </div>
             <div className="logic-item">
                <div className="logic-icon"><ShieldCheck className="text-teal" /></div>
                <div>
                   <h3>Reliability Weighting</h3>
                   <p>Not all evidence is equal. Sovereign research and direct behavioral telemetry carry higher authority than public sentiment or self-assessments.</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* COMPLETENESS STATES */}
      <section className="bg-navy text-white py-24">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="section-h2 text-white">Canonical Completeness States</h2>
            <p className="body-p text-slate-400 max-w-2xl mx-auto">The Global Index identifies organizations based on the transparency and depth of their available adaptiveness evidence.</p>
          </div>

          <div className="grid-3 gap-8">
            <div className="status-card triangulated">
               <div className="status-header">
                  <CheckCircle2 size={32} />
                  <h3>Triangulated Measurement</h3>
               </div>
               <p>The highest level of observability. Full integration of environmental signals, diagnostic data, and direct behavioral observation.</p>
            </div>
            <div className="status-card partial">
               <div className="status-header">
                  <Info size={32} />
                  <h3>Partial Insight</h3>
               </div>
               <p>Moderate observability. Typically relies on environmental signals and self-assessments without direct behavioral telemetry.</p>
            </div>
            <div className="status-card insufficient">
               <div className="status-header">
                  <AlertCircle size={32} />
                  <h3>Insufficient Behavioral Data</h3>
               </div>
               <p>Preliminary observability. Insight is restricted to public market signals and environmental context with no direct behavioral visibility.</p>
            </div>
          </div>
        </div>
      </section>

      {/* LIMITS OF VISIBILITY */}
      <section className="py-24 border-b border-slate-200">
        <div className="container grid-2 items-center">
          <div className="visual-preview">
             <BarChart3 size={300} className="text-teal opacity-10 mx-auto" />
             <div className="confidence-meter-mock">
                <span>Confidence Level</span>
                <div className="meter"><div className="fill" style={{ width: '85%' }}></div></div>
             </div>
          </div>
          <div>
            <h2 className="section-h2">The Limits of Visibility</h2>
            <p className="body-p mb-6">We maintain a strict stance against false precision. If an organization does not participate in diagnostics or behavioral simulations, our observatory marks them as having insufficient data, even if external signals are abundant.</p>
            <p className="body-p">Completeness is the primary indicator of whether an adaptiveness score should be considered definitive or merely indicative.</p>
            <Link to="/global-index" className="btn-institutional primary mt-8">View the Index Transparency</Link>
          </div>
        </div>
      </section>

      <RelatedPathwaysSection 
        relatedPaths={pageMeta.related}
        eyebrow="Integrity Layer"
        title="Further Pathways"
      />

      <style jsx>{`
        .completeness-page { background: white; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }
        .narrow { max-width: 800px; margin: 0 auto; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; }
        .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
        .py-20 { padding: 8rem 0; }
        .py-24 { padding: 10rem 0; }
        
        .page-header { padding: 12rem 0 8rem; text-align: center; }
        .bg-navy { background: #0a192f; }
        .bg-light { background: #f8fafc; }
        .text-navy { color: #0a192f; }
        .text-white { color: white; }
        .eyebrow { display: block; font-size: 0.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 1rem; color: #0d9488; }
        h1 { font-size: 3.5rem; font-weight: 800; margin-bottom: 1rem; }
        .hero-lead { font-size: 1.5rem; color: #475569; font-weight: 500; }

        .section-h2 { font-size: 2.5rem; font-weight: 800; color: #0a192f; margin-bottom: 1.5rem; }
        .large-p { font-size: 1.4rem; line-height: 1.8; color: #334155; margin-bottom: 2rem; }
        .body-p { font-size: 1.15rem; line-height: 1.8; color: #64748b; }

        .completeness-logic-box { display: flex; flex-direction: column; gap: 2.5rem; }
        .logic-item { display: flex; gap: 1.5rem; align-items: flex-start; }
        .logic-icon { padding-top: 0.25rem; }
        .logic-item h3 { font-size: 1.25rem; font-weight: 800; color: #0a192f; margin-bottom: 0.5rem; }
        .logic-item p { font-size: 1.05rem; color: #64748b; line-height: 1.6; }

        .status-card { padding: 3rem; border-radius: 20px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); }
        .status-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
        .status-header h3 { font-size: 1.25rem; font-weight: 800; color: white; margin: 0; }
        .status-card p { font-size: 0.95rem; line-height: 1.6; color: #94a3b8; }
        
        .triangulated { border-color: #10b981; }
        .triangulated .status-header { color: #10b981; }
        .partial { border-color: #3b82f6; }
        .partial .status-header { color: #3b82f6; }
        .insufficient { border-color: #ef4444; }
        .insufficient .status-header { color: #ef4444; }

        .confidence-meter-mock { background: white; border: 1px solid #e2e8f0; padding: 2rem; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); margin-top: -4rem; max-width: 300px; margin-left: auto; margin-right: auto; }
        .confidence-meter-mock span { display: block; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: #475569; margin-bottom: 1rem; }
        .confidence-meter-mock .meter { height: 10px; background: #f1f5f9; border-radius: 99px; overflow: hidden; }
        .confidence-meter-mock .fill { height: 100%; background: #0d9488; }

        .btn-institutional { padding: 1rem 2rem; border-radius: 8px; font-weight: 800; text-decoration: none; transition: all 0.2s; display: inline-block; }
        .btn-institutional.primary { background: #0a192f; color: white !important; }

        @media (max-width: 992px) {
          .grid-2 { grid-template-columns: 1fr; }
          h1 { font-size: 2.5rem; }
          .confidence-meter-mock { margin-top: 2rem; }
        }
      `}</style>
    </div>
  );
};

export default CompletenessPage;
