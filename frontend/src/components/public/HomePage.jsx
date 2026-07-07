import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Star, ShieldCheck, Globe, Cpu, Cloud, Smartphone, Database, Layout, Sparkles, Award, TrendingUp, Users } from 'lucide-react';

export default function HomePage({ profile, services = [], projects = [], testimonials = [] }) {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Auto-rotate testimonial carousel
  useEffect(() => {
    if (!testimonials || testimonials.length === 0) return;
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials]);

  const companyName = profile?.company_name || "Micro Infoweb";
  const tagline = profile?.tagline || "Architecting Digital Excellence for Tomorrow's Enterprises";

  const getIcon = (name) => {
    switch (name) {
      case 'Globe': return <Globe className="w-8 h-8 text-blue-400" />;
      case 'Cloud': return <Cloud className="w-8 h-8 text-cyan-400" />;
      case 'Cpu': return <Cpu className="w-8 h-8 text-emerald-400" />;
      case 'Smartphone': return <Smartphone className="w-8 h-8 text-amber-400" />;
      case 'Database': return <Database className="w-8 h-8 text-rose-400" />;
      default: return <Layout className="w-8 h-8 text-blue-400" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. High-Impact Hero Section */}
      <section className="relative pt-20 pb-28 overflow-hidden">
        {/* Glowing Background Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/20 to-cyan-500/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Value Statement & CTAs */}
            <div className="lg:col-span-7 flex flex-col gap-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-cyan-300 text-xs font-bold uppercase tracking-widest w-fit animate-bounce">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Next-Generation Software Engineering</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
                Empowering Brands Through <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400">Intelligent Digital Systems</span>
              </h1>

              <p className="text-lg text-slate-300 font-normal leading-relaxed max-w-2xl">
                At <strong className="text-white font-semibold">{companyName}</strong>, we translate complex business objectives into high-performance web platforms, cloud-native architectures, and AI-driven mobile solutions engineered for zero-trust security and exponential scalability.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link to="/contact" className="btn btn-primary !py-3.5 !px-8 text-base shadow-lg shadow-blue-600/40">
                  <span>Start Your Transformation</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/projects" className="btn btn-secondary !py-3.5 !px-6 text-base border-slate-700 hover:border-slate-500">
                  <span>Explore Case Studies</span>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>ISO & SOC 2 Compliant Arch</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>99.99% Uptime SLA Guaranteed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Dedicated QA & Testing Labs</span>
                </div>
              </div>
            </div>

            {/* Right Column: Dynamic Isometric Cube Illustration & Interactive Card */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md aspect-square rounded-3xl bg-gradient-to-br from-blue-900/30 via-slate-900/60 to-cyan-900/30 border border-white/15 p-8 flex flex-col justify-between shadow-2xl shadow-blue-950/50 backdrop-blur-xl animate-float">
                {/* Top bar inside graphic */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500" />
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-xs font-mono text-cyan-400 bg-cyan-950/50 px-2.5 py-1 rounded border border-cyan-800">
                    STATUS: ACTIVE MESH
                  </span>
                </div>

                {/* Isometric Cube Visual Representation */}
                <div className="my-auto py-8 flex flex-col items-center justify-center text-center">
                  <div className="w-28 h-28 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-1 shadow-2xl shadow-cyan-500/50 flex items-center justify-center rotate-12 hover:rotate-0 transition-transform duration-500 cursor-pointer">
                    <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
                      <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                        MI
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mt-6">{companyName} Core Engine</h3>
                  <p className="text-xs text-slate-400 max-w-xs mt-1">
                    Real-time microservices communication, automated threat protection, and sub-millisecond data delivery.
                  </p>
                </div>

                {/* Bottom live stats inside graphic */}
                <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-4 text-center">
                  <div className="bg-white/5 rounded-xl p-2.5">
                    <span className="block text-lg font-bold text-emerald-400 font-mono">150 ms</span>
                    <span className="text-[10px] text-slate-400 uppercase">Avg Response Time</span>
                  </div>
                  <div className="bg-white/5 rounded-xl p-2.5">
                    <span className="block text-lg font-bold text-cyan-400 font-mono">100% Secure</span>
                    <span className="text-[10px] text-slate-400 uppercase">Memory-Hard Auth</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Real-Time Counter Statistics Section */}
      <section className="bg-slate-900/80 border-y border-slate-800/80 py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="glass-card !p-6 text-center flex flex-col items-center justify-center">
              <Award className="w-8 h-8 text-blue-500 mb-2" />
              <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">150+</span>
              <span className="text-xs sm:text-sm font-semibold text-slate-300 uppercase tracking-wider mt-1">Enterprise Projects Delivered</span>
            </div>
            <div className="glass-card !p-6 text-center flex flex-col items-center justify-center">
              <TrendingUp className="w-8 h-8 text-cyan-400 mb-2" />
              <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">99.99%</span>
              <span className="text-xs sm:text-sm font-semibold text-slate-300 uppercase tracking-wider mt-1">Runtime Availability SLA</span>
            </div>
            <div className="glass-card !p-6 text-center flex flex-col items-center justify-center">
              <Users className="w-8 h-8 text-emerald-400 mb-2" />
              <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">50+</span>
              <span className="text-xs sm:text-sm font-semibold text-slate-300 uppercase tracking-wider mt-1">Global Corporate Clients</span>
            </div>
            <div className="glass-card !p-6 text-center flex flex-col items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-amber-400 mb-2" />
              <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">10+</span>
              <span className="text-xs sm:text-sm font-semibold text-slate-300 uppercase tracking-wider mt-1">Years of Architectural Innovation</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Services Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 block mb-2">Our Capabilities</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Engineered for Technical Superiority</h2>
          </div>
          <Link to="/services" className="btn btn-secondary !py-2.5 !px-5 text-sm w-fit">
            <span>View All Services</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.slice(0, 3).map((svc) => (
            <div key={svc.id} className="glass-card flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center justify-center mb-6 shadow-inner">
                  {getIcon(svc.icon_name)}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{svc.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  {svc.short_description}
                </p>
              </div>
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-800">
                  {svc.tech_stack?.split(',')[0] || 'Modern Stack'}
                </span>
                <Link to="/services" className="text-sm font-semibold text-blue-400 hover:text-cyan-300 flex items-center gap-1">
                  <span>Explore Workflow</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Featured Case Studies Preview */}
      <section className="py-24 bg-slate-900/50 border-t border-slate-800 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400 block mb-2">Project Showcase</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Featured Success Stories</h2>
            </div>
            <Link to="/projects" className="btn btn-primary !py-2.5 !px-5 text-sm w-fit">
              <span>Explore Complete Portfolio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.slice(0, 2).map((proj) => (
              <div key={proj.id} className="glass-card !p-0 overflow-hidden group flex flex-col">
                <div className="relative h-64 overflow-hidden bg-slate-950">
                  <img
                    src={proj.media_url}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  <span className="absolute top-4 right-4 badge badge-blue bg-slate-900/90 backdrop-blur-md">
                    {proj.category}
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block mb-1">
                      Client: {proj.client_name} • Timeline: {proj.timeline}
                    </span>
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                      {proj.title}
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed mb-6">
                      {proj.short_description}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-white/10">
                    {proj.tech_stack_tags && proj.tech_stack_tags.map((tag, idx) => (
                      <span key={idx} className="badge badge-cyan text-[10px]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Interactive Testimonial Carousel */}
      {testimonials.length > 0 && (
        <section className="py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-2">Client Endorsements</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-12">Trusted by Industry Leaders</h2>

          <div className="glass-card !p-10 md:!p-16 relative">
            <div className="flex justify-center mb-6">
              {[...Array(testimonials[activeTestimonial]?.star_rating || 5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-amber-400 fill-amber-400 inline-block" />
              ))}
            </div>
            <blockquote className="text-xl sm:text-2xl text-slate-100 font-medium italic leading-relaxed mb-8 max-w-3xl mx-auto">
              "{testimonials[activeTestimonial]?.quote}"
            </blockquote>
            <div className="flex flex-col items-center justify-center">
              <span className="font-bold text-lg text-white">
                {testimonials[activeTestimonial]?.client_name}
              </span>
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mt-0.5">
                {testimonials[activeTestimonial]?.reviewer_title} • {testimonials[activeTestimonial]?.company_name}
              </span>
            </div>

            {/* Carousel indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTestimonial(idx)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    idx === activeTestimonial ? 'bg-blue-500 w-8' : 'bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. Call-to-Action Banner */}
      <section className="py-20 bg-gradient-to-r from-blue-900/60 via-slate-900 to-cyan-900/60 border-t border-slate-800 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Ready to Accelerate Your Digital Roadmap?
          </h2>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-8">
            Connect with our system architects for a secure, zero-obligation consultation and comprehensive architectural assessment.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="btn btn-primary !py-3.5 !px-8 text-base shadow-xl">
              <span>Schedule Technical Consultation</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/about" className="btn btn-secondary !py-3.5 !px-6 text-base">
              <span>Learn About Our Methodology</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
