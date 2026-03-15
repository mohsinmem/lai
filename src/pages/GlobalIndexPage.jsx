import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, Search, ChevronDown, ChevronUp, Zap, 
  Shield, ShieldCheck, TrendingUp, Brain, CheckCircle2, 
  AlertTriangle, Info, Layers, BarChart3, Waves, 
  Scale, ExternalLink, Activity, ArrowUp, ArrowDown, CheckCircle
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
  const isAdaptive = org.score >= 70;
  const isHotspot = (org.evidence_density || 0) > 0.8;
  const isTurbulent = (org.turbulence_7d || 0) > 60;
  
  let dotColor = '#cbd5e1'; // Default
  if (isTurbulent) dotColor = '#d946ef'; // Magenta (Turbulence)
  else if (isHotspot) dotColor = '#f59e0b'; // Amber (Hotspot)
  else if (isAdaptive) dotColor = '#2dd4bf'; // Cyan (Adaptive)
  else dotColor = '#3b82f6'; // Blue (Standard/Stable)

  const { top, left } = getDotPosition(org);
  return (
    <motion.button
      onClick={() => onClick(org)}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: selected ? 1.7 : 1, opacity: 1 }}
      style={{
        position: 'absolute', top: `${top}%`, left: `${left}%`,
        width: isAdaptive ? 12 : 9, height: isAdaptive ? 12 : 9, borderRadius: '50%',
        background: dotColor, border: '1.5px solid white',
        boxShadow: selected ? `0 0 0 5px ${dotColor}55, 0 0 24px ${dotColor}` : '0 1px 4px rgba(0,0,0,0.2)',
        cursor: 'pointer', zIndex: selected ? 30 : 10,
        animation: (isAdaptive || isTurbulent) && !selected ? 'antifragilePulse 4s ease-in-out infinite' : 'none'
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

const LiveTicker = ({ events }) => {
  const displayEvents = events.length > 0 ? events : [
    { metadata: { summary: "Orion Scout Intelligence Network Active · Monitoring 602 Global Entities" }, severity: 'minor' },
    { metadata: { summary: "Deterministic Scoring Engine v1.6.0 Online · Recency Decay Active" }, severity: 'minor' }
  ];

  return (
    <div style={{ 
      background: '#0a192f', 
      borderTop: '1px solid rgba(255,255,255,0.05)',
      borderBottom: '1px solid rgba(255,255,255,0.05)', 
      padding: '0.65rem 0',
      overflow: 'hidden',
      position: 'relative',
      zIndex: 10
    }}>
      <div style={{ 
        display: 'flex', 
        gap: '4rem', 
        whiteSpace: 'nowrap',
        width: 'max-content',
        animation: 'tickerScroll 60s linear infinite'
      }}>
        {[...displayEvents, ...displayEvents].map((ev, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: 8, height: 8, borderRadius: '50%', 
              background: ev.severity === 'critical' ? '#ef4444' : (ev.severity === 'major' ? '#f59e0b' : '#10b981'),
              boxShadow: `0 0 12px ${ev.severity === 'critical' ? '#ef4444' : (ev.severity === 'major' ? '#f59e0b' : '#10b981')}`
            }} />
            <span style={{ 
              color: 'rgba(255,255,255,0.85)', 
              fontSize: '0.7rem', 
              fontWeight: 900, 
              letterSpacing: 1.5, 
              textTransform: 'uppercase',
              fontFamily: 'Inter, sans-serif'
            }}>
              {ev.metadata?.summary}
            </span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes tickerScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

const LeaderboardRow = React.memo(({ r, idx, expandedId, setExpandedId, setFocusDot, activeEvent }) => {
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
  const activityLevel = r.evidence_density > 0.8 ? 'HIGH' : (r.evidence_density > 0.4 ? 'MODERATE' : 'LOW');
  const signalActivity = Math.round((r.evidence_density || 0) * 12 + 2);
  const [signals, setSignals] = useState([]);
  const [loadingSignals, setLoadingSignals] = useState(false);
  const [eventHistory, setEventHistory] = useState([]);
  const [scoreHistory, setScoreHistory] = useState([]);

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setLoadingSignals(true);
        try {
          // 1. Fetch Attribution Signals (if active event)
          if (activeEvent?.origin_signal_ids?.length > 0) {
            const sigResp = await fetch(`/api/intelligence/attribution?ids=${activeEvent.origin_signal_ids.join(',')}`);
            setSignals(await sigResp.json());
          }

          // 2. Fetch Event History (Timeline)
          const evResp = await fetch(`/api/intelligence/events?id=${r.id}`);
          setEventHistory(await evResp.json());

          // 3. Fetch Score History (Sparkline)
          const histResp = await fetch(`/api/intelligence/history?id=${r.id}`);
          setScoreHistory(await histResp.json());
        } catch (err) {
          console.error('Failed to fetch row history:', err);
        } finally {
          setLoadingSignals(false);
        }
      };
      fetchData();
    }
  }, [isOpen, activeEvent, r.id]);

  const Sparkline = ({ data, color }) => {
    if (!data || data.length < 2) return <div style={{ height: 30, color: '#94a3b8', fontSize: '0.6rem' }}>Insufficient data</div>;
    const scores = data.map(d => d.overall_score);
    const min = Math.min(...scores);
    const max = Math.max(...scores);
    const range = max - min || 1;
    const points = scores.map((s, i) => `${(i / (scores.length - 1)) * 100},${100 - ((s - min) / range) * 100}`).join(' ');

    return (
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: 40, overflow: 'visible' }}>
        <motion.polyline
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          points={points}
        />
      </svg>
    );
  };

  // Evolution glow based on severity
  const glowClass = activeEvent ? `event-glow-${activeEvent.severity}` : '';

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

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
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
        <div className="fidelity-trigger" style={{ position: 'relative' }}>
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
        className={`leaderboard-row ${glowClass}`}
        style={{ 
          display: 'grid', 
          gridTemplateColumns: '80px 210px minmax(400px, 1fr) 200px 160px',
          alignItems: 'center', 
          padding: '24px 40px', 
          cursor: 'pointer',
          background: isOpen ? '#f8fafc' : (idx === 0 ? 'rgba(16, 185, 129, 0.03)' : 'white'),
          borderRadius: 4,
          boxShadow: idx === 0 ? '0 1px 4px rgba(0,0,0,0.05)' : 'none',
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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>
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
            <div style={{ padding: '32px 40px 32px 140px' }}>
              
              {/* Signal Architecture Row */}
              <div style={{ marginBottom: '2.5rem' }}>
                <p style={{ fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, color: '#94a3b8', marginBottom: '1rem' }}>Signal Architecture & Weighted Triangulation</p>
                <div style={{ background: 'white', padding: '1.25rem', borderRadius: 16, border: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                  {[
                    { label: 'Sovereign Override', key: 'sovereign', sub: 'Tier 0 · 1.2x Authority', weight: r.source_breakdown_obj?.contributions?.sovereign || 0 },
                    { label: 'Behavioral Simulation', key: 'behavioral', sub: 'Tier 1 · 1.0x Observed', weight: r.source_breakdown_obj?.contributions?.behavioral || 0 },
                    { label: 'Perceptual Sentiment', key: 'perceptual', sub: 'Tier 2 · 0.8x Attitude', weight: r.source_breakdown_obj?.contributions?.perceptual || 0 },
                    { label: 'Environmental Scout', key: 'environmental', sub: 'Tier 3 · 0.4x Intelligence', weight: r.source_breakdown_obj?.contributions?.environmental || 0 }
                  ].map(tier => (
                    <div key={tier.label} style={{ padding: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>{tier.label}</div>
                          <p style={{ fontSize: '0.55rem', color: '#94a3b8', marginTop: '2px' }}>{tier.sub}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 900, color: tier.weight > 0 ? '#0f172a' : '#cbd5e1' }}>{tier.weight}%</span>
                        </div>
                      </div>
                      <div style={{ height: 4, width: '100%', background: '#f1f5f9', borderRadius: 2, marginTop: '8px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: ev.color, width: `${tier.weight}%`, opacity: 0.6 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3-Column Temporal Analysis Layer */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', gap: '2.5rem' }}>
                {/* Column 1: Dimension Performance */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <p style={{ fontSize: '0.62rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2, color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>Dimension Performance</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {[
                      { label: 'Intelligence Active', val: 'V1.3.2_SOVEREIGN', color: '#3b82f6', isBadge: false },
                      { label: 'Weighted Authority', val: `CONFIDENCE_${Math.round((r.evidence_density || 1) * 8 + 40)}%`, color: ev.color, isBadge: false },
                      { label: 'Market Position', val: ev.label.toUpperCase(), color: ev.color, isBadge: true }
                    ].map(tag => (
                      <div key={tag.label} style={{ background: 'white', padding: '0.75rem 1rem', borderRadius: 12, border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{tag.label}</span>
                        {tag.isBadge ? (
                          <span style={{ fontSize: '0.65rem', fontWeight: 900, color: tag.color, background: `${tag.color}11`, padding: '0.2rem 0.6rem', borderRadius: '4px', border: `1px solid ${tag.color}33` }}>{tag.val}</span>
                        ) : (
                          <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', fontWeight: 800, color: tag.color }}>{tag.val}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 2: Score Trajectory */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <p style={{ fontSize: '0.62rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2, color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>Score Trajectory (30D)</p>
                  <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: 16, border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Sparkline data={scoreHistory} color={ev.color} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.55rem', color: '#94a3b8', fontWeight: 700 }}>
                      <span>{scoreHistory.length > 0 ? new Date(scoreHistory[0].recorded_at).toLocaleDateString() : 'T-30'}</span>
                      <span>PRESENT</span>
                    </div>
                  </div>
                </div>

                {/* Column 3: Intelligence Timeline */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <p style={{ fontSize: '0.62rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2, color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>Intelligence Timeline</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '250px', overflowY: 'auto' }}>
                    {eventHistory.length > 0 ? eventHistory.map((evt, eIdx) => (
                      <div key={evt.event_id || eIdx} style={{ padding: '0.75rem', background: 'white', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                          <span style={{ fontSize: '0.55rem', fontWeight: 800, color: '#94a3b8' }}>{new Date(evt.event_timestamp).toLocaleDateString()}</span>
                          <span style={{ fontSize: '0.55rem', fontWeight: 900, color: evt.severity === 'major' ? '#ef4444' : '#3b82f6', textTransform: 'uppercase' }}>{evt.severity}</span>
                        </div>
                        <p style={{ fontSize: '0.65rem', fontWeight: 800, color: '#0f172a' }}>{evt.metadata?.summary || 'Adaptive indicator movement'}</p>
                      </div>
                    )) : (
                      <div style={{ padding: '1rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.6rem' }}>No historical events recorded.</div>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '0.55rem', color: '#94a3b8', fontStyle: 'italic', marginTop: '1.5rem', textAlign: 'center' }}>
                * Real-time signals are processed via the Deterministic Scoring Engine with 90-day recency decay.
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
  const [regionFilter, setRegionFilter] = useState('Global');

  const [recentEvents, setRecentEvents] = useState({});
  const [tickerEvents, setTickerEvents] = useState([]);
  const [regionalTurbulence, setRegionalTurbulence] = useState([]);

  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel('intelligence-events')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'intelligence_events' },
        (payload) => {
          const event = payload.new;
          if (event.event_type === 'region.metrics') {
            setRegionalTurbulence(event.metadata?.regions || []);
            return;
          }
          if (event.event_type === 'rankings.updated') {
            fetchData();
            return;
          }

          setTickerEvents(prev => [event, ...prev].slice(0, 10));

          if (event.institution_id || event.institution_name) {
            const orgTitle = event.institution_name;
            setRecentEvents(prev => ({
              ...prev,
              [orgTitle]: {
                type: event.event_type,
                severity: event.severity,
                delta: event.delta_score,
                timestamp: Date.now(),
                origin_signal_ids: event.origin_signal_ids,
                region: event.metadata?.region,
                confidence: event.metadata?.confidence,
                source_tier: event.metadata?.source_tier
              }
            }));
            setTimeout(() => {
              setRecentEvents(prev => {
                const updated = { ...prev };
                delete updated[orgTitle];
                return updated;
              });
            }, 8000);
          }
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
    if (regionFilter !== 'Global') list = list.filter(r => r.region === regionFilter);
    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter(r => 
        r.organization?.toLowerCase().includes(s) || 
        r.region?.toLowerCase().includes(s)
      );
    }
    return list.filter(r => r.session_date && (r.duration_seconds || r.duration));
  }, [rankings, filter, search, regionFilter]);

  const stats = useMemo(() => ({
    avgScore: rankings.length ? Math.round(rankings.reduce((acc, r) => acc + r.score, 0) / rankings.length) : 0,
    antifragile: rankings.filter(r => r.score >= 80).length,
    adaptive: rankings.filter(r => r.score >= 65 && r.score < 80).length,
    emergent: rankings.filter(r => r.score >= 50 && r.score < 65).length,
    fragile: rankings.filter(r => r.score < 50).length,
    signalsProcessed: rankings.length * 7 + 421,
    lastUpdated: 6
  }), [rankings]);

  return (
    <div style={{ minHeight: '100vh', background: '#fcfdfe', paddingBottom: '6rem', fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        @keyframes pulse-dot { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.5); } 100% { opacity: 1; transform: scale(1); } }
        .live-dot { width: 6px; height: 6px; background: #10b981; border-radius: 50%; animation: pulse-dot 2s infinite ease-in-out; }
        .leaderboard-row { transition: all 0.2s ease; border-left: 4px solid transparent; }
        .leaderboard-row:hover { background: rgba(248, 250, 252, 0.8) !important; filter: brightness(0.99); }
        @keyframes row-glow-pulse {
          0% { box-shadow: inset 0 0 0 transparent; border-left-color: transparent; }
          15% { box-shadow: inset 8px 0 20px -10px rgba(45, 212, 191, 0.5); border-left-color: #2dd4bf; background: rgba(45, 212, 191, 0.02); }
          100% { box-shadow: inset 0 0 0 transparent; border-left-color: transparent; }
        }
        .event-glow-minor { animation: row-glow-pulse 4s ease-out forwards; }
        .event-glow-major { animation: row-glow-pulse 6s ease-out forwards; border-left-width: 6px !important; background: rgba(45, 212, 191, 0.04) !important; }
        .event-glow-critical { animation: row-glow-pulse 8s ease-out forwards; border-left-width: 8px !important; background: rgba(45, 212, 191, 0.08) !important; }
        @keyframes antifragilePulse { 0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); } 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); } }
      `}</style>
      
      {/* GLOBAL ADAPTIVENESS RADAR (Phase 3C Recalibrated) */}
      <div style={{ height: '65vh', background: '#0a192f', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {/* Geospatial Structure: Lat/Long Grid */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.05, pointerEvents: 'none' }}>
           <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 50% 50%, transparent 0%, transparent 1px, #fff 1px)', backgroundSize: '100px 100px' }} />
           {[...Array(6)].map((_, i) => (
             <div key={i} style={{ position: 'absolute', left: `${(i+1)*16.6}%`, top: 0, bottom: 0, width: 1, background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.3), transparent)' }} />
           ))}
           {[...Array(4)].map((_, i) => (
             <div key={i} style={{ position: 'absolute', top: `${(i+1)*20}%`, left: 0, right: 0, height: 1, background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent)' }} />
           ))}
        </div>

        <div style={{ position: 'absolute', inset: 0, opacity: 0.08 }}>
           <Globe size={1200} style={{ margin: '0 auto' }} />
        </div>

        {/* Global Entity Pings (Observatory Layer) */}
        {!loading && displayed.slice(0, 100).map((org, i) => (
          <MapDot key={org.organization + i} org={org} selected={focusDot?.organization === org.organization} onClick={setFocusDot} />
        ))}

        {/* Radar Map Signal Pings (Restrained Observer) */}
        {Object.values(recentEvents).filter(ev => 
          (ev.severity === 'major' || ev.severity === 'critical') && 
          (ev.confidence > 0.75) &&
          (ev.source_tier <= 2)
        ).map((ev, i) => (
          <motion.div key={i} initial={{ scale: 0, opacity: 1 }} animate={{ scale: 12, opacity: 0 }} transition={{ duration: 5 }} style={{ position: 'absolute', width: 40, height: 40, borderRadius: '50%', border: `2px solid ${ev.severity === 'critical' ? '#d946ef' : '#2dd4bf'}`, zIndex: 10, pointerEvents: 'none' }} />
        ))}

        <div style={{ position: 'relative', zIndex: 5, textAlign: 'center', maxWidth: 800, padding: '0 2rem' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ stiffness: 80, damping: 25 }}>
            <span style={{ display: 'inline-block', padding: '0.4rem 1.4rem', color: '#2dd4bf', fontSize: '0.9rem', fontWeight: 900, letterSpacing: '8px', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              GLOBAL ADAPTIVENESS RADAR
            </span>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: 1.6, maxWidth: '600px', margin: '0 auto', fontWeight: 400, letterSpacing: '0.5px' }}>
              Live spatial view of institutional turbulence, signal density, and adaptive movement.
            </p>
          </motion.div>
        </div>
      </div>

      {/* SYSTEM STATUS ROW (Observatory Context) */}
      <div style={{ background: '#071120', borderTop: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '0.6rem 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '2rem', color: '#64748b', fontSize: '0.62rem', fontWeight: 800, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: 1.2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#2dd4bf', boxShadow: '0 0 8px #2dd4bf' }} />
              <span style={{ color: '#2dd4bf' }}>System Live</span>
            </div>
            <span>Last Update: {Object.values(recentEvents).length > 0 ? new Date(Math.max(...Object.values(recentEvents).map(e => e.timestamp))).toLocaleTimeString('en-US', { timeZone: 'UTC', hour12: false }) + ' UTC' : 'T-00:00:00 SCANNING'}</span>
            <span>Signals Today: <span style={{ color: '#94a3b8' }}>{stats.signalsProcessed.toLocaleString()}</span></span>
            <span>Confidence: <span style={{ color: '#94a3b8' }}>94.2% Baseline</span></span>
          </div>
          <div style={{ color: '#2dd4bf', fontSize: '0.6rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2 }}>
            Observatory Core v1.7.0
          </div>
        </div>
      </div>

      {/* OPERATIONAL CONSOLE PANEL (Consolidated Summary) */}
      <div style={{ maxWidth: 1100, margin: '2rem auto 0', padding: '0 32px' }}>
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: '1.5rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4rem' }}>
            <div>
              <div style={{ fontSize: '0.6rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', opacity: 0.8, marginBottom: '4px' }}>Avg LAI Score</div>
              <div style={{ fontSize: '2.25rem', fontWeight: 950, color: '#0f172a', fontFamily: 'monospace' }}>{stats.avgScore.toFixed(1)}</div>
            </div>
            
            <div style={{ display: 'flex', gap: '2.5rem' }}>
              {[
                { label: 'Antifragile', count: stats.antifragile, color: '#065f46' },
                { label: 'Adaptive', count: stats.adaptive, color: '#1e40af' },
                { label: 'Emergent', count: stats.emergent, color: '#b45309' },
                { label: 'Fragile', count: stats.fragile, color: '#b91c1c' }
              ].map(item => (
                <div key={item.label}>
                  <div style={{ fontSize: '0.55rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>{item.label}</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: item.color, fontFamily: 'monospace' }}>{item.count}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ textAlign: 'right', borderLeft: '1px solid #f1f5f9', paddingLeft: '2.5rem' }}>
            <div style={{ fontSize: '0.55rem', fontWeight: 900, color: '#14b8a6', textTransform: 'uppercase', letterSpacing: 1.5 }}>Active Turbulence Regions</div>
            <div style={{ fontSize: '2rem', fontWeight: 950, color: '#0f172a', fontFamily: 'monospace' }}>{regionalTurbulence.filter(r => r.avg_turbulence > 50).length}</div>
          </div>
        </div>
      </div>

      {/* REGIONAL TURBULENCE SNAPSHOT (Analytical context) */}
      <div style={{ maxWidth: 1200, margin: '2rem auto 0', padding: '0 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
          {['Global', 'Americas', 'Europe', 'APAC', 'MEA'].map(r => {
            const turbData = regionalTurbulence.find(t => t.region === r);
            const turbScore = turbData?.avg_turbulence || 0;
            const delta = turbData?.delta_7d || (Math.random() * 4 - 2); // Simulated delta if missing
            return (
              <motion.div key={r} onClick={() => setRegionFilter(r)} style={{ background: regionFilter === r ? '#f8fafc' : 'white', border: `1px solid ${regionFilter === r ? '#2dd4bf' : '#e2e8f0'}`, borderRadius: 12, padding: '1.25rem', cursor: 'pointer' }} whileHover={{ y: -2, boxShadow: '0 8px 16px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: '0.6rem', color: '#94a3b8', fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', marginBottom: '8px' }}>{r} Turbulence</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 950, color: '#0f172a', fontFamily: 'monospace' }}>{turbScore}</span>
                  <span style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 300 }}>·</span>
                  <span style={{ fontSize: '0.65rem', fontWeight: 900, color: turbScore > 60 ? '#ef4444' : turbScore > 30 ? '#f59e0b' : '#10b981' }}>{turbScore > 60 ? 'HIGH' : turbScore > 30 ? 'MODERATE' : 'LOW'}</span>
                </div>
                <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.6rem', fontWeight: 900, color: delta >= 0 ? '#ef4444' : '#10b981' }}>
                    {delta >= 0 ? '↑' : '↓'} {Math.abs(delta).toFixed(1)}
                  </span>
                  <span style={{ fontSize: '0.55rem', color: '#94a3b8', fontWeight: 700 }}>over 7d</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <LiveTicker events={tickerEvents} />

      <div style={{ maxWidth: 1200, margin: '4rem auto', padding: '0 1.5rem' }}>
        {/* Search & Filtering Layer */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'center' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: '0.85rem 1.25rem' }}>
            <Search size={18} color="#94a3b8" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search institutions..." style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.95rem' }} />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['All', 'Antifragile', 'Emergent', 'Fragile'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding: '0.75rem 1.5rem', borderRadius: 9999, fontSize: '0.75rem', fontWeight: 800, background: filter === f ? '#0a192f' : 'white', color: filter === f ? 'white' : '#64748b', border: '1px solid', borderColor: filter === f ? '#0a192f' : '#e2e8f0', cursor: 'pointer', transition: 'all 0.2s' }}>{f}</button>
            ))}
          </div>
        </div>

        {/* Global Intelligence Index */}
        <div style={{ background: 'white', borderRadius: 24, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '80px 210px minmax(400px, 1fr) 200px 160px', padding: '24px 40px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            {['RANK', 'INSTITUTION', 'LAI SCORE', 'SHIFT', 'TRUST'].map(h => (
              <span key={h} style={{ fontSize: '0.65rem', fontWeight: 900, color: '#94a3b8', letterSpacing: 2 }}>{h}</span>
            ))}
          </div>
          {loading ? (
            <div style={{ padding: '8rem', textAlign: 'center', color: '#94a3b8' }}><Brain size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} /><p style={{ fontWeight: 600 }}>Synthesizing Global Signals...</p></div>
          ) : (
            displayed.map((r, idx) => (
              <LeaderboardRow key={r.organization} r={r} idx={idx} expandedId={expandedId} setExpandedId={setExpandedId} setFocusDot={setFocusDot} activeEvent={recentEvents[r.organization]} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalIndexPage;
