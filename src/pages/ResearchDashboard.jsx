import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader, CheckCircle, AlertCircle } from 'lucide-react';

const ResearchDashboard = () => {
  const [companyName, setCompanyName] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const handleTriggerResearch = async (e) => {
    e.preventDefault();
    if (!companyName) return;

    setStatus('loading');
    setMessage(`Triggering research for ${companyName}...`);

    try {
      // Direct call to Netlify Background Function
      const response = await fetch('/.netlify/functions/research-worker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company_name: companyName })
      });

      if (response.ok) {
        setStatus('success');
        setMessage(`Research task for "${companyName}" has been queued. This runs in the background.`);
        setCompanyName('');
      } else {
        throw new Error('Failed to trigger background worker');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
      setMessage('Something went wrong. Please check your Netlify logs.');
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-slate-100"
        >
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4">Research Dashboard</h1>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Trigger background analysis for specific organizations. Our agent will scrape signals and calculate adaptiveness metrics.
            </p>
          </div>

          <form onSubmit={handleTriggerResearch} className="max-w-md mx-auto">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Enter Company Name (e.g. Tesla, Siemens)"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-medium hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {status === 'loading' ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Queuing Task...
                </>
              ) : (
                'Trigger Deep Research'
              )}
            </button>
          </form>

          {status !== 'idle' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`mt-8 p-6 rounded-xl border flex gap-4 ${
                status === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 
                status === 'error' ? 'bg-rose-50 border-rose-100 text-rose-800' : 
                'bg-blue-50 border-blue-100 text-blue-800'
              }`}
            >
              {status === 'success' && <CheckCircle className="w-6 h-6 shrink-0" />}
              {status === 'error' && <AlertCircle className="w-6 h-6 shrink-0" />}
              {status === 'loading' && <Loader className="w-6 h-6 shrink-0 animate-spin" />}
              <p className="font-medium">{message}</p>
            </motion.div>
          )}

          <div className="mt-12 pt-8 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">Worker Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-slate-500 mb-1">Queue Type</p>
                <p className="font-mono font-bold">Netlify Background</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-slate-500 mb-1">Max Duration</p>
                <p className="font-mono font-bold">15 Minutes</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-slate-500 mb-1">Persistence</p>
                <p className="font-mono font-bold text-teal-600">Supabase Connected</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResearchDashboard;
