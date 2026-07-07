import React, { useState } from 'react';
import { publicService } from '../../services/api';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, ShieldCheck, Clock, Globe } from 'lucide-react';

export default function ContactPage({ profile }) {
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Simple math challenge anti-spam protection (Section 15 of SRS)
  const [mathA] = useState(Math.floor(Math.random() * 8) + 2);
  const [mathB] = useState(Math.floor(Math.random() * 8) + 2);
  const [userAnswer, setUserAnswer] = useState("");
  const [honeypot, setHoneypot] = useState(""); // Hidden spam trap field

  const [formData, setFormData] = useState({
    sender_name: "",
    sender_email: "",
    sender_phone: "",
    subject: "",
    message: "",
  });

  const companyName = profile?.company_name || "Micro Infoweb";
  const address = profile?.office_address || "100 Innovation Way, Tech District, Suite 400, Silicon Valley, CA";
  const phone = profile?.support_phone || "+1 (555) 389-2026";
  const email = profile?.primary_email || "contact@microinfoweb.com";

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (honeypot !== "") {
      // Bot detected via honeypot
      setSubmitError("Spam detection triggered. Submission rejected.");
      return;
    }
    if (parseInt(userAnswer, 10) !== mathA + mathB) {
      setSubmitError(`Anti-spam verification failed. Please solve ${mathA} + ${mathB} correctly.`);
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    try {
      await publicService.submitLead(formData);
      setSubmitSuccess(true);
      setFormData({
        sender_name: "",
        sender_email: "",
        sender_phone: "",
        subject: "",
        message: "",
      });
      setUserAnswer("");
    } catch (err) {
      setSubmitError(err.response?.data?.detail || "Failed to submit inquiry. Please verify your email format or try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 block mb-2">Connect With Headquarters</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">
          Initiate a Technical Conversation
        </h1>
        <p className="text-lg text-slate-300 leading-relaxed">
          Whether you need a custom enterprise platform, a cloud security audit, or dedicated engineering squads, our system architects are ready to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Contact Form */}
        <div className="lg:col-span-7 glass-panel !p-8 md:!p-10">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Send className="w-5 h-5 text-blue-400" /> Send an Inquiry
          </h2>
          <p className="text-slate-400 text-xs mb-8">
            Complete the form below. All data is encrypted via TLS 1.3 and protected by our privacy policies.
          </p>

          {submitSuccess ? (
            <div className="bg-emerald-950/40 border border-emerald-500/50 rounded-2xl p-8 text-center space-y-4 animate-slide-up">
              <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-xl font-bold text-white">Inquiry Successfully Dispatch!</h3>
              <p className="text-slate-300 text-sm">
                Thank you for reaching out to <strong className="text-white">{companyName}</strong>. A Senior Account Executive and Technical Architect have been assigned to review your inquiry and will respond within 2 business hours.
              </p>
              <button
                onClick={() => setSubmitSuccess(false)}
                className="btn btn-secondary !py-2 !px-6 text-xs mt-4"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-5">
              {submitError && (
                <div className="bg-rose-950/60 border border-rose-500/50 text-rose-200 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Hidden Honeypot Trap */}
              <input
                type="text"
                name="website_url_trap"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                style={{ display: 'none' }}
                tabIndex="-1"
                autoComplete="off"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="John Smith"
                    value={formData.sender_name}
                    onChange={(e) => setFormData({ ...formData, sender_name: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Enterprise Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="john@enterprise.com"
                    value={formData.sender_email}
                    onChange={(e) => setFormData({ ...formData, sender_email: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="form-group">
                  <label className="form-label">Phone Number / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 019-2834"
                    value={formData.sender_phone}
                    onChange={(e) => setFormData({ ...formData, sender_phone: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Inquiry Subject *</label>
                  <input
                    type="text"
                    required
                    placeholder="Cloud Migration / AI Architecture"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Project Scope & Technical Requirements *</label>
                <textarea
                  required
                  placeholder="Please describe your project objectives, target timelines, and current technology stack..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="form-textarea !min-h-[140px]"
                />
              </div>

              {/* Anti-Spam Challenge */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Spam Protection: What is <strong>{mathA} + {mathB}</strong>?</span>
                </div>
                <input
                  type="number"
                  required
                  placeholder="Answer"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="form-input !w-28 !py-1.5 !text-center !text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary w-full !py-3.5 text-sm font-bold shadow-lg shadow-blue-600/30"
              >
                {submitting ? "Transmitting Secure Inquiry..." : "Dispatch Technical Inquiry"}
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Office Info & Embedded Map Widget */}
        <div className="lg:col-span-5 space-y-8">
          <div className="glass-card">
            <h3 className="text-xl font-bold text-white mb-6">Global Headquarters</h3>
            
            <div className="space-y-5 text-sm text-slate-300">
              <div className="flex items-start gap-3.5">
                <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5">Office Address</strong>
                  <span>{address}</span>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <Phone className="w-5 h-5 text-cyan-400 shrink-0" />
                <div>
                  <strong className="text-white block mb-0.5">Support Desk & Sales</strong>
                  <span>{phone}</span>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <Mail className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <strong className="text-white block mb-0.5">Primary Correspondence</strong>
                  <span>{email}</span>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <Clock className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <strong className="text-white block mb-0.5">Operating Hours</strong>
                  <span>Mon - Fri: 8:00 AM - 6:00 PM (PST)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Embedded Map Widget Representation (Section 15 of SRS) */}
          <div className="glass-card !p-3 overflow-hidden">
            <div className="w-full h-64 rounded-xl bg-slate-950 relative overflow-hidden flex flex-col items-center justify-center border border-slate-800 text-center p-6">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
              <Globe className="w-12 h-12 text-blue-500 mb-3 animate-pulse relative z-10" />
              <h4 className="text-base font-bold text-white relative z-10">Silicon Valley Tech Campus</h4>
              <p className="text-xs text-slate-400 max-w-xs mt-1 relative z-10">
                Lat: 37.3861° N, Long: 122.0839° W • Secure Visitor Parking Available at Gate 4
              </p>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="mt-4 btn btn-secondary !py-1.5 !px-4 !text-xs relative z-10 hover:border-blue-500"
              >
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
