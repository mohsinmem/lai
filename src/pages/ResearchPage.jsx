import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Globe, Activity, Search, Filter, ShieldCheck } from 'lucide-react';

const ResearchPage = () => {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        const response = await fetch('/api/research/live');
        const data = await response.json();
        setSignals(data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch signals:', err);
      }
    };
    fetchSignals();
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-20 bg-slate-50">
      <div className="container px-4 mx-auto">
        <header className="mb-16 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-block px-4 py-1.5 bg-teal-50 text-teal-700 text-xs font-bold uppercase tracking-widest rounded-full mb-6">
              Empirical Intelligence
            </span>
            <h1 className="text-4xl md:text-5xl font-serif text-slate-900 mb-6">Research & Signal Intelligence</h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              We leverage automated signal scraping and behavioral analysis to establish transparency in how global organizations respond to systemic change.
            </p>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content: Live Feed */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-serif text-slate-900">Live Global Signals</h2>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                Live Feed
              </div>
            </div>

            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-48 bg-slate-200 animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : signals.length > 0 ? (
              <div className="space-y-6">
                {signals.map((signal, index) => (
                  <motion.div
                    key={signal.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-slate-900">{signal.company_name}</h3>
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded">
                            {signal.region}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500">
                          Last Analysis: {new Date(signal.last_researched).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-serif font-bold text-teal-600">
                          {signal.adaptiveness_score}
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">LAI Score</p>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 mb-6 italic text-slate-700">
                      "{signal.research_notes}"
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">
                        <ShieldCheck className="w-4 h-4" />
                        Verified Signal
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-12 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-center">
                <Globe className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">No Research Results Yet</h3>
                <p className="text-slate-500 max-w-sm mx-auto mb-8">
                  The LAI research agents are currently scanning global signals. Results will appear here automatically once the first cycle completes.
                </p>
                <div className="flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                  <span className="w-2 h-2 bg-slate-300 rounded-full" />
                  Scanner Idle
                </div>
              </div>
            )}
          </div>

          {/* Sidebar: Library & Reports */}
          <div className="space-y-8">
            <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl">
              <h3 className="text-xl font-serif mb-6">Resource Library</h3>
              <div className="space-y-6">
                {[
                  { title: 'The 2024 Global Adaptiveness Report', type: 'Annual Report' },
                  { title: 'Decision Alignment in Decentralized Teams', type: 'White Paper' },
                  { title: 'Signal Sensitivity in CEO Decisions', type: 'Academic Study' },
                ].map((doc, i) => (
                  <div key={i} className="group cursor-pointer">
                    <p className="text-[10px] font-bold text-teal-400 uppercase mb-1">{doc.type}</p>
                    <h4 className="font-medium group-hover:text-teal-400 transition-colors mb-2">{doc.title}</h4>
                    <button className="flex items-center gap-2 text-xs font-bold text-slate-400 group-hover:text-white">
                      <Download className="w-4 h-4" />
                      Download PDF
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 bg-white rounded-2xl border border-slate-200">
              <Activity className="w-8 h-8 text-teal-600 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">Research Methodology</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Our proprietary agent-led research model scores companies based on five dimensions of adaptiveness by analyzing operational cadence, strategic redirection, and signal transparency.
              </p>
              <button className="text-sm font-bold text-slate-900 flex items-center gap-2 hover:gap-3 transition-all">
                Learn about the Framework <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchPage;
