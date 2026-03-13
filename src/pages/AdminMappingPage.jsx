import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Search, Link2, AlertCircle, CheckCircle2, RefreshCw, ChevronRight, Building2, Globe } from 'lucide-react';

const AdminMappingPage = () => {
  const [unclaimed, setUnclaimed] = useState([]);
  const [verified, setVerified] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUnclaimed, setSelectedUnclaimed] = useState(null);
  const [mappingStatus, setMappingStatus] = useState({ state: 'idle', message: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [uRes, vRes] = await Promise.all([
        fetch('/api/admin/unclaimed-signals'),
        fetch('/api/admin/verified-entities')
      ]);
      const uData = await uRes.json();
      const vData = await vRes.json();
      setUnclaimed(uData);
      setVerified(vData);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMap = async (rawName, entityId) => {
    setMappingStatus({ state: 'processing', message: `Mapping ${rawName}...` });
    try {
      const mapRes = await fetch('/api/admin/map-signal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ raw_name: rawName, verified_entity_id: entityId })
      });
      
      if (!mapRes.ok) throw new Error('Mapping failed');

      // Trigger Recalculate (Kill 72)
      await fetch('/api/admin/recalculate-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entity_id: entityId })
      });

      setMappingStatus({ state: 'success', message: `Successfully mapped ${rawName}` });
      setSelectedUnclaimed(null);
      fetchData();
      
      setTimeout(() => setMappingStatus({ state: 'idle', message: '' }), 3000);
    } catch (err) {
      setMappingStatus({ state: 'error', message: err.message });
      setTimeout(() => setMappingStatus({ state: 'idle', message: '' }), 5000);
    }
  };

  const filteredVerified = verified.filter(v => 
    v.name.toLowerCase().includes(search.toLowerCase()) || 
    v.domain?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', paddingTop: '8rem', paddingBottom: '6rem', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', background: 'rgba(15, 23, 42, 0.05)', borderRadius: 9999, color: '#64748b', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1rem' }}>
            <Shield size={14} /> Admin Identity Control v1.3.3
          </div>
          <h1 style={{ fontSize: '2.5rem', fontFamily: 'Georgia, serif', color: '#0f172a', marginBottom: '0.5rem' }}>Signal Mapping Registry</h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: 300 }}>Consolidate individual AFERR signals into undisputed parent datasets.</p>
        </div>

        {mappingStatus.state !== 'idle' && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} 
            style={{ padding: '1rem 1.5rem', borderRadius: 12, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem',
              background: mappingStatus.state === 'success' ? '#f0fdf4' : mappingStatus.state === 'error' ? '#fef2f2' : '#eff6ff',
              border: `1px solid ${mappingStatus.state === 'success' ? '#bbf7d0' : mappingStatus.state === 'error' ? '#fecaca' : '#bfdbfe'}`,
              color: mappingStatus.state === 'success' ? '#166534' : mappingStatus.state === 'error' ? '#991b1b' : '#1e40af' }}>
            {mappingStatus.state === 'processing' ? <RefreshCw size={18} className="animate-spin" /> : 
             mappingStatus.state === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{mappingStatus.message}</span>
          </motion.div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          
          {/* Left Pane: Unclaimed */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '1px' }}>Unclaimed Signals</h2>
              <span style={{ background: '#0f172a', color: 'white', padding: '0.2rem 0.6rem', borderRadius: 6, fontSize: '0.7rem', fontWeight: 800 }}>{unclaimed.length}</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {loading ? (
                [1,2,3].map(i => <div key={i} style={{ height: 80, background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', opacity: 0.5 }}></div>)
              ) : unclaimed.length === 0 ? (
                <div style={{ padding: '4rem', textAlign: 'center', background: 'white', borderRadius: 16, border: '1px solid #e2e8f0' }}>
                  <CheckCircle2 size={40} style={{ margin: '0 auto 1rem', color: '#10b981', opacity: 0.2 }} />
                  <p style={{ color: '#94a3b8', fontWeight: 600 }}>All signals resolve to parent entities.</p>
                </div>
              ) : (
                unclaimed.map(u => (
                  <motion.div key={u.name} whileHover={{ x: 4 }} onClick={() => setSelectedUnclaimed(u)}
                    style={{ background: selectedUnclaimed?.name === u.name ? '#f8fafc' : 'white', padding: '1.25rem', borderRadius: 16, border: '1px solid', borderColor: selectedUnclaimed?.name === u.name ? '#3b82f6' : '#e2e8f0', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>{u.name}</div>
                      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
                        <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>{u.count} Signals</span>
                        <span style={{ fontSize: '0.65rem', color: u.avg_score >= 70 ? '#3b82f6' : '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>Avg Score: {u.avg_score}</span>
                      </div>
                    </div>
                    <ChevronRight size={18} color={selectedUnclaimed?.name === u.name ? '#3b82f6' : '#cbd5e1'} />
                  </motion.div>
                ))
              )}
            </div>
          </section>

          {/* Right Pane: Verified Entities */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '1px' }}>Verified Registry</h2>
              <div style={{ position: 'relative', width: '200px' }}>
                <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
                  style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: 8, padding: '0.4rem 0.5rem 0.4rem 2rem', fontSize: '0.75rem', outline: 'none' }} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <AnimatePresence mode="popLayout">
                {selectedUnclaimed ? (
                  filteredVerified.map(v => (
                    <motion.div key={v.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                      style={{ background: 'white', padding: '1.25rem', borderRadius: 16, border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Building2 size={14} color="#64748b" /> {v.name}
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
                          <span style={{ fontSize: '0.65rem', color: '#3b82f6', fontWeight: 800 }}>{v.domain}</span>
                          <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 800 }}>{v.headquarters}</span>
                        </div>
                      </div>
                      <button onClick={() => handleMap(selectedUnclaimed.name, v.id)}
                        style={{ background: '#0f172a', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: 8, fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Link2 size={14} /> Resolve Entity
                      </button>
                    </motion.div>
                  ))
                ) : (
                  <div style={{ padding: '4rem', textAlign: 'center', background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', borderStyle: 'dashed' }}>
                    <AlertCircle size={40} style={{ margin: '0 auto 1rem', color: '#cbd5e1' }} />
                    <p style={{ color: '#94a3b8', fontWeight: 500 }}>Select an unclaimed signal to map it.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
};

export default AdminMappingPage;
