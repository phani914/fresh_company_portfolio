import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import { Briefcase, Plus, Edit2, Trash2, X, CheckCircle, AlertCircle, RefreshCw, Star } from 'lucide-react';

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    client_name: "",
    category: "Web Dev",
    short_description: "",
    detailed_description: "",
    tech_stack: "",
    media_url: "",
    timeline: "3 Months",
    is_featured: false,
    display_order: 1,
  });

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await adminService.getProjects();
      setProjects(res.data);
    } catch (err) {
      setError("Failed to fetch projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      title: "",
      slug: "",
      client_name: "",
      category: "Web Dev",
      short_description: "",
      detailed_description: "",
      tech_stack: "",
      media_url: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80",
      timeline: "3 Months",
      is_featured: false,
      display_order: projects.length + 1,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (proj) => {
    setEditingId(proj.id);
    setFormData({
      title: proj.title,
      slug: proj.slug,
      client_name: proj.client_name,
      category: proj.category,
      short_description: proj.short_description,
      detailed_description: proj.detailed_description || "",
      tech_stack: proj.tech_stack,
      media_url: proj.media_url,
      timeline: proj.timeline,
      is_featured: proj.is_featured,
      display_order: proj.display_order,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete project "${title}"?`)) return;
    try {
      await adminService.deleteProject(id);
      setSuccess(`Project "${title}" deleted.`);
      fetchProjects();
    } catch (err) {
      setError("Failed to delete project.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await adminService.updateProject(editingId, formData);
        setSuccess("Project updated successfully.");
      } else {
        await adminService.createProject(formData);
        setSuccess("New project added to portfolio.");
      }
      setModalOpen(false);
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.detail || "Error saving project.");
    }
  };

  const handleTitleChange = (e) => {
    const val = e.target.value;
    const autoSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setFormData({ ...formData, title: val, slug: !editingId ? autoSlug : formData.slug });
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">Case Studies Management</span>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-blue-400" /> Project Portfolio
          </h1>
        </div>
        <button onClick={handleOpenCreate} className="btn btn-primary !py-2.5 !px-5 text-xs">
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
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
          <span>Loading portfolio...</span>
        </div>
      ) : projects.length === 0 ? (
        <div className="glass-card text-center py-16">
          <Briefcase className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <p className="text-slate-300 text-sm mb-4">No portfolio case studies created yet.</p>
          <button onClick={handleOpenCreate} className="btn btn-primary !py-2 !px-4 text-xs">Add First Case Study</button>
        </div>
      ) : (
        <div className="glass-panel !p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/80 border-b border-slate-800 text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                  <th className="py-4 px-6">Project Title & Client</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Timeline</th>
                  <th className="py-4 px-6">Featured</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-sm">
                {projects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img src={proj.media_url} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-800" />
                        <div>
                          <strong className="text-white block font-bold">{proj.title}</strong>
                          <span className="text-xs text-cyan-400 font-semibold">Client: {proj.client_name}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6"><span className="badge badge-blue">{proj.category}</span></td>
                    <td className="py-4 px-6 font-mono text-xs text-slate-300">{proj.timeline}</td>
                    <td className="py-4 px-6">
                      {proj.is_featured ? (
                        <span className="badge badge-amber flex items-center gap-1 w-fit"><Star className="w-3 h-3 fill-amber-400" /> Yes</span>
                      ) : (
                        <span className="text-xs text-slate-500">No</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleOpenEdit(proj)} className="p-2 rounded-lg bg-white/5 hover:bg-blue-600 hover:text-white text-slate-300"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(proj.id, proj.title)} className="p-2 rounded-lg bg-white/5 hover:bg-rose-600 hover:text-white text-slate-300"><Trash2 className="w-4 h-4" /></button>
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
          <div className="modal-content !max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <h3 className="text-xl font-bold text-white">{editingId ? "Edit Case Study" : "Add New Case Study"}</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-6 h-6" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Project Title *</label>
                  <input type="text" required value={formData.title} onChange={handleTitleChange} className="form-input" placeholder="Apex FinTech Portal" />
                </div>
                <div className="form-group">
                  <label className="form-label">URL Slug *</label>
                  <input type="text" required value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="form-input font-mono text-xs" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Client / Enterprise Name *</label>
                  <input type="text" required value={formData.client_name} onChange={(e) => setFormData({ ...formData, client_name: e.target.value })} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Category Domain *</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="form-select">
                    <option value="Web Dev">Web Dev</option>
                    <option value="Mobile">Mobile App</option>
                    <option value="Cloud">Cloud & DevOps</option>
                    <option value="AI & Data">AI & Big Data</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Project Timeline Duration *</label>
                  <input type="text" required value={formData.timeline} onChange={(e) => setFormData({ ...formData, timeline: e.target.value })} className="form-input" placeholder="4 Months" />
                </div>
                <div className="form-group flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="feat_check"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0"
                  />
                  <label htmlFor="feat_check" className="form-label !mb-0 cursor-pointer">Feature on HomePage Showcase</label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Image Media URL *</label>
                <input type="url" required value={formData.media_url} onChange={(e) => setFormData({ ...formData, media_url: e.target.value })} className="form-input text-xs font-mono" />
              </div>

              <div className="form-group">
                <label className="form-label">Short Summary (Card Preview) *</label>
                <input type="text" required value={formData.short_description} onChange={(e) => setFormData({ ...formData, short_description: e.target.value })} className="form-input" />
              </div>

              <div className="form-group">
                <label className="form-label">Detailed Case Study Description</label>
                <textarea rows={3} value={formData.detailed_description} onChange={(e) => setFormData({ ...formData, detailed_description: e.target.value })} className="form-textarea !min-h-[80px]" />
              </div>

              <div className="form-group">
                <label className="form-label">Technology Stack Tags (Comma separated) *</label>
                <input type="text" required value={formData.tech_stack} onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })} className="form-input" placeholder="React, Python, Docker, PostgreSQL" />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary !py-2 !px-5 text-xs">Cancel</button>
                <button type="submit" className="btn btn-primary !py-2 !px-6 text-xs">{editingId ? "Save Project" : "Add Project"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
