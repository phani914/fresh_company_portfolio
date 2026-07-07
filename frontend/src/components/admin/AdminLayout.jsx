import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';
import { 
  LayoutDashboard, Building2, Briefcase, Layers, Users, MessageSquareQuote, 
  UserCheck, Camera, Mail, ShieldAlert, History, LogOut, Menu, X, Box, ExternalLink 
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const userRole = localStorage.getItem('user_role') || 'admin';

  const handleLogout = () => {
    authService.logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { name: 'Dashboard KPIs', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Company Profile', path: '/admin/profile', icon: Building2 },
    { name: 'Corporate Services', path: '/admin/services', icon: Layers },
    { name: 'Project Portfolio', path: '/admin/projects', icon: Briefcase },
    { name: 'Team Roster', path: '/admin/team', icon: Users },
    { name: 'Testimonials', path: '/admin/testimonials', icon: MessageSquareQuote },
    { name: 'Careers & Jobs', path: '/admin/careers', icon: UserCheck },
    { name: 'Media Gallery', path: '/admin/gallery', icon: Camera },
    { name: 'Contact Leads', path: '/admin/leads', icon: Mail },
  ];

  // Super admin only items
  if (userRole === 'super_admin') {
    menuItems.push(
      { name: 'Staff Users (RBAC)', path: '/admin/users', icon: ShieldAlert },
      { name: 'System Audit Logs', path: '/admin/audit-logs', icon: History }
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed lg:static top-0 bottom-0 left-0 w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-50 transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-white block leading-tight">Micro Infoweb</span>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">CMS Console</span>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Role Badge */}
        <div className="px-6 py-4 bg-slate-950/50 border-b border-slate-800 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400">Logged in as</span>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
              ★ {userRole.replace('_', ' ')}
            </span>
          </div>
          <Link to="/" target="_blank" className="text-xs text-blue-400 hover:text-cyan-300 flex items-center gap-1" title="Open Public Website">
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-bold'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full btn btn-secondary !py-2.5 !px-4 text-xs !justify-start text-rose-400 hover:text-rose-300 border-rose-500/20 hover:border-rose-500/40 hover:bg-rose-950/20"
          >
            <LogOut className="w-4 h-4" />
            <span>Secure Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="bg-slate-900 border-b border-slate-800 h-16 px-6 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg bg-white/5 text-slate-300 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-4 ml-auto">
            <span className="text-xs text-slate-400 hidden sm:inline">
              System Health: <strong className="text-emerald-400 font-mono">100% OPERATIONAL</strong>
            </span>
            <Link
              to="/"
              className="btn btn-secondary !py-1.5 !px-3 text-xs flex items-center gap-1.5"
            >
              <span>View Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Dashboard View Area */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
