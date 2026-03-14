import React from 'react';
import { motion } from 'framer-motion';
import { 
  Signal, Heart, Layers, Target, Zap, 
  ArrowRight, Download, Eye, Shield, 
  ZapOff, Activity, Layout, Info,
  TrendingUp, Search, MousePointer2, Briefcase
} from 'lucide-react';

const PILLAR_DETAILS = [
  {
    icon: <Signal size={40} />,
    title: '1. Signal Detection',
    subtitle: 'Recognition vs Noise',
    desc: 'Adaptiveness begins with the ability to recognize meaningful change. Organizations constantly generate signals—technological disruption, competitor activity, regulatory shifts—yet most remain unobserved.',
    bullet: 'Distinguishes meaningful environmental signals from background noise.',
    metrics: ['Recognition Speed', 'Signal Sensitivity', 'Signal-to-Noise Ratio', 'Environmental Scan Breadth']
  },
  {
    icon: <Heart size={40} />,
    title: '2. Cognitive Framing',
    subtitle: 'Threat vs Opportunity',
    desc: 'Recognizing change is not sufficient. Leaders must interpret uncertainty in a productive way. Framing determines whether a team responds with defensive entrenchment or strategic curiosity.',
    bullet: 'Determines the psychological orientation toward emerging volatility.',
    metrics: ['Threat vs Opportunity Orientation', 'Forecast Horizon', 'Confidence Calibration', 'Scenario Diversity']
  },
  {
    icon: <Target size={40} />,
    title: '3. Decision Alignment',
    subtitle: 'Coherence vs Fragmentation',
    desc: 'Leadership teams frequently agree on change intellectually but diverge in operational decisions. Alignment measures whether choices reinforce a shared strategic response.',
    bullet: 'Ensures leadership decisions converge around a shared adaptation pathway.',
    metrics: ['Strategic Consistency', 'Decision Latency', 'Cross-Leadership Convergence', 'Experimentation Bias']
  },
  {
    icon: <Layers size={40} />,
    title: '4. Resource Calibration',
    subtitle: 'Velocity vs Inertia',
    desc: 'Adaptiveness becomes visible when organizations redirect resources. Calibration measures the speed and precision of shifting capital, talent, and attention.',
    bullet: 'The measurable movement of capital and talent toward emerging priorities.',
    metrics: ['Resource Reallocation Speed', 'Strategic Resource Ratio', 'Budget Flexibility', 'Talent Reassignment Rate']
  },
  {
    icon: <Zap size={40} />,
    title: '5. Integrated Responsiveness',
    subtitle: 'Execution vs Latency',
    desc: 'Strategic intent only matters when it produces operational change. Responsiveness measures how quickly organizations translate decisions into systemic evolution.',
    bullet: 'The final translation of strategic intent into operational reality.',
    metrics: ['Pivot Speed', 'Execution Synchronization', 'Learning Integration Rate', 'Systemic Adaptation Index']
  }
];

const SEC_STYLE = { padding: '8rem 0' };

const FrameworkPage = () => {
  return (
    <div className="framework-container">
      {/* ── HERO SECTION ──────────────────────────────────────────────────────── */}
      <section className="hero-sec">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="hero-content">
            <div className="badge">Institutional Framework</div>
            <h1 className="hero-title">The Leadership Adaptiveness Framework</h1>
            <p className="hero-lead">The behavioral system behind measurable organizational response.</p>
            <div className="hero-body">
              <p>Most organizations recognize change. Few translate that recognition into coordinated action.</p>
              <p>The Leadership Adaptiveness Framework defines the five observable behaviors that determine whether leadership systems actually adapt when reality shifts.</p>
              <p>Grounded in behavioral research from AFERR and validated through leadership simulation environments, the framework allows the Leadership Adaptiveness Institute to measure adaptiveness rather than speculate about it.</p>
            </div>
            <div className="hero-ctas">
              <a href="https://drive.google.com/file/d/1bTBH2z7KaEoTTXpE9M5IrEPdUO5gYj7N/view" target="_blank" rel="noopener noreferrer" className="btn-primary">
                <Download size={18} /> Download Framework Briefing
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 1: THE ILLUSION ────────────────────────────────────────────── */}
      <section className="bg-light" style={SEC_STYLE}>
        <div className="container grid-2">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="section-h2">The Illusion of Adaptiveness</h2>
            <div className="text-content">
              <p>Many leadership teams believe they are adaptive. They detect change early. They discuss emerging risks. They acknowledge market shifts.</p>
              <p>Yet organizations frequently fail to convert that recognition into coordinated action. The result is the <strong>Adaptiveness Gap</strong>: Recognition exists, but the organization remains operationally frozen.</p>
              <p>The LAI framework treats adaptiveness not as a personality trait, but as a behavioral system that determines whether intellectual recognition survives the journey to operational execution.</p>
            </div>
          </motion.div>
          <div className="visual-placeholder">
            <div className="gap-graphic">
              <div className="gap-part recognition">Intellectual Recognition</div>
              <div className="gap-arrow"><ZapOff size={24} color="#ef4444" /></div>
              <div className="gap-part execution">Operational Execution</div>
              <div className="gap-label">THE ADAPTIVENESS GAP</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: THE PARADIGM ───────────────────────────────────────────── */}
      <section style={SEC_STYLE}>
        <div className="container">
          <div className="paradigm-header">
            <h2 className="section-h2 text-center">The LAI Paradigm Shift</h2>
            <p className="subtitle text-center">System Response {'>'} Individual Competency</p>
          </div>
          <div className="grid-2 mt-4 contrast-grid">
            <div className="contrast-card legacy">
              <h3>Traditional Models</h3>
              <ul>
                <li>Personality Assessments</li>
                <li>Individual Leadership Styles</li>
                <li>Cultural Values Surveys</li>
                <li>Static Competency Frameworks</li>
              </ul>
            </div>
            <div className="contrast-card modern">
              <h3>LAI Framework</h3>
              <ul>
                <li>Observable Behavioral Patterns</li>
                <li>System Response to Signals</li>
                <li>Operational Resource Movement</li>
                <li>Decision Coherence Across Teams</li>
              </ul>
            </div>
          </div>
          <p className="paradigm-conclusion text-center">Adaptiveness therefore becomes <strong>measurable operational behavior</strong>, not an abstract leadership quality.</p>
        </div>
      </section>

      {/* ── SECTION 3: THE FIVE DIMENSIONS ────────────────────────────────────── */}
      <section className="bg-navy text-white" style={SEC_STYLE}>
        <div className="container">
          <div className="sec-header mb-5">
            <h2 className="section-h2 text-white">The Five Dimensions</h2>
            <p className="text-teal-400 font-bold uppercase tracking-widest text-sm">The Leadership Adaptiveness System</p>
          </div>
          
          <div className="dimensions-scroll">
            {PILLAR_DETAILS.map((dim, i) => (
              <motion.div 
                key={dim.title}
                className="dim-row"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="dim-number">0{i+1}</div>
                <div className="dim-main">
                  <div className="dim-header">
                    <div className="dim-icon">{dim.icon}</div>
                    <div>
                      <h3>{dim.title}</h3>
                      <span className="dim-sub">{dim.subtitle}</span>
                    </div>
                  </div>
                  <p className="dim-desc">{dim.desc}</p>
                </div>
                <div className="dim-metrics-box">
                  <h4>Key Metrics</h4>
                  <ul>
                    {dim.metrics.map(m => <li key={m}>{m}</li>)}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: THE LOOP ───────────────────────────────────────────────── */}
      <section style={SEC_STYLE} className="bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-h2">The Adaptiveness Loop</h2>
            <p className="max-w-xl mx-auto text-slate-600">The five dimensions operate as a continuous feedback system rather than a linear sequence. The speed of the system is dictated by its weakest link.</p>
          </div>
          
          <div className="loop-container">
             <div className="loop-steps">
                {['Signal Detection', 'Cognitive Framing', 'Decision Alignment', 'Resource Calibration', 'Integrated Responsiveness'].map((s, i) => (
                  <React.Fragment key={s}>
                    <div className="step-pill">{s}</div>
                    {i < 4 && <ArrowRight size={20} className="text-teal-500" />}
                  </React.Fragment>
                ))}
             </div>
             <div className="loop-return">
               <div className="return-path"></div>
               <span className="return-label">NEW SIGNALS</span>
             </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: MEASUREMENT ───────────────────────────────────────────── */}
      <section style={SEC_STYLE}>
        <div className="container">
          <h2 className="section-h2 text-center mb-5">How Adaptiveness Is Measured</h2>
          <div className="grid-3">
            {[
              { icon: <Search />, title: 'Research Intelligence', desc: 'External signals from market actions, analyst commentary, and institutional research.' },
              { icon: <Activity />, title: 'Perception-Based Assessment', desc: 'Internal diagnostics capturing how leaders believe they respond to change.' },
              { icon: <Layout />, title: 'Behavioral Simulation', desc: 'Ground-truth observation of leadership decisions through dynamic simulation environments.' }
            ].map(path => (
              <div key={path.title} className="path-card">
                <div className="path-icon">{path.icon}</div>
                <h3>{path.title}</h3>
                <p>{path.desc}</p>
              </div>
            ))}
          </div>
          <div className="triangulation-seal">
            <Shield size={20} /> Triangulated Adaptiveness Score
          </div>
        </div>
      </section>

      {/* ── SECTION 6/7: GAP & OBJECTIVE ─────────────────────────────────────── */}
      <section className="bg-slate-900 text-white" style={SEC_STYLE}>
        <div className="container grid-2 items-center">
          <div>
            <h2 className="section-h2 text-white">The Institutional Objective</h2>
            <p className="text-slate-400 mb-4">Financial reporting transformed global markets by creating transparency around financial performance. The Leadership Adaptiveness Institute seeks to do the same for organizational response to change.</p>
            <p className="text-slate-400">By measuring adaptiveness systematically, the institute creates transparency around how leadership systems respond when reality shifts.</p>
          </div>
          <div className="gap-focus">
             <div className="gap-value perceived">Perceived Adaptiveness <span>(What leaders believe)</span></div>
             <div className="gap-diff">THE GAP</div>
             <div className="gap-value behavioral">Behavioral Adaptiveness <span>(What leaders actually do)</span></div>
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ───────────────────────────────────────────────────────── */}
      <section style={{ padding: '6rem 0', background: 'white' }}>
        <div className="container">
          <div className="cta-box">
             <div className="cta-main">
                <h2>Download the Framework Briefing</h2>
                <p>Explore the full visual framework and measurement model.</p>
                <a href="https://drive.google.com/file/d/1bTBH2z7KaEoTTXpE9M5IrEPdUO5gYj7N/view" target="_blank" rel="noopener noreferrer" className="btn-primary mt-4">Download PDF</a>
             </div>
             <div className="cta-divider"></div>
             <div className="cta-secondary">
                <h3>Explore the AFERR Behavioral Engine</h3>
                <p>Learn how AFERR translates leadership cognition into observable behavior.</p>
                <Link to="/aferr" className="btn-outline mt-4">LAI Framework ↔ AFERR Integration</Link>
             </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .framework-container { background: white; color: #0f172a; font-family: 'Inter', sans-serif; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; }
        .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
        .bg-light { background: #f8fafc; }
        .bg-navy { background: #0a192f; }
        .text-white { color: white !important; }
        .text-teal-400 { color: #2dd4bf; }
        .text-slate-400 { color: #94a3b8; }
        .text-slate-600 { color: #475569; }
        .font-bold { font-weight: 700; }
        .uppercase { text-transform: uppercase; }
        .tracking-widest { letter-spacing: 0.1em; }
        .text-sm { font-size: 0.875rem; }
        .mb-4 { margin-bottom: 1rem; }
        .items-center { align-items: center; }

        .text-center { text-align: center; }
        .mb-5 { margin-bottom: 3rem; }
        .mt-4 { margin-top: 2rem; }
        .max-w-xl { max-width: 36rem; }
        .mx-auto { margin-left: auto; margin-right: auto; }

        /* Typography */
        .hero-title { font-size: 4rem; font-weight: 800; line-height: 1.1; margin: 1.5rem 0; color: #0f172a; }
        .hero-lead { font-size: 1.5rem; font-weight: 600; color: #0d9488; margin-bottom: 2rem; }
        .section-h2 { font-size: 2.5rem; font-weight: 800; margin-bottom: 1.5rem; letter-spacing: -0.02em; color: inherit; }
        .subtitle { font-size: 0.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; color: #94a3b8; }

        /* Sections */
        .hero-sec { padding: 12rem 0 8rem; background: linear-gradient(to bottom, #f0fdfa, white); }
        .badge { display: inline-block; padding: 0.5rem 1rem; background: #0a192f; color: white; font-weight: 800; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 2px; border-radius: 4px; }
        .hero-body p { font-size: 1.125rem; line-height: 1.7; color: #475569; margin-bottom: 1.5rem; max-width: 800px; }

        .btn-primary { background: #0d9488; color: white !important; padding: 1rem 2rem; border-radius: 8px; font-weight: 700; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 0.5rem; transition: all 0.2s; text-decoration: none; }
        .btn-primary:hover { background: #0f766e; transform: translateY(-2px); }
        .btn-outline { background: transparent; border: 2px solid #0d9488; color: #0d9488; padding: 0.8rem 1.5rem; border-radius: 8px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 0.5rem; transition: all 0.2s; text-decoration: none; }

        /* Paradigm Contrast */
        .contrast-card { padding: 2.5rem; border-radius: 24px; border: 1px solid #e2e8f0; }
        .contrast-card.legacy { background: #f1f5f9; }
        .contrast-card.modern { background: white; border: 2px solid #0d9488; box-shadow: 0 20px 40px rgba(13, 148, 136, 0.1); }
        .contrast-card h3 { font-size: 1.5rem; font-weight: 800; margin-bottom: 1.5rem; }
        .contrast-card ul { list-style: none; padding: 0; }
        .contrast-card li { margin-bottom: 1rem; color: #64748b; font-weight: 500; display: flex; align-items: center; gap: 0.5rem; }
        .contrast-card.modern li { color: #0f172a; }
        .contrast-card.modern li::before { content: '→'; color: #0d9488; font-weight: 900; }
        .paradigm-conclusion { margin-top: 3rem; font-size: 1.25rem; color: #475569; }

        /* Dimensions */
        .dim-row { display: flex; gap: 3rem; padding: 3rem 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .dim-number { font-size: 3rem; font-weight: 900; color: rgba(45, 212, 191, 0.4); font-family: 'Georgia', serif; }
        .dim-main { flex: 2; }
        .dim-header { display: flex; gap: 1.5rem; align-items: center; margin-bottom: 1.5rem; }
        .dim-icon { width: 64px; height: 64px; background: rgba(45, 212, 191, 0.1); border-radius: 16px; display: flex; align-items: center; justify-content: center; color: #2dd4bf; }
        .dim-header h3 { font-size: 1.75rem; font-weight: 800; color: white; margin: 0; }
        .dim-sub { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: #2dd4bf; letter-spacing: 1px; }
        .dim-desc { color: #94a3b8; line-height: 1.8; }
        .dim-metrics-box { flex: 1; background: rgba(255,255,255,0.03); padding: 1.5rem; border-radius: 16px; }
        .dim-metrics-box h4 { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: #2dd4bf; margin-bottom: 1rem; }
        .dim-metrics-box ul { list-style: none; padding: 0; margin: 0; }
        .dim-metrics-box li { color: white; font-size: 0.85rem; margin-bottom: 0.5rem; font-weight: 600; }

        /* The Loop */
        .loop-container { padding: 4rem 2rem; background: white; border-radius: 32px; border: 1px solid #e2e8f0; }
        .loop-steps { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
        .step-pill { padding: 0.75rem 1.25rem; background: #0a192f; color: white; border-radius: 99px; font-weight: 700; font-size: 0.8rem; white-space: nowrap; }
        .loop-return { margin-top: 3rem; display: flex; flex-direction: column; align-items: center; gap: 0.75rem; }
        .return-path { width: 80%; height: 30px; border: 2px solid #2dd4bf; border-top: none; borderRadius: 0 0 40px 40px; opacity: 0.3; }
        .return-label { font-size: 0.65rem; font-weight: 900; color: #0d9488; letter-spacing: 3px; }

        /* Measurement */
        .path-card { padding: 2.5rem; background: #f8fafc; border-radius: 24px; transition: all 0.3s; }
        .path-card:hover { transform: translateY(-5px); background: #f1f5f9; }
        .path-icon { color: #0d9488; margin-bottom: 1.5rem; }
        .path-card h3 { font-size: 1.25rem; font-weight: 800; margin-bottom: 1rem; }
        .path-card p { font-size: 0.95rem; color: #64748b; line-height: 1.6; }
        .triangulation-seal { margin-top: 4rem; display: flex; align-items: center; justify-content: center; gap: 0.75rem; color: #94a3b8; font-weight: 800; text-transform: uppercase; font-size: 0.7rem; letter-spacing: 2px; }

        /* Gap Focus */
        .gap-focus { background: rgba(255,255,255,0.05); padding: 3rem; border-radius: 24px; display: flex; flex-direction: column; gap: 1rem; }
        .gap-value { background: rgba(255,255,255,0.1); padding: 1.5rem; border-radius: 12px; font-weight: 800; }
        .gap-value span { display: block; font-size: 0.7rem; color: #94a3b8; font-weight: 400; margin-top: 4px; }
        .gap-diff { text-align: center; color: #ef4444; font-weight: 900; font-size: 0.8rem; letter-spacing: 4px; }

        /* CTA Box */
        .cta-box { display: flex; gap: 3rem; background: #f0fdfa; padding: 4rem; border-radius: 32px; border: 1px solid #ccfbf1; }
        .cta-main { flex: 1.5; }
        .cta-secondary { flex: 1; }
        .cta-divider { width: 1px; background: #ccfbf1; }

        @media (max-width: 992px) {
          .grid-2, .grid-3 { grid-template-columns: 1fr; }
          .hero-title { font-size: 2.5rem; }
          .dim-row { flex-direction: column; gap: 1.5rem; }
          .loop-steps { flex-direction: column; }
          .cta-box { flex-direction: column; }
          .cta-divider { width: 100%; height: 1px; }
        }
      `}</style>
    </div>
  );
};

export default FrameworkPage;
