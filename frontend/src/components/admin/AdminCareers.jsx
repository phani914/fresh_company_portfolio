import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Briefcase, UserCheck, Plus, Edit2, Trash2, X, CheckCircle, AlertCircle, RefreshCw, FileText, Download, Eye } from 'lucide-react';

export default function AdminCareers() {
  const [activeTab, setActiveTab] = useState("openings"); // "openings" or "applications"
  const [openings, setOpenings] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    job_title: "",
    department: "Engineering",
    location: "Remote",
    employment_type: "Full-time",
    role_description: "",
    requirements: "",
    salary_range: "$130,000 - $180,000",
    is_active: true,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const headers = { Authorization: `Bearer ${token}` };
      const [openingsRes, appsRes] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/v1/admin/careers/', { headers }),
        axios.get('http://127.0.0.1:8000/api/v1/admin/applications/', { headers }),
      ]);
      setOpenings(openingsRes.data);
      setApplications(appsRes.data);
    } catch (err) {
      setError("Failed to fetch careers data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      job_title: "",
      department: "Engineering",
      location: "Remote",
      employment_type: "Full-time",
      role_description: "",
      requirements: "",
      salary_range: "$130,000 - $180,000",
      is_active: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (job) => {
    setEditingId(job.id);
    setFormData({
      job_title: job.job_title,
      department: job.department,
      location: job.location,
      employment_type: job.employment_type,
      role_description: job.role_description,
      requirements: job.requirements,
      salary_range: job.salary_range || "",
      is_active: job.is_active,
    });
    setModalOpen(true);
  };

  const handleDeleteOpening = async (id, title) => {
    if (!window.confirm(`Delete job opening "${title}"?`)) return;
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`http://127.0.0.1:8000/api/v1/admin/careers/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(`Job opening "${title}" deleted.`);
      fetchData();
    } catch (err) {
      setError("Failed to delete opening.");
    }
  };

  const handleSubmitOpening = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const token = localStorage.getItem('access_token');
      const headers = { Authorization: `Bearer ${token}` };
      if (editingId) {
        await axios.patch(`http://127.0.0.1:8000/api/v1/admin/careers/${editingId}/`, formData, { headers });
        setSuccess("Job opening updated successfully.");
      } else {
        await axios.post('http://127.0.0.1:8000/api/v1/admin/careers/', formData, { headers });
        setSuccess("New job opening published.");
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      setError("Error saving job opening.");
    }
  };

  const handleUpdateAppStatus = async (appId, newStatus) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.patch(`http://127.0.0.1:8000/api/v1/admin/applications/${appId}/`, { status_state: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(`Application status changed to ${newStatus}.`);
      setApplications(applications.map(a => a.id === appId ? { ...a, status_state: newStatus } : a));
      if (selectedApp && selectedApp.id === appId) {
        setSelectedApp({ ...selectedApp, status_state: newStatus });
      }
    } catch (err) {
      setError("Failed to update application status.");
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">Talent Acquisition</span>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-blue-400" /> Careers & Job Applications
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex">
            <button
              onClick={() => setActiveTab("openings")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                activeTab === "openings" ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Job Listings ({openings.length})
            </button>
            <button
              onClick={() => setActiveTab("applications")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                activeTab === "applications" ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Applications ({applications.length})
            </button>
          </div>

          {activeTab === "openings" && (
            <button onClick={handleOpenCreate} className="btn btn-primary !py-2.5 !px-5 text-xs">
              <Plus className="w-4 h-4" />
              <span>Post New Role</span>
            </button>
          )}
        </div>
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
          <span>Loading talent acquisition portal...</span>
        </div>
      ) : activeTab === "openings" ? (
        openings.length === 0 ? (
          <div className="glass-card text-center py-16">
            <Briefcase className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-300 text-sm mb-4">No open job postings published.</p>
            <button onClick={handleOpenCreate} className="btn btn-primary !py-2 !px-4 text-xs">Post First Job</button>
          </div>
        ) : (
          <div className="glass-panel !p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/80 border-b border-slate-800 text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                    <th className="py-4 px-6">Role Title</th>
                    <th className="py-4 px-6">Department</th>
                    <th className="py-4 px-6">Location</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-sm">
                  {openings.map((job) => (
                    <tr key={job.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6 font-bold text-white">{job.job_title}</td>
                      <td className="py-4 px-6"><span className="badge badge-blue">{job.department}</span></td>
                      <td className="py-4 px-6 text-xs text-slate-300">{job.location} ({job.employment_type})</td>
                      <td className="py-4 px-6">
                        {job.is_active ? <span className="badge badge-emerald">Active</span> : <span className="badge badge-rose">Closed</span>}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleOpenEdit(job)} className="p-2 rounded-lg bg-white/5 hover:bg-blue-600 hover:text-white text-slate-300"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteOpening(job.id, job.job_title)} className="p-2 rounded-lg bg-white/5 hover:bg-rose-600 hover:text-white text-slate-300"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        // Applications Tab
        applications.length === 0 ? (
          <div className="glass-card text-center py-16">
            <FileText className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-300 text-sm">No job applications submitted yet.</p>
          </div>
        ) : (
          <div className="glass-panel !p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/80 border-b border-slate-800 text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                    <th className="py-4 px-6">Applied Date</th>
                    <th className="py-4 px-6">Candidate Name & Email</th>
                    <th className="py-4 px-6">Target Role</th>
                    <th className="py-4 px-6">Resume Doc</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-sm">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6 font-mono text-xs text-slate-400">{new Date(app.created_at).toLocaleDateString()}</td>
                      <td className="py-4 px-6">
                        <strong className="text-white block font-bold">{app.applicant_name}</strong>
                        <span className="text-xs text-cyan-400">{app.applicant_email}</span>
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-200">{app.job_opening_title}</td>
                      <td className="py-4 px-6">
                        {app.resume_file ? (
                          <a href={`http://127.0.0.1:8000${app.resume_file}`} target="_blank" rel="noreferrer" className="btn btn-secondary !py-1 !px-2.5 text-xs flex items-center gap-1 text-emerald-400">
                            <Download className="w-3.5 h-3.5" />
                            <span>CV File</span>
                          </a>
                        ) : (
                          <span className="text-xs text-slate-500">No file</span>
                        )}
                      </td>
                      <td className="py-4 px-6"><span className="badge badge-amber">{app.status_state}</span></td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => setSelectedApp(app)} className="btn btn-secondary !py-1.5 !px-3 text-xs flex items-center gap-1"><Eye className="w-3.5 h-3.5" /><span>Review</span></button>
                          <select value={app.status_state} onChange={(e) => handleUpdateAppStatus(app.id, e.target.value)} className="form-select !py-1 !px-2 !text-xs !w-32 bg-slate-900 border-slate-700">
                            <option value="New">New</option>
                            <option value="In Review">In Review</option>
                            <option value="Interviewing">Interviewing</option>
                            <option value="Offered">Offered</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {/* Opening CRUD Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content !max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <h3 className="text-xl font-bold text-white">{editingId ? "Edit Job Posting" : "Post New Career Role"}</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-6 h-6" /></button>
            </div>

            <form onSubmit={handleSubmitOpening} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Job Role Title *</label>
                  <input type="text" required value={formData.job_title} onChange={(e) => setFormData({ ...formData, job_title: e.target.value })} className="form-input" placeholder="Senior AI Engineer" />
                </div>
                <div className="form-group">
                  <label className="form-label">Department *</label>
                  <input type="text" required value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} className="form-input" placeholder="AI Research / Engineering" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="form-group">
                  <label className="form-label">Location *</label>
                  <input type="text" required value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="form-input" placeholder="Remote / Silicon Valley" />
                </div>
                <div className="form-group">
                  <label className="form-label">Employment Type *</label>
                  <select value={formData.employment_type} onChange={(e) => setFormData({ ...formData, employment_type: e.target.value })} className="form-select">
                    <option value="Full-time">Full-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Part-time">Part-time</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Salary Range</label>
                  <input type="text" value={formData.salary_range} onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })} className="form-input text-xs font-mono" placeholder="$150k - $200k" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Role Overview *</label>
                <textarea required rows={3} value={formData.role_description} onChange={(e) => setFormData({ ...formData, role_description: e.target.value })} className="form-textarea !min-h-[80px]" />
              </div>

              <div className="form-group">
                <label className="form-label">Technical Requirements & Qualifications *</label>
                <textarea required rows={4} value={formData.requirements} onChange={(e) => setFormData({ ...formData, requirements: e.target.value })} className="form-textarea !min-h-[100px]" placeholder="5+ years experience in Python, PyTorch, distributed computing..." />
              </div>

              <div className="form-group flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="active_check"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0"
                />
                <label htmlFor="active_check" className="form-label !mb-0 cursor-pointer">Active Posting (Visible on Careers Board)</label>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary !py-2 !px-5 text-xs">Cancel</button>
                <button type="submit" className="btn btn-primary !py-2 !px-6 text-xs">{editingId ? "Save Changes" : "Publish Posting"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Application Review Modal */}
      {selectedApp && (
        <div className="modal-overlay" onClick={() => setSelectedApp(null)}>
          <div className="modal-content !max-w-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">Application ID: MI-APP-{selectedApp.id}</span>
                <h3 className="text-xl font-bold text-white">{selectedApp.applicant_name}</h3>
              </div>
              <button onClick={() => setSelectedApp(null)} className="text-slate-400 hover:text-white"><X className="w-6 h-6" /></button>
            </div>

            <div className="space-y-6 text-slate-300 text-sm">
              <div className="grid grid-cols-2 gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                <div>
                  <strong className="text-xs text-slate-400 uppercase block mb-1">Email Address</strong>
                  <a href={`mailto:${selectedApp.applicant_email}`} className="text-cyan-400 hover:underline">{selectedApp.applicant_email}</a>
                </div>
                <div>
                  <strong className="text-xs text-slate-400 uppercase block mb-1">Phone Number</strong>
                  <span className="text-white font-mono">{selectedApp.applicant_phone}</span>
                </div>
                <div className="pt-2">
                  <strong className="text-xs text-slate-400 uppercase block mb-1">Target Role</strong>
                  <span className="text-emerald-400 font-bold">{selectedApp.job_opening_title}</span>
                </div>
                {selectedApp.linkedin_url && (
                  <div className="pt-2">
                    <strong className="text-xs text-slate-400 uppercase block mb-1">LinkedIn Profile</strong>
                    <a href={selectedApp.linkedin_url} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline truncate block">View LinkedIn →</a>
                  </div>
                )}
              </div>

              <div>
                <strong className="text-xs font-bold text-white uppercase tracking-wider block mb-2">Cover Letter Notes</strong>
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-slate-200 whitespace-pre-line leading-relaxed">
                  {selectedApp.cover_letter_notes || "No cover letter notes provided."}
                </div>
              </div>

              {selectedApp.resume_file && (
                <div className="bg-blue-950/40 border border-blue-500/30 p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <strong className="text-white block text-sm mb-0.5 font-bold">Resume Document Attached</strong>
                    <span className="text-xs text-slate-400">Click download to inspect candidate CV file.</span>
                  </div>
                  <a
                    href={`http://127.0.0.1:8000${selectedApp.resume_file}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary !py-2 !px-4 text-xs flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download CV</span>
                  </a>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <strong className="text-xs text-slate-400 uppercase">Change Status:</strong>
                  <select
                    value={selectedApp.status_state}
                    onChange={(e) => handleUpdateAppStatus(selectedApp.id, e.target.value)}
                    className="form-select !py-1 !px-3 !text-xs !w-36"
                  >
                    <option value="New">New</option>
                    <option value="In Review">In Review</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Offered">Offered</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <button onClick={() => setSelectedApp(null)} className="btn btn-secondary !py-2 !px-5 text-xs">Close Details</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
