import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Mail, Phone, MapPin, ArrowUpRight, ShieldCheck, Heart } from 'lucide-react';

export default function Footer({ profile }) {
  const companyName = profile?.company_name || "Micro Infoweb";
  const tagline = profile?.tagline || "Architecting Digital Excellence for Tomorrow's Enterprises";
  const email = profile?.primary_email || "contact@microinfoweb.com";
  const phone = profile?.support_phone || "+1 (555) 389-2026";
  const address = profile?.office_address || "100 Innovation Way, Tech District, Suite 400, Silicon Valley, CA";

  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 pt-16 pb-12 text-slate-400 relative overflow-hidden">
      {/* Background Subtle Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Col 1 & 2: Brand Identity & Newsletter */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                <Box className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-2xl text-white tracking-tight">
                {companyName}
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              {tagline}. We combine deep technical rigor with award-winning UI/UX aesthetics to deliver mission-critical software solutions globally.
            </p>
            <div className="pt-2">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">Subscribe to Tech Insights</h5>
              <form onSubmit={(e) => { e.preventDefault(); alert("Thank you for subscribing to Micro Infoweb updates!"); }} className="flex gap-2 max-w-sm">
                <input
                  type="email"
                  required
                  placeholder="Enter your enterprise email..."
                  className="bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 flex-1"
                />
                <button type="submit" className="btn btn-primary !py-2 !px-4 text-xs !rounded-lg">
                  Join
                </button>
              </form>
            </div>
          </div>

          {/* Col 3: Quick Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-1">Company</h4>
            <Link to="/about" className="hover:text-cyan-400 transition-colors text-sm">About Us</Link>
            <Link to="/services" className="hover:text-cyan-400 transition-colors text-sm">Services Showcase</Link>
            <Link to="/projects" className="hover:text-cyan-400 transition-colors text-sm">Case Studies</Link>
            <Link to="/team" className="hover:text-cyan-400 transition-colors text-sm">Leadership Roster</Link>
            <Link to="/gallery" className="hover:text-cyan-400 transition-colors text-sm">Media Gallery</Link>
          </div>

          {/* Col 4: Specialized Offerings */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-1">Offerings</h4>
            <Link to="/services" className="hover:text-blue-400 transition-colors text-sm">Enterprise Web Dev</Link>
            <Link to="/services" className="hover:text-blue-400 transition-colors text-sm">Cloud & DevOps Mesh</Link>
            <Link to="/services" className="hover:text-blue-400 transition-colors text-sm">AI & Big Data Analytics</Link>
            <Link to="/services" className="hover:text-blue-400 transition-colors text-sm">Mobile SuperApps</Link>
            <Link to="/services" className="hover:text-blue-400 transition-colors text-sm">Cybersecurity Audits</Link>
          </div>

          {/* Col 5: Global Contact */}
          <div className="flex flex-col gap-3.5">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-1">Contact Headquarters</h4>
            <div className="flex items-start gap-3 text-sm">
              <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <span>{address}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{phone}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{email}</span>
            </div>
            <div className="pt-2 flex items-center gap-4">
              <a href={profile?.linkedin_url || "#"} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
                <span className="text-xs font-bold">in</span>
              </a>
              <a href={profile?.twitter_url || "#"} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-cyan-500 hover:text-white transition-all">
                <span className="text-xs font-bold">𝕏</span>
              </a>
              <a href={profile?.github_url || "#"} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-slate-700 hover:text-white transition-all">
                <span className="text-xs font-bold">&lt;&gt;</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-900 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} {companyName}. All rights reserved. Built with precision & security.</p>
          <div className="flex items-center gap-6">
            <Link to="/admin/login" className="hover:text-blue-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
              <span>Internal CMS Console</span>
            </Link>
            <span className="flex items-center gap-1">
              Engineered with <Heart className="w-3 h-3 text-rose-500 inline fill-rose-500" /> in Silicon Valley
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
