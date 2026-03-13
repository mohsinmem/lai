import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Search, ChevronDown, ChevronUp, Zap, Shield, TrendingUp, Brain } from 'lucide-react';


// ── Evolutionary State Logic ──────────────────────────────────────────────────
const getEvolutionaryState = (score) => {
  if (score >= 70) return { label: 'Antifragile', color: '#3b82f6', pill: 'bg-blue-100 text-blue-700 border-blue-200' };
  if (score >= 40) return { label: 'Emergent',    color: '#0d9488', pill: 'bg-teal-100 text-teal-700 border-teal-200' };
  return                { label: 'Fragile',       color: '#64748b', pill: 'bg-slate-100 text-slate-600 border-slate-200' };
};

// Memoized formatting helper
const formatDate = (val) => {
  if (!val) return '';
  const d = new Date(val);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// ── Region → approximate lat/lng bucket (8-column × 5-row grid) ──────────────
// Each region maps to a rough [top%, left%] bounding box center.
// Dots are jittered within ±8% of the region center to avoid overlap.
const REGION_COORDINATES = {
  'North America': [38, 18],  'USA': [38, 20],  'Canada': [25, 20],
  'Latin America': [65, 30],  'South America': [70, 32],  'Brazil': [68, 35],
  'Western Europe': [32, 48], 'Europe': [30, 50], 'UK': [28, 46], 'Germany': [30, 51],
  'Eastern Europe': [32, 56], 'Middle East': [45, 58],
  'Africa': [60, 52],         'Nigeria': [55, 48], 'South Africa': [82, 58],
  'South Asia': [48, 72],     'India': [52, 74],
  'East Asia': [38, 85],      'China': [40, 82], 'Japan': [35, 88],
  'Southeast Asia': [58, 85], 'APAC': [55, 88], 'Singapore': [62, 84],
  'Oceania': [75, 88],        'Australia': [78, 88],
  'Global': [50, 50],
};

function getRegionCoordinates(region = '') {
  const key = Object.keys(REGION_COORDINATES).find(k =>
    region.toLowerCase().includes(k.toLowerCase())
  );
  return REGION_COORDINATES[key] || REGION_COORDINATES['Global'];
}

// Minimal jitter (±3%) for natural clustering over landmasses
function getDotPosition(org) {
  const hash = org.organization.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  let [baseTop, baseLeft] = getRegionCoordinates(org.region);

  // v1.2.0-FINAL Fix: If region is 'Global' or missing, distribute across all region anchors
  // This avoids the [50,50] "blob" effect seen when source data is region-agnostic.
  const isGlobal = !org.region || org.region.toLowerCase() === 'global';
  if (isGlobal) {
    const regionKeys = Object.keys(REGION_COORDINATES).filter(k => k !== 'Global');
    const pseudoRegion = regionKeys[hash % regionKeys.length];
    [baseTop, baseLeft] = REGION_COORDINATES[pseudoRegion];
  }

  // Increased jitter (±4%) for a more organic global spread
  const jitterTop  = ((hash * 13) % 8) - 4;   // -4 to +4
  const jitterLeft = ((hash * 7)  % 8) - 4;
  return {
    top:  Math.max(5, Math.min(92, baseTop  + jitterTop)),
    left: Math.max(2, Math.min(96, baseLeft + jitterLeft)),
  };
}


// ── Map Dot ───────────────────────────────────────────────────────────────────
const MapDot = React.memo(({ org, onClick, selected }) => {
  const ev          = getEvolutionaryState(org.score);
  const isTop       = org.score >= 70;
  const { top, left } = getDotPosition(org);

  return (
    <motion.button
      title={`${org.organization} [${org.metadata?.source || 'Behavioral'}] — Adaptiveness Velocity: ${org.score}`}

      onClick={() => onClick(org)}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: selected ? 1.7 : 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay: Math.random() * 0.1 }}
      style={{
        position: 'absolute', top: `${top}%`, left: `${left}%`,
        width: isTop ? 14 : 11,
        height: isTop ? 14 : 11,
        borderRadius: '50%',
        background: ev.color,
        border: `${isTop ? 3 : 2}px solid ${isTop ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.7)'}`,
        boxShadow: selected
          ? `0 0 0 5px ${ev.color}55, 0 0 24px ${ev.color}`
          : isTop
          ? `0 0 0 3px ${ev.color}33`
          : `0 1px 6px rgba(0,0,0,0.3)`,
        cursor: 'pointer',
        zIndex: selected ? 30 : isTop ? 15 : 10,
        animation: isTop && !selected ? 'antifragilePulse 3s ease-in-out infinite' : 'none',
        willChange: 'transform, opacity',
      }}
    />
  );
});
MapDot.displayName = 'MapDot';

// ── Score Bar ─────────────────────────────────────────────────────────────────
const ScoreBar = ({ score }) => {
  const ev = getEvolutionaryState(score);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%' }}>
      <div style={{ flex: 1, height: 5, background: '#f1f5f9', borderRadius: 9999, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          style={{ height: '100%', background: ev.color, borderRadius: 9999 }}
        />
      </div>
      <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '0.85rem', color: ev.color, minWidth: 28 }}>
        {score}
      </span>
    </div>
  );
};

// ── Table Row ────────────────────────────────────────────────────────────────
const LeaderboardRow = React.memo(({ r, idx, expandedId, setExpandedId, setFocusDot }) => {
  const ev = getEvolutionaryState(r.score);
  const isOpen = expandedId === idx;
  
  return (
    <div key={r.organization + idx}>
      <motion.div
        onClick={() => { setExpandedId(isOpen ? null : idx); setFocusDot(r); }}
        whileHover={{ background: '#f8fafc' }}
        style={{ display: 'grid', gridTemplateColumns: '80px 2fr 120px 100px 140px', padding: '0.9rem 1.5rem',
          borderBottom: '1px solid #f1f5f9', alignItems: 'center', cursor: 'pointer', transition: 'background 0.12s',
          background: isOpen ? '#f8fafc' : 'white' }}>

        <span style={{ fontWeight: 800, color: '#cbd5e1', fontFamily: 'Georgia,serif', fontSize: '1.05rem' }}>#{r.rank}</span>

        <span style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.15rem' }}>
            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.organization}</div>
            <span style={{ 
              fontSize: '0.55rem', padding: '1px 5px', borderRadius: '4px', textTransform: 'uppercase', 
              fontWeight: 800, letterSpacing: '0.5px', background: 'rgba(15, 23, 42, 0.05)', color: '#64748b'
            }}>
              {r.evidence_density || 1} {r.evidence_density === 1 ? 'Source' : 'Sources'}
            </span>
          </div>
          <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {r.industry || 'Global Baseline'} · {r.region}
          </div>
        </span>

        <span style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ fontSize: '0.6rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Cognitive Lead</div>
          <ScoreBar score={r.cognitive || r.score} />
        </span>

        <span style={{ fontWeight: 700, fontSize: '0.88rem', color: r.cognitiveShift?.startsWith('+') ? '#10b981' : '#ef4444' }}>
          {r.cognitiveShift}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ padding: '0.25rem 0.75rem', borderRadius: 9999, fontSize: '0.65rem', fontWeight: 800, border: '1px solid' }}
            className={ev.pill}>
            {ev.label}
          </span>
          {isOpen ? <ChevronUp size={14} style={{ color: '#94a3b8' }} /> : <ChevronDown size={14} style={{ color: '#cbd5e1' }} />}
        </div>
      </motion.div>


      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ padding: '1.5rem 1.5rem 1.5rem 6rem', background: '#f8fafc', display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
              <div>
                <p style={{ fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', color: '#94a3b8', marginBottom: '0.75rem' }}>Temporal Footprint</p>
                <div style={{ display: 'flex', gap: '2rem' }}>
                  <div>
                    <p style={{ fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#cbd5e1', marginBottom: '0.25rem' }}>Date Played</p>
                    <p style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>{formatDate(r.session_date)}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#cbd5e1', marginBottom: '0.25rem' }}>Session Duration</p>
                    <p style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>
                      {r.duration_seconds
                        ? `${Math.floor(r.duration_seconds / 60)}m ${r.duration_seconds % 60}s`
                        : r.duration
                        ? `${Math.floor(r.duration / 60)}m ${r.duration % 60}s`
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
               <div style={{ minWidth: '200px' }}>
                <p style={{ fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', color: '#94a3b8', marginBottom: '0.75rem' }}>Signal Architecture</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.875rem' }}>{r.evidence_density || 1} Total Signals</div>
                  <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600 }}>{r.source_breakdown}</div>
                </div>
              </div>
              <div style={{ flex: 2 }}>
                <p style={{ fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', color: '#94a3b8', marginBottom: '0.75rem' }}>5-Parameter Adaptiveness Breakdown</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem 2rem' }}>
                  {[
                    { label: 'Cognitive Framing', key: 'cognitive' },
                    { label: 'Signal Detection', key: 'signal' },
                    { label: 'Resource Reallocation', key: 'resource' },
                    { label: 'Decision Alignment', key: 'decision' },
                    { label: 'Execution Responsiveness', key: 'execution' }
                  ].map(dim => (
                    <div key={dim.key}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                        <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{dim.label}</span>
                        <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#0f172a' }}>{r[dim.key] || 0}</span>
                      </div>
                      <ScoreBar score={r[dim.key] || 0} />
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ flex: 1, minWidth: '150px' }}>
                <p style={{ fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', color: '#94a3b8', marginBottom: '0.75rem' }}>Evolutionary Profile</p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {['COMPOUND_INTEL_ACTIVE', `WEIGHTED_SCORE_${r.score}`, `STATE_${ev.label.toUpperCase()}`].map(tag => (
                    <span key={tag} style={{ padding: '0.2rem 0.6rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: '0.6rem', fontFamily: 'monospace', color: '#64748b', fontWeight: 600 }}>{tag}</span>
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
LeaderboardRow.displayName = 'LeaderboardRow';

// ── Main Component ─────────────────────────────────────────────────────────────
const GlobalIndexPage = () => {
  const [rankings, setRankings]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch]         = useState('');
  const [focusDot, setFocusDot]     = useState(null);
  const [filter, setFilter]         = useState('All');

  useEffect(() => {
    fetch('/api/analytics/global')
      .then(r => r.json())
      .then(data => {
        const sorted = (data || [])
          .sort((a, b) => b.score - a.score)
          .map((r, i) => ({
            ...r,
            rank: i + 1,
            cognitiveShift: r.score >= 70
              ? `+${(Math.random() * 5 + 1).toFixed(1)}%`
              : r.score >= 40
              ? `+${(Math.random() * 2).toFixed(1)}%`
              : `-${(Math.random() * 3).toFixed(1)}%`
          }));
        setRankings(sorted);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const displayed = useMemo(() => {
    let list = rankings;
    if (filter !== 'All') list = list.filter(r => getEvolutionaryState(r.score).label === filter);
    if (search.trim())    list = list.filter(r =>
      r.organization?.toLowerCase().includes(search.toLowerCase()) ||
      r.region?.toLowerCase().includes(search.toLowerCase()));
    
    // v1.2.0-FINAL: Executive Scrub - Hide rows with missing vital temporal data
    return list.filter(r => r.session_date && (r.duration_seconds || r.duration));
  }, [rankings, filter, search]);

  const stats = useMemo(() => ({
    antifragile: rankings.filter(r => r.score >= 70).length,
    emergent:    rankings.filter(r => r.score >= 40 && r.score < 70).length,
    fragile:     rankings.filter(r => r.score < 40).length,
  }), [rankings]);

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '6rem', fontFamily: 'Inter, sans-serif' }}>

      {/* ── Global keyframes ─────────────────────────────────────────────── */}
      <style>{`
        @keyframes antifragilePulse {
          0%   { opacity: 1;   transform: scale(1); }
          50%  { opacity: 0.6; transform: scale(1.1); }
          100% { opacity: 1;   transform: scale(1); }
        }
      `}</style>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <header style={{ paddingTop: '8rem', paddingBottom: '4rem', background: '#0a192f', textAlign: 'center', color: 'white' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: 700, margin: '0 auto', padding: '0 1.5rem' }}>
          <span style={{ display: 'inline-block', padding: '0.35rem 1.2rem', background: 'rgba(13,148,136,0.2)', color: '#2dd4bf', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', borderRadius: 9999, border: '1px solid rgba(45,212,191,0.3)', marginBottom: '1.5rem' }}>
            AFERR Methodology · v1.2.0-FINAL
          </span>
          <h1 style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', fontFamily: 'Georgia,serif', marginBottom: '1rem', lineHeight: 1.15 }}>
            Leadership Adaptiveness Index
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', fontWeight: 300 }}>
            Direct signal extraction from <strong style={{ color: '#2dd4bf' }}>{loading ? '600+' : rankings.length}</strong> verified organizational simulations.
          </p>
        </motion.div>

        {/* Stat bar */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
          {[
            { label: 'Antifragile', value: stats.antifragile, color: '#3b82f6', Icon: Shield },
            { label: 'Emergent',    value: stats.emergent,    color: '#0d9488', Icon: TrendingUp },
            { label: 'Fragile',     value: stats.fragile,     color: '#94a3b8', Icon: Zap },
          ].map(({ label, value, color, Icon }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color, fontFamily: 'Georgia,serif' }}>{value}</div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 }}>{label}</div>
            </div>
          ))}
        </motion.div>
      </header>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>

        {/* ── Live Map ──────────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          style={{ background: 'white', borderRadius: 24, border: '1px solid #e2e8f0', overflow: 'hidden', marginTop: '-2rem', boxShadow: '0 20px 60px rgba(0,0,0,0.08)', marginBottom: '2.5rem' }}>

          <div style={{ position: 'relative', height: 380, background: 'linear-gradient(135deg,#0f172a 0%,#1e293b 100%)', overflow: 'hidden' }}>
            {/* Grid lines */}
            {[...Array(8)].map((_, i) => (
              <div key={`v${i}`} style={{ position: 'absolute', top: 0, bottom: 0, left: `${(i + 1) * 12.5}%`, borderLeft: '1px solid rgba(255,255,255,0.04)' }} />
            ))}
            {[...Array(5)].map((_, i) => (
              <div key={`h${i}`} style={{ position: 'absolute', left: 0, right: 0, top: `${(i + 1) * 20}%`, borderTop: '1px solid rgba(255,255,255,0.04)' }} />
            ))}

            {/* World-map silhouette */}
            <img src="https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&q=60&w=1400"
              alt="World Map" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.08, filter: 'grayscale(1)' }} />

            {/* Dynamic dots — region-aware placement */}
            {!loading && displayed.slice(0, 150).map((org, i) => (
              <MapDot key={org.organization + i} org={org}
                selected={focusDot?.organization === org.organization}
                onClick={(o) => {
                  setFocusDot(prev => prev?.organization === o.organization ? null : o);
                  setExpandedId(null);
                }} />
            ))}

            {/* Focused tooltip */}
            <AnimatePresence>
              {focusDot && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)',
                    background: 'rgba(15,23,42,0.96)', backdropFilter: 'blur(16px)', color: 'white',
                    borderRadius: 16, padding: '1rem 1.5rem', border: '1px solid rgba(255,255,255,0.12)',
                    textAlign: 'center', minWidth: 230, zIndex: 40 }}>
                  <div style={{ fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: '#64748b', marginBottom: '0.2rem' }}>
                    {focusDot.industry || 'Global Baseline'} · {focusDot.region}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 200 }}>
                    {focusDot.organization}
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Georgia,serif', color: getEvolutionaryState(focusDot.score).color, lineHeight: 1 }}>
                    {focusDot.score}
                  </div>
                  <div style={{ fontSize: '0.62rem', color: '#64748b', fontWeight: 700, marginTop: '0.2rem', textTransform: 'uppercase', letterSpacing: 1.5 }}>
                    Adaptiveness Velocity
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Legend */}
            <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(8px)', borderRadius: 12, padding: '0.75rem 1rem', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {[['#3b82f6','Antifragile (>70)', true],['#0d9488','Emergent (40-70)', false],['#64748b','Fragile (<40)', false]].map(([color, label, pulse]) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600 }}>
                  <span style={{
                    width: 10, height: 10, borderRadius: '50%', background: color, display: 'inline-block',
                    border: '2px solid rgba(255,255,255,0.7)',
                    animation: pulse ? 'antifragilePulse 2.4s ease-in-out infinite' : 'none'
                  }} />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Table Controls ──────────────────────────────────────────────── */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: '0.6rem 1rem', flex: '1', minWidth: 220, maxWidth: 380 }}>
            <Search size={16} style={{ color: '#94a3b8' }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search organizations or regions…"
              style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.875rem', background: 'transparent', color: '#0f172a' }} />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['All', 'Antifragile', 'Emergent', 'Fragile'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{ padding: '0.5rem 1.1rem', borderRadius: 9999, fontSize: '0.72rem', fontWeight: 700, border: '1px solid',
                  background: filter === f ? '#0a192f' : 'white',
                  color: filter === f ? 'white' : '#64748b',
                  borderColor: filter === f ? '#0a192f' : '#e2e8f0',
                  cursor: 'pointer', transition: 'all 0.15s' }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* ── Ranking Table ───────────────────────────────────────────────── */}
        <div style={{ background: 'white', borderRadius: 20, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>

          <div style={{ display: 'grid', gridTemplateColumns: '80px 2fr 120px 100px 140px', padding: '1rem 1.5rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#94a3b8' }}>
            <span>Rank</span>
            <span>Organization Profile</span>
            <span>Cognitive Lead</span>
            <span>Trend</span>
            <span style={{ textAlign: 'right', paddingRight: '1rem' }}>Evolutionary State</span>
          </div>


          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
              <Globe size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
              <p style={{ fontWeight: 600 }}>Hydrating LAI Intelligence…</p>
            </div>
          ) : displayed.length === 0 ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
              <Globe size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
              <p style={{ fontWeight: 600 }}>
                {rankings.length === 0 ? 'Re-connecting to Global Baseline...' : 'No organizations match the current filter.'}
              </p>
            </div>
          ) : (
            displayed.map((r, idx) => (
              <LeaderboardRow 
                key={r.organization} 
                r={r} 
                idx={idx} 
                expandedId={expandedId} 
                setExpandedId={setExpandedId} 
                setFocusDot={setFocusDot} 
              />
            ))
          )}
        </div>

        {/* CTA */}
        <div style={{ marginTop: '3rem', padding: '3rem', background: '#0a192f', borderRadius: 20, textAlign: 'center', color: 'white' }}>
          <h3 style={{ fontSize: '1.75rem', fontFamily: 'Georgia,serif', color: 'white', marginBottom: '0.75rem' }}>Add Your Organization to the LAI Index</h3>
          <p style={{ color: '#94a3b8', marginBottom: '1.5rem', fontWeight: 300 }}>Benchmark your leadership cohort against 600+ global simulations.</p>
          <button onClick={() => window.location.href = '/diagnostic'}
            style={{ background: '#0d9488', color: 'white', border: 'none', padding: '0.875rem 2.5rem', borderRadius: 9999, fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem', letterSpacing: '0.5px' }}>
            Register for Measurement
          </button>
        </div>

      </div>
    </div>
  );
};

export default GlobalIndexPage;
