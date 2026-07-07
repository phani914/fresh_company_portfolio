import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import { Users, Plus, Edit2, Trash2, X, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

export default function AdminTeam() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    department: "Engineering",
    bio: "",
    photo_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80",
    linkedin_url: "",
    display_order: 1,
  });

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const res = await adminService.getTeam();
      setTeam(res.data);
    } catch (err) {
      setError("Failed to fetch team roster.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      name: "",
      title: "",
      department: "Engineering",
      bio: "",
      photo_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80",
      linkedin_url: "",
      display_order: team.length + 1,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (member) => {
    setEditingId(member.id);
    setFormData({
      name: member.name,
      title: member.title,
      department: member.department,
      bio: member.bio,
      photo_url: member.photo_url,
      linkedin_url: member.linkedin_url || "",
      display_order: member.display_order,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove team member "${name}" from roster?`)) return;
    try {
      await adminService.deleteTeamMember(id);
      setSuccess(`Team member "${name}" removed.`);
      fetchTeam();
    } catch (err) {
      setError("Failed to delete member.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await adminService.updateTeamMember(editingId, formData);
        setSuccess("Team member updated successfully.");
      } else {
        await adminService.createTeamMember(formData);
        setSuccess("New team member added to roster.");
      }
      setModalOpen(false);
      fetchTeam();
    } catch (err) {
      setError(err.response?.data?.detail || "Error saving team member.");
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">Staff & Faculty</span>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-400" /> Team Directory Management
          </h1>
        </div>
        <button onClick={handleOpenCreate} className="btn btn-primary !py-2.5 !px-5 text-xs">
          <Plus className="w-4 h-4" />
          <span>Add Team Member</span>
        </button>
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

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400 gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
          <span>Loading faculty directory...</span>
        </div>
      ) : team.length === 0 ? (
        <div className="glass-card text-center py-16">
          <Users className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <p className="text-slate-300 text-sm mb-4">No team members listed yet.</p>
          <button onClick={handleOpenCreate} className="btn btn-primary !py-2 !px-4 text-xs">Add First Member</button>
        </div>
      ) : (
        <div className="glass-panel !p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/80 border-b border-slate-800 text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                  <th className="py-4 px-6">Member Profile</th>
                  <th className="py-4 px-6">Department</th>
                  <th className="py-4 px-6">Bio Preview</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-sm">
                {team.map((m) => (
                  <tr key={m.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img src={m.photo_url} alt="" className="w-10 h-10 rounded-full object-cover bg-slate-800" />
                        <div>
                          <strong className="text-white block font-bold">{m.name}</strong>
                          <span className="text-xs text-cyan-400">{m.title}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6"><span className="badge badge-emerald">{m.department}</span></td>
                    <td className="py-4 px-6 text-xs text-slate-300 max-w-sm truncate">{m.bio}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleOpenEdit(m)} className="p-2 rounded-lg bg-white/5 hover:bg-blue-600 hover:text-white text-slate-300"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(m.id, m.name)} className="p-2 rounded-lg bg-white/5 hover:bg-rose-600 hover:text-white text-slate-300"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CRUD Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content !max-w-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <h3 className="text-xl font-bold text-white">{editingId ? "Edit Team Member" : "Add Team Member"}</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-6 h-6" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="form-input" placeholder="Elena Rostova" />
                </div>
                <div className="form-group">
                  <label className="form-label">Job Title *</label>
                  <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="form-input" placeholder="Chief Architect" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Department *</label>
                  <select value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} className="form-select">
                    <option value="Engineering">Engineering</option>
                    <option value="Executive">Executive Leadership</option>
                    <option value="AI Research">AI Research</option>
                    <option value="Design & UX">Design & UX</option>
                    <option value="DevOps">Cloud & DevOps</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Display Order</label>
                  <input type="number" required value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value, 10) || 1 })} className="form-input" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Photo URL (Unsplash or Portrait) *</label>
                <input type="url" required value={formData.photo_url} onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })} className="form-input text-xs font-mono" />
              </div>

              <div className="form-group">
                <label className="form-label">LinkedIn Profile URL</label>
                <input type="url" value={formData.linkedin_url} onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })} className="form-input text-xs" />
              </div>

              <div className="form-group">
                <label className="form-label">Professional Bio *</label>
                <textarea required rows={4} value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} className="form-textarea !min-h-[100px]" />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary !py-2 !px-5 text-xs">Cancel</button>
                <button type="submit" className="btn btn-primary !py-2 !px-6 text-xs">{editingId ? "Save Member" : "Add Member"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
