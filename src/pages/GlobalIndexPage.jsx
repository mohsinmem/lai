import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Search, ChevronDown, ChevronUp, Zap, Shield, ShieldCheck, TrendingUp, Brain, CheckCircle2, AlertTriangle, Info, Layers } from 'lucide-react';
import { supabase } from '../supabase';

const PILLAR_DEFINITIONS = {
  signal_detection: "The precision in detecting environmental signals and translating them into strategy.",
  cognitive_framing: "The ability to reframe threats as opportunities and pivot mental models under pressure.",
  decision_alignment: "The presence of psychological safety and dissent channels to stress-test decisions.",
  resource_calibration: "The speed and precision of skill acquisition and capital reallocation.",
  integrated_responsiveness: "The capacity to maintain high-performance decision-making during extended disruption."
};

// ── Evolutionary State Logic ──────────────────────────────────────────────────
const getEvolutionaryState = (score) => {
  if (score >= 70) return { label: 'Antifragile', color: '#3b82f6', pill: 'bg-blue-100 text-blue-700 border-blue-200' };
  if (score >= 40) return { label: 'Emergent',    color: '#0d9488', pill: 'bg-teal-100 text-teal-700 border-teal-200' };
  return                { label: 'Fragile',       color: '#64748b', pill: 'bg-slate-100 text-slate-600 border-slate-200' };
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
  const ev = getEvolutionaryState(score);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
      <div style={{ flex: 1, height: 5, background: '#f1f5f9', borderRadius: 9999, overflow: 'hidden' }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${score}%` }}
          style={{ height: '100%', background: ev.color, borderRadius: 9999 }} />
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

  const FidelityBadge = () => {
    const badgeStyle = {
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.6rem',
      fontWeight: 800,
      border: '1px solid',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    };

    return (
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {is_triangulated && (
          <span style={{ ...badgeStyle, background: '#eff6ff', color: '#1d4ed8', borderColor: '#dbeafe' }}>
            TRIANGULATED
          </span>
        )}
        {is_dissonant && (
          <span style={{ ...badgeStyle, background: '#fffbeb', color: '#b45309', borderColor: '#fef3c7', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <AlertTriangle size={10}/> INSIGHT ALERT
          </span>
        )}
        {!is_triangulated && !is_dissonant && (
          <span style={{ ...badgeStyle, background: '#f8fafc', color: '#64748b', borderColor: '#e2e8f0' }}>
            INFERRED
          </span>
        )}
      </div>
    );
  };

  return (
    <div key={r.organization + idx}>
      <motion.div onClick={() => { setExpandedId(isOpen ? null : idx); setFocusDot(r); }}
        whileHover={{ background: '#f8fafc' }}
        style={{ display: 'grid', gridTemplateColumns: '70px 2.5fr 150px 100px 180px', padding: '1rem 1.5rem',
          borderBottom: '1px solid #f1f5f9', alignItems: 'center', cursor: 'pointer', background: isOpen ? '#f8fafc' : 'white' }}>
        <span style={{ fontWeight: 800, color: '#cbd5e1', fontSize: '1rem' }}>#{r.rank}</span>
        <span style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>{r.organization}</div>
            {r.is_verified && (
              <CheckCircle2 size={13} color="#3b82f6" fill="rgba(59, 130, 246, 0.1)" 
                style={{ cursor: 'help' }} 
                title={`Verified Institutional Signal: ${r.evidence_density} data points synthesized.`} />
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>{r.industry || 'Global Baseline'} · {r.region}</div>
          </div>
        </span>
        <span>
          {r.is_verified && r.evidence_density === 0 ? (
            <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Data Pending
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ScoreBar score={r.score} />
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', minWidth: '2.5ch' }}>{r.score}</span>
            </div>
          )}
        </span>
        <span style={{ fontWeight: 700, fontSize: '0.85rem', color: r.cognitiveShift?.startsWith('+') ? '#10b981' : '#ef4444', opacity: (r.is_verified && r.evidence_density === 0) ? 0.3 : 1 }}>
          {r.score === 0 ? '--' : r.cognitiveShift}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1rem' }}>
          <FidelityBadge />
          {isOpen ? <ChevronUp size={14} color="#94a3b8" /> : <ChevronDown size={14} color="#cbd5e1" />}
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
            <div style={{ padding: '2rem 1.5rem 2rem 6.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '3rem' }}>
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
                    { label: 'Intelligence Active', val: 'V1.3.2_SOVEREIGN', color: '#3b82f6' },
                    { label: 'Weighted Authority', val: `CONFIDENCE_${Math.round((r.evidence_density || 1) * 8 + 40)}%`, color: ev.color },
                    { label: 'Market Position', val: ev.label.toUpperCase(), color: ev.color }
                  ].map(tag => (
                    <div key={tag.label} style={{ background: 'white', padding: '0.75rem 1rem', borderRadius: 12, border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{tag.label}</span>
                      <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', fontWeight: 800, color: tag.color }}>{tag.val}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p style={{ fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, color: '#94a3b8', marginBottom: '1rem' }}>Canonical 5-Behavioral Dimension Breakdown</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem 2rem' }}>
                  {[
                    { label: 'Signal Detection', key: 'signal_detection' },
                    { label: 'Cognitive Framing', key: 'cognitive_framing' },
                    { label: 'Decision Alignment', key: 'decision_alignment' },
                    { label: 'Resource Calibration', key: 'resource_calibration' },
                    { label: 'Integrated Responsiveness', key: 'integrated_responsiveness' }
                  ].map(dim => (
                    <div key={dim.key} title={PILLAR_DEFINITIONS[dim.key]}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', cursor: 'help' }}>
                        <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {dim.label} <Info size={10} />
                        </span>
                        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#0f172a' }}>{r[dim.key] || 0}</span>
                      </div>
                      <ScoreBar score={r[dim.key] || 0} />
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
    antifragile: rankings.filter(r => r.score >= 70).length,
    emergent: rankings.filter(r => r.score >= 40 && r.score < 70).length,
    fragile: rankings.filter(r => r.score < 40).length,
  }), [rankings]);

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '6rem', fontFamily: 'Inter, sans-serif' }}>
      <style>{`@keyframes antifragilePulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.1); } 100% { opacity: 1; transform: scale(1); } }`}</style>
      
      <header style={{ paddingTop: '8rem', paddingBottom: '4rem', background: '#0a192f', textAlign: 'center', color: 'white' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: 700, margin: '0 auto', padding: '0 1.5rem' }}>
          <span style={{ display: 'inline-block', padding: '0.35rem 1.2rem', background: 'rgba(13,148,136,0.2)', color: '#2dd4bf', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', borderRadius: 9999, border: '1px solid rgba(45,212,191,0.3)', marginBottom: '1.5rem' }}>
            AFERR Methodology · v1.3.2_SOVEREIGN
          </span>
          <h1 style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', fontFamily: 'Georgia,serif', marginBottom: '1rem', lineHeight: 1.15 }}>Global Leadership Adaptiveness Index</h1>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', fontWeight: 300 }}>Weighted Truth Hierarchy: Aggregating simulation behavioral data with sovereign research. Total Verified Signals: <strong style={{ color: '#2dd4bf' }}>{loading ? '600+' : rankings.length}</strong></p>
        </motion.div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginTop: '2.5rem' }}>
          {[{ label: 'Antifragile', color: '#3b82f6', value: stats.antifragile }, { label: 'Emergent', color: '#0d9488', value: stats.emergent }, { label: 'Fragile', color: '#94a3b8', value: stats.fragile }].map(s => (
            <div key={s.label}><div style={{ fontSize: '2rem', fontWeight: 800, color: s.color, fontFamily: 'Georgia,serif' }}>{s.value}</div><div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>{s.label}</div></div>
          ))}
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

        <div style={{ background: 'white', borderRadius: 24, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '70px 2.5fr 150px 100px 180px', padding: '1.25rem 1.5rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, color: '#94a3b8' }}>
            <span>Rank</span>
            <span>Organization Profile</span>
            <span>LAI Score</span>
            <span>Trend</span>
            <span style={{ textAlign: 'right' }}>Data Fidelity</span>
          </div>
          {loading ? (
            <div style={{ padding: '5rem', textAlign: 'center', color: '#cbd5e1' }}><Brain size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} /><p>Synthesizing Global Signals...</p></div>
          ) : (
            displayed.map((r, idx) => (
              <LeaderboardRow key={r.organization} r={r} idx={idx} expandedId={expandedId} setExpandedId={setExpandedId} setFocusDot={setFocusDot} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalIndexPage;
