import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText, ShieldCheck, Info, ArrowRight, 
  Activity, Users, Brain, Target, Compass
} from 'lucide-react';
import { supabase } from '../supabase';

const dimensions = [
  { id: 'signal_detection', name: 'Signal Detection', desc: 'Ability to detect emerging technological, geopolitical, and market signals.' },
  { id: 'cognitive_framing', name: 'Cognitive Framing', desc: 'Interpretation of market shifts (Opportunity vs. Threat).' },
  { id: 'decision_alignment', name: 'Decision Alignment', desc: 'Convergence of actions across the simulated system.' },
  { id: 'resource_calibration', name: 'Resource Calibration', desc: 'Velocity of capital and talent reallocation.' },
  { id: 'integrated_responsiveness', name: 'Integrated Responsiveness', desc: 'Systemic translation of strategy into behavioral output.' }
];

const RadarChart = ({ scores }) => {
  const size = 300;
  const center = size / 2;
  const radius = size * 0.4;
  const angleStep = (Math.PI * 2) / 5;

  // Grid lines
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];
  
  const getPoint = (score, index, r = radius) => {
    const angle = angleStep * index - Math.PI / 2;
    const factor = score / 100;
    const x = center + r * factor * Math.cos(angle);
    const y = center + r * factor * Math.sin(angle);
    return { x, y };
  };

  const points = dimensions.map((d, i) => getPoint(scores[d.id] || 0, i));
  const pointsString = points.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="radar-container">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Grid */}
        {gridLevels.map((level, i) => (
          <polygon
            key={i}
            points={dimensions.map((_, j) => {
              const p = getPoint(100, j, radius * level);
              return `${p.x},${p.y}`;
            }).join(' ')}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="1"
          />
        ))}
        
        {/* Axis Lines */}
        {dimensions.map((_, i) => {
          const p = getPoint(100, i);
          return (
            <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} stroke="#e2e8f0" strokeWidth="1" />
          );
        })}

        {/* Data Area */}
        <motion.polygon
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          points={pointsString}
          fill="rgba(20, 184, 166, 0.2)"
          stroke="#14b8a6"
          strokeWidth="2"
        />

        {/* Labels */}
        {dimensions.map((d, i) => {
          const p = getPoint(115, i);
          return (
            <text
              key={i}
              x={p.x}
              y={p.y}
              fontSize="8"
              fontWeight="800"
              fill="#94a3b8"
              textAnchor="middle"
              dominantBaseline="middle"
              className="radar-label"
              style={{ textTransform: 'uppercase', letterSpacing: '1px' }}
            >
              {d.name.split(' ').map((word, wi) => (
                <tspan key={wi} x={p.x} dy={wi === 0 ? 0 : 10}>{word}</tspan>
              ))}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

const Part1Report = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [teamData, setTeamData] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`/.netlify/functions/api/diagnostic/${id}`);
        if (!response.ok) throw new Error('Report not found');
        const report = await response.json();
        setData(report);

        // If team code exists, fetch team average
        if (report.metadata?.team_code) {
          // Note: In a production environment, this would also be a backend endpoint
          // For now, we keep the aggregation logic or move it to a new endpoint if needed.
          const { data: teamResults } = await supabase
            .from('diagnostic_results')
            .select('*')
            .eq('metadata->>team_code', report.metadata.team_code);
          
          if (teamResults && teamResults.length > 1) {
            const avg = dimensions.reduce((acc, dim) => {
              const field = `${dim.id}_score`;
              acc[dim.id] = teamResults.reduce((sum, r) => sum + (r[field] || 0), 0) / teamResults.length;
              return acc;
            }, {});
            setTeamData({ count: teamResults.length, scores: avg });
          }
        }
      } catch (err) {
        console.error('Report Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  if (loading) return <div className="report-loading">Synthesizing Institutional Profile...</div>;
  if (!data) return <div className="report-error">Report not found.</div>;

  const scores = {
    signal_detection: data.signal_detection_score,
    cognitive_framing: data.cognitive_framing_score,
    decision_alignment: data.decision_alignment_score,
    resource_calibration: data.resource_calibration_score,
    integrated_responsiveness: data.integrated_responsiveness_score
  };

  return (
    <div className="report-page">
      <div className="report-container">
        {/* HEADER */}
        <header className="report-header">
          <div className="institutional-box">
             <div className="lai-logo">LAI</div>
             <div className="line" />
             <div className="report-type">PERCEPTION ASSESSMENT</div>
          </div>
          <h1>Leadership Adaptiveness Profile</h1>
          <div className="meta-row">
            <span>Institution: <strong>{data.organization_name}</strong></span>
            <span>Date: <strong>{new Date(data.created_at).toLocaleDateString()}</strong></span>
            <span>ID: <strong>{id.substring(0, 8)}</strong></span>
          </div>
        </header>

        {/* SECTION 1: EXECUTIVE OVERVIEW */}
        <section className="report-section">
          <h2>Executive Overview</h2>
          <div className="overview-content">
            <p>
              This report reflects how you currently perceive your leadership system’s ability to detect change, align decisions, and respond to disruption.
            </p>
            <div className="insight-callout">
               <Info size={16} />
               <p>
                 Leadership adaptiveness is often difficult to evaluate from perception alone. Many leadership teams believe they adapt quickly, but behavioral observation frequently reveals gaps between awareness and action.
               </p>
            </div>
          </div>
        </section>

        {/* SECTION 2: ADAPTIVENESS PROFILE */}
        <section className="report-section profile-section">
          <div className="chart-area">
             <h2>Your Adaptiveness Profile</h2>
             <RadarChart scores={scores} />
             <p className="chart-caption">Scores reflect self-perception across five dimensions of leadership adaptiveness.</p>
          </div>
          
          <div className="dimension-list">
             {dimensions.map(dim => (
               <div key={dim.id} className="dim-card-report">
                  <div className="dim-header">
                    <span className="dim-name">{dim.name}</span>
                    <span className="dim-score">{scores[dim.id]}</span>
                  </div>
                  <p className="dim-desc">{dim.desc}</p>
                  <div className="dim-bar">
                    <div className="fill" style={{ width: `${scores[dim.id]}%` }} />
                  </div>
               </div>
             ))}
          </div>
        </section>

        {/* SECTION 4: TEAM VIEW (IF APPLICABLE) */}
        {teamData && (
          <section className="report-section team-section">
            <div className="section-header-row">
              <Users size={20} />
              <h2>Leadership System Perception</h2>
            </div>
            <p>Aggregated results from <strong>{teamData.count}</strong> leadership team members.</p>
            <div className="team-comparison-grid">
               <div className="comparison-card">
                  <h4>Perception Alignment</h4>
                  <p>Leadership teams frequently discover differences in how members perceive decision alignment and responsiveness.</p>
               </div>
               <div className="variance-check">
                  {/* Simplistic variance logic */}
                  <div className="v-label">System Variance</div>
                  <div className="v-value">MODERATE</div>
               </div>
            </div>
          </section>
        )}

        {/* SECTION 6: RESEARCH INSIGHT */}
        <section className="report-section research-insight">
           <div className="insight-grid">
              <div className="i-icon"><Brain size={32} /></div>
              <div className="i-text">
                 <h3>Research Insight</h3>
                 <p>
                   Research conducted by the Leadership Adaptiveness Institute shows that perception-based assessments often overestimate adaptiveness. Behavioral observation frequently reveals that leadership systems detect signals but struggle to realign decisions and resources quickly.
                 </p>
              </div>
           </div>
        </section>

        {/* SECTION 7: NEXT STAGE */}
        <section className="report-section next-stage">
            <div className="next-stage-box">
               <div className="n-header">
                  <Target size={24} />
                  <h3>Next Stage of Measurement: Behavioral Observation</h3>
               </div>
               <p>
                 The next stage of the Leadership Adaptiveness Diagnostic observes leadership behavior under dynamic conditions. In the coming days, you will receive access to a short simulation experience designed to observe how leadership decisions unfold in practice.
               </p>
               <div className="stage-actions">
                  <button className="btn-institutional primary">Launch Preliminary Simulation</button>
                  <button className="btn-institutional outline">Download Briefing PDF</button>
               </div>
            </div>
        </section>

        <footer className="report-footer">
          <div className="footer-logo">LEADERSHIP ADAPTIVENESS INSTITUTE</div>
          <div className="legal">CONFIDENTIAL · INTELLECTUAL PROPERTY OF LAI</div>
        </footer>
      </div>

      <style jsx>{`
        .report-page { background: #f1f5f9; min-height: 100vh; padding: 4rem 2rem; color: #0f172a; }
        .report-container { 
          max-width: 900px; margin: 0 auto; background: white; 
          padding: 5rem; box-shadow: 0 50px 100px -20px rgba(0,0,0,0.1);
        }
        
        /* Header */
        .report-header { border-bottom: 2px solid #0f172a; padding-bottom: 2rem; margin-bottom: 4rem; }
        .institutional-box { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
        .lai-logo { font-weight: 900; font-size: 1.25rem; letter-spacing: -1px; }
        .institutional-box .line { width: 1px; height: 20px; background: #e2e8f0; }
        .report-type { font-size: 0.65rem; font-weight: 800; letter-spacing: 2px; color: #94a3b8; }
        
        h1 { font-size: 2.75rem; font-weight: 950; margin-bottom: 1.5rem; font-family: 'Georgia', serif; }
        .meta-row { display: flex; gap: 3rem; font-size: 0.8rem; color: #64748b; }
        .meta-row strong { color: #0f172a; }

        /* Sections */
        .report-section { margin-bottom: 5rem; }
        h2 { font-size: 1.25rem; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; color: #0f172a; margin-bottom: 1.5rem; border-bottom: 1px solid #f1f5f9; padding-bottom: 0.5rem; }
        
        .overview-content { max-width: 650px; }
        .overview-content p { font-size: 1.1rem; line-height: 1.6; color: #475569; }
        
        .insight-callout { 
          margin-top: 2rem; padding: 1.5rem; background: #f8fafc; border-left: 3px solid #14b8a6;
          display: flex; gap: 1rem;
        }
        .insight-callout p { margin: 0; font-size: 0.95rem; font-style: italic; color: #64748b; }

        /* Profile Section */
        .profile-section { display: grid; grid-template-columns: 350px 1fr; gap: 4rem; align-items: center; }
        .chart-area { text-align: center; }
        .radar-container { margin: 2rem 0; }
        .chart-caption { font-size: 0.75rem; color: #94a3b8; font-style: italic; }
        
        .dimension-list { display: flex; flex-direction: column; gap: 1.5rem; }
        .dim-card-report { padding: 1.5rem; border: 1px solid #f1f5f9; border-radius: 12px; }
        .dim-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
        .dim-name { font-weight: 900; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; }
        .dim-score { font-size: 1.25rem; font-weight: 900; font-family: monospace; color: #14b8a6; }
        .dim-desc { font-size: 0.8rem; color: #64748b; margin-bottom: 1rem; }
        .dim-bar { height: 4px; background: #f1f5f9; border-radius: 2px; }
        .dim-bar .fill { height: 100%; background: #14b8a6; border-radius: 2px; }

        /* Team Section */
        .section-header-row { display: flex; align-items: center; gap: 1rem; color: #14b8a6; margin-bottom: 1rem; }
        .section-header-row h2 { flex: 1; border: none; margin: 0; }
        .team-comparison-grid { display: grid; grid-template-columns: 1fr 200px; gap: 2rem; margin-top: 2rem; }
        .comparison-card { background: #f8fafc; padding: 2rem; border-radius: 16px; h4 { margin-top: 0; font-size: 1rem; } }
        .variance-check { background: #0f172a; color: white; border-radius: 16px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .v-label { font-size: 0.6rem; color: #94a3b8; font-weight: 800; letter-spacing: 2px; margin-bottom: 0.5rem; }
        .v-value { font-size: 1.5rem; font-weight: 900; }

        /* Research Insight */
        .research-insight { background: #0f172a; color: white; padding: 3rem; border-radius: 24px; }
        .insight-grid { display: flex; gap: 2.5rem; align-items: center; }
        .i-icon { color: #14b8a6; }
        .i-text h3 { color: white; margin-top: 0; font-size: 1.25rem; margin-bottom: 1rem; }
        .i-text p { color: #94a3b8; line-height: 1.6; margin: 0; }

        /* Next Stage */
        .next-stage-box { border: 2px solid #f1f5f9; border-radius: 24px; padding: 3rem; }
        .n-header { display: flex; align-items: center; gap: 1rem; color: #14b8a6; margin-bottom: 1.5rem; }
        .n-header h3 { margin: 0; font-size: 1.5rem; color: #0f172a; }
        .next-stage-box p { font-size: 1rem; line-height: 1.6; color: #475569; margin-bottom: 2.5rem; }
        .stage-actions { display: flex; gap: 1.5rem; }

        /* Footer */
        .report-footer { border-top: 1px solid #f1f5f9; padding-top: 3rem; display: flex; justify-content: space-between; align-items: center; }
        .footer-logo { font-size: 0.75rem; font-weight: 900; letter-spacing: 1.5px; }
        .legal { font-size: 0.6rem; color: #cbd5e1; font-weight: 800; }

        .report-loading { display: flex; height: 100vh; align-items: center; justify-content: center; font-weight: 800; color: #94a3b8; letter-spacing: 2px; text-transform: uppercase; }

        @media (max-width: 768px) {
          .report-container { padding: 2rem; }
          .profile-section { grid-template-columns: 1fr; }
          .meta-row { flex-direction: column; gap: 0.5rem; }
          .team-comparison-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default Part1Report;
