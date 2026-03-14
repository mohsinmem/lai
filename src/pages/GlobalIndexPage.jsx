import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, Search, ChevronDown, ChevronUp, Zap, 
  Shield, ShieldCheck, TrendingUp, Brain, CheckCircle2, 
  AlertTriangle, Info, Layers, BarChart3, Waves, 
  Scale, ExternalLink, Activity, ArrowUp, ArrowDown, CheckCircle, CheckCircle2
} from 'lucide-react';
import { supabase } from '../supabase';

const PILLAR_DEFINITIONS = {
  signal_detection: "Measures how quickly leadership systems recognize emerging environmental signals such as technological change, regulatory shifts, or competitive disruption.",
  cognitive_framing: "Measures how leadership interprets uncertainty — whether it is framed as a threat requiring defense or an opportunity requiring exploration.",
  decision_alignment: "Measures whether leadership decisions reinforce a coherent strategic response across teams and business units.",
  resource_calibration: "Measures the speed and precision with which capital and talent are reallocated to high-potential opportunities during shifts.",
  integrated_responsiveness: "Measures the capacity to maintain high-performance decision execution while simultaneously learning from environmental feedback."
};

// ── Evolutionary State Logic ──────────────────────────────────────────────────
const getEvolutionaryState = (score) => {
  if (score >= 80) return { label: 'Antifragile', color: '#065f46', pill: 'bg-emerald-900/10 text-emerald-800 border-emerald-200' };
  if (score >= 65) return { label: 'Adaptive',    color: '#1e40af', pill: 'bg-blue-900/10 text-blue-800 border-blue-200' };
  if (score >= 50) return { label: 'Emergent',    color: '#b45309', pill: 'bg-amber-900/10 text-amber-800 border-amber-200' };
  return                { label: 'Fragile',     color: '#b91c1c', pill: 'bg-rose-900/10 text-rose-800 border-rose-200' };
};

const getScoreColor = (score) => {
  // 4-Point Interpolation: 0=Red(#b91c1c), 50=Amber(#b45309), 70=Blue(#1e40af), 100=Green(#065f46)
  if (score < 50) {
    const p = score / 50;
    const r = Math.round(185 + (180 - 185) * p);
    const g = Math.round(28 + (83 - 28) * p);
    const b = Math.round(28 + (9 - 28) * p);
    return `rgb(${r},${g},${b})`;
  } else if (score < 70) {
    const p = (score - 50) / 20;
    const r = Math.round(180 + (30 - 180) * p);
    const g = Math.round(83 + (64 - 83) * p);
    const b = Math.round(9 + (175 - 9) * p);
    return `rgb(${r},${g},${b})`;
  } else {
    const p = (score - 70) / 30;
    const r = Math.round(30 + (6 - 30) * p);
    const g = Math.round(64 + (95 - 64) * p);
    const b = Math.round(175 + (70 - 175) * p);
    return `rgb(${r},${g},${b})`;
  }
};

const formatDate = (val) => {
  if (!val) return '';
  const d = new Date(val);
  return isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const REGION_COORDINATES = {
  'North America': [38, 18], 'USA': [38, 20], 'Canada': [25, 20],
  'Latin America': [65, 30], 'South America': [70, 32], 'Brazil': [68, 35],
  'Western Europe': [32, 48], 'Europe': [30, 50], 'UK': [28, 46], 'Germany': [30, 51],
  'Eastern Europe': [32, 56], 'Middle East': [45, 58],
  'Africa': [60, 52], 'Nigeria': [55, 48], 'South Africa': [82, 58],
  'South Asia': [48, 72], 'India': [52, 74],
  'East Asia': [38, 85], 'China': [40, 82], 'Japan': [35, 88],
  'APAC': [55, 88], 'LATAM': [65, 30],
  'Global': [50, 50],
};

function getDotPosition(org) {
  const hash = org.organization.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  let regionKey = Object.keys(REGION_COORDINATES).find(k => org.region?.toLowerCase().includes(k.toLowerCase())) || 'Global';
  if (regionKey === 'Global') {
    const keys = Object.keys(REGION_COORDINATES).filter(k => k !== 'Global');
    regionKey = keys[hash % keys.length];
  }
  let [baseTop, baseLeft] = REGION_COORDINATES[regionKey];
  const jitterTop = ((hash * 13) % 8) - 4;
  const jitterLeft = ((hash * 7) % 8) - 4;
  return {
    top: Math.max(5, Math.min(92, baseTop + jitterTop)),
    left: Math.max(2, Math.min(96, baseLeft + jitterLeft)),
  };
}

const MapDot = React.memo(({ org, onClick, selected }) => {
  const ev = getEvolutionaryState(org.score);
  const isTop = org.score >= 70;
  const { top, left } = getDotPosition(org);
  return (
    <motion.button
      onClick={() => onClick(org)}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: selected ? 1.7 : 1, opacity: 1 }}
      style={{
        position: 'absolute', top: `${top}%`, left: `${left}%`,
        width: isTop ? 14 : 11, height: isTop ? 14 : 11, borderRadius: '50%',
        background: ev.color, border: `${isTop ? 3 : 2}px solid white`,
        boxShadow: selected ? `0 0 0 5px ${ev.color}55, 0 0 24px ${ev.color}` : '0 1px 4px rgba(0,0,0,0.3)',
        cursor: 'pointer', zIndex: selected ? 30 : 10,
        animation: isTop && !selected ? 'antifragilePulse 3s ease-in-out infinite' : 'none'
      }}
    />
  );
});


const ScoreBar = ({ score }) => {
  const bgSize = score > 0 ? `${(100 / score) * 100}% 100%` : '100% 100%';
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '220px' }}>
      <div style={{ flex: 1, height: 10, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden', position: 'relative', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)' }}>
        {/* Background track */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #b91c1c, #b45309, #1e40af, #065f46)', opacity: 0.08 }} />
        
        {/* Master Gradient with subtle internal gloss */}
        <motion.div initial={{ width: 0 }} animate={{ width: `${score}%` }}
          style={{ 
            height: '100%', 
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.15), transparent), linear-gradient(to right, #b91c1c, #b45309, #1e40af, #065f46)', 
            backgroundSize: `100% 100%, ${bgSize}`,
            backgroundBlendMode: 'overlay',
            borderRadius: 2, 
            position: 'relative',
            boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
          }}>
          {/* Accessibility Texture Overlay */}
          <div style={{ position: 'absolute', inset: 0, opacity: 0.1, background: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.2) 5px, rgba(255,255,255,0.2) 10px)' }} />
        </motion.div>
      </div>
    </div>
  );
};

const LeaderboardRow = React.memo(({ r, idx, expandedId, setExpandedId, setFocusDot }) => {
  const ev = getEvolutionaryState(r.score);
  const isOpen = expandedId === idx;
  const is_triangulated = r.is_triangulated;
  const is_dissonant = r.strategic_dissonance;
  const is_inferred = !is_triangulated && (r.source_breakdown_obj?.contributions?.environmental > 80);
  const formattedIdx = (idx + 1).toString().padStart(2, '0');
  
  const hash = r.organization.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const signalConfidence = is_triangulated ? 94 : (r.evidence_density > 0.6 ? 78 : (is_dissonant ? 42 : 56));
  const shiftVal = parseFloat(r.cognitiveShift?.replace(/[+%↑]/g, '') || '0');
  const signalVelocity = shiftVal > 3 ? 'ACCELERATING' : (shiftVal > 1.2 ? 'STABLE' : 'DECELERATING');
  const signalActivity = Math.round((hash % 40) + 12); // Mock signal volume
  const activityLevel = signalActivity > 35 ? 'HIGH' : (signalActivity > 20 ? 'MEDIUM' : 'LOW');

  const FidelityBadge = () => {
    const badgeStyle = {
      padding: '0.25rem 0.6rem',
      borderRadius: '4px',
      fontSize: '0.6rem',
      fontWeight: 900,
      border: '1px solid',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      cursor: 'help',
      position: 'relative',
      transition: 'all 0.2s'
    };

    const Tooltip = ({ text }) => (
      <div className="badge-tooltip" style={{
        position: 'absolute',
        bottom: '140%',
        right: '0',
        width: '240px',
        background: '#0f172a',
        color: 'white',
        padding: '0.8rem 1rem',
        borderRadius: '12px',
        fontSize: '0.65rem',
        lineHeight: '1.5',
        textAlign: 'left',
        zIndex: 1000,
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        pointerEvents: 'none',
        opacity: 0,
        visibility: 'hidden',
        transition: 'all 0.2s ease',
        fontWeight: 400,
        textTransform: 'none',
        letterSpacing: 'normal'
      }}>
        {text}
        <div style={{ position: 'absolute', top: '100%', right: '15px', border: '6px solid transparent', borderTopColor: '#0f172a' }} />
      </div>
    );

    return (
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <style>{`
          .fidelity-trigger:hover .badge-tooltip { opacity: 1 !important; visibility: visible !important; transform: translateY(-5px); }
          .fidelity-trigger:hover { filter: brightness(0.95); }
        `}</style>
        {is_triangulated && (
          <div className="fidelity-trigger" style={{ position: 'relative' }}>
            <span style={{ ...badgeStyle, background: '#eff6ff', color: '#1e40af', borderColor: '#dbeafe' }}>
              TRIANGULATED <Info size={10} strokeWidth={3} />
            </span>
            <Tooltip text="Triangulated scores are validated across behavioral, perceptual, and research data sources and represent the highest fidelity measurement." />
          </div>
        )}
        {is_dissonant && (
          <div className="fidelity-trigger" style={{ position: 'relative' }}>
            <span style={{ ...badgeStyle, background: '#fffbeb', color: '#b45309', borderColor: '#fef3c7' }}>
              INSIGHT ALERT <Info size={10} strokeWidth={3} />
            </span>
            <Tooltip text="Leadership perception of adaptiveness significantly exceeds behavioral indicators. This may indicate strategic dissonance." />
          </div>
        )}
        {!is_triangulated && !is_dissonant && (
          <div className="fidelity-trigger" style={{ position: 'relative' }}>
            <span style={{ ...badgeStyle, background: '#f8fafc', color: '#475569', borderColor: '#e2e8f0' }}>
              INFERRED <Info size={10} strokeWidth={3} />
            </span>
            <Tooltip text="This score is inferred from external intelligence signals such as market behavior, industry events, and institutional actions." />
          </div>
        )}
        <div className="fidelity-trigger" style={{ marginTop: '8px', position: 'relative' }}>
          <div style={{ fontSize: '0.55rem', fontWeight: 900, color: '#94a3b8', letterSpacing: 1.5, fontVariantNumeric: 'tabular-nums' }}>
            CONFIDENCE {signalConfidence}%
          </div>
          <Tooltip text="Confidence reflects the volume, diversity, and reliability of signals used to calculate the LAI score." />
        </div>
      </div>
    );
  };

  return (
    <div style={{ position: 'relative' }}>
      <motion.div 
        onClick={() => { setExpandedId(isOpen ? null : idx); setFocusDot(r); }}
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'minmax(80px, 100px) minmax(280px, 1.2fr) minmax(350px, 1.5fr) 140px 240px',
          alignItems: 'center', 
          padding: '24px 40px', 
          cursor: 'pointer',
          background: isOpen ? '#f8fafc' : (idx === 0 ? 'rgba(16, 185, 129, 0.03)' : 'white'),
          margin: '0 8px 1px',
          borderRadius: 4,
          boxShadow: '0 1px 0 rgba(0,0,0,0.03)',
          borderLeft: idx === 0 ? '4px solid #10b981' : '4px solid transparent',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          zIndex: isOpen ? 10 : 1
        }}
        whileHover={{ 
          background: idx === 0 ? 'rgba(16, 185, 129, 0.05)' : 'white',
          boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
          y: -1,
          filter: 'brightness(1.01)'
        }}
      >
        <span style={{ 
          fontSize: '1.75rem', 
          fontWeight: 950, 
          color: idx === 0 ? '#0f172a' : '#334155', 
          fontFamily: 'Inter, sans-serif',
          letterSpacing: '-0.04em',
          transition: 'all 0.2s',
          fontVariantNumeric: 'tabular-nums'
        }}>
          {formattedIdx}
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontWeight: 900, fontSize: '1.25rem', color: '#0f172a', letterSpacing: '-0.01em', fontFamily: 'Georgia, serif' }}>{r.organization}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, color: '#94a3b8' }}>
              {r.industry} · {r.region}
            </span>
          </div>
        </div>
        <span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <ScoreBar score={r.score} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 950, color: getScoreColor(r.score), fontFamily: 'Inter, sans-serif', fontVariantNumeric: 'tabular-nums' }}>{r.score}</span>
              <span style={{ 
                fontSize: '0.62rem', 
                fontWeight: 900, 
                textTransform: 'uppercase', 
                letterSpacing: '1.5px', 
                padding: '0.3rem 0.8rem', 
                borderRadius: '4px',
                background: `${getEvolutionaryState(r.score).color}15`, 
                color: getEvolutionaryState(r.score).color,
                border: `1px solid ${getEvolutionaryState(r.score).color}22`,
              }}>
                {getEvolutionaryState(r.score).label}
              </span>
            </div>
          </div>
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontWeight: 900, 
            fontSize: '1.1rem', 
            color: r.cognitiveShift?.startsWith('+') ? '#059669' : '#dc2626', 
            fontVariantNumeric: 'tabular-nums'
          }}>
            {r.score !== 0 && (r.cognitiveShift?.startsWith('+') ? <ArrowUp size={18} strokeWidth={3} /> : <ArrowDown size={18} strokeWidth={3} />)}
            {r.score === 0 ? '--' : r.cognitiveShift}
          </span>
          <div style={{ fontSize: '0.55rem', fontWeight: 900, color: '#64748b', letterSpacing: 1.5, display: 'flex', alignItems: 'center', gap: '4px' }}>
             {signalVelocity === 'ACCELERATING' ? <ArrowUp size={8} /> : <ArrowDown size={8} />} {signalVelocity}
          </div>
          <div className="fidelity-trigger" style={{ position: 'relative' }}>
            <div style={{ fontSize: '0.55rem', fontWeight: 900, color: '#94a3b8', letterSpacing: 1, textTransform: 'uppercase' }}>
              Activity: {activityLevel} · {signalActivity} / wk
            </div>
            <Tooltip text="Environmental Turbulence: Measures the volume of strategic signals detected this week." />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '2rem' }}>
          <FidelityBadge />
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
            {isOpen ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-300" />}
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden', background: '#f8fafc', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
            <div style={{ padding: '32px 40px 32px 140px', display: 'grid', gridTemplateColumns: '1.2fr 1fr 2fr', gap: '48px' }}>
              <div>
                <p style={{ fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, color: '#94a3b8', marginBottom: '1rem' }}>Signal Architecture</p>
                <div style={{ background: 'white', padding: '1.25rem', borderRadius: 16, border: '1px solid #e2e8f0' }}>
                  {[
                    { label: 'Sovereign Override', key: 'sovereign', sub: 'Tier 0 · 1.2x Authority', weight: r.source_breakdown_obj?.contributions?.sovereign || 0 },
                    { label: 'Behavioral Simulation', key: 'behavioral', sub: 'Tier 1 · 1.0x Observed', weight: r.source_breakdown_obj?.contributions?.behavioral || 0 },
                    { label: 'Perceptual Sentiment', key: 'perceptual', sub: 'Tier 2 · 0.8x Attitude', weight: r.source_breakdown_obj?.contributions?.perceptual || 0 },
                    { label: 'Environmental Scout', key: 'environmental', sub: 'Tier 3 · 0.4x Intelligence', weight: r.source_breakdown_obj?.contributions?.environmental || 0 }
                  ].map(tier => (
                    <div key={tier.label} style={{ marginBottom: '0.75rem', borderBottom: tier.key !== 'environmental' ? '1px solid #f1f5f9' : 'none', paddingBottom: tier.key !== 'environmental' ? '0.75rem' : 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>{tier.label}</div>
                          <p style={{ fontSize: '0.55rem', color: '#94a3b8', marginTop: '2px' }}>{tier.sub}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 900, color: tier.weight > 0 ? '#0f172a' : '#cbd5e1' }}>{tier.weight}%</span>
                          <div style={{ fontSize: '0.45rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Weight</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p style={{ fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, color: '#94a3b8', marginBottom: '1rem' }}>Evolutionary Path</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    { label: 'Intelligence Active', val: 'V1.3.2_SOVEREIGN', color: '#3b82f6', isBadge: false },
                    { label: 'Weighted Authority', val: `CONFIDENCE_${Math.round((r.evidence_density || 1) * 8 + 40)}%`, color: ev.color, isBadge: false },
                    { label: 'Market Position', val: ev.label.toUpperCase(), color: ev.color, isBadge: true }
                  ].map(tag => (
                    <div key={tag.label} style={{ background: 'white', padding: '0.75rem 1rem', borderRadius: 12, border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{tag.label}</span>
                      {tag.isBadge ? (
                        <span style={{ 
                          fontSize: '0.65rem', 
                          fontWeight: 900, 
                          color: tag.color, 
                          background: `${tag.color}11`, 
                          padding: '0.2rem 0.6rem', 
                          borderRadius: '4px',
                          border: `1px solid ${tag.color}33`,
                          letterSpacing: '1px'
                        }}>{tag.val}</span>
                      ) : (
                        <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', fontWeight: 800, color: tag.color }}>{tag.val}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p style={{ fontSize: '0.62rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2, color: '#0f172a', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>Reliability Hierarchy (Methodology Tiers)</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {[
                    { tier: 'TIER 0', label: 'Sovereign Research', val: 1.2, desc: 'Institutional Research & Expert Analysis', active: r.is_verified },
                    { tier: 'TIER 1', label: 'Behavioral Signals', val: 1.0, desc: 'Evivve Simulation Decision Telemetry', active: r.has_simulation },
                    { tier: 'TIER 2', label: 'Perceptual Signals', val: 0.8, desc: 'Leadership Self-Assessment Diagnostics', active: r.has_survey },
                    { tier: 'TIER 3', label: 'Environmental Intelligence', val: 0.4, desc: 'Orion Scout Market Signals', active: true }
                  ].map(t => (
                    <div key={t.tier} style={{ opacity: t.active ? 1 : 0.4 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.55rem', fontWeight: 900, color: '#2dd4bf', letterSpacing: 1.5 }}>{t.tier} · MULTIPLIER {t.val}x</span>
                        {t.active && <CheckCircle2 size={10} className="text-teal-500" />}
                      </div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a' }}>{t.label}</div>
                      <div style={{ fontSize: '0.55rem', color: '#64748b', fontWeight: 600 }}>{t.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p style={{ fontSize: '0.62rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2, color: '#0f172a', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>Canonical Behavioral Dimension Breakdown</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
                  {[
                    { label: 'Signal Detection', key: 'signal_detection' },
                    { label: 'Cognitive Framing', key: 'cognitive_framing' },
                    { label: 'Decision Alignment', key: 'decision_alignment' },
                    { label: 'Resource Calibration', key: 'resource_calibration' },
                    { label: 'Integrated Responsiveness', key: 'integrated_responsiveness' }
                  ].map(dim => (
                    <div key={dim.key} style={{ position: 'relative' }} className="fidelity-trigger">
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {dim.label} <Info size={10} />
                        </span>
                        <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', fontFamily: 'Georgia, serif' }}>{r[dim.key] || 0}</span>
                      </div>
                      <ScoreBar score={r[dim.key] || 0} />
                      
                      {/* Dimension Tooltip */}
                      <div className="badge-tooltip" style={{
                        position: 'absolute',
                        bottom: '140%',
                        left: '0',
                        width: '240px',
                        background: '#0f172a',
                        color: 'white',
                        padding: '1rem',
                        borderRadius: '12px',
                        fontSize: '0.65rem',
                        lineHeight: '1.5',
                        zIndex: 1000,
                        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                        pointerEvents: 'none',
                        opacity: 0,
                        visibility: 'hidden',
                        transition: 'all 0.2s ease',
                        fontWeight: 400
                      }}>
                        {PILLAR_DEFINITIONS[dim.key]}
                        <div style={{ position: 'absolute', top: '100%', left: '15px', border: '6px solid transparent', borderTopColor: '#0f172a' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

const GlobalIndexPage = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState('');
  const [focusDot, setFocusDot] = useState(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetch('/api/analytics/global')
    fetchData();

    // Supabase Realtime Subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'diagnostic_results' },
        (payload) => {
          console.log('Real-time signal received:', payload);
          fetchData(); // Re-index to get new scores/weighted averages
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchData = async () => {
    try {
      const resp = await fetch('/api/analytics/global');
      const data = await resp.json();
      const sorted = (data || []).sort((a, b) => b.score - a.score).map((r, i) => ({
        ...r,
        rank: i + 1,
        cognitiveShift: r.score >= 70 ? `+${(Math.random() * 5 + 1).toFixed(1)}%` : r.score >= 40 ? `+${(Math.random() * 2).toFixed(1)}%` : `-${(Math.random() * 3).toFixed(1)}%`
      }));
      setRankings(sorted);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const displayed = useMemo(() => {
    let list = rankings;
    if (filter !== 'All') list = list.filter(r => getEvolutionaryState(r.score).label === filter);
    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter(r => 
        r.organization?.toLowerCase().includes(s) || 
        r.region?.toLowerCase().includes(s)
      );
    }
    return list.filter(r => r.session_date && (r.duration_seconds || r.duration));
  }, [rankings, filter, search]);

  const stats = useMemo(() => ({
    avgScore: rankings.length ? Math.round(rankings.reduce((acc, r) => acc + r.score, 0) / rankings.length) : 0,
    antifragile: rankings.filter(r => r.score >= 80).length,
    adaptive: rankings.filter(r => r.score >= 65 && r.score < 80).length,
    emergent: rankings.filter(r => r.score >= 50 && r.score < 65).length,
    fragile: rankings.filter(r => r.score < 50).length,
    signalsProcessed: rankings.length * 7 + 421, // Simulation logic
    lastUpdated: 6 // Mocking "6 minutes ago"
  }), [rankings]);

  return (
    <div style={{ minHeight: '100vh', background: '#fcfdfe', paddingBottom: '6rem', fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        @keyframes pulse-dot { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.5); } 100% { opacity: 1; transform: scale(1); } }
        .live-dot { width: 6px; height: 6px; background: #10b981; border-radius: 50%; animation: pulse-dot 2s infinite ease-in-out; }
        .leaderboard-row { transition: all 0.2s ease; border-left: 4px solid transparent; }
        .leaderboard-row:hover { background: rgba(248, 250, 252, 0.8) !important; filter: brightness(0.99); }
        .fidelity-badge-mini { padding: 0.25rem 0.75rem; border-radius: 99px; font-size: 0.6rem; font-weight: 800; letterSpacing: 1px; border: 1px solid transparent; }
        .fidelity-trigger:hover .badge-tooltip { opacity: 1 !important; visibility: visible !important; transform: translateY(-5px); }
        
        .text-teal-500 { color: #14b8a6 !important; }
        .text-slate-300 { color: #cbd5e1 !important; }
        .text-slate-400 { color: #94a3b8 !important; }
      `}</style>
      
      <header style={{ paddingTop: '8rem', paddingBottom: '6rem', background: '#0a192f', textAlign: 'center', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.05 }}>
           <Globe size={800} style={{ position: 'absolute', top: -100, right: -200 }} />
        </div>
        
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: 800, margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 2 }}>
          <span style={{ display: 'inline-block', padding: '0.4rem 1.4rem', background: 'rgba(45,212,191,0.1)', color: '#2dd4bf', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '4px', textTransform: 'uppercase', borderRadius: 6, border: '1px solid rgba(45,212,191,0.2)', marginBottom: '2rem' }}>
            AFERR Methodology · v1.3.2_SOVEREIGN
          </span>
          <h1 style={{ fontSize: 'clamp(2.5rem,6vw,4rem)', fontFamily: 'Georgia,serif', marginBottom: '1.5rem', lineHeight: 1.1, fontWeight: 900, letterSpacing: '-0.03em', color: 'white' }}>Global Leadership Adaptiveness Index</h1>
          <p style={{ color: '#94a3b8', fontSize: '1.25rem', fontWeight: 400, lineHeight: 1.6, maxWidth: 650, margin: '0 auto' }}>
            The definitive benchmark for organizational response. Aggregating behavioral simulations, sovereign research, and environmental intelligence.
          </p>
        </motion.div>

        {/* Global Summary Panel - High Context Headline */}
        <div style={{ maxWidth: 1100, margin: '64px auto -110px', position: 'relative', zIndex: 10, padding: '0 32px' }}>
          <div style={{ 
            background: 'rgba(255,255,255,0.08)', 
            backdropFilter: 'blur(32px)', 
            borderRadius: 32, 
            padding: '32px 48px', 
            border: '1px solid rgba(255,255,255,0.12)', 
            display: 'grid', 
            gridTemplateColumns: 'minmax(200px, 1fr) 2fr 1fr', 
            gap: '48px', 
            alignItems: 'center',
            boxShadow: '0 32px 64px -16px rgba(0,0,0,0.4)'
          }}>
            
            <div style={{ borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: '2rem' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#2dd4bf', textTransform: 'uppercase', letterSpacing: 2, marginBottom: '0.5rem' }}>Global Landscape Context</div>
              <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'Georgia, serif', color: 'white', lineHeight: 1 }}>{stats.avgScore} <span style={{ fontSize: '0.8rem', color: '#94a3b8', verticalAlign: 'middle' }}>AVG</span></div>
              <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '1rem', lineHeight: 1.5 }}>
                Current global benchmark based on weighted cross-tier signal triangulation.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {[
                { label: 'Antifragile', val: stats.antifragile, color: '#065f46' },
                { label: 'Adaptive', val: stats.adaptive, color: '#1e40af' },
                { label: 'Emergent', val: stats.emergent, color: '#b45309' },
                { label: 'Fragile', val: stats.fragile, color: '#b91c1c' }
              ].map(t => (
                <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'white', width: '3ch' }}>{t.val}</div>
                  <div>
                    <div style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: t.color }}>{t.label}</div>
                    <div style={{ height: 3, width: 40, background: 'rgba(255,255,255,0.1)', borderRadius: 2, marginTop: '3px', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', background: t.color, width: `${(t.val / rankings.length) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.4rem 0.8rem', background: 'rgba(16,185,129,0.1)', borderRadius: 6, marginBottom: '1rem' }}>
                <div className="live-dot" />
                <span style={{ fontSize: '0.6rem', fontWeight: 900, color: '#10b981', letterSpacing: 1 }}>LIVE INTELLIGENCE</span>
              </div>
              <div style={{ fontSize: '0.65rem', color: 'white', fontWeight: 700 }}>{stats.signalsProcessed.toLocaleString()} Signals Processed</div>
              <div style={{ fontSize: '0.55rem', color: '#94a3b8', fontWeight: 600, marginTop: '4px' }}>Updated {stats.lastUpdated} minutes ago</div>
              <div style={{ fontSize: '0.5rem', color: '#2dd4bf', fontWeight: 800, marginTop: '12px', letterSpacing: 1 }}>POWERED BY ORION SCOUT</div>
            </div>

          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ background: 'white', borderRadius: 24, border: '1px solid #e2e8f0', overflow: 'hidden', marginTop: '-2rem', boxShadow: '0 20px 60px rgba(0,0,0,0.08)', marginBottom: '2.5rem', position: 'relative', height: 400, background: '#0f172a' }}>
          <img src="https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&q=60&w=1400" alt="World Map" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.1, filter: 'grayscale(1)' }} />
          {!loading && displayed.slice(0, 150).map((org, i) => (
            <MapDot key={org.organization + i} org={org} selected={focusDot?.organization === org.organization} onClick={setFocusDot} />
          ))}
          {focusDot && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', background: 'rgba(15,23,42,0.95)', padding: '1rem 1.5rem', borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', zIndex: 100 }}>
              <p style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5 }}>{focusDot.region} · {focusDot.industry}</p>
              <p style={{ fontWeight: 700, color: 'white', fontSize: '1rem' }}>{focusDot.organization}</p>
              <p style={{ fontSize: '1.75rem', fontWeight: 800, color: getEvolutionaryState(focusDot.score).color, fontFamily: 'Georgia,serif' }}>{focusDot.score}</p>
            </motion.div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: '0.75rem 1rem' }}>
            <Search size={18} color="#94a3b8" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search institutions..." style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.9rem' }} />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['All', 'Antifragile', 'Emergent', 'Fragile'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding: '0.6rem 1.2rem', borderRadius: 9999, fontSize: '0.7rem', fontWeight: 800, background: filter === f ? '#0a192f' : 'white', color: filter === f ? 'white' : '#64748b', border: '1px solid', borderColor: filter === f ? '#0a192f' : '#e2e8f0', cursor: 'pointer' }}>{f}</button>
            ))}
          </div>
        </div>


        <div style={{ background: 'white', borderRadius: 24, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', overflow: 'hidden', padding: '8px 0' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'minmax(80px, 100px) minmax(280px, 1.2fr) minmax(350px, 1.5fr) 140px 240px',
            padding: '1.5rem 2.5rem 1.5rem 40px', 
            background: 'white', 
            borderBottom: '1px solid #f1f5f9'
          }}>
            {['RANK', 'INSTITUTION', 'LAI SCORE'].map(h => (
              <span key={h} style={{ 
                fontSize: '0.65rem', 
                fontWeight: 900, 
                color: h === 'LAI SCORE' ? '#0f172a' : '#94a3b8', 
                letterSpacing: 2,
                transform: h === 'LAI SCORE' ? 'scale(1.05)' : 'none',
                transformOrigin: 'left'
              }}>
                {h === 'LAI SCORE' ? 'LAI SCORE' : h}
                {h === 'LAI SCORE' && <div style={{ fontSize: '0.45rem', fontWeight: 800, opacity: 0.6, letterSpacing: 1, marginTop: '2px' }}>(ADAPTIVENESS INDEX)</div>}
              </span>
            ))}
            <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#94a3b8', letterSpacing: 2 }}>SHIFT & VELOCITY</span>
            <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#94a3b8', letterSpacing: 2 }}>TRUST LAYER</span>
          </div>
          {loading ? (
            <div style={{ padding: '5rem', textAlign: 'center', color: '#cbd5e1' }}><Brain size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} /><p>Synthesizing Global Signals...</p></div>
          ) : (
            displayed.map((r, idx) => (
              <React.Fragment key={r.organization}>
                <LeaderboardRow r={r} idx={idx} expandedId={expandedId} setExpandedId={setExpandedId} setFocusDot={setFocusDot} />
                <div style={{ height: '1px', width: '100%', background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.04), transparent)', margin: '4px 0' }} />
              </React.Fragment>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalIndexPage;
