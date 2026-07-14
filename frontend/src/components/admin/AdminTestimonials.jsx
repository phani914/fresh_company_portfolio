import React, { useState, useEffect } from 'react';
import { MessageSquareQuote, Plus, Edit2, Trash2, X, CheckCircle, AlertCircle, RefreshCw, Star } from 'lucide-react';
import api from '../../services/api';

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    client_name: "",
    reviewer_title: "",
    company_name: "",
    quote: "",
    star_rating: 5,
    is_featured: true,
    display_order: 1,
  });

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await api.get('admin/testimonials/');
      setTestimonials(res.data);
    } catch (err) {
      setError("Failed to fetch testimonials.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      client_name: "",
      reviewer_title: "",
      company_name: "",
      quote: "",
      star_rating: 5,
      is_featured: true,
      display_order: testimonials.length + 1,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      client_name: item.client_name,
      reviewer_title: item.reviewer_title,
      company_name: item.company_name,
      quote: item.quote,
      star_rating: item.star_rating,
      is_featured: item.is_featured,
      display_order: item.display_order,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete testimonial from "${name}"?`)) return;
    try {
      await api.delete(`admin/testimonials/${id}/`);
      setSuccess("Testimonial deleted.");
      fetchTestimonials();
    } catch (err) {
      setError("Failed to delete testimonial.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await api.patch(`admin/testimonials/${editingId}/`, formData);
        setSuccess("Testimonial updated.");
      } else {
        await api.post('admin/testimonials/', formData);
        setSuccess("New testimonial added.");
      }
      setModalOpen(false);
      fetchTestimonials();
    } catch (err) {
      setError("Error saving testimonial.");
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">Social Proof Management</span>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <MessageSquareQuote className="w-6 h-6 text-blue-400" /> Client Testimonials
          </h1>
        </div>
        <button onClick={handleOpenCreate} className="btn btn-primary !py-2.5 !px-5 text-xs">
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
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
          <span>Loading endorsements...</span>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="glass-card text-center py-16">
          <MessageSquareQuote className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <p className="text-slate-300 text-sm mb-4">No client testimonials listed.</p>
          <button onClick={handleOpenCreate} className="btn btn-primary !py-2 !px-4 text-xs">Add First Endorsement</button>
        </div>
      ) : (
        <div className="glass-panel !p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/80 border-b border-slate-800 text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                  <th className="py-4 px-6">Client & Company</th>
                  <th className="py-4 px-6">Endorsement Quote</th>
                  <th className="py-4 px-6">Rating</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-sm">
                {testimonials.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6">
                      <strong className="text-white block font-bold">{item.client_name}</strong>
                      <span className="text-xs text-cyan-400">{item.reviewer_title} • {item.company_name}</span>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-300 italic max-w-md truncate">"{item.quote}"</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {[...Array(item.star_rating)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />)}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleOpenEdit(item)} className="p-2 rounded-lg bg-white/5 hover:bg-blue-600 hover:text-white text-slate-300"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(item.id, item.client_name)} className="p-2 rounded-lg bg-white/5 hover:bg-rose-600 hover:text-white text-slate-300"><Trash2 className="w-4 h-4" /></button>
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
              <h3 className="text-xl font-bold text-white">{editingId ? "Edit Testimonial" : "Add Client Testimonial"}</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-6 h-6" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-group">
                <label className="form-label">Client Name *</label>
                <input type="text" required value={formData.client_name} onChange={(e) => setFormData({ ...formData, client_name: e.target.value })} className="form-input" placeholder="Marcus Vance" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Reviewer Title *</label>
                  <input type="text" required value={formData.reviewer_title} onChange={(e) => setFormData({ ...formData, reviewer_title: e.target.value })} className="form-input" placeholder="CTO" />
                </div>
                <div className="form-group">
                  <label className="form-label">Company Name *</label>
                  <input type="text" required value={formData.company_name} onChange={(e) => setFormData({ ...formData, company_name: e.target.value })} className="form-input" placeholder="Apex FinTech" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Star Rating (1-5) *</label>
                  <select value={formData.star_rating} onChange={(e) => setFormData({ ...formData, star_rating: parseInt(e.target.value, 10) })} className="form-select">
                    <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                    <option value="3">⭐⭐⭐ (3 Stars)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Display Order</label>
                  <input type="number" required value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value, 10) || 1 })} className="form-input" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Endorsement Quote *</label>
                <textarea required rows={4} value={formData.quote} onChange={(e) => setFormData({ ...formData, quote: e.target.value })} className="form-textarea !min-h-[100px]" placeholder="Micro Infoweb transformed our core infrastructure..." />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary !py-2 !px-5 text-xs">Cancel</button>
                <button type="submit" className="btn btn-primary !py-2 !px-6 text-xs">{editingId ? "Save Testimonial" : "Add Endorsement"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
