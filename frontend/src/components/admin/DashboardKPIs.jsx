import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/api';
import { LayoutDashboard, Mail, Briefcase, Users, UserCheck, ArrowUpRight, ShieldCheck, Download, RefreshCw, AlertCircle } from 'lucide-react';

export default function DashboardKPIs() {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchKPIs = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminService.getKPIs();
      setKpis(res.data.kpis);
    } catch (err) {
      setError("Failed to load dashboard metrics. Please check your network or authentication status.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKPIs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-400 gap-2">
        <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
        <span>Aggregating real-time telemetry and KPI metrics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-950/60 border border-rose-500/50 text-rose-200 p-6 rounded-2xl text-sm flex items-center gap-3">
        <AlertCircle className="w-6 h-6 text-rose-400 shrink-0" />
        <div>
          <strong className="block text-white mb-1">Telemetry Error</strong>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-900/40 via-slate-900 to-cyan-900/40 border border-white/10 p-6 rounded-2xl">
        <div>
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-1">
            System Telemetry & Analytics
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
            <LayoutDashboard className="w-7 h-7 text-blue-400" /> Executive Overview
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchKPIs} className="btn btn-secondary !py-2 !px-3.5 text-xs flex items-center gap-1.5" title="Refresh Telemetry">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
          <a
            href={adminService.exportLeadsCSVUrl()}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary !py-2 !px-4 text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/30"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Leads (CSV)</span>
          </a>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card !p-6 border-blue-500/30 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Inquiries</span>
            <span className="text-3xl font-extrabold text-white font-mono">{kpis?.total_inquiries || 0}</span>
            <span className="text-[10px] text-cyan-400 block mt-1">Client leads received</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Mail className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card !p-6 border-cyan-500/30 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Active Projects</span>
            <span className="text-3xl font-extrabold text-white font-mono">{kpis?.active_projects || 0}</span>
            <span className="text-[10px] text-emerald-400 block mt-1">Portfolio deployments</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card !p-6 border-emerald-500/30 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Team Roster</span>
            <span className="text-3xl font-extrabold text-white font-mono">{kpis?.team_members || 0}</span>
            <span className="text-[10px] text-emerald-400 block mt-1">Authorized engineers</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card !p-6 border-amber-500/30 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Open Careers</span>
            <span className="text-3xl font-extrabold text-white font-mono">{kpis?.open_job_positions || 0}</span>
            <span className="text-[10px] text-amber-400 block mt-1">Active job listings</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* System Health Overview Card */}
      <div className="glass-panel !p-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" /> Infrastructure Security & Compliance Status
          </h3>
          <span className="badge badge-emerald">SECURE MESH ACTIVE</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
          <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5">
            <strong className="text-white block mb-1">Database Storage Engine</strong>
            <span>MySQL / SQLite Unified ORM Layer via Django REST Framework with connection pooling.</span>
          </div>
          <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5">
            <strong className="text-white block mb-1">Authentication Protocol</strong>
            <span>Stateless JWT Bearer tokens with memory-hard Argon2 password hashing.</span>
          </div>
          <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5">
            <strong className="text-white block mb-1">Audit Logging & RBAC</strong>
            <span>Immutable IP telemetry tracking enabled across all Super Admin administrative actions.</span>
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="glass-card !p-6">
        <h3 className="text-base font-bold text-white mb-4">Quick Management Shortcuts</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link to="/admin/services" className="bg-white/5 hover:bg-white/10 p-4 rounded-xl text-center transition-all group">
            <strong className="text-xs font-bold text-white group-hover:text-cyan-400 block mb-1">Manage Services</strong>
            <span className="text-[10px] text-slate-400 block">Edit corporate workflows</span>
          </Link>
          <Link to="/admin/projects" className="bg-white/5 hover:bg-white/10 p-4 rounded-xl text-center transition-all group">
            <strong className="text-xs font-bold text-white group-hover:text-cyan-400 block mb-1">Update Portfolio</strong>
            <span className="text-[10px] text-slate-400 block">Add case studies</span>
          </Link>
          <Link to="/admin/leads" className="bg-white/5 hover:bg-white/10 p-4 rounded-xl text-center transition-all group">
            <strong className="text-xs font-bold text-white group-hover:text-cyan-400 block mb-1">Review Leads</strong>
            <span className="text-[10px] text-slate-400 block">Respond to inquiries</span>
          </Link>
          <Link to="/admin/profile" className="bg-white/5 hover:bg-white/10 p-4 rounded-xl text-center transition-all group">
            <strong className="text-xs font-bold text-white group-hover:text-cyan-400 block mb-1">Edit Headquarters</strong>
            <span className="text-[10px] text-slate-400 block">Update address & contacts</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
