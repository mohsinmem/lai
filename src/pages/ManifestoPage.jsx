import React from 'react';
import { motion } from 'framer-motion';

const ManifestoPage = () => {
  return (
    <div className="manifesto-page">
      <header className="page-header">
        <div className="container">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            The Leadership Adaptiveness Manifesto
          </motion.h1>
          <p className="subtitle">Why Leadership Adaptiveness Must Become a Global Standard</p>
        </div>
      </header>

      <section className="manifesto-content">
        <div className="container narrow-content">
          <motion.div 
            className="manifesto-section"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2>The Age of Perpetual Change</h2>
            <p>The modern organization operates in an environment where change is no longer episodic. It is continuous.</p>
            <p>Markets shift unexpectedly. Technologies emerge faster than institutions can absorb them. Geopolitical shocks ripple through supply chains overnight. Entire industries are reshaped within a few years.</p>
            <p>Yet most organizations still operate with leadership models designed for a slower world — a world where strategy could remain stable for long periods and leaders had time to adjust gradually.</p>
            <blockquote className="serif-quote">That world no longer exists.</blockquote>
            <p>Today, the primary challenge facing leaders is not simply strategy or execution. It is <strong>adaptiveness</strong>.</p>
          </motion.div>

          <motion.div 
            className="manifesto-section"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2>The Adaptiveness Gap</h2>
            <p>Across industries and regions, a consistent pattern appears. Leaders may agree in meetings that circumstances have changed. They may acknowledge new risks, new technologies, or new strategic realities.</p>
            <p>But the actual decisions inside organizations often lag behind this awareness. Budgets remain allocated to outdated priorities. Teams continue executing obsolete plans. Projects advance even after their strategic assumptions have expired.</p>
            <div className="highlight-box">
              <p>This creates a hidden phenomenon that we call <strong>the Adaptiveness Gap</strong>: The distance between what leaders recognize intellectually and what their organizations actually change in practice.</p>
            </div>
          </motion.div>

          <motion.div 
            className="manifesto-section"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2>The Problem with Measuring Leadership</h2>
            <p>Traditional leadership assessments focus on personality traits, competencies, or leadership styles. While these dimensions may matter, they do not capture the central question organizations now face:</p>
            <blockquote className="serif-quote">“When reality changes, do leaders actually adapt their decisions?”</blockquote>
            <p>Most leadership measurement tools rely on surveys and perception-based feedback. These methods capture how leaders believe they behave, or how colleagues perceive them. But perception does not always reflect real behavior under pressure.</p>
            <p>Adaptiveness is not a belief. It is a behavior. And behavior must be measured where decisions actually occur.</p>
          </motion.div>

          <motion.div 
            className="manifesto-section final"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2>The Future of Leadership</h2>
            <p>Leadership has always been about guiding organizations through uncertainty. But the nature of uncertainty is changing. Where previous generations of leaders faced occasional disruption, today’s leaders operate in systems where disruption is constant.</p>
            <p>In such systems, leadership cannot rely solely on static strategies or established playbooks. It must evolve continuously.</p>
            <div className="conclusion-call">
              <p>In a world defined by change, the most important leadership question is no longer: “What is the plan?”</p>
              <p className="final-quote">“How quickly can we adapt when the plan stops matching reality?”</p>
            </div>
          </motion.div>
        </div>
      </section>

      <style jsx>{`
        .manifesto-page { padding-bottom: 8rem; }
        
        .page-header {
          padding: 10rem 0 6rem;
          background: #f8fafc;
          text-align: center;
        }

        .page-header h1 { font-size: 3.5rem; margin-bottom: 1rem; color: var(--navy); }
        .subtitle { font-family: var(--font-sans); color: var(--teal); font-weight: 700; text-transform: uppercase; letter-spacing: 2px; }

        .narrow-content { max-width: 800px; margin: 0 auto; }
        
        .manifesto-section { margin-bottom: 6rem; }
        .manifesto-section h2 { font-size: 2.2rem; margin-bottom: 2rem; color: var(--navy); border-bottom: 2px solid var(--teal); display: inline-block; padding-bottom: 0.5rem; }
        .manifesto-section p { font-size: 1.2rem; line-height: 1.8; color: var(--text-main); margin-bottom: 1.5rem; }

        .serif-quote {
          font-family: var(--font-serif);
          font-size: 2.5rem;
          font-style: italic;
          color: var(--navy);
          margin: 3rem 0;
          text-align: center;
          line-height: 1.2;
        }

        .highlight-box {
          background: var(--navy);
          color: white;
          padding: 3rem;
          border-radius: 8px;
          margin: 3rem 0;
        }
        .highlight-box p { color: #cbd5e0; margin-bottom: 0; }

        .conclusion-call {
          margin-top: 5rem;
          padding: 4rem;
          background: rgba(49, 151, 149, 0.05);
          border-radius: 12px;
          text-align: center;
        }

        .final-quote {
          font-family: var(--font-serif);
          font-size: 2rem;
          font-weight: 700;
          color: var(--teal);
          margin-top: 2rem;
        }

        @media (max-width: 768px) {
          .page-header h1 { font-size: 2.5rem; }
          .manifesto-section h2 { font-size: 1.8rem; }
          .serif-quote { font-size: 1.8rem; }
        }
      `}</style>
    </div>
  );
};

export default ManifestoPage;
