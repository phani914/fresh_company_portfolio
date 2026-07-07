import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import { Mail, Download, CheckCircle, AlertCircle, RefreshCw, Eye, X, Phone, Calendar } from 'lucide-react';

export default function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedLead, setSelectedLead] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await adminService.getLeads();
      setLeads(res.data);
    } catch (err) {
      setError("Failed to fetch contact inquiries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await adminService.updateLeadStatus(id, newStatus);
      setSuccess(`Inquiry status updated to ${newStatus}.`);
      setLeads(leads.map(l => l.id === id ? { ...l, status_state: newStatus } : l));
      if (selectedLead && selectedLead.id === id) {
        setSelectedLead({ ...selectedLead, status_state: newStatus });
      }
    } catch (err) {
      setError("Failed to update status.");
    }
  };

  const filters = ["All", "New", "In Progress", "Closed", "Archived"];
  const filteredLeads = activeFilter === "All" ? leads : leads.filter(l => l.status_state === activeFilter);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'New': return <span className="badge badge-rose">New</span>;
      case 'In Progress': return <span className="badge badge-blue">In Progress</span>;
      case 'Closed': return <span className="badge badge-emerald">Closed</span>;
      default: return <span className="badge badge-amber">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">Client Correspondence</span>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Mail className="w-6 h-6 text-blue-400" /> Contact Inquiries & Leads
          </h1>
        </div>
        <a
          href={adminService.exportLeadsCSVUrl()}
          target="_blank"
          rel="noreferrer"
          className="btn btn-primary !py-2.5 !px-5 text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/30"
        >
          <Download className="w-4 h-4" />
          <span>Export Leads (CSV)</span>
        </a>
      </div>

      {success && (
        <div className="bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 px-4 py-3 rounded-xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" /><span>{success}</span></div>
          <button onClick={() => setSuccess("")}><X className="w-4 h-4" /></button>
        </div>
      )}

      {error && (
        <div className="bg-rose-950/60 border border-rose-500/50 text-rose-200 px-4 py-3 rounded-xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2"><AlertCircle className="w-4 h-4 shrink-0 text-rose-400" /><span>{error}</span></div>
          <button onClick={() => setError("")}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeFilter === f
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            {f} ({f === "All" ? leads.length : leads.filter(l => l.status_state === f).length})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400 gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
          <span>Loading client inquiries...</span>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="glass-card text-center py-16">
          <Mail className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <p className="text-slate-300 text-sm">No client inquiries found in this status view.</p>
        </div>
      ) : (
        <div className="glass-panel !p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/80 border-b border-slate-800 text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                  <th className="py-4 px-6">Date Received</th>
                  <th className="py-4 px-6">Sender & Contact</th>
                  <th className="py-4 px-6">Subject</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-sm">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6 font-mono text-xs text-slate-400 whitespace-nowrap">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <strong className="text-white block font-bold">{lead.sender_name}</strong>
                      <span className="text-xs text-cyan-400">{lead.sender_email}</span>
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-200">{lead.subject}</td>
                    <td className="py-4 px-6">{getStatusBadge(lead.status_state)}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="btn btn-secondary !py-1.5 !px-3 text-xs flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                        <select
                          value={lead.status_state}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                          className="form-select !py-1 !px-2 !text-xs !w-32 bg-slate-900 border-slate-700"
                        >
                          <option value="New">New</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Closed">Closed</option>
                          <option value="Archived">Archived</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedLead && (
        <div className="modal-overlay" onClick={() => setSelectedLead(null)}>
          <div className="modal-content !max-w-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">Inquiry ID: MI-LEAD-{selectedLead.id}</span>
                <h3 className="text-xl font-bold text-white">{selectedLead.subject}</h3>
              </div>
              <button onClick={() => setSelectedLead(null)} className="text-slate-400 hover:text-white"><X className="w-6 h-6" /></button>
            </div>

            <div className="space-y-6 text-slate-300 text-sm">
              <div className="grid grid-cols-2 gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                <div>
                  <strong className="text-xs text-slate-400 uppercase block mb-1">Sender Name</strong>
                  <span className="text-white font-bold">{selectedLead.sender_name}</span>
                </div>
                <div>
                  <strong className="text-xs text-slate-400 uppercase block mb-1">Email Address</strong>
                  <a href={`mailto:${selectedLead.sender_email}`} className="text-cyan-400 hover:underline">{selectedLead.sender_email}</a>
                </div>
                <div className="pt-2">
                  <strong className="text-xs text-slate-400 uppercase block mb-1">Phone / WhatsApp</strong>
                  <span className="text-white font-mono flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-emerald-400" /> {selectedLead.sender_phone}</span>
                </div>
                <div className="pt-2">
                  <strong className="text-xs text-slate-400 uppercase block mb-1">Timestamp</strong>
                  <span className="text-slate-300 font-mono text-xs flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-blue-400" /> {new Date(selectedLead.created_at).toLocaleString()}</span>
                </div>
              </div>

              <div>
                <strong className="text-xs font-bold text-white uppercase tracking-wider block mb-2">Message Specification</strong>
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-slate-200 whitespace-pre-line leading-relaxed">
                  {selectedLead.message}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <strong className="text-xs text-slate-400 uppercase">Change Status:</strong>
                  <select
                    value={selectedLead.status_state}
                    onChange={(e) => handleStatusChange(selectedLead.id, e.target.value)}
                    className="form-select !py-1 !px-3 !text-xs !w-36"
                  >
                    <option value="New">New</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
                <button onClick={() => setSelectedLead(null)} className="btn btn-secondary !py-2 !px-5 text-xs">Close Details</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
