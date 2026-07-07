import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import { Building2, Save, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

export default function AdminCompanyProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminService.getCompanyProfile();
      setProfile(res.data);
    } catch (err) {
      setError("Failed to load company profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError("");
    try {
      const res = await adminService.updateCompanyProfile(profile);
      setProfile(res.data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-400 gap-2">
        <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
        <span>Loading Headquarters Configuration...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-slide-up">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">CMS Configuration</span>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-400" /> Company Profile & Headquarters
          </h1>
        </div>
      </div>

      <div className="glass-panel !p-8">
        {success && (
          <div className="mb-6 bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Company Profile updated successfully! Changes are now live across the public website.</span>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-rose-950/60 border border-rose-500/50 text-rose-200 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="form-label">Company Legal Name *</label>
              <input
                type="text"
                required
                value={profile?.company_name || ""}
                onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Tagline / Value Statement *</label>
              <input
                type="text"
                required
                value={profile?.tagline || ""}
                onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="form-label">Primary Support Email *</label>
              <input
                type="email"
                required
                value={profile?.primary_email || ""}
                onChange={(e) => setProfile({ ...profile, primary_email: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Support / Sales Phone *</label>
              <input
                type="text"
                required
                value={profile?.support_phone || ""}
                onChange={(e) => setProfile({ ...profile, support_phone: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Physical Office Address *</label>
            <input
              type="text"
              required
              value={profile?.office_address || ""}
              onChange={(e) => setProfile({ ...profile, office_address: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">About Us Overview</label>
            <textarea
              value={profile?.about_overview || ""}
              onChange={(e) => setProfile({ ...profile, about_overview: e.target.value })}
              className="form-textarea !min-h-[100px]"
            />
          </div>

          <div className="border-t border-slate-800 pt-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Social Media & Repository Links</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="form-group">
                <label className="form-label text-xs">LinkedIn Profile URL</label>
                <input
                  type="url"
                  value={profile?.linkedin_url || ""}
                  onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
                  className="form-input !text-xs"
                />
              </div>
              <div className="form-group">
                <label className="form-label text-xs">Twitter / X Handle URL</label>
                <input
                  type="url"
                  value={profile?.twitter_url || ""}
                  onChange={(e) => setProfile({ ...profile, twitter_url: e.target.value })}
                  className="form-input !text-xs"
                />
              </div>
              <div className="form-group">
                <label className="form-label text-xs">GitHub Organization URL</label>
                <input
                  type="url"
                  value={profile?.github_url || ""}
                  onChange={(e) => setProfile({ ...profile, github_url: e.target.value })}
                  className="form-input !text-xs"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary !py-3 !px-8 text-sm font-bold shadow-lg shadow-blue-600/30"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving Changes..." : "Save Headquarters Profile"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
