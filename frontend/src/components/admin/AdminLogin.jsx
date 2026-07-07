import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/api';
import { ShieldCheck, Lock, User, Eye, EyeOff, AlertCircle, ArrowLeft, Box } from 'lucide-react';

export default function AdminLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await authService.login(username, password);
      localStorage.setItem('user_role', data.role_type || 'admin');
      if (onLoginSuccess) onLoginSuccess(data);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid credentials. Please check your username and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link to="/" className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-xl shadow-blue-500/30">
            <Box className="w-7 h-7" />
          </div>
          <span className="font-extrabold text-3xl text-white tracking-tight">Micro Infoweb</span>
        </Link>
        
        <div className="text-center">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-800">
            Secure Management Console
          </span>
          <h2 className="mt-4 text-2xl font-bold text-white">Staff Authentication Portal</h2>
          <p className="mt-1 text-xs text-slate-400">
            Authorized personnel only. All access attempts are recorded in immutable audit logs.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="glass-panel !p-8 shadow-2xl">
          {error && (
            <div className="mb-6 bg-rose-950/80 border border-rose-500/50 text-rose-200 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="form-group">
              <label className="form-label">Username or Staff ID</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-input !pl-10"
                  autoFocus
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input !pl-10 !pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full !py-3.5 text-sm font-bold shadow-lg shadow-blue-600/30"
            >
              {loading ? "Verifying Credentials..." : "Access Admin Console"}
            </button>
          </form>

          {/* Demo Credentials Tip */}
          <div className="mt-6 pt-6 border-t border-white/10 bg-slate-900/50 -mx-8 -mb-8 p-6 rounded-b-2xl text-xs text-slate-400">
            <div className="flex items-center gap-1.5 font-bold text-cyan-400 mb-1">
              <ShieldCheck className="w-4 h-4" /> Default Demo Credentials:
            </div>
            <div className="font-mono text-[11px] text-slate-300">
              Username: <span className="text-white font-bold">admin</span> | Password: <span className="text-white font-bold">adminpassword123</span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
