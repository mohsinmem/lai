import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Globe, Activity, ShieldCheck, ArrowRight, Target, Brain, ArrowDownUp, Minimize, FastForward, BookOpen, FileChartPie, Building2, BarChart3 } from 'lucide-react';

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
    <div className="min-h-screen pt-32 bg-slate-50">
      
      {/* Hero Section */}
      <section className="container px-4 mx-auto mb-20">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-block px-4 py-1.5 bg-teal-50 text-teal-700 text-xs font-bold uppercase tracking-widest rounded-full mb-6">
              Research & Insights
            </span>
            <h1 className="text-4xl md:text-6xl font-serif text-slate-900 mb-6 leading-tight">
              Advancing the global understanding and measurement of leadership adaptiveness.
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed font-light">
              The modern organization operates within an ecosystem defined by perpetual, compounding volatility, where market shifts and geopolitical shocks occur with unprecedented frequency. To understand how leadership systems evolve under conditions of extreme uncertainty, the Leadership Adaptiveness Institute (LAI) serves as a global thought leadership engine and dedicated research body.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Core Foundation & Adaptiveness Gap */}
      <section className="bg-white py-24 border-y border-slate-200">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            
            {/* Left Column: Foundation */}
            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
            >
              <h2 className="text-3xl lg:text-4xl font-serif text-slate-900 mb-8">
                Our Foundation: The Behavioral Science of Adaptiveness
              </h2>
              <div className="space-y-6 text-lg text-slate-600 font-light leading-relaxed">
                <p>
                  Traditional leadership measurement often relies on perception-based surveys and static personality traits. The LAI takes a fundamentally different approach. Grounded in a decade of behavioral science and the AFERR model, our research is built upon data generated from over 20,000 high-fidelity leadership simulations involving more than 100,000 participants.
                </p>
                <div className="p-6 bg-slate-50 border-l-4 border-teal-600 rounded-r-2xl italic text-slate-700 my-8">
                  By observing leaders in simulated decision environments characterized by competing priorities and limited resources, we capture how leaders <strong>actually</strong> behave under pressure, rather than how they <strong>believe</strong> they will behave.
                </div>
                <p>
                  A primary focus of our research is identifying and closing the "Adaptiveness Gap"—the hidden distance between a leadership team’s intellectual recognition of a changing reality and the organization’s actual shift in execution and resource allocation.
                </p>
              </div>
            </motion.div>

            {/* Right Column: AFERR Breakdown */}
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="bg-slate-50 p-8 lg:p-12 rounded-3xl border border-slate-100 shadow-sm"
            >
              <h3 className="text-2xl font-serif text-slate-900 mb-8">The Five Dimensions of Corporate Resilience</h3>
              <p className="text-slate-600 mb-8">Through continuous data collection and the Global Leadership Adaptiveness Index (GLAI), our research explores the core behavioral dimensions:</p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                    <Target className="w-5 h-5 text-teal-700"/>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Signal Detection</h4>
                    <p className="text-slate-600 text-sm mt-1">Differentiating actionable signals from background noise.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                    <Brain className="w-5 h-5 text-teal-700"/>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Emotional Framing</h4>
                    <p className="text-slate-600 text-sm mt-1">Interpreting uncertainty with curiosity rather than a threat-based, defensive posture.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                    <ArrowDownUp className="w-5 h-5 text-teal-700"/>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Resource Reallocation</h4>
                    <p className="text-slate-600 text-sm mt-1">The velocity at which budgets and talent are shifted toward emerging priorities.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                    <Minimize className="w-5 h-5 text-teal-700"/>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Decision Alignment</h4>
                    <p className="text-slate-600 text-sm mt-1">Maintaining systemic coherence among leadership decisions.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                    <FastForward className="w-5 h-5 text-teal-700"/>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Execution Responsiveness</h4>
                    <p className="text-slate-600 text-sm mt-1">Translating new strategic understanding into rapid operational change.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Library & Live Feed */}
      <section className="py-24 bg-slate-50">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* The Research Library */}
            <div className="lg:col-span-5">
              <h2 className="text-3xl font-serif text-slate-900 mb-6">The Research Library</h2>
              <p className="text-lg text-slate-600 font-light mb-10">
                Our library provides leaders and organizations with the knowledge required to navigate disruption and benchmark their capabilities. The repository is continuously updated and organized into four core categories:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-teal-300 transition-colors group cursor-pointer">
                  <BookOpen className="w-8 h-8 text-teal-600 mb-4 group-hover:-translate-y-1 transition-transform" />
                  <h4 className="font-bold text-slate-900 mb-2 font-serif text-lg">Articles</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">In-depth explorations of the adaptiveness framework, featuring topics such as Leadership Under Uncertainty and Decision Alignment.</p>
                </div>
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-teal-300 transition-colors group cursor-pointer">
                  <FileChartPie className="w-8 h-8 text-teal-600 mb-4 group-hover:-translate-y-1 transition-transform" />
                  <h4 className="font-bold text-slate-900 mb-2 font-serif text-lg">Reports</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">Comprehensive publications, including the annual Global Adaptiveness Report, highlighting structural trends.</p>
                </div>
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-teal-300 transition-colors group cursor-pointer">
                  <Building2 className="w-8 h-8 text-teal-600 mb-4 group-hover:-translate-y-1 transition-transform" />
                  <h4 className="font-bold text-slate-900 mb-2 font-serif text-lg">Case Studies</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">Real-world analyses of organizations navigating complex strategic pivots and environmental shocks.</p>
                </div>
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-teal-300 transition-colors group cursor-pointer">
                  <BarChart3 className="w-8 h-8 text-teal-600 mb-4 group-hover:-translate-y-1 transition-transform" />
                  <h4 className="font-bold text-slate-900 mb-2 font-serif text-lg">Insights</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">Granular, data-driven perspectives from the Global Leadership Adaptiveness Map (GLAM) across different executive roles.</p>
                </div>
              </div>
            </div>

            {/* Live Global Signals (GLAM Data Feed) */}
            <div className="lg:col-span-7">
              <div className="bg-slate-900 rounded-3xl p-6 md:p-10 shadow-2xl text-white h-full border border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-8 border-b border-slate-800">
                  <div>
                    <h2 className="text-2xl font-serif">Live Global Signals (GLAM)</h2>
                    <p className="text-slate-400 text-xs mt-1">Real-time signal extraction from the Orion Scout network.</p>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/30 px-3 py-1.5 rounded-full border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    Tracking Active
                  </div>
                </div>

                <div className="h-[500px] overflow-y-auto pr-2 custom-scrollbar space-y-4">
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-40 bg-slate-800/50 animate-pulse rounded-2xl" />
                      ))}
                    </div>
                  ) : signals.length > 0 ? (
                    signals.map((signal, index) => (
                      <motion.div
                        key={signal.id || index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-6 bg-slate-800/40 rounded-2xl border border-slate-700/50 hover:bg-slate-800/80 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-lg font-bold text-slate-100">{signal.company_name}</h3>
                              <span className="px-2 py-0.5 bg-slate-700 text-slate-300 text-[10px] font-bold uppercase rounded">
                                {signal.region}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest">
                              {new Date(signal.last_researched).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-serif font-bold text-teal-400">
                              {signal.adaptiveness_score}
                            </div>
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">LAI Score</p>
                          </div>
                        </div>
                        
                        <div className="text-sm text-slate-300 mb-4 border-l-2 border-slate-600 pl-4 py-1 italic font-light">
                          "{signal.research_notes}"
                        </div>

                        <div className="flex items-center gap-2 text-[10px] font-bold text-teal-500 uppercase">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Authenticated Pipeline
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                      <Globe className="w-12 h-12 text-slate-700 mb-4 animate-spin-slow" />
                      <h3 className="text-lg font-medium text-slate-300 mb-2">Awaiting Intelligence</h3>
                      <p className="text-sm text-slate-500 max-w-sm">
                        The Orion intelligence agents are actively scanning for new behavioral signals.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Explore CTA */}
      <section className="py-32 bg-white text-center border-t border-slate-200">
        <div className="container px-4 mx-auto max-w-3xl">
          <h2 className="text-4xl lg:text-5xl font-serif text-slate-900 mb-6">Explore the Research</h2>
          <p className="text-xl text-slate-600 font-light leading-relaxed mb-12">
            Dive into our latest publications below to understand the structural realities of global corporate resilience, or contribute to our ongoing research by benchmarking your own leadership team's adaptiveness profile.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button className="w-full sm:w-auto px-8 py-4 bg-teal-700 hover:bg-teal-800 text-white rounded-full font-bold transition-all shadow-lg hover:shadow-teal-900/20 text-sm tracking-wide">
              Access Resource Library
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-full font-bold transition-all text-sm tracking-wide">
              Benchmark Your Team
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ResearchPage;

