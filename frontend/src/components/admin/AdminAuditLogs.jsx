import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import { History, ShieldCheck, RefreshCw, AlertCircle, Database, Globe } from 'lucide-react';

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAuditLogs();
      setLogs(res.data);
    } catch (err) {
      setError("Failed to load audit logs. Only Super Admins are authorized to view immutable telemetry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">Security Telemetry</span>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <History className="w-6 h-6 text-blue-400" /> Immutable System Audit Logs
          </h1>
        </div>
        <button onClick={fetchLogs} className="btn btn-secondary !py-2 !px-3.5 text-xs flex items-center gap-1.5">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl text-xs text-slate-300 flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
        <div>
          <strong className="text-white block mb-0.5 font-bold">SOC 2 Compliance Ledger</strong>
          <span>All administrative actions (profile updates, CRUD operations, user provisioning, CSV exports) are immutably logged with timestamp and IP address. This log cannot be modified or deleted.</span>
        </div>
      </div>

      {error && (
        <div className="bg-rose-950/60 border border-rose-500/50 text-rose-200 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400 gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
          <span>Aggregating audit ledger...</span>
        </div>
      ) : logs.length === 0 ? (
        <div className="glass-card text-center py-16">
          <History className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <p className="text-slate-300 text-sm">No audit logs recorded yet.</p>
        </div>
      ) : (
        <div className="glass-panel !p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/80 border-b border-slate-800 text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                  <th className="py-4 px-6">Timestamp (UTC)</th>
                  <th className="py-4 px-6">Actor / User</th>
                  <th className="py-4 px-6">Action Event</th>
                  <th className="py-4 px-6">Target Table</th>
                  <th className="py-4 px-6">IP Address</th>
                  <th className="py-4 px-6">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-xs font-mono">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6 text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toISOString().replace('T', ' ').substring(0, 19)}
                    </td>
                    <td className="py-4 px-6 font-bold text-white">
                      {log.username || <span className="text-slate-500 italic">System / Anonymous</span>}
                    </td>
                    <td className="py-4 px-6">
                      <span className="badge badge-cyan !text-[10px]">{log.action}</span>
                    </td>
                    <td className="py-4 px-6 text-emerald-400 flex items-center gap-1">
                      <Database className="w-3 h-3 inline" /> {log.target_table}
                    </td>
                    <td className="py-4 px-6 text-slate-300">
                      <Globe className="w-3 h-3 inline text-blue-400 mr-1" /> {log.ip_address || '127.0.0.1'}
                    </td>
                    <td className="py-4 px-6 text-slate-300 font-sans text-xs max-w-xs truncate">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
