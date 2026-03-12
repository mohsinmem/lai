import React from 'react';
import { motion } from 'framer-motion';
import { Signal, Heart, Layers, Target, Zap, ArrowRight } from 'lucide-react';

const dimensions = [
  {
    icon: <Signal size={40} />,
    title: '1. Signal Detection',
    desc: 'Adaptiveness begins with the ability to recognize that circumstances are changing. Organizations constantly generate signals — emerging technologies, market shifts, competitor moves. Many signals remain unnoticed or dismissed. Signal Detection measures how effectively leaders identify early indicators of change and differentiate signal from noise.'
  },
  {
    icon: <Heart size={40} />,
    title: '2. Emotional Framing',
    desc: 'Recognizing change is not enough. Leaders must also interpret uncertainty in a productive way. When uncertainty appears, leadership teams often respond with either a Threat Orientation or an Opportunity Orientation. Emotional Framing measures how leadership teams psychologically interpret change and uncertainty, influencing whether they approach disruption as a danger or an opportunity.'
  },
  {
    icon: <Layers size={40} />,
    title: '3. Resource Reallocation',
    desc: 'Adaptiveness becomes visible when organizations redirect effort. Even when leaders recognize change, organizations often continue investing in outdated priorities. Resource Reallocation measures how effectively leadership teams shift budgets toward emerging priorities and discontinue initiatives that no longer serve the strategy.'
  },
  {
    icon: <Target size={40} />,
    title: '4. Decision Alignment',
    desc: 'Leadership teams frequently agree on the need for change in meetings but diverge in their decisions afterward. Decision Alignment measures whether leadership decisions reinforce a shared strategic response to change. When alignment is strong, leaders reinforce each other’s decisions and organizations maintain coherent momentum.'
  },
  {
    icon: <Zap size={40} />,
    title: '5. Execution Responsiveness',
    desc: 'The final dimension of adaptiveness is execution. Adaptation only becomes real when actions change across the organization. Execution Responsiveness measures how quickly organizations translate leadership decisions into operational shifts, including changes in workflows, new product development, and process redesign.'
  }
];

const FrameworkPage = () => {
  return (
    <div className="framework-page">
      <header className="page-header">
        <div className="container">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            The Leadership Adaptiveness Framework
          </motion.h1>
          <p className="subtitle">The Behavioral System Behind the LAI Score</p>
        </div>
      </header>

      <section className="framework-intro">
        <div className="container narrow-content">
          <p className="lead">The Leadership Adaptiveness Framework translates the concept of adaptiveness into a set of observable leadership behaviors that can be measured, benchmarked, and improved.</p>
          <p>Ground in behavioral research conducted through AFERR, drawing on data from thousands of simulations, the framework captures the behavioral system that determines how quickly organizations respond when reality shifts.</p>
        </div>
      </section>

      <section className="dimensions-detail">
        <div className="container">
          {dimensions.map((dim, i) => (
            <motion.div 
              key={dim.title}
              className={`dim-block ${i % 2 !== 0 ? 'reverse' : ''}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="dim-icon-box">{dim.icon}</div>
              <div className="dim-text">
                <h2>{dim.title}</h2>
                <p>{dim.desc}</p>
                <div className="dim-metrics">
                  <span>Key Metrics: Recognition Speed, Signal Sensitivity, Noise Ratio</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="adaptiveness-loop">
        <div className="container">
          <div className="loop-card">
            <h2>The Adaptiveness Loop</h2>
            <p>These five dimensions operate as a continuous feedback loop. If any stage weakens, the entire system slows down.</p>
            <div className="loop-visual">
              <div className="loop-step">Signal</div>
              <ArrowRight className="loop-arrow" />
              <div className="loop-step">Frame</div>
              <ArrowRight className="loop-arrow" />
              <div className="loop-step">Resource</div>
              <ArrowRight className="loop-arrow" />
              <div className="loop-step">Align</div>
              <ArrowRight className="loop-arrow" />
              <div className="loop-step">Execute</div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .framework-page { padding-bottom: 8rem; }
        
        .page-header {
          padding: 10rem 0 6rem;
          background: var(--navy);
          text-align: center;
          color: white;
        }

        .page-header h1 { font-size: 3.5rem; margin-bottom: 1rem; color: white; }
        .subtitle { font-family: var(--font-sans); color: var(--teal-light); font-weight: 700; text-transform: uppercase; letter-spacing: 2px; }

        .framework-intro { padding: 6rem 0; text-align: center; border-bottom: 1px solid var(--border-color); }
        .narrow-content { max-width: 800px; margin: 0 auto; }
        .lead { font-size: 1.5rem; color: var(--navy); font-weight: 500; margin-bottom: 2rem; line-height: 1.4; }
        .framework-intro p:not(.lead) { color: var(--text-muted); font-size: 1.1rem; }

        .dimensions-detail { padding: 8rem 0; }
        .dim-block { display: flex; align-items: center; gap: 5rem; margin-bottom: 8rem; }
        .dim-block.reverse { flex-direction: row-reverse; }
        
        .dim-icon-box { 
          flex: 0 0 120px; height: 120px; background: rgba(49, 151, 149, 0.1); 
          border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--teal);
        }
        
        .dim-text { flex: 1; }
        .dim-text h2 { font-size: 2.2rem; margin-bottom: 1.5rem; }
        .dim-text p { font-size: 1.1rem; line-height: 1.7; color: var(--text-muted); margin-bottom: 2rem; }
        
        .dim-metrics { font-family: var(--font-sans); font-size: 0.8rem; font-weight: 700; color: var(--navy); text-transform: uppercase; letter-spacing: 1px; }

        .adaptiveness-loop { padding-bottom: 8rem; }
        .loop-card { background: #f8fafc; padding: 5rem; border-radius: 20px; text-align: center; }
        .loop-card h2 { font-size: 2.5rem; margin-bottom: 1.5rem; }
        .loop-card p { color: var(--text-muted); margin-bottom: 4rem; max-width: 600px; margin-left: auto; margin-right: auto; }

        .loop-visual { display: flex; align-items: center; justify-content: space-between; max-width: 900px; margin: 0 auto; }
        .loop-step { padding: 1.5rem 2rem; background: white; border: 2px solid var(--teal); border-radius: 8px; font-weight: 700; color: var(--navy); box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
        .loop-arrow { color: var(--slate-light); }

        @media (max-width: 992px) {
          .dim-block, .dim-block.reverse { flex-direction: column; text-align: center; gap: 2rem; }
          .loop-visual { flex-direction: column; gap: 1.5rem; }
          .loop-arrow { transform: rotate(90deg); }
        }
      `}</style>
    </div>
  );
};

export default FrameworkPage;
