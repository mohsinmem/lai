import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, Target, Search, RefreshCcw, 
  Shield, Brain, Microscope, Activity,
  Layers, Waves, Zap, TrendingUp, ArrowRight,
  Globe, CheckCircle2, AlertTriangle, Scale
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SEC_STYLE = { padding: '8rem 0' };

const LAIMeasurementPage = () => {
  return (
    <div className="measurement-page">
      {/* ── HERO SECTION ──────────────────────────────────────────────────────── */}
      <section className="hero-sec bg-navy text-white">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }} 
            className="hero-content"
          >
            <div className="badge">Measurement Architecture</div>
            <h1 className="hero-title">How the LAI Score Is Calculated</h1>
            <p className="hero-lead text-teal-400">The Measurement Architecture Behind the Leadership Adaptiveness Index.</p>
            
            <div className="hero-body max-w-3xl">
              <p>Most leadership assessments measure what leaders say. The Leadership Adaptiveness Institute measures what leadership systems <strong>actually do</strong> when reality changes.</p>
              <p>The Leadership Adaptiveness Index (LAI) converts environmental signals, leadership behavior, and institutional research into a measurable adaptiveness score.</p>
              
              <div className="capability-grid mt-4">
                {['detect change', 'interpret uncertainty', 'align decisions', 'redirect resources', 'translate strategy'].map(cap => (
                  <div key={cap} className="cap-item">
                    <CheckCircle2 size={16} className="text-teal-400" />
                    <span>{cap}</span>
                  </div>
                ))}
              </div>

              <p className="mt-4 font-semibold text-lg">The result is a quantified measure of organizational adaptiveness.</p>
              
              <div className="hero-ctas mt-5">
                 <a href="#layers" className="btn-primary">Explore the LAI Measurement Architecture <ArrowRight size={18} /></a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION: THE THREE LAYERS ─────────────────────────────────────────── */}
      <section id="layers" style={SEC_STYLE}>
        <div className="container">
          <div className="grid-2 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="section-h2">The Three Layers Behind the LAI Score</h2>
              <p className="text-slate-600 mb-5">The Leadership Adaptiveness Institute measures adaptiveness by integrating three components:</p>
              
              <div className="stack-items">
                <div className="stack-item">
                  <div className="stack-icon"><Layers size={24} /></div>
                  <div className="stack-text">
                    <h3>The Leadership Adaptiveness Framework</h3>
                    <p>Defines <strong>where</strong> adaptiveness occurs inside leadership systems.</p>
                  </div>
                </div>
                <div className="stack-item">
                  <div className="stack-icon"><Brain size={24} /></div>
                  <div className="stack-text">
                    <h3>AFERR</h3>
                    <p>Explains <strong>how</strong> leaders move through those stages psychologically and behaviorally.</p>
                  </div>
                </div>
                <div className="stack-item">
                  <div className="stack-icon"><Activity size={24} /></div>
                  <div className="stack-text">
                    <h3>The LAI Scoring Engine</h3>
                    <p>Converts behavioral signals and environmental intelligence into a quantified adaptiveness score.</p>
                  </div>
                </div>
              </div>
              
              <p className="mt-4 italic text-slate-500">Together these components transform complex leadership behavior into a structured measurement model.</p>
            </motion.div>
            
            <div className="visual-container">
               <div className="measurement-stack-visual">
                  <div className="m-layer framework">Framework</div>
                  <div className="m-layer aferr">AFERR</div>
                  <div className="m-layer score">LAI Score</div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION: FROM SIGNALS TO MEASUREMENT ─────────────────────────────── */}
      <section className="bg-light" style={SEC_STYLE}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-h2">From Signals to Measurement</h2>
            <p className="max-w-3xl mx-auto text-slate-600">Leadership systems constantly generate signals through market shifts, technological disruption, competitor moves, and strategic decisions.</p>
          </div>

          <div className="signals-grid">
            {['Market shifts', 'Technological disruption', 'Competitor moves', 'Regulatory change', 'Strategic decisions'].map(sig => (
               <div key={sig} className="signal-bubble">{sig}</div>
            ))}
          </div>

          <div className="grid-2 mt-5">
             <div className="card-plain">
                <h3 className="font-bold text-xl mb-3">Multi-Source Engine</h3>
                <p>The LAI system collects and evaluates these signals using a multi-source measurement engine. Signals are gathered from:</p>
                <ul className="dot-list mt-3">
                   <li>Behavioral simulation environments</li>
                   <li>Leadership diagnostic assessments</li>
                   <li>Institutional research intelligence</li>
                   <li>External environmental signals</li>
                </ul>
             </div>
             <div className="card-plain border-left">
                <h3 className="font-bold text-xl mb-3">Dimensional Mapping</h3>
                <p>Each signal is analyzed, weighted, and mapped to the five dimensions of leadership adaptiveness. This ensures that every data point contributes to a holistic institutional view.</p>
                <div className="triangulation-badge mt-4">Weighted Accuracy</div>
             </div>
          </div>
        </div>
      </section>

      {/* ── SECTION: THE FIVE DIMENSIONS ──────────────────────────────────────── */}
      <section style={SEC_STYLE}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-h2">The Five Dimensions of Adaptiveness</h2>
            <p className="max-w-2xl mx-auto text-slate-600">The LAI score measures leadership behavior across five critical capabilities that form the adaptiveness loop.</p>
          </div>

          <div className="dimensions-detailed-grid">
            {[
              { title: 'Signal Detection', icon: <Search />, desc: 'How effectively leadership systems detect emerging change.' },
              { title: 'Cognitive Framing', icon: <Brain />, desc: 'How leaders interpret uncertainty and anticipate future conditions.' },
              { title: 'Decision Alignment', icon: <Scale />, desc: 'Whether leadership decisions reinforce a coherent strategic response.' },
              { title: 'Resource Calibration', icon: <Waves />, desc: 'How quickly organizations redirect resources toward emerging priorities.' },
              { title: 'Integrated Responsiveness', icon: <Zap />, desc: 'How rapidly organizations operationalize strategic adjustments.' }
            ].map(dim => (
              <div key={dim.title} className="dim-card-detailed">
                <div className="dim-icon-box">{dim.icon}</div>
                <h4>{dim.title}</h4>
                <p>{dim.desc}</p>
              </div>
            ))}
          </div>
          
          <p className="text-center mt-5 font-semibold text-slate-500">Together these five dimensions determine whether organizations adapt effectively when conditions change.</p>
        </div>
      </section>

      {/* ── SECTION: THE RELIABILITY HIERARCHY ────────────────────────────────── */}
      <section className="bg-navy text-white" style={SEC_STYLE}>
        <div className="container">
          <div className="grid-2">
            <div>
              <h2 className="section-h2 text-white">The Reliability Hierarchy</h2>
              <p className="text-slate-400 mb-5">Not all data sources carry equal weight. The LAI scoring engine applies reliability multipliers to ensure behavioral evidence carries greater influence.</p>
              
              <div className="hierarchy-list">
                {[
                  { tier: 'Sovereign Research', desc: 'High-authority institutional intelligence and expert analysis.' },
                  { tier: 'Behavioral Signals', desc: 'Direct observation of leadership decisions in dynamic environments.' },
                  { tier: 'Perceptual Signals', desc: 'Leadership self-assessments and diagnostic surveys.' },
                  { tier: 'Environmental Intelligence', desc: 'External signals captured from markets, tech, and regulatory shifts.' }
                ].map((item, i) => (
                  <div key={item.tier} className="hierarchy-item">
                    <div className="tier-idx">TIER {i+1}</div>
                    <div>
                      <h4 className="font-bold">{item.tier}</h4>
                      <p className="text-slate-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hierarchy-visual text-center">
               <div className="pyramid">
                  <div className="p-level tier-1">SOVEREIGN</div>
                  <div className="p-level tier-2">BEHAVIORAL</div>
                  <div className="p-level tier-3">PERCEPTUAL</div>
                  <div className="p-level tier-4">ENVIRONMENTAL</div>
               </div>
               <p className="mt-4 text-teal-400 font-bold uppercase tracking-widest text-xs">Hierarchy of Observed Behavior</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION: STRATEGIC DISSONANCE ─────────────────────────────────────── */}
      <section style={SEC_STYLE}>
        <div className="container">
          <div className="dissonance-box">
             <div className="grid-2 items-center">
                <div>
                   <h2 className="section-h2">Detecting Strategic Dissonance</h2>
                   <p className="text-slate-600 mb-4">One of the most powerful insights generated by the LAI system is the <strong>Adaptiveness Gap</strong>. The system compares:</p>
                   <div className="comparison-row">
                      <div className="comp-item">
                         <span className="comp-label">Perceived Adaptiveness</span>
                         <span className="comp-sub">(what leaders believe)</span>
                      </div>
                      <div className="comp-vs">VS</div>
                      <div className="comp-item">
                         <span className="comp-label">Behavioral Adaptiveness</span>
                         <span className="comp-sub">(what leaders actually do)</span>
                      </div>
                   </div>
                </div>
                <div className="alert-card-minimal">
                   <div className="alert-header">
                      <AlertTriangle className="text-red-500" />
                      <span>STRATEGIC DISSONANCE ALERT</span>
                   </div>
                   <p className="text-sm text-slate-500 mt-2">Triggered when perception significantly exceeds behavior, indicating that leadership teams may believe they are adapting while operational behavior suggests otherwise.</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* ── SECTION: THE INDEX SCORE ─────────────────────────────────────────── */}
      <section className="bg-light" style={SEC_STYLE}>
        <div className="container text-center">
           <h2 className="section-h2">The Leadership Adaptiveness Index</h2>
           <p className="max-w-2xl mx-auto mb-5 text-slate-600">The final LAI score represents the aggregate adaptiveness of a leadership system.</p>
           
           <div className="score-range-visual">
              <div className="range-track">
                 <div className="range-marker start">0</div>
                 <div className="range-marker end">100</div>
                 <div className="range-fill-gradient"></div>
              </div>
              <div className="range-labels-detailed">
                 <span>Fragile</span>
                 <span>Emergent</span>
                 <span>Antifragile</span>
              </div>
           </div>

           <div className="score-explanation mt-5 text-left max-w-4xl mx-auto grid-2 gap-8">
              <p>Each of the five dimensions receives a score based on weighted signals. The overall LAI score is calculated as the average of these dimensions.</p>
              <p>Higher scores indicate systems that detect change earlier, align decisions more effectively, reallocate resources faster, and translate strategy into coordinated action.</p>
           </div>
        </div>
      </section>

      {/* ── SECTION: TRIANGULATED TRUTH ───────────────────────────────────────── */}
      <section style={SEC_STYLE}>
        <div className="container">
           <div className="triangulated-box">
              <div className="grid-2 items-center">
                 <div>
                    <h2 className="section-h2">Triangulated Truth</h2>
                    <p className="text-slate-600 mb-4">The highest confidence LAI scores achieve <strong>Triangulated Status</strong>. This occurs only when the system receives signals from three independent perspectives:</p>
                    <ul className="fidelity-list">
                       <li><Microscope size={18} /> Institutional research intelligence</li>
                       <li><Activity size={18} /> Behavioral decision observation</li>
                       <li><Brain size={18} /> Leadership perception diagnostics</li>
                    </ul>
                 </div>
                 <div className="fidelity-badge-large">
                    <div className="badge-inner">
                       <span className="b-label">Fidelity Level</span>
                       <span className="b-value">TRIANGULATED</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* ── SECTION: WHY IT MATTERS ───────────────────────────────────────────── */}
      <section className="bg-navy text-white" style={SEC_STYLE}>
        <div className="container text-center">
           <h2 className="section-h2 text-white">Why This Measurement System Matters</h2>
           <p className="max-w-3xl mx-auto mb-5 text-slate-400">Leadership adaptiveness is often discussed as a cultural aspiration. The Leadership Adaptiveness Institute transforms it into a measurable leadership capability.</p>
           <p className="max-w-4xl mx-auto text-xl font-light text-slate-300">By combining behavioral research, environmental intelligence, and leadership diagnostics, the LAI system provides a quantified index of <strong>how leadership systems respond when reality changes</strong>.</p>
        </div>
      </section>

      {/* ── FINAL CTA SECTION ─────────────────────────────────────────────────── */}
      <section style={SEC_STYLE}>
        <div className="container">
           <div className="final-cta-box text-center">
              <Globe size={48} className="text-teal-500 mb-4 mx-auto" />
              <h2 className="section-h2">Explore the Global Adaptiveness Index</h2>
              <p className="max-w-2xl mx-auto mb-5">Discover how organizations and leadership teams compare across industries and regions.</p>
              <Link to="/global-index" className="btn-primary btn-lg">
                 See the Global Adaptiveness Index <ArrowRight size={20} />
              </Link>
           </div>
        </div>
      </section>

      <style jsx>{`
        .measurement-page { background: white; color: #0f172a; font-family: 'Inter', sans-serif; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; }
        .bg-light { background: #f8fafc; }
        .bg-navy { background: #0a192f; }
        .text-teal-400 { color: #2dd4bf !important; }
        .text-slate-300 { color: #cbd5e1 !important; }
        .text-slate-400 { color: #94a3b8 !important; }
        .text-slate-500 { color: #64748b !important; }
        .text-slate-600 { color: #475569 !important; }
        .text-center { text-align: center; }
        .mb-5 { margin-bottom: 4rem; }
        .mt-5 { margin-top: 4rem; }
        .mx-auto { margin-left: auto; margin-right: auto; }
        .hero-body { color: white !important; }
        .hero-body p { color: white !important; margin-bottom: 1.5rem; line-height: 1.8; font-size: 1.1rem; }

        /* Hero */
        .hero-sec { padding: 12rem 0 8rem; }
        .hero-title { font-size: 3.5rem; font-weight: 800; line-height: 1.1; margin: 1.5rem 0; }
        .hero-lead { font-size: 1.5rem; font-weight: 600; margin-bottom: 2rem; }
        .badge { display: inline-block; padding: 0.5rem 1rem; background: #2dd4bf; color: #0a192f; font-weight: 800; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 2px; border-radius: 4px; }
        
        .cap-item { display: flex; align-items: center; gap: 0.75rem; font-weight: 600; font-size: 0.9rem; margin-bottom: 0.5rem; }
        
        .btn-primary { background: #0d9488; color: white !important; padding: 1rem 1.5rem; border-radius: 8px; font-weight: 700; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 0.5rem; transition: all 0.2s; text-decoration: none; }
        .btn-outline { background: transparent; border: 2px solid #0d9488; color: #0d9488; padding: 0.8rem 1.25rem; border-radius: 8px; font-weight: 700; cursor: pointer; text-decoration: none; display: inline-flex; }
        .btn-lg { padding: 1.25rem 2.5rem; font-size: 1.1rem; }

        .section-h2 { font-size: 2.5rem; font-weight: 800; margin-bottom: 1.5rem; letter-spacing: -0.02em; line-height: 1.2; }

        /* Three Layers */
        .stack-items { display: flex; flex-direction: column; gap: 2rem; }
        .stack-item { display: flex; gap: 1.5rem; }
        .stack-icon { width: 48px; height: 48px; min-width: 48px; background: #f1f5f9; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #0d9488; }
        .stack-text h3 { font-size: 1.1rem; font-weight: 700; margin-bottom: 0.25rem; }
        .stack-text p { color: #64748b; font-size: 0.95rem; }

        .measurement-stack-visual { display: flex; flex-direction: column; gap: 1rem; perspective: 1000px; }
        .m-layer { padding: 2rem; border-radius: 16px; text-align: center; font-weight: 800; transition: all 0.3s; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        .m-layer.framework { background: #f8fafc; border: 1px solid #e2e8f0; transform: rotateX(20deg); }
        .m-layer.aferr { background: #0d9488; color: white; transform: rotateX(20deg) translateZ(20px); }
        .m-layer.score { background: #0a192f; color: white; transform: rotateX(20deg) translateZ(40px); }

        /* Signals */
        .signals-grid { display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem; }
        .signal-bubble { background: white; padding: 0.75rem 1.5rem; border-radius: 99px; border: 1px solid #e2e8f0; font-weight: 700; font-size: 0.85rem; color: #64748b; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
        .dot-list { list-style: none; padding: 0; }
        .dot-list li { margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.75rem; font-weight: 600; }
        .dot-list li::before { content: ''; width: 6px; height: 6px; background: #0d9488; border-radius: 50%; }
        .border-left { border-left: 1px solid #e2e8f0; padding-left: 4rem; }

        /* Dimensions */
        .dimensions-detailed-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
        .dim-card-detailed { background: white; padding: 2rem; border-radius: 20px; border: 1px solid #e2e8f0; transition: all 0.3s; }
        .dim-card-detailed:hover { border-color: #0d9488; transform: translateY(-5px); }
        .dim-icon-box { width: 44px; height: 44px; background: #f0fdfa; color: #0d9488; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem; }
        .dim-card-detailed h4 { font-weight: 800; font-size: 1.1rem; margin-bottom: 0.75rem; }
        .dim-card-detailed p { font-size: 0.9rem; color: #64748b; line-height: 1.6; }

        /* Hierarchy */
        .hierarchy-list { display: flex; flex-direction: column; gap: 1.5rem; }
        .hierarchy-item { display: flex; gap: 1.5rem; align-items: flex-start; }
        .tier-idx { font-size: 0.65rem; font-weight: 900; background: rgba(45, 212, 191, 0.1); color: #2dd4bf; padding: 4px 10px; border-radius: 4px; border: 1px solid rgba(45, 212, 191, 0.2); }
        
        .pyramid { display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .p-level { height: 60px; display: flex; align-items: center; justify-content: center; font-weight: 900; letter-spacing: 2px; font-size: 0.8rem; clip-path: polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%); }
        .tier-1 { width: 150px; background: #2dd4bf; color: #0a192f; }
        .tier-2 { width: 220px; background: #0d9488; color: white; }
        .tier-3 { width: 290px; background: #1e293b; color: #94a3b8; }
        .tier-4 { width: 360px; background: #0f172a; color: #64748b; border: 1px solid rgba(255,255,255,0.05); }

        /* Dissonance */
        .dissonance-box { background: #f8fafc; padding: 4rem; border-radius: 32px; border: 1px solid #e2e8f0; }
        .comparison-row { display: flex; align-items: center; gap: 2rem; margin-top: 2rem; }
        .comp-item { flex: 1; display: flex; flex-direction: column; align-items: center; text-align: center; padding: 1.5rem; background: white; border-radius: 12px; border: 1px solid #e2e8f0; }
        .comp-label { font-weight: 800; font-size: 1rem; display: block; }
        .comp-sub { font-size: 0.75rem; color: #94a3b8; font-weight: 600; }
        .comp-vs { font-weight: 900; color: #0d9488; font-size: 0.8rem; }
        .alert-card-minimal { background: white; padding: 2rem; border-radius: 20px; border: 2px dashed #fee2e2; }
        .alert-header { display: flex; align-items: center; gap: 0.75rem; font-weight: 900; font-size: 0.75rem; letter-spacing: 1px; }

        /* Score Range */
        .score-range-visual { max-width: 800px; margin: 0 auto; margin-top: 4rem; }
        .range-track { height: 12px; background: #e2e8f0; border-radius: 10px; position: relative; }
        .range-fill-gradient { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 10px; background: linear-gradient(to right, #ef4444, #f59e0b, #10b981); }
        .range-marker { position: absolute; top: -25px; font-weight: 800; font-size: 0.8rem; color: #94a3b8; }
        .range-marker.start { left: 0; }
        .range-marker.end { right: 0; }
        .range-labels-detailed { display: flex; justify-content: space-between; margin-top: 1rem; font-weight: 800; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 2px; color: #64748b; }

        /* Triangulation */
        .triangulated-box { background: white; padding: 4rem; border-radius: 32px; border: 1px solid #e2e8f0; box-shadow: 0 10px 40px rgba(0,0,0,0.03); }
        .fidelity-list { list-style: none; padding: 0; margin-top: 2rem; }
        .fidelity-list li { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; font-weight: 600; color: #475569; }
        .fidelity-badge-large { width: 100%; height: 200px; background: #0a192f; border-radius: 24px; display: flex; align-items: center; justify-content: center; position: relative; }
        .badge-inner { text-align: center; }
        .b-label { display: block; font-size: 0.65rem; font-weight: 900; color: #2dd4bf; letter-spacing: 3px; margin-bottom: 0.5rem; }
        .b-value { font-size: 2rem; font-weight: 900; color: white; }

        /* Final CTA */
        .final-cta-box { background: #f0fdfa; padding: 6rem 4rem; border-radius: 40px; border: 1px solid #ccfbf1; }

        @media (max-width: 992px) {
          .grid-2, .dimensions-detailed-grid { grid-template-columns: 1fr; }
          .hero-title { font-size: 2.5rem; }
          .border-left { border-left: none; padding-left: 0; padding-top: 2rem; border-top: 1px solid #e2e8f0; }
        }
      `}</style>
    </div>
  );
};

export default LAIMeasurementPage;
