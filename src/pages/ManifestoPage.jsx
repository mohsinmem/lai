import React from 'react';
import { motion } from 'framer-motion';
import RelatedPathwaysSection from '../components/RelatedPathwaysSection';

const pageMeta = {
  domain: "vision",
  concepts: ["institutional standards", "continuous change", "measurement problem"],
  related: ["/gap", "/framework", "/how-measured", "/observatory"]
};

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
            <h2>A World Defined by Continuous Change</h2>
            <p>Organizations today operate in environments where change is no longer episodic. It is continuous.</p>
            <p>Technological breakthroughs reshape industries at unprecedented speed. Geopolitical developments alter trade relationships and supply chains overnight. Artificial intelligence is transforming how organizations create value. Economic shocks ripple through global markets with increasing frequency.</p>
            <p>In such conditions, the stability that once allowed organizations to plan far into the future has largely disappeared. Leaders are now responsible for guiding institutions through systems where the environment itself evolves continuously.</p>
            <p>Yet the models of leadership used by many organizations were developed for a slower world. A world where change occurred periodically rather than constantly. A world where strategy could remain stable for years at a time.</p>
            <blockquote className="serif-quote">That world no longer exists.</blockquote>
          </motion.div>

          <motion.div 
            className="manifesto-section"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2>The New Leadership Imperative</h2>
            <p>In environments defined by constant disruption, leadership effectiveness can no longer depend solely on strategy or execution discipline. What increasingly determines organizational resilience is a different capability: <strong>Adaptiveness</strong>.</p>
            <p>Leadership adaptiveness is the ability of leadership systems to continuously interpret signals, revise assumptions, realign decisions, and redirect resources as circumstances evolve. It is not simply about responding to change after it becomes obvious. It is about maintaining alignment between organizational behavior and changing reality.</p>
          </motion.div>

          <motion.div 
            className="manifesto-section"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2>The Invisible Challenge</h2>
            <p>Despite its importance, leadership adaptiveness remains poorly understood and rarely measured. Many organizations assume they are adaptive if leaders discuss change or launch transformation initiatives. But discussion does not equal adaptation. Planning does not equal adaptation. Even intention does not equal adaptation.</p>
            <p>Adaptation only exists when leadership systems translate recognition of change into <strong>actual shifts in decisions, resource allocation, and coordinated action</strong>. And this is precisely where many organizations struggle.</p>
          </motion.div>

          <motion.div 
            className="manifesto-section"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2>The Measurement Problem</h2>
            <p>For decades, leadership measurement has focused primarily on personality traits, competencies, or leadership styles. Organizations ask whether leaders are visionary, collaborative, or communicative. These qualities may be valuable, but they do not answer the central leadership question of our time:</p>
            <blockquote className="serif-quote">“When reality changes, do leaders actually adapt their decisions?”</blockquote>
            <p>Most leadership assessments rely on perception-based feedback. These tools capture how leaders believe they behave, or how colleagues perceive them. But perception does not always reflect behavior under pressure.</p>
            <p>Adaptiveness can only be understood by observing how leaders <strong>actually respond to evolving situations</strong>.</p>
          </motion.div>

          <motion.div 
            className="manifesto-section"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2>A Behavioral View of Leadership</h2>
            <p>Understanding adaptiveness requires shifting from perception-based leadership assessment to behavioral observation. Leadership adaptiveness reveals itself through a series of observable behaviors:</p>
            <ul className="behavior-list">
              <li>Recognizing signals that the environment is changing.</li>
              <li>Interpreting uncertainty constructively.</li>
              <li>Aligning leadership decisions around shared responses.</li>
              <li>Reallocating resources toward emerging priorities.</li>
              <li>Translating decisions into coordinated operational change.</li>
            </ul>
          </motion.div>

          <motion.div 
            className="manifesto-section"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2>The Future of Leadership</h2>
            <p>Leadership has always involved guiding organizations through uncertainty. But the nature of uncertainty is evolving. Tomorrow’s leaders operate in systems where disruption is constant.</p>
            <div className="conclusion-call">
              <p>In a world defined by change, the most important leadership question is no longer: “What is the plan?”</p>
              <p className="final-quote">“How quickly can we adapt when the plan stops matching reality?”</p>
            </div>
          </motion.div>
        </div>
      </section>

      <RelatedPathwaysSection 
        relatedPaths={pageMeta.related}
        eyebrow="Mission Context"
        title="Continue Reading"
      />

      <style jsx>{`
        .manifesto-page { background: white; }
        
        .page-header {
          padding: 12rem 0 8rem;
          background: #f8fafc;
          text-align: center;
        }

        .page-header h1 { 
          font-size: 4rem; 
          font-weight: 800;
          margin-bottom: 1.5rem; 
          color: #0a192f; 
          letter-spacing: -0.02em;
        }
        
        .subtitle { 
          font-family: var(--font-sans); 
          color: #0d9488; 
          font-weight: 800; 
          text-transform: uppercase; 
          letter-spacing: 3px; 
          font-size: 0.85rem;
        }

        .manifesto-content { padding: 8rem 0; }
        .narrow-content { max-width: 760px; margin: 0 auto; }
        
        .manifesto-section { margin-bottom: 8rem; }
        .manifesto-section h2 { 
          font-size: 2.5rem; 
          font-weight: 800;
          margin-bottom: 2.5rem; 
          color: #0a192f; 
          letter-spacing: -0.01em;
        }
        
        .manifesto-section p { 
          font-size: 1.25rem; 
          line-height: 1.8; 
          color: #334155; 
          margin-bottom: 2rem; 
          font-weight: 400;
        }

        .serif-quote {
          font-family: var(--font-serif);
          font-size: 2.8rem;
          font-style: italic;
          color: #0a192f;
          margin: 4rem 0;
          text-align: center;
          line-height: 1.25;
          border: none;
          padding: 0;
        }

        .behavior-list {
          list-style: none;
          padding: 0;
          margin: 2rem 0;
        }

        .behavior-list li {
          font-size: 1.25rem;
          color: #334155;
          margin-bottom: 1.5rem;
          padding-left: 2.5rem;
          position: relative;
          line-height: 1.6;
        }

        .behavior-list li::before {
          content: '→';
          position: absolute;
          left: 0;
          color: #0d9488;
          font-weight: 800;
        }

        .conclusion-call {
          margin-top: 6rem;
          padding: 5rem 4rem;
          background: #f8fafc;
          border-radius: 24px;
          text-align: center;
          border: 1px solid #e2e8f0;
        }

        .conclusion-call p {
          font-size: 1.4rem;
          margin-bottom: 0;
        }

        .final-quote {
          font-family: var(--font-serif);
          font-size: 2.2rem;
          font-weight: 800;
          color: #0d9488;
          margin-top: 2.5rem;
          display: block;
          line-height: 1.3;
        }

        @media (max-width: 992px) {
          .page-header { padding: 10rem 0 6rem; }
          .page-header h1 { font-size: 3rem; }
          .manifesto-section h2 { font-size: 2rem; }
          .serif-quote { font-size: 2rem; }
          .manifesto-section p, .behavior-list li { font-size: 1.1rem; }
        }
      `}</style>
    </div>
  );
};

export default ManifestoPage;
