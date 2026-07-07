import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import { ShieldAlert, Plus, Trash2, X, CheckCircle, AlertCircle, RefreshCw, Lock, User } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role_type: "staff",
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminService.getUsers();
      setUsers(res.data);
    } catch (err) {
      setError("Failed to fetch user accounts. Only Super Admins have permission to view this panel.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenCreate = () => {
    setFormData({
      username: "",
      email: "",
      role_type: "staff",
    });
    setModalOpen(true);
  };

  const handleDelete = async (id, username) => {
    if (!window.confirm(`Delete staff account "${username}"? This action will revoke all system access.`)) return;
    try {
      await adminService.deleteUser(id);
      setSuccess(`Account "${username}" removed successfully.`);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to delete user account.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await adminService.createUser(formData);
      setSuccess(`New account "${formData.username}" created with role "${formData.role_type}". Default password set to: DefaultWelcome123!`);
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.detail || "Error creating account. Username or email may already exist.");
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'super_admin': return <span className="badge badge-rose font-bold">Super Admin</span>;
      case 'admin': return <span className="badge badge-blue font-bold">Admin</span>;
      default: return <span className="badge badge-emerald font-bold">Staff</span>;
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono text-rose-400 uppercase tracking-wider block">RBAC Security Console</span>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-rose-400" /> Staff Accounts & Access Control
          </h1>
        </div>
        <button onClick={handleOpenCreate} className="btn btn-primary !py-2.5 !px-5 text-xs !bg-gradient-to-r !from-rose-600 !to-amber-600">
          <Plus className="w-4 h-4" />
          <span>Provision New Account</span>
        </button>
      </div>

      <div className="bg-blue-950/40 border border-blue-500/30 p-4 rounded-xl text-xs text-slate-300 flex items-center gap-3">
        <Lock className="w-5 h-5 text-cyan-400 shrink-0" />
        <div>
          <strong className="text-white block mb-0.5 font-bold">Super Admin Exclusivity Notice</strong>
          <span>This panel regulates Role-Based Access Control (RBAC). Newly provisioned accounts receive the default temporary password <code className="bg-slate-900 px-1.5 py-0.5 rounded text-cyan-300 font-mono">DefaultWelcome123!</code> and must change it upon login.</span>
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
          <span>Loading RBAC user accounts...</span>
        </div>
      ) : (
        <div className="glass-panel !p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/80 border-b border-slate-800 text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                  <th className="py-4 px-6">User ID</th>
                  <th className="py-4 px-6">Username</th>
                  <th className="py-4 px-6">Email Address</th>
                  <th className="py-4 px-6">RBAC Role</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-sm">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6 font-mono text-xs text-slate-400">#MI-{u.id + 500}</td>
                    <td className="py-4 px-6 font-bold text-white flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-400" /> {u.username}
                    </td>
                    <td className="py-4 px-6 text-xs text-cyan-400">{u.email}</td>
                    <td className="py-4 px-6">{getRoleBadge(u.role_type)}</td>
                    <td className="py-4 px-6 text-right">
                      {u.username !== 'admin' && u.username !== 'super' ? (
                        <button
                          onClick={() => handleDelete(u.id, u.username)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-rose-600 hover:text-white text-slate-300 transition-colors"
                          title="Revoke Account"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-mono uppercase">Protected</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Provisioning Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content !max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <h3 className="text-xl font-bold text-white">Provision Staff Account</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-6 h-6" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-group">
                <label className="form-label">Username *</label>
                <input type="text" required value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="form-input font-mono" placeholder="jdoe" />
              </div>

              <div className="form-group">
                <label className="form-label">Corporate Email Address *</label>
                <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="form-input" placeholder="jdoe@microinfoweb.com" />
              </div>

              <div className="form-group">
                <label className="form-label">Assign RBAC Permission Tier *</label>
                <select value={formData.role_type} onChange={(e) => setFormData({ ...formData, role_type: e.target.value })} className="form-select">
                  <option value="staff">Staff (Limited CRUD)</option>
                  <option value="admin">Admin (Full Content Management)</option>
                  <option value="super_admin">Super Admin (Full System & RBAC Control)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary !py-2 !px-5 text-xs">Cancel</button>
                <button type="submit" className="btn btn-primary !py-2 !px-6 text-xs">Create Account</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
