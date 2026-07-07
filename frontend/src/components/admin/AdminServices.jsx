import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import { Layers, Plus, Edit2, Trash2, X, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    icon_name: "Globe",
    short_description: "",
    detailed_workflow: "",
    tech_stack: "",
    case_study_summary: "",
    display_order: 1,
  });

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await adminService.getServices();
      setServices(res.data);
    } catch (err) {
      setError("Failed to fetch services.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      title: "",
      slug: "",
      icon_name: "Globe",
      short_description: "",
      detailed_workflow: "",
      tech_stack: "",
      case_study_summary: "",
      display_order: services.length + 1,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (svc) => {
    setEditingId(svc.id);
    setFormData({
      title: svc.title,
      slug: svc.slug,
      icon_name: svc.icon_name,
      short_description: svc.short_description,
      detailed_workflow: svc.detailed_workflow,
      tech_stack: svc.tech_stack,
      case_study_summary: svc.case_study_summary || "",
      display_order: svc.display_order,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete service "${title}"?`)) return;
    try {
      await adminService.deleteService(id);
      setSuccess(`Service "${title}" deleted successfully.`);
      fetchServices();
    } catch (err) {
      setError("Failed to delete service.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await adminService.updateService(editingId, formData);
        setSuccess("Service updated successfully.");
      } else {
        await adminService.createService(formData);
        setSuccess("New service created successfully.");
      }
      setModalOpen(false);
      fetchServices();
    } catch (err) {
      setError(err.response?.data?.detail || "Error saving service. Ensure slug is unique.");
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
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">Offerings Management</span>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-blue-400" /> Corporate Services
          </h1>
        </div>
        <button onClick={handleOpenCreate} className="btn btn-primary !py-2.5 !px-5 text-xs">
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {success && (
        <div className="bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 px-4 py-3 rounded-xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{success}</span>
          </div>
          <button onClick={() => setSuccess("")}><X className="w-4 h-4" /></button>
        </div>
      )}

      {error && (
        <div className="bg-rose-950/60 border border-rose-500/50 text-rose-200 px-4 py-3 rounded-xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError("")}><X className="w-4 h-4" /></button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400 gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
          <span>Loading services...</span>
        </div>
      ) : services.length === 0 ? (
        <div className="glass-card text-center py-16">
          <Layers className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <p className="text-slate-300 text-sm mb-4">No corporate services defined yet.</p>
          <button onClick={handleOpenCreate} className="btn btn-primary !py-2 !px-4 text-xs">Create First Service</button>
        </div>
      ) : (
        <div className="glass-panel !p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/80 border-b border-slate-800 text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                  <th className="py-4 px-6">Order</th>
                  <th className="py-4 px-6">Service Title & Slug</th>
                  <th className="py-4 px-6">Icon</th>
                  <th className="py-4 px-6">Tech Stack</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-sm">
                {services.map((svc) => (
                  <tr key={svc.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6 font-mono text-cyan-400 font-bold">#{svc.display_order}</td>
                    <td className="py-4 px-6">
                      <strong className="text-white block font-bold">{svc.title}</strong>
                      <span className="text-xs text-slate-400 font-mono">/{svc.slug}</span>
                    </td>
                    <td className="py-4 px-6"><span className="badge badge-blue">{svc.icon_name}</span></td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {svc.tech_stack?.split(',').slice(0, 3).map((t, idx) => (
                          <span key={idx} className="badge badge-cyan !text-[10px]">{t.trim()}</span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(svc)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-blue-600 hover:text-white text-slate-300 transition-colors"
                          title="Edit Service"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(svc.id, svc.title)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-rose-600 hover:text-white text-slate-300 transition-colors"
                          title="Delete Service"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
              <h3 className="text-xl font-bold text-white">
                {editingId ? "Edit Corporate Service" : "Add New Corporate Service"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-6 h-6" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Service Title *</label>
                  <input type="text" required value={formData.title} onChange={handleTitleChange} className="form-input" placeholder="Cloud Architecture" />
                </div>
                <div className="form-group">
                  <label className="form-label">URL Slug *</label>
                  <input type="text" required value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="form-input font-mono text-xs" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Icon Name</label>
                  <select value={formData.icon_name} onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })} className="form-select">
                    <option value="Globe">Globe (Web Dev)</option>
                    <option value="Cloud">Cloud (DevOps)</option>
                    <option value="Cpu">Cpu (AI & Data)</option>
                    <option value="Smartphone">Smartphone (Mobile)</option>
                    <option value="Database">Database (Storage)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Display Order</label>
                  <input type="number" required value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value, 10) || 1 })} className="form-input" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Short Summary (1-2 sentences) *</label>
                <input type="text" required value={formData.short_description} onChange={(e) => setFormData({ ...formData, short_description: e.target.value })} className="form-input" />
              </div>

              <div className="form-group">
                <label className="form-label">Technology Stack (Comma separated) *</label>
                <input type="text" required placeholder="Python, Django, Kubernetes, AWS" value={formData.tech_stack} onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })} className="form-input" />
              </div>

              <div className="form-group">
                <label className="form-label">Detailed Engineering Workflow / Specification *</label>
                <textarea required rows={4} value={formData.detailed_workflow} onChange={(e) => setFormData({ ...formData, detailed_workflow: e.target.value })} className="form-textarea !min-h-[100px]" />
              </div>

              <div className="form-group">
                <label className="form-label">Case Study / Proven Impact Summary (Optional)</label>
                <input type="text" value={formData.case_study_summary} onChange={(e) => setFormData({ ...formData, case_study_summary: e.target.value })} className="form-input" />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary !py-2 !px-5 text-xs">Cancel</button>
                <button type="submit" className="btn btn-primary !py-2 !px-6 text-xs">{editingId ? "Save Changes" : "Create Service"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
