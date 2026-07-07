import React from 'react';
import { Target, Eye, Shield, Award, Users, CheckCircle, Rocket, HeartHandshake } from 'lucide-react';

export default function AboutUsPage({ profile, team = [] }) {
  const companyName = profile?.company_name || "Micro Infoweb";

  const milestones = [
    { year: "2016", title: "Foundation in Silicon Valley", description: "Established with a core engineering team focused on enterprise cloud architectures and high-performance APIs." },
    { year: "2018", title: "Global Expansion & SOC 2 Certification", description: "Opened distributed engineering labs across Europe and Asia while attaining SOC 2 Type II compliance." },
    { year: "2021", title: "AI & Big Data Division Launch", description: "Pioneered proprietary machine learning pipelines and real-time data lake architectures for Fortune 500 clients." },
    { year: "2024", title: "150+ Enterprise Projects Delivered", description: "Surpassed 150 successful deployments with a flawless 99.99% runtime SLA across global financial and medical verticals." },
    { year: "2026", title: "Next-Gen Design Systems", description: "Unveiled our ultra-responsive, glassmorphic UI/UX framework designed for accessibility and sub-100ms render speeds." },
  ];

  return (
    <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 block mb-2">About {companyName}</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">
          Pioneering the Future of Enterprise Software Architecture
        </h1>
        <p className="text-lg text-slate-300 leading-relaxed">
          We are a team of veteran systems architects, AI scientists, and award-winning designers dedicated to engineering robust digital ecosystems that withstand scale and security threats.
        </p>
      </div>

      {/* Mission / Vision / Values Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        <div className="glass-card flex flex-col justify-between border-blue-500/30">
          <div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-6">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Our Mission</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              To empower global enterprises by architecting fault-tolerant software systems that deliver measurable business growth, bulletproof data security, and unmatched human UX.
            </p>
          </div>
          <div className="pt-4 mt-6 border-t border-white/10 text-xs font-semibold text-blue-400 uppercase tracking-wider">
            Precision & Execution
          </div>
        </div>

        <div className="glass-card flex flex-col justify-between border-cyan-500/30">
          <div>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Our Vision</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              To be the world’s most trusted engineering partner for mission-critical digital transformations, recognized for zero-defect deployments and cutting-edge AI integrations.
            </p>
          </div>
          <div className="pt-4 mt-6 border-t border-white/10 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            Global Technical Leadership
          </div>
        </div>

        <div className="glass-card flex flex-col justify-between border-emerald-500/30">
          <div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Core Values</h3>
            <ul className="text-slate-300 text-sm space-y-2">
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> Zero-Trust Security First</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> Uncompromising Quality</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> Radical Transparency</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> Client Obsession</li>
            </ul>
          </div>
          <div className="pt-4 mt-6 border-t border-white/10 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            Integrity & Rigor
          </div>
        </div>
      </div>

      {/* Corporate History Timeline */}
      <div className="mb-24">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400 block mb-2">Our Evolution</span>
          <h2 className="text-3xl font-extrabold text-white">A Decade of Technical Excellence</h2>
        </div>

        <div className="relative border-l-2 border-blue-600/40 ml-4 md:ml-32 pl-8 space-y-12">
          {milestones.map((m, idx) => (
            <div key={idx} className="relative group">
              {/* Timeline dot */}
              <div className="absolute -left-[39px] top-1.5 w-5 h-5 rounded-full bg-slate-900 border-4 border-blue-500 group-hover:scale-125 transition-transform" />
              
              <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8">
                <span className="text-xl font-extrabold font-mono text-cyan-400 w-24 shrink-0">{m.year}</span>
                <div className="glass-card !p-6 flex-1">
                  <h4 className="text-lg font-bold text-white mb-2">{m.title}</h4>
                  <p className="text-slate-300 text-sm leading-relaxed">{m.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leadership Team Grid Preview */}
      {team.length > 0 && (
        <div className="pt-12 border-t border-slate-800">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-2">Leadership Roster</span>
            <h2 className="text-3xl font-extrabold text-white">Meet Our System Architects</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.slice(0, 4).map((member) => (
              <div key={member.id} className="glass-card !p-0 overflow-hidden flex flex-col group">
                <div className="relative h-64 overflow-hidden bg-slate-950">
                  <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 badge badge-blue !text-[10px]">
                    {member.department}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-0.5">{member.name}</h3>
                    <span className="text-xs font-semibold text-cyan-400 block mb-3">{member.title}</span>
                    <p className="text-slate-300 text-xs leading-relaxed line-clamp-3">{member.bio}</p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-white/10 flex justify-end">
                    <a href={member.linkedin_url || "#"} target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-400 hover:text-cyan-300 flex items-center gap-1">
                      <span>LinkedIn Profile</span>
                      <span>→</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
