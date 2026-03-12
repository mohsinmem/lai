import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Globe, Activity, ShieldCheck, ArrowRight, Target, Brain, ArrowDownUp, Minimize, FastForward, BookOpen, FileChartPie, Building2, BarChart3 } from 'lucide-react';

const ResearchPage = () => {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  const resources = [
    {
      id: 1,
      title: "The AFERR Model: Behavioral Foundations",
      type: "Google Slides",
      category: "Framework",
      description: "A comprehensive deck outlining the behavioral science behind the Activation-Forecasting-Reflection loop.",
      link: "#",
      icon: <Target className="w-5 h-5 text-amber-500" />
    },
    {
      id: 2,
      title: "Global Leadership Resilience Report 2025",
      type: "PDF Report",
      category: "Report",
      description: "Statistical analysis of 100,000+ simulation data points across 40 countries.",
      link: "#",
      icon: <FileChartPie className="w-5 h-5 text-red-500" />
    },
    {
      id: 3,
      title: "Adaptive Strategy Whitepaper",
      type: "Google Doc",
      category: "Article",
      description: "Directives for CHROs on closing the Adaptiveness Gap in executive leadership.",
      link: "#",
      icon: <FileText className="w-5 h-5 text-blue-500" />
    },
    {
      id: 4,
      title: "Case Study: Geopolitical Pivot 2024",
      type: "PDF Case Study",
      category: "Case Study",
      description: "Anonymized analysis of a Fortune 500 company's response to supply chain volatility.",
      link: "#",
      icon: <Building2 className="w-5 h-5 text-teal-500" />
    },
    {
        id: 5,
        title: "Leadership Benchmarking Framework",
        type: "Google Slides",
        category: "Framework",
        description: "Standardized methodology for measuring executive coherence velocity.",
        link: "#",
        icon: <BarChart3 className="w-5 h-5 text-amber-500" />
    }
  ];

  const filteredResources = activeFilter === 'All' 
    ? resources 
    : resources.filter(r => r.category === activeFilter || r.type.includes(activeFilter));

  useEffect(() => {
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
    fetchSignals();
  }, []);

  return (
    <div className="min-h-screen pt-32 bg-slate-50 font-['Inter']">
      
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

      {/* Library Section */}
      <section className="py-24 bg-slate-50 overflow-hidden">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-serif text-slate-900 mb-4">The Research Library</h2>
              <p className="text-lg text-slate-600 font-light max-w-2xl">
                Our library provides leaders with the knowledge required to navigate disruption. The repository is continuously updated across our core diagnostic domains.
              </p>
            </div>
            
            {/* Filter Bar */}
            <div className="flex flex-wrap gap-2">
              {['All', 'Framework', 'Report', 'Case Study', 'Article'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                    activeFilter === filter 
                      ? 'bg-teal-700 text-white shadow-md' 
                      : 'bg-white text-slate-500 border border-slate-200 hover:border-teal-200 shadow-sm'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredResources.map((resource) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={resource.id}
                className="p-8 bg-white rounded-3xl shadow-sm border border-slate-100 hover:border-teal-300 hover:shadow-xl hover:shadow-teal-900/5 transition-all group flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-teal-50 transition-colors">
                    {resource.icon}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100 italic">
                    {resource.type}
                  </span>
                </div>
                
                <h3 className="text-xl font-serif text-slate-900 mb-3 group-hover:text-teal-700 transition-colors">
                  {resource.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-8 flex-grow font-light">
                  {resource.description}
                </p>
                
                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">
                    {resource.category}
                  </span>
                  <a 
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-slate-900 font-bold text-sm group-hover:translate-x-1 transition-transform"
                  >
                    View Resource <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Global Signals (GLAM Data Feed) */}
      <section className="py-24 bg-white border-y border-slate-200">
        <div className="container px-4 mx-auto">
          <div className="bg-slate-900 rounded-[3rem] p-8 md:p-16 shadow-2xl text-white border border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -ml-48 -mb-48" />
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12 pb-12 border-b border-slate-800">
                <div className="max-w-xl">
                  <h2 className="text-3xl lg:text-4xl font-serif mb-4">Live Global Signals (GLAM)</h2>
                  <p className="text-slate-400 font-light leading-relaxed">
                    Real-time signal extraction from the Orion Scout network. Monitoring leadership adaptiveness profiles across 10,000+ global entities.
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/30 px-6 py-3 rounded-full border border-emerald-500/20 shadow-[0_0_25px_rgba(16,185,129,0.15)]">
                  <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  Orion Scout Live
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
                {loading ? (
                  <div className="space-y-6">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-44 bg-slate-800/40 animate-pulse rounded-[2rem] border border-slate-800" />
                    ))}
                  </div>
                ) : signals.length > 0 ? (
                  signals.map((signal, index) => (
                    <motion.div
                      key={signal.id || index}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-8 bg-slate-800/30 rounded-[2rem] border border-slate-700/50 hover:bg-slate-800/60 hover:border-teal-500/30 transition-all group"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                        <div>
                          <div className="flex items-center gap-4 mb-2">
                            <h3 className="text-xl font-bold text-slate-100">{signal.company_name}</h3>
                            <span className="px-3 py-1 bg-slate-700/50 text-slate-300 text-[10px] font-bold uppercase tracking-widest rounded-full border border-slate-600">
                              {signal.region}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                            Detected {new Date(signal.last_researched).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-4xl font-serif font-bold text-teal-400 mb-1">
                            {signal.adaptiveness_score}
                          </div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Benchmark Rating</p>
                        </div>
                      </div>
                      
                      <div className="text-sm text-slate-300 mb-6 border-l-2 border-teal-500/50 pl-6 py-2 italic font-light leading-relaxed">
                        "{signal.research_notes}"
                      </div>

                      <div className="flex items-center gap-3 text-[10px] font-bold text-teal-500 uppercase tracking-widest">
                        <Activity className="w-4 h-4" />
                        AFERR Logic Sequence Validated
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-20 flex flex-col items-center justify-center p-8 text-center bg-slate-800/20 rounded-[2rem] border border-dashed border-slate-700">
                    <Globe className="w-16 h-16 text-slate-800 mb-6" />
                    <h3 className="text-2xl font-serif text-slate-300 mb-4">Awaiting Intelligence Signals</h3>
                    <p className="text-slate-500 max-w-sm font-light">
                      The Orion network is scanning. New behavioral data will appear here as leadership signals are extracted and verified.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore CTA */}
      <section className="py-32 bg-slate-50 text-center relative overflow-hidden">
        <div className="container px-4 mx-auto max-w-3xl relative z-10">
          <h2 className="text-4xl lg:text-5xl font-serif text-slate-900 mb-8">Contribute to the Map</h2>
          <p className="text-xl text-slate-600 font-light leading-relaxed mb-12">
            The LAI research engine thrives on data. Contribute to our understanding of global organizational resilience by benchmarking your leadership team or exploring the depth of our open library.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <button className="w-full sm:w-auto px-10 py-5 bg-teal-700 hover:bg-teal-800 text-white rounded-full font-bold transition-all shadow-xl shadow-teal-900/20 text-sm tracking-wide transform hover:-translate-y-1">
              Explore Resource Library
            </button>
            <button 
                onClick={() => window.location.href = '/diagnostic'}
                className="w-full sm:w-auto px-10 py-5 bg-white hover:bg-slate-50 text-slate-900 rounded-full font-bold transition-all border border-slate-200 text-sm tracking-wide shadow-sm transform hover:-translate-y-1"
            >
              Benchmark Your Team
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ResearchPage;
