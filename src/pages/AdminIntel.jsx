import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Save, Shield, Users, AlertCircle, Sparkles, Database } from 'lucide-react';

const AdminIntel = () => {
  const [organizations, setOrganizations] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [mode, setMode] = useState('SOVEREIGN'); // SOVEREIGN or PERCEPTION
  const [seniority, setSeniority] = useState('middle_management');
  const [intelText, setIntelText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchOrgs();
  }, []);

  const fetchOrgs = async () => {
    try {
      const response = await fetch('/api/analytics/global'); // Reuse this to get verified list
      const data = await response.json();
      // Filter for verified orgs or all
      setOrganizations(data.filter(o => o.is_verified) || []);
    } catch (err) {
      console.error('Failed to fetch orgs:', err);
    }
  };

  const filteredOrgs = organizations.filter(o => 
    o.organization.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOrg || !intelText) return;

    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/researcher-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organization_id: selectedOrg.organization, // Using name for fallback if needed or ID
          mode,
          seniority,
          text: intelText
        })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Intel successfully ingested and processed.' });
        setIntelText('');
        setSelectedOrg(null);
        setSearch('');
      } else {
        throw new Error('Processing failed');
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to process intelligence. Ensure Researcher Agent is active.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-intel-page">
      <div className="container narrow">
        <header className="admin-header">
          <div className="badge-admin">Admin Portal</div>
          <h1>Sovereign Ingestion Portal</h1>
          <p>Proprietary overrides and perception-based survey ingestion layer.</p>
        </header>

        <form onSubmit={handleSubmit} className="intel-form">
          <div className="form-section">
            <label><Database size={16} /> Mode Selection</label>
            <div className="mode-toggle">
              <button 
                type="button"
                className={mode === 'SOVEREIGN' ? 'active' : ''} 
                onClick={() => setMode('SOVEREIGN')}
              >
                <Shield size={18} /> Proprietary Research (Tier 0)
              </button>
              <button 
                type="button"
                className={mode === 'PERCEPTION' ? 'active' : ''} 
                onClick={() => setMode('PERCEPTION')}
              >
                <Users size={18} /> Perception Survey (Tier 2)
              </button>
            </div>
          </div>

          <div className="form-section">
            <label><Search size={16} /> Select Organization (Global 2000)</label>
            <div className="search-container">
              <input 
                type="text" 
                placeholder="Search master registry..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && filteredOrgs.length > 0 && !selectedOrg && (
                <div className="search-results">
                  {filteredOrgs.map(o => (
                    <div 
                      key={o.organization} 
                      className="search-item"
                      onClick={() => {
                        setSelectedOrg(o);
                        setSearch(o.organization);
                      }}
                    >
                      {o.organization} <span className="region-tag">{o.region}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-section">
            <label><Users size={16} /> Source Seniority</label>
            <select value={seniority} onChange={(e) => setSeniority(e.target.value)}>
              <option value="c_suite">C-Suite / Board (1.5x)</option>
              <option value="svp_vp_director">SVP / VP / Director (1.2x)</option>
              <option value="middle_management">Middle Management (1.0x)</option>
              <option value="individual_contributor">Individual Contributor (0.8x)</option>
            </select>
          </div>

          <div className="form-section">
            <label><AlertCircle size={16} /> Raw Intelligence / Survey Data</label>
            <textarea 
              placeholder={mode === 'SOVEREIGN' ? "Enter proprietary research notes, expert observations, or board report snippets..." : "Paste raw survey responses or employee sentiment reports..."}
              value={intelText}
              onChange={(e) => setIntelText(e.target.value)}
              rows={8}
            />
          </div>

          <button type="submit" className="btn-submit" disabled={isSubmitting || !selectedOrg || !intelText}>
            {isSubmitting ? 'Processing via Researcher Agent...' : <><Sparkles size={18} /> Ingest into Hierarchy of Truth</>}
          </button>

          {message && (
            <div className={`form-message ${message.type}`}>
              {message.text}
            </div>
          )}
        </form>
      </div>

      <style jsx>{`
        .admin-intel-page { padding: 8rem 0; min-height: 100vh; background: #f8fafc; }
        .admin-header { text-align: center; margin-bottom: 4rem; }
        .badge-admin { 
          display: inline-block; background: var(--navy); color: white; 
          padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.7rem; 
          font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 1rem;
        }
        .admin-header h1 { font-size: 2.5rem; margin-bottom: 1rem; }
        
        .intel-form { background: white; padding: 3rem; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 10px 40px rgba(0,0,0,0.05); }
        .form-section { margin-bottom: 2rem; }
        .form-section label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--slate); margin-bottom: 0.75rem; }
        
        .mode-toggle { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .mode-toggle button { 
          display: flex; align-items: center; justify-content: center; gap: 0.75rem;
          padding: 1rem; border: 1px solid #e2e8f0; border-radius: 8px; background: white;
          cursor: pointer; font-weight: 600; transition: all 0.2s ease;
        }
        .mode-toggle button.active { background: var(--navy); color: white; border-color: var(--navy); }
        
        .search-container { position: relative; }
        .search-container input, .form-section select, .form-section textarea { 
          width: 100%; padding: 1rem; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 1rem;
        }
        
        .search-results { 
          position: absolute; top: 100%; left: 0; right: 0; background: white; 
          border: 1px solid #e2e8f0; border-radius: 0 0 8px 8px; z-index: 10;
          max-height: 200px; overflow-y: auto; shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        .search-item { padding: 0.75rem 1rem; cursor: pointer; transition: background 0.2s; border-bottom: 1px solid #f1f5f9; }
        .search-item:hover { background: #f8fafc; }
        .region-tag { font-size: 0.7rem; color: var(--slate-light); margin-left: 0.5rem; }
        
        .btn-submit { 
          width: 100%; background: var(--teal); color: white; border: none; 
          padding: 1.25rem; border-radius: 8px; font-size: 1.1rem; font-weight: 700;
          display: flex; align-items: center; justify-content: center; gap: 0.75rem;
          cursor: pointer; transition: all 0.2s;
        }
        .btn-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(49, 151, 149, 0.3); }
        .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        
        .form-message { margin-top: 1.5rem; padding: 1rem; border-radius: 8px; text-align: center; font-weight: 600; }
        .form-message.success { background: #f0fff4; color: #2f855a; border: 1px solid #c6f6d5; }
        .form-message.error { background: #fff5f5; color: #c53030; border: 1px solid #feb2b2; }
      `}</style>
    </div>
  );
};

export default AdminIntel;
