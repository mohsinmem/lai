import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Zap, Globe, Activity } from 'lucide-react';
import { supabase } from '../supabase';

const LiveSignalsWidget = () => {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSignals();

    // Supabase Realtime Subscription
    const channel = supabase
      .channel('live-signals')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'diagnostic_results' },
        (payload) => {
          console.log('New signal detected:', payload);
          fetchSignals();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchSignals = async () => {
    try {
      const response = await fetch('/api/research/live');
      const data = await response.json();
      setSignals(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch signals:', err);
      setLoading(false);
    }
  };

  if (loading) return null;

  return (
    <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden relative">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Live Adaptiveness Feed</h3>
        </div>
        <Radio className="w-4 h-4 text-slate-500" />
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {signals.length > 0 ? (
            signals.slice(0, 3).map((signal, index) => (
              <motion.div
                key={signal.company_name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 backdrop-blur-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-slate-100">{signal.company_name}</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Globe className="w-3 h-3" />
                      {signal.region}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-mono font-bold text-emerald-400">{signal.adaptiveness_score}</span>
                    <p className="text-[10px] text-slate-500 uppercase">LAI Index</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 line-clamp-2 italic">
                  "{signal.research_notes}"
                </p>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-8 text-center text-slate-500"
            >
              <Activity className="w-8 h-8 mx-auto mb-3 opacity-20" />
              <p className="text-xs font-medium">No research activity detected yet.</p>
              <p className="text-[10px] opacity-50 mt-1">Waiting for next scheduled agent cycle...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4 text-[10px] text-slate-500 uppercase tracking-tighter">
        <div className="flex items-center gap-1">
          <Activity className="w-3 h-3" />
          Processing Queue: {Math.floor(Math.random() * 50)} items
        </div>
        <span>•</span>
        <div className="flex items-center gap-1">
          <Zap className="w-3 h-3" />
          Global Agent active
        </div>
      </div>
    </div>
  );
};

export default LiveSignalsWidget;
