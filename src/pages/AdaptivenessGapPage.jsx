import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Target, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import RelatedPathwaysSection from '../components/RelatedPathwaysSection';

const pageMeta = {
  domain: "insight",
  concepts: ["structural lag", "strategic drift", "behavioral observation"],
  related: ["/framework", "/how-measured", "/signals", "/observatory"]
};

const AdaptivenessGapPage = () => {
  return (
    <div className="gap-page">
      <header className="page-header">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="eyebrow">Core Insight</span>
            <h1>The Adaptiveness Gap</h1>
            <p className="hero-lead">Why Organizations Recognize Change Faster Than They Change Their Decisions</p>
          </motion.div>
        </div>
      </header>

      <section className="intro-section">
        <div className="container narrow">
          <p className="large-p">Across industries and regions, a consistent pattern appears. Leadership teams frequently acknowledge that the environment has shifted. They discuss emerging technologies. They recognize new risks. They agree that the organization must adapt.</p>
          <p className="large-p">Yet inside many organizations, <strong>actual decisions change far more slowly than awareness of change</strong>.</p>
          
          <div className="symptoms-grid mt-5">
            <div className="symptom">
              <Clock size={20} className="text-teal" />
              <span>Budgets remain allocated to outdated priorities.</span>
            </div>
            <div className="symptom">
              <Shield size={20} className="text-teal" />
              <span>Teams continue executing obsolete plans.</span>
            </div>
            <div className="symptom">
              <Target size={20} className="text-teal" />
              <span>Projects advance even after expiration of assumptions.</span>
            </div>
          </div>

          <div className="block-quote mt-5">
            <p>This phenomenon is not primarily a failure of intelligence or awareness. It is a failure of <strong>organizational adaptation</strong>.</p>
          </div>
        </div>
      </section>

      <section className="definition-section bg-navy text-white">
        <div className="container">
          <div className="content-grid">
            <div className="text-block">
              <h2>Defining the Adaptiveness Gap</h2>
              <p>The Adaptiveness Gap is the distance between what leadership teams recognize about changing reality and what their organizations actually change in response.</p>
              <p>The result is a structural lag between recognition and response. Over time, this lag produces strategic drift: organizations continue executing yesterday’s assumptions while the environment continues to evolve.</p>
            </div>
            <div className="visual-block">
              <div className="gap-visual">
                <div className="v-marker start">RECOGNITION</div>
                <div className="v-line">
                  <div className="v-fill">THE GAP</div>
                </div>
                <div className="v-marker end">ADAPTATION</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="why-section">
        <div className="container">
          <h2 className="section-h2 text-center">Why the Adaptiveness Gap Appears</h2>
          <div className="grid-3">
            {[
              { title: "Organizational Inertia", desc: "Large organizations are designed for stability. Budgets and structures reinforce existing priorities." },
              { title: "Fragmented Decisions", desc: "Leadership teams often agree on need for change but interpret implications differently." },
              { title: "Resource Commitment", desc: "Organizations remain invested in projects that no longer match current realities due to sunk costs." },
              { title: "Cognitive Framing", desc: "Uncertainty can trigger defensive interpretations, reframing change as a temporary anomaly." }
            ].map(item => (
              <div key={item.title} className="card-plain">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <RelatedPathwaysSection 
        relatedPaths={pageMeta.related}
        eyebrow="Conceptual Integration"
        title="Continue the Exploration"
      />

      <style jsx>{`
        .gap-page { background: white; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }
        .narrow { max-width: 760px; margin: 0 auto; }
        
        .page-header { padding: 12rem 0 6rem; background: #f8fafc; text-align: center; }
        .eyebrow { display: block; font-size: 0.8rem; font-weight: 800; color: #0d9488; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 1rem; }
        h1 { font-size: 4rem; font-weight: 800; color: #0a192f; margin-bottom: 1rem; }
        .hero-lead { font-size: 1.5rem; color: #475569; font-weight: 500; }

        .intro-section { padding: 8rem 0; }
        .large-p { font-size: 1.4rem; line-height: 1.8; color: #334155; margin-bottom: 2rem; }
        
        .symptoms-grid { display: flex; flex-direction: column; gap: 1rem; }
        .symptom { display: flex; align-items: center; gap: 1rem; font-weight: 600; color: #475569; }
        .text-teal { color: #0d9488; }

        .block-quote { padding: 3rem; background: #f8fafc; border-left: 4px solid #0d9488; border-radius: 4px; }
        .block-quote p { font-size: 1.25rem; font-style: italic; color: #0a192f; margin: 0; }

        .definition-section { padding: 8rem 0; }
        .bg-navy { background: #0a192f; }
        .text-white { color: white; }
        .content-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
        .text-block h2 { font-size: 2.5rem; font-weight: 800; margin-bottom: 2rem; }
        .text-block p { font-size: 1.1rem; line-height: 1.7; color: #94a3b8; margin-bottom: 1.5rem; }

        .gap-visual { position: relative; padding: 4rem 0; }
        .v-line { height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; position: relative; }
        .v-fill { position: absolute; left: 20%; right: 20%; height: 100%; background: #2dd4bf; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 0.6rem; font-weight: 900; color: #0a192f; letter-spacing: 2px; }
        .v-marker { position: absolute; font-size: 0.7rem; font-weight: 800; color: #2dd4bf; top: -30px; letter-spacing: 1px; }
        .v-marker.start { left: 0; }
        .v-marker.end { right: 0; text-align: right; }

        .why-section { padding: 8rem 0; }
        .section-h2 { font-size: 2.5rem; font-weight: 800; margin-bottom: 4rem; }
        .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; }
        .card-plain { padding: 2.5rem; border: 1px solid #e2e8f0; border-radius: 12px; }
        .card-plain h3 { font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; color: #0a192f; }
        .card-plain p { font-size: 0.95rem; color: #64748b; line-height: 1.6; }

        @media (max-width: 992px) {
          .content-grid { grid-template-columns: 1fr; }
          h1 { font-size: 3rem; }
        }
      `}</style>
    </div>
  );
};

export default AdaptivenessGapPage;
