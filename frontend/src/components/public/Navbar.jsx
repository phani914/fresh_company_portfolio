import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Navbar({ companyName = "Micro Infoweb" }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Projects', path: '/projects' },
    { name: 'Team', path: '/team' },
    { name: 'Careers', path: '/careers' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className={`glass-navbar ${scrolled ? 'py-3' : 'py-5'} transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
            <Box className="w-6 h-6 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
              {companyName}
              <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block animate-ping" />
            </span>
            <span className="text-[10px] tracking-widest text-cyan-300 font-semibold uppercase -mt-1">
              Enterprise Solutions
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-full border border-white/10 backdrop-blur-md">
          {navLinks.map((link) => {
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  active
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-600/40'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            to="/admin/login"
            className="btn btn-secondary !py-2 !px-3.5 text-xs !rounded-full border-blue-500/30 hover:border-blue-500 flex items-center gap-1.5 text-blue-300"
            title="Internal Staff Admin Console"
          >
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Admin CMS</span>
          </Link>
          <Link
            to="/contact"
            className="btn btn-primary !py-2 !px-4 text-xs !rounded-full group shadow-md shadow-blue-600/30"
          >
            <span>Get in Touch</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-slate-200 hover:text-white focus:outline-none"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900/95 border-b border-white/10 px-4 pt-4 pb-6 mt-3 animate-slide-up">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  location.pathname === link.path
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="border-t border-white/10 pt-4 mt-2 flex flex-col gap-2">
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-secondary w-full justify-center !py-2.5 text-sm"
              >
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Internal Admin Portal</span>
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-primary w-full justify-center !py-2.5 text-sm"
              >
                <span>Request Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
