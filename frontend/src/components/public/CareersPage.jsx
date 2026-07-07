import React, { useState } from 'react';
import { publicService } from '../../services/api';
import { Briefcase, MapPin, Clock, DollarSign, Upload, X, CheckCircle, AlertCircle, ArrowRight, Search } from 'lucide-react';

export default function CareersPage({ careers = [] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [formData, setFormData] = useState({
    applicant_name: "",
    applicant_email: "",
    applicant_phone: "",
    linkedin_url: "",
    cover_letter_notes: "",
    resume_file: null,
  });

  const filteredJobs = careers.filter((job) =>
    job.is_active && (
      job.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setSubmitError("Invalid file type. Please upload a PDF or Microsoft Word DOC/DOCX document.");
        e.target.value = "";
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setSubmitError("File size exceeds 5MB limit.");
        e.target.value = "";
        return;
      }
      setSubmitError("");
      setFormData({ ...formData, resume_file: file });
    }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!formData.resume_file) {
      setSubmitError("Please attach your CV / resume document.");
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    try {
      const data = new FormData();
      data.append('applicant_name', formData.applicant_name);
      data.append('applicant_email', formData.applicant_email);
      data.append('applicant_phone', formData.applicant_phone);
      if (formData.linkedin_url) data.append('linkedin_url', formData.linkedin_url);
      if (formData.cover_letter_notes) data.append('cover_letter_notes', formData.cover_letter_notes);
      data.append('resume_file', formData.resume_file);

      await publicService.applyForJob(selectedJob.id, data);
      setSubmitSuccess(true);
      setFormData({
        applicant_name: "",
        applicant_email: "",
        applicant_phone: "",
        linkedin_url: "",
        cover_letter_notes: "",
        resume_file: null,
      });
    } catch (err) {
      setSubmitError(err.response?.data?.detail || "Failed to submit application. Please verify your details or try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block mb-2">Join Our Mission</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">
          Architect Your Career at Micro Infoweb
        </h1>
        <p className="text-lg text-slate-300 leading-relaxed">
          We are actively looking for exceptional systems engineers, AI scientists, and product designers to help us build next-generation enterprise software platforms.
        </p>
      </div>

      {/* Search Bar */}
      <div className="glass-panel !p-6 mb-12 max-w-xl mx-auto flex items-center gap-3">
        <Search className="w-5 h-5 text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Search roles by title, department, or location (e.g., Remote, AI, Senior)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent border-none text-white text-sm focus:outline-none w-full"
        />
      </div>

      {/* Job Listings */}
      {filteredJobs.length === 0 ? (
        <div className="glass-card text-center py-16">
          <Briefcase className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <p className="text-slate-300 text-base mb-2">No open positions match your search criteria.</p>
          <p className="text-slate-500 text-xs">Try clearing your search filters or check back next week.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredJobs.map((job) => (
            <div key={job.id} className="glass-card flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-amber-500/40">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="badge badge-amber">{job.department}</span>
                  <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {job.location}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" /> {job.employment_type}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-3">{job.job_title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-4 line-clamp-2">
                  {job.role_description}
                </p>

                {job.salary_range && (
                  <div className="inline-flex items-center gap-1 text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-800">
                    <DollarSign className="w-3.5 h-3.5" /> {job.salary_range} / yr
                  </div>
                )}
              </div>

              <div className="shrink-0 flex items-center">
                <button
                  onClick={() => { setSelectedJob(job); setSubmitSuccess(false); setSubmitError(""); }}
                  className="btn btn-primary !py-3 !px-6 text-sm w-full md:w-auto shadow-md shadow-blue-600/30"
                >
                  <span>Apply for this Role</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Interactive Application Modal */}
      {selectedJob && (
        <div className="modal-overlay" onClick={() => setSelectedJob(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between border-b border-white/10 pb-4 mb-6">
              <div>
                <span className="text-xs font-mono text-amber-400 uppercase tracking-wider block">
                  Application Submission
                </span>
                <h3 className="text-2xl font-extrabold text-white">{selectedJob.job_title}</h3>
                <span className="text-xs text-slate-400">{selectedJob.department} • {selectedJob.location}</span>
              </div>
              <button onClick={() => setSelectedJob(null)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="text-center py-12 space-y-4 animate-slide-up">
                <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto" />
                <h4 className="text-2xl font-bold text-white">Application Successfully Received!</h4>
                <p className="text-slate-300 text-sm max-w-md mx-auto">
                  Thank you for applying to join <strong className="text-white">Micro Infoweb</strong>. Our talent acquisition committee will review your credentials and contact you within 5 business days.
                </p>
                <button onClick={() => setSelectedJob(null)} className="btn btn-primary !py-2.5 !px-8 text-xs mt-4">
                  Return to Careers
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-4">
                {submitError && (
                  <div className="bg-rose-950/60 border border-rose-500/50 text-rose-200 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={formData.applicant_name}
                      onChange={(e) => setFormData({ ...formData, applicant_name: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="jane@example.com"
                      value={formData.applicant_email}
                      onChange={(e) => setFormData({ ...formData, applicant_email: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 019-2834"
                      value={formData.applicant_phone}
                      onChange={(e) => setFormData({ ...formData, applicant_phone: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">LinkedIn Profile URL</label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/janedoe"
                      value={formData.linkedin_url}
                      onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Cover Letter / Technical Notes</label>
                  <textarea
                    placeholder="Tell us about your relevant projects, architectural experience, or what excites you about Micro Infoweb..."
                    value={formData.cover_letter_notes}
                    onChange={(e) => setFormData({ ...formData, cover_letter_notes: e.target.value })}
                    className="form-textarea !min-h-[90px]"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Attach CV / Resume (.pdf, .doc, .docx - Max 5MB) *</label>
                  <div className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-xl p-6 text-center cursor-pointer transition-colors relative bg-slate-900/50">
                    <input
                      type="file"
                      required
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    {formData.resume_file ? (
                      <div className="text-sm font-semibold text-emerald-400">
                        Selected: {formData.resume_file.name} ({Math.round(formData.resume_file.size / 1024)} KB)
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400">
                        <span className="text-blue-400 font-semibold">Click to upload</span> or drag and drop your document here
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                  <button type="button" onClick={() => setSelectedJob(null)} className="btn btn-secondary !py-2 !px-5 text-xs">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="btn btn-primary !py-2 !px-6 text-xs">
                    {submitting ? "Submitting Application..." : "Submit Application"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
