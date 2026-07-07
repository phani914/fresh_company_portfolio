import React, { useState } from 'react';
import { Share2, Mail, ShieldCheck, Users, Sparkles } from 'lucide-react';

export default function TeamPage({ team = [] }) {
  const [activeDept, setActiveDept] = useState("All");

  const departments = ["All", ...new Set(team.map(m => m.department))];

  const filteredTeam = activeDept === "All" ? team : team.filter(m => m.department === activeDept);

  return (
    <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-2">Our Architecture Faculty</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">
          Meet the Minds Behind the Mesh
        </h1>
        <p className="text-lg text-slate-300 leading-relaxed">
          Our engineering team blends veteran Silicon Valley software architects, AI research scientists, and cybersecurity specialists committed to engineering flawless enterprise software.
        </p>
      </div>

      {/* Department Filter Tabs */}
      {departments.length > 2 && (
        <div className="flex flex-wrap items-center justify-center gap-2 mb-16">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setActiveDept(dept)}
              className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeDept === dept
                  ? 'bg-gradient-to-r from-emerald-600 to-cyan-500 text-white shadow-md shadow-emerald-500/30 scale-105'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      )}

      {/* Team Roster Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredTeam.map((member) => (
          <div key={member.id} className="glass-card !p-0 overflow-hidden flex flex-col group border-slate-800 hover:border-emerald-500/50">
            <div className="relative h-72 overflow-hidden bg-slate-950">
              <img
                src={member.photo_url}
                alt={member.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
              
              <span className="absolute bottom-3 left-3 badge badge-emerald !text-[10px] bg-slate-900/90 backdrop-blur-md">
                {member.department}
              </span>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between -mt-4 relative z-10 bg-slate-900/95 backdrop-blur-xl rounded-t-2xl border-t border-white/10">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {member.name}
                  </h3>
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" title="Verified Staff" />
                </div>
                <span className="text-xs font-semibold text-cyan-400 block mb-4">{member.title}</span>
                <p className="text-slate-300 text-xs leading-relaxed mb-6">
                  {member.bio}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">ID: MI-{member.id + 100}</span>
                <div className="flex items-center gap-2">
                  {member.linkedin_url && (
                    <a
                      href={member.linkedin_url}
                      target="_blank"
                      rel="noreferrer"
                      className="w-8 h-8 rounded-lg bg-white/5 hover:bg-blue-600 hover:text-white flex items-center justify-center text-slate-300 transition-all"
                      title="LinkedIn Profile"
                    >
                      <Share2 className="w-4 h-4" />
                    </a>
                  )}
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="w-8 h-8 rounded-lg bg-white/5 hover:bg-emerald-600 hover:text-white flex items-center justify-center text-slate-300 transition-all"
                      title="Email Direct"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
