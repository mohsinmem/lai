import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Shield, Users, AlertCircle, Sparkles, Database, CheckCircle, TrendingUp, Cpu } from 'lucide-react';

const DIMENSIONS = [
  { key: 'signal_interpretation', label: 'Signal Interpretation' },
  { key: 'cognitive_framing',     label: 'Cognitive Framing' },
  { key: 'resource_reallocation', label: 'Resource Reallocation' },
  { key: 'decision_alignment',    label: 'Decision Alignment' },
  { key: 'execution_responsiveness', label: 'Execution Responsiveness' }
];

const ScoreBar = ({ score, color = '#3b82f6' }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <div style={{ flex: 1, height: 6, background: '#f1f5f9', borderRadius: 9999, overflow: 'hidden' }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ height: '100%', background: color, borderRadius: 9999 }}
      />
    </div>
    <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '0.8rem', color, minWidth: 28 }}>{score}</span>
  </div>
);

const AdminIntel = () => {
  const [organizations, setOrganizations] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [mode, setMode] = useState('SOVEREIGN');
  const [seniority, setSeniority] = useState('c_suite');
  const [intelText, setIntelText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => { fetchOrgs(); }, []);

  const fetchOrgs = async () => {
    try {
      const res = await fetch('/api/analytics/global');
      const data = await res.json();
      setOrganizations((data || []).filter(o => o.is_verified));
    } catch (err) {
      console.error('Failed to fetch orgs:', err);
    }
  };

  const filteredOrgs = organizations.filter(o =>
    o.organization.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOrg || !intelText.trim()) return;

    setIsSubmitting(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch('/api/researcher-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organization_id: selectedOrg.organization,
          mode,
          seniority,
          text: intelText
        })
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Processing failed');

      setResult(json);
      setIntelText('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const tierColor = mode === 'SOVEREIGN' ? '#3b82f6' : '#0d9488';
  const overallColor = result
    ? result.overall >= 70 ? '#3b82f6' : result.overall >= 40 ? '#0d9488' : '#94a3b8'
    : '#3b82f6';

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '7rem 1.5rem 4rem' }}>
      <div style={{ maxWidth: 780, margin: '0 auto' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: '#0a192f', color: 'white', padding: '0.4rem 1.2rem',
            borderRadius: 20, fontSize: '0.65rem', fontWeight: 800,
            textTransform: 'uppercase', letterSpacing: 2, marginBottom: '1.25rem'
          }}>
            <Shield size={12} /> Sovereign Ingestion Portal
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
            Intelligence Submission
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem' }}>
            Submit proprietary research or perception surveys. The Researcher Agent v2.0 extracts scores
            across all 5 Evaluation Layer dimensions and injects them into the Hierarchy of Truth.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ background: 'white', borderRadius: 20, border: '1px solid #e2e8f0', padding: '2.5rem', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>

          <form onSubmit={handleSubmit}>
            {/* Tier Selection */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: 1.5, marginBottom: '0.75rem' }}>
                <Database size={14} /> Intelligence Tier
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[
                  { id: 'SOVEREIGN', icon: <Shield size={18} />, title: 'Proprietary Research', sub: 'Tier 0 · 1.2× Authority Weight', color: '#3b82f6' },
                  { id: 'PERCEPTION', icon: <Users size={18} />, title: 'Perception Survey', sub: 'Tier 2 · 0.8× Sentiment Weight', color: '#0d9488' }
                ].map(t => (
                  <button key={t.id} type="button" onClick={() => setMode(t.id)}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                      padding: '1rem 1.25rem', border: `2px solid`, borderRadius: 12, cursor: 'pointer',
                      background: mode === t.id ? t.color + '10' : 'white',
                      borderColor: mode === t.id ? t.color : '#e2e8f0',
                      transition: 'all 0.2s'
                    }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: mode === t.id ? t.color : '#64748b', fontWeight: 700, marginBottom: '0.25rem' }}>
                      {t.icon} {t.title}
                    </div>
                    <div style={{ fontSize: '0.6rem', color: mode === t.id ? t.color : '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>
                      {t.sub}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Organization Selector */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: 1.5, marginBottom: '0.75rem' }}>
                <Search size={14} /> Target Organization
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Search Global 2000 registry..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setSelectedOrg(null); }}
                  style={{ width: '100%', padding: '0.9rem 1rem', border: `1px solid ${selectedOrg ? tierColor : '#e2e8f0'}`, borderRadius: 10, fontSize: '0.95rem', outline: 'none', background: selectedOrg ? tierColor + '08' : 'white', boxSizing: 'border-box' }}
                />
                {selectedOrg && (
                  <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)' }}>
                    <CheckCircle size={18} color={tierColor} />
                  </div>
                )}
                <AnimatePresence>
                  {search && filteredOrgs.length > 0 && !selectedOrg && (
                    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #e2e8f0', borderRadius: '0 0 10px 10px', zIndex: 20, maxHeight: 220, overflowY: 'auto', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
                      {filteredOrgs.slice(0, 10).map(o => (
                        <div key={o.organization} onClick={() => { setSelectedOrg(o); setSearch(o.organization); setResult(null); }}
                          style={{ padding: '0.8rem 1rem', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                          onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                          <span style={{ fontWeight: 600, color: '#0f172a' }}>{o.organization}</span>
                          <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>{o.region}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Seniority */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: 1.5, marginBottom: '0.75rem' }}>
                <TrendingUp size={14} /> Source Seniority
              </label>
              <select value={seniority} onChange={e => setSeniority(e.target.value)}
                style={{ width: '100%', padding: '0.9rem 1rem', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: '0.95rem', background: 'white', cursor: 'pointer' }}>
                <option value="c_suite">C-Suite / Board (1.5× Multiplier)</option>
                <option value="svp_vp_director">SVP / VP / Director (1.2× Multiplier)</option>
                <option value="middle_management">Middle Management (1.0×)</option>
                <option value="individual_contributor">Individual Contributor (0.8×)</option>
              </select>
            </div>

            {/* Intel Text */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: 1.5, marginBottom: '0.75rem' }}>
                <AlertCircle size={14} /> Raw Intelligence
              </label>
              <textarea
                value={intelText}
                onChange={e => setIntelText(e.target.value)}
                placeholder={mode === 'SOVEREIGN'
                  ? 'Enter proprietary research notes, expert board report snippets, or insider observational data...'
                  : 'Paste raw survey responses, employee sentiment reports, or perception-based field data...'}
                rows={7}
                style={{ width: '100%', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: '0.9rem', lineHeight: 1.7, resize: 'vertical', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
              />
              <div style={{ textAlign: 'right', fontSize: '0.65rem', color: '#94a3b8', marginTop: '0.4rem' }}>
                {intelText.length} chars — minimum 50 recommended
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={isSubmitting || !selectedOrg || intelText.length < 10}
              style={{
                width: '100%', padding: '1.1rem', borderRadius: 12, border: 'none',
                background: isSubmitting || !selectedOrg || intelText.length < 10 ? '#e2e8f0' : tierColor,
                color: isSubmitting || !selectedOrg || intelText.length < 10 ? '#94a3b8' : 'white',
                fontSize: '1rem', fontWeight: 800, cursor: isSubmitting || !selectedOrg || intelText.length < 10 ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                transition: 'all 0.2s'
              }}>
              {isSubmitting
                ? <><Cpu size={18} style={{ animation: 'spin 1s linear infinite' }} /> Researcher Agent Processing...</>
                : <><Sparkles size={18} /> Ingest into Hierarchy of Truth</>}
            </button>
          </form>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ marginTop: '1.5rem', padding: '1rem 1.25rem', borderRadius: 10, background: '#fff5f5', border: '1px solid #fecaca', color: '#dc2626', fontWeight: 600, fontSize: '0.9rem' }}>
                ⚠️ {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Result */}
          <AnimatePresence>
            {result && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ marginTop: '2rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 16, padding: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <CheckCircle size={22} color="#16a34a" />
                  <div>
                    <div style={{ fontWeight: 800, color: '#15803d', fontSize: '1rem' }}>Intel Ingested Successfully</div>
                    <div style={{ fontSize: '0.65rem', color: '#16a34a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{result.tier}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: overallColor, fontFamily: 'Georgia, serif' }}>{result.overall}</div>
                    <div style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Overall LAI</div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #dcfce7', paddingTop: '1.25rem' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, color: '#64748b', marginBottom: '1rem' }}>
                    Extracted Dimension Scores
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                    {DIMENSIONS.map(dim => (
                      <div key={dim.key}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>{dim.label}</span>
                        </div>
                        <ScoreBar score={result.scores[dim.key] || 0} color={tierColor} />
                      </div>
                    ))}
                  </div>
                </div>

                <button onClick={() => { setResult(null); setSelectedOrg(null); setSearch(''); }}
                  style={{ marginTop: '1.5rem', width: '100%', padding: '0.75rem', borderRadius: 10, border: `1px solid ${tierColor}`, background: 'white', color: tierColor, fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>
                  Submit Another
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default AdminIntel;
