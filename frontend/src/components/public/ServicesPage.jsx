import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Cpu, Cloud, Smartphone, Database, Layout, ArrowRight, X, CheckCircle2, Terminal, Layers } from 'lucide-react';

export default function ServicesPage({ services = [] }) {
  const [selectedService, setSelectedService] = useState(null);

  const getIcon = (name, size = "w-8 h-8") => {
    switch (name) {
      case 'Globe': return <Globe className={`${size} text-blue-400`} />;
      case 'Cloud': return <Cloud className={`${size} text-cyan-400`} />;
      case 'Cpu': return <Cpu className={`${size} text-emerald-400`} />;
      case 'Smartphone': return <Smartphone className={`${size} text-amber-400`} />;
      case 'Database': return <Database className={`${size} text-rose-400`} />;
      default: return <Layout className={`${size} text-blue-400`} />;
    }
  };

  return (
    <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-400 block mb-2">Service Showcase</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">
          Architecting High-Throughput Digital Offerings
        </h1>
        <p className="text-lg text-slate-300 leading-relaxed">
          From multi-cloud Kubernetes clusters to sub-millisecond trading algorithms and custom AI LLM pipelines, explore our comprehensive technical capabilities. Click any service for an architectural deep-dive.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {services.map((svc) => (
          <div
            key={svc.id}
            onClick={() => setSelectedService(svc)}
            className="glass-card flex flex-col justify-between cursor-pointer group hover:border-cyan-500/50"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {getIcon(svc.icon_name)}
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                {svc.title}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                {svc.short_description}
              </p>
            </div>

            <div>
              <div className="flex flex-wrap gap-1.5 mb-6">
                {svc.tech_stack?.split(',').slice(0, 3).map((tech, idx) => (
                  <span key={idx} className="badge badge-blue !text-[10px]">
                    {tech.trim()}
                  </span>
                ))}
              </div>
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-cyan-400 group-hover:text-white transition-colors">
                <span>View Technical Workflow</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Deep-Dive Modal (Section 10 of SRS) */}
      {selectedService && (
        <div className="modal-overlay" onClick={() => setSelectedService(null)}>
          <div className="modal-content !max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between border-b border-white/10 pb-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">
                  {getIcon(selectedService.icon_name, "w-8 h-8 text-white")}
                </div>
                <div>
                  <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">
                    Technical Specification
                  </span>
                  <h3 className="text-2xl font-extrabold text-white">{selectedService.title}</h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6 text-slate-300">
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-400" /> Executive Overview
                </h4>
                <p className="text-sm leading-relaxed">{selectedService.short_description}</p>
              </div>

              <div className="bg-slate-900/80 rounded-xl p-5 border border-white/10">
                <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" /> Engineering Workflow & Methodology
                </h4>
                <p className="text-sm leading-relaxed whitespace-pre-line text-slate-200 font-mono text-xs">
                  {selectedService.detailed_workflow}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Matching Technology Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedService.tech_stack?.split(',').map((tech, idx) => (
                    <span key={idx} className="badge badge-emerald !text-xs !py-1 !px-3 font-mono">
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {selectedService.case_study_summary && (
                <div className="bg-blue-950/30 border border-blue-500/30 rounded-xl p-5">
                  <h4 className="text-xs font-bold text-blue-300 uppercase tracking-wider mb-2">
                    Proven Impact & Case Study Notice
                  </h4>
                  <p className="text-xs leading-relaxed text-slate-300">
                    {selectedService.case_study_summary}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-6 mt-8 border-t border-white/10 flex flex-wrap items-center justify-end gap-3">
              <button onClick={() => setSelectedService(null)} className="btn btn-secondary !py-2 !px-5 text-xs">
                Close Modal
              </button>
              <Link to="/contact" onClick={() => setSelectedService(null)} className="btn btn-primary !py-2 !px-6 text-xs">
                Request Service Consultation
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
