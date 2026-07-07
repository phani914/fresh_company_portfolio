import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Camera, Plus, Edit2, Trash2, X, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

export default function AdminGallery() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    category: "Headquarters",
    cover_image_url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    date_taken: "2026-06-15",
    description: "",
    display_order: 1,
  });

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const res = await axios.get('http://127.0.0.1:8000/api/v1/admin/gallery/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGallery(res.data);
    } catch (err) {
      setError("Failed to fetch media gallery.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      title: "",
      category: "Headquarters",
      cover_image_url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
      date_taken: "2026-06-15",
      description: "",
      display_order: gallery.length + 1,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      category: item.category,
      cover_image_url: item.cover_image_url,
      date_taken: item.date_taken,
      description: item.description || "",
      display_order: item.display_order,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete media album "${title}"?`)) return;
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`http://127.0.0.1:8000/api/v1/admin/gallery/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(`Album "${title}" deleted.`);
      fetchGallery();
    } catch (err) {
      setError("Failed to delete album.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const token = localStorage.getItem('access_token');
      const headers = { Authorization: `Bearer ${token}` };
      if (editingId) {
        await axios.patch(`http://127.0.0.1:8000/api/v1/admin/gallery/${editingId}/`, formData, { headers });
        setSuccess("Media album updated.");
      } else {
        await axios.post('http://127.0.0.1:8000/api/v1/admin/gallery/', formData, { headers });
        setSuccess("New media album published.");
      }
      setModalOpen(false);
      fetchGallery();
    } catch (err) {
      setError("Error saving media album.");
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">Media Repository</span>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Camera className="w-6 h-6 text-blue-400" /> Corporate Gallery
          </h1>
        </div>
        <button onClick={handleOpenCreate} className="btn btn-primary !py-2.5 !px-5 text-xs">
          <Plus className="w-4 h-4" />
          <span>Add Media Album</span>
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
          <span>Loading media albums...</span>
        </div>
      ) : gallery.length === 0 ? (
        <div className="glass-card text-center py-16">
          <Camera className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <p className="text-slate-300 text-sm mb-4">No media albums published yet.</p>
          <button onClick={handleOpenCreate} className="btn btn-primary !py-2 !px-4 text-xs">Add First Album</button>
        </div>
      ) : (
        <div className="glass-panel !p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/80 border-b border-slate-800 text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                  <th className="py-4 px-6">Album Preview</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Date Recorded</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-sm">
                {gallery.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img src={item.cover_image_url} alt="" className="w-12 h-10 rounded-lg object-cover bg-slate-800" />
                        <div>
                          <strong className="text-white block font-bold">{item.title}</strong>
                          <span className="text-xs text-slate-400 truncate max-w-xs block">{item.description}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6"><span className="badge badge-rose">{item.category}</span></td>
                    <td className="py-4 px-6 font-mono text-xs text-slate-400">{item.date_taken}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleOpenEdit(item)} className="p-2 rounded-lg bg-white/5 hover:bg-blue-600 hover:text-white text-slate-300"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(item.id, item.title)} className="p-2 rounded-lg bg-white/5 hover:bg-rose-600 hover:text-white text-slate-300"><Trash2 className="w-4 h-4" /></button>
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
          <div className="modal-content !max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <h3 className="text-xl font-bold text-white">{editingId ? "Edit Media Album" : "Add Media Album"}</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-6 h-6" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-group">
                <label className="form-label">Album Title *</label>
                <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="form-input" placeholder="Silicon Valley Headquarters Setup" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Category Domain *</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="form-select">
                    <option value="Headquarters">Headquarters</option>
                    <option value="Events">Tech Events</option>
                    <option value="Hackathons">AI Hackathons</option>
                    <option value="Milestones">Corporate Milestones</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Date Taken *</label>
                  <input type="text" required value={formData.date_taken} onChange={(e) => setFormData({ ...formData, date_taken: e.target.value })} className="form-input font-mono text-xs" placeholder="2026-06-15" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Cover Image URL *</label>
                <input type="url" required value={formData.cover_image_url} onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })} className="form-input text-xs font-mono" />
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea required rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="form-textarea !min-h-[80px]" />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary !py-2 !px-5 text-xs">Cancel</button>
                <button type="submit" className="btn btn-primary !py-2 !px-6 text-xs">{editingId ? "Save Album" : "Publish Album"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
