import React from 'react';
import { motion } from 'framer-motion';
import { Target, Microscope, Globe, Lightbulb, Activity, Database, Users, GraduationCap, Building, Server, ChevronRight } from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const AdvisorySection = ({ title, subtitle, items, icon: Icon }) => (
  <motion.div variants={fadeIn} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 hover:shadow-md transition-shadow">
    <div className="flex items-center gap-4 mb-6">
      <div className="p-3 bg-teal-50 rounded-xl text-teal-600">
        <Icon size={24} />
      </div>
      <div>
        <h3 className="text-xl font-bold text-[#0a192f]">{title}</h3>
        <p className="text-sm font-medium text-teal-600">{subtitle}</p>
      </div>
    </div>
    <ul className="space-y-4">
      {items.map((item, idx) => (
        <li key={idx} className="flex flex-col border-b border-slate-50 pb-4 last:border-0 last:pb-0">
          <span className="font-semibold text-slate-800">{item.name}</span>
          {item.expertise && <span className="text-sm text-slate-500 mt-1">{item.expertise}</span>}
        </li>
      ))}
    </ul>
  </motion.div>
);

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[#0a192f] text-white">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-teal-400 via-[#0a192f] to-[#0a192f]"></div>
        </div>

        <div className="container relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.h1 variants={fadeIn} className="text-5xl md:text-6xl font-serif font-bold text-white mb-6">
              About the Leadership Adaptiveness Institute
            </motion.h1>
            <motion.p variants={fadeIn} className="text-xl text-slate-300 leading-relaxed mb-8">
              The Leadership Adaptiveness Institute (LAI) exists to advance the global understanding and measurement of leadership adaptiveness. In an era defined by perpetual market shifts, technological disruption, and geopolitical shocks, traditional leadership paradigms are no longer sufficient.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Pillars Section */}
      <section className="py-24 bg-white">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid lg:grid-cols-2 gap-16 items-center"
          >
            <div>
              <motion.h2 variants={fadeIn} className="text-4xl font-serif text-[#0a192f] mb-6">Our Mission</motion.h2>
              <motion.div variants={fadeIn} className="prose prose-lg text-slate-600">
                <p className="mb-4">
                  Our primary intent is to help organizations close the <strong>"Adaptiveness Gap"</strong>—the critical distance between a leadership team's intellectual recognition of a changing reality and the organization's actual shift in execution and resource allocation.
                </p>
                <p>
                  To achieve this, our mission is built on four pillars:
                </p>
              </motion.div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { icon: Target, text: "Establish leadership adaptiveness as a measurable, behavioral capability." },
                { icon: Microscope, text: "Advance scientific research into how leaders and teams respond to complex environments." },
                { icon: Globe, text: "Create robust global benchmarks allowing organizations to understand their adaptiveness relative to peers." },
                { icon: Lightbulb, text: "Provide actionable knowledge and insights that synchronize strategic intent with operational reality." }
              ].map((pillar, idx) => (
                <motion.div key={idx} variants={fadeIn} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:border-teal-200 transition-colors">
                  <pillar.icon className="text-teal-600 mb-4" size={32} />
                  <p className="text-slate-700 text-sm font-medium">{pillar.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pedigree Section */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-16">
              <motion.h2 variants={fadeIn} className="text-4xl font-serif text-[#0a192f] mb-6">Our Pedigree and Scientific Foundation</motion.h2>
              <motion.div variants={fadeIn} className="w-24 h-1 bg-teal-500 mx-auto rounded-full"></motion.div>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <motion.div variants={fadeIn} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-bl-full -z-0 opacity-50"></div>
                <Activity className="text-teal-600 w-12 h-12 mb-6 relative z-10" />
                <h3 className="text-2xl font-serif text-[#0a192f] mb-4 relative z-10">Measurable Behavior</h3>
                <p className="text-slate-600 leading-relaxed relative z-10">
                  Adaptiveness is not a stated belief; it is a measurable behavior. The Institute's framework is grounded in over a decade of behavioral science research utilizing the AFERR model (Activation, Forecasting, Experimentation, Realization, Reflection).
                </p>
              </motion.div>

              <motion.div variants={fadeIn} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#0a192f]/5 rounded-bl-full -z-0"></div>
                <Database className="text-[#0a192f] w-12 h-12 mb-6 relative z-10" />
                <h3 className="text-2xl font-serif text-[#0a192f] mb-4 relative z-10">Empirical Baseline</h3>
                <p className="text-slate-600 leading-relaxed relative z-10">
                  Developed from an empirical baseline of over 20,000 high-fidelity leadership simulations involving more than 100,000 global participants. Rather than relying on perception-based surveys, we use the Evivve simulation engine to capture real-time decisions under pressure.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Network & Advisors */}
      <section className="py-24 bg-white">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mb-16 text-center max-w-3xl mx-auto"
          >
            <motion.h2 variants={fadeIn} className="text-4xl font-serif text-[#0a192f] mb-6">A Global Effort: Our Network of Experts</motion.h2>
            <motion.p variants={fadeIn} className="text-lg text-slate-600">
              Institutionalizing leadership adaptiveness requires a coordinated, global collaborative effort. The Institute is supported by a distinguished coalition of researchers, corporate dignitaries, and institutional partners.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <AdvisorySection
              title="The Global Advisory Board"
              subtitle="[ XX ] Global Industry Dignitaries & Executive Leaders"
              icon={Building}
              items={[
                { name: "[Insert Name]", expertise: "Expertise: Global Supply Chain Resilience" },
                { name: "[Insert Name]", expertise: "Expertise: Digital Transformation & AI Integration" },
                { name: "[Insert Name]", expertise: "Expertise: Geopolitical Strategy" },
                { name: "(... space for additional dignitaries...)", expertise: "" },
              ]}
            />

            <AdvisorySection
              title="Research & Behavioral Science Council"
              subtitle="[ XX ] Lead Behavioral Scientists & Psychometricians"
              icon={Microscope}
              items={[
                { name: "Mohsin Memon", expertise: "Developer of the AFERR Model & Founder of Evivve – Expertise: Gamified Behavioral Science & Applied Behavioral Intelligence" },
                { name: "[Insert Name]", expertise: "Expertise: Cognitive Load & Executive Decision Making" },
                { name: "[Insert Name]", expertise: "Expertise: Organizational Psychology" },
                { name: "(... space for additional researchers...)", expertise: "" },
              ]}
            />

            <AdvisorySection
              title="Institutional & Academic Partners"
              subtitle="[ XX ] Global University & Think-Tank Partnerships"
              icon={GraduationCap}
              items={[
                { name: "[Insert Institution Name]", expertise: "Focus: Data Aggregation and Industry Benchmarking" },
                { name: "[Insert Institution Name]", expertise: "Focus: Cross-Cultural Leadership Dynamics" },
                { name: "[Insert Institution Name]", expertise: "Focus: Macroeconomic Resilience Studies" },
                { name: "(... space for additional institutions...)", expertise: "" },
              ]}
            />

            <AdvisorySection
              title="Technology & Simulation Contributors"
              subtitle="[ XX ] Platform Architects & Data Infrastructure Advisors"
              icon={Server}
              items={[
                { name: "The Evivve Platform Team", expertise: "Providing the core simulation engine for behavioral measurement." },
                { name: "[Insert Name/Company]", expertise: "Expertise: Geospatial Data Visualization (GLAM)" },
                { name: "[Insert Name/Company]", expertise: "Expertise: Multi-Tenant Database Security & Architecture" },
                { name: "(... space for additional technical supporters...)", expertise: "" },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Join the Effort CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#0a192f] text-white">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-teal-400 via-[#0a192f] to-[#0a192f]"></div>
        </div>

        <div className="container relative z-10 text-center max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeIn} className="text-4xl font-serif text-white mb-6">Join the Effort</motion.h2>
            <motion.p variants={fadeIn} className="text-xl text-slate-300 leading-relaxed mb-10">
              The Institute continuously invites forward-thinking leaders, academic researchers, and organizations to contribute to this global intelligence network. By sharing insights and participating in our behavioral measurements, you help shape the future of organizational resilience.
            </motion.p>
            <motion.button variants={fadeIn} className="bg-teal-500 hover:bg-teal-400 text-white px-8 py-4 rounded-full font-bold text-lg transition-colors inline-flex items-center gap-2">
              Get Involved <ChevronRight size={20} className="stroke-[3]" />
            </motion.button>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;
