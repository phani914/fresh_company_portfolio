import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Calendar, User, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function ProjectsPage({ projects = [] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", "Web Dev", "Mobile", "Cloud", "AI & Data"];

  const filteredProjects = projects.filter((proj) => {
    const matchesCategory = activeCategory === "All" || proj.category === activeCategory;
    const matchesSearch =
      proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.short_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (proj.tech_stack_tags && proj.tech_stack_tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 block mb-2">Case Studies & Success Stories</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">
          Architecting Enterprise Triumphs
        </h1>
        <p className="text-lg text-slate-300 leading-relaxed">
          Explore our portfolio of high-frequency trading portals, HIPAA-compliant AI medical apps, and multi-cloud Kubernetes migrations. Filter by domain or search by technology stack.
        </p>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="glass-panel !p-6 mb-16 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-center md:justify-start">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/30 scale-105'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Live Search Box */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search projects, clients, tech..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input !pl-10 !py-2 !text-sm !rounded-xl w-full"
          />
        </div>
      </div>

      {/* Projects Catalog Grid */}
      {filteredProjects.length === 0 ? (
        <div className="glass-card text-center py-16">
          <p className="text-slate-400 text-base mb-4">No projects match your filter or search query.</p>
          <button
            onClick={() => { setActiveCategory("All"); setSearchQuery(""); }}
            className="btn btn-secondary !py-2 !px-4 text-xs"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {filteredProjects.map((proj) => (
            <div key={proj.id} className="glass-card !p-0 overflow-hidden flex flex-col group border-slate-800 hover:border-blue-500/50">
              <div className="relative h-72 overflow-hidden bg-slate-950">
                <img
                  src={proj.media_url}
                  alt={proj.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="badge badge-blue !text-[10px] bg-slate-900/90 backdrop-blur-md">
                    {proj.category}
                  </span>
                  {proj.is_featured && (
                    <span className="badge badge-amber !text-[10px] bg-slate-900/90 backdrop-blur-md">
                      ★ Featured
                    </span>
                  )}
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col justify-between -mt-6 relative z-10 bg-slate-900/90 backdrop-blur-xl rounded-t-3xl border-t border-white/10">
                <div>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-cyan-400 mb-3">
                    <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {proj.client_name}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {proj.timeline}</span>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                    {proj.title}
                  </h3>

                  <p className="text-slate-300 text-sm leading-relaxed mb-6">
                    {proj.detailed_description || proj.short_description}
                  </p>
                </div>

                <div>
                  <div className="mb-6">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Technical Architecture</span>
                    <div className="flex flex-wrap gap-1.5">
                      {proj.tech_stack_tags && proj.tech_stack_tags.map((tag, idx) => (
                        <span key={idx} className="badge badge-cyan !text-[10px] font-mono">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-5 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified Production SLA
                    </span>
                    <Link to="/contact" className="text-xs font-bold text-white hover:text-cyan-300 flex items-center gap-1 bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-lg transition-colors">
                      <span>Request Similar Build</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
