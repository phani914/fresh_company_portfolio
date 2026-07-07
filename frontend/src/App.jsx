import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { publicService, authService } from './services/api';

// Public Components
import Navbar from './components/public/Navbar';
import Footer from './components/public/Footer';
import HomePage from './components/public/HomePage';
import AboutUsPage from './components/public/AboutUsPage';
import ServicesPage from './components/public/ServicesPage';
import ProjectsPage from './components/public/ProjectsPage';
import TeamPage from './components/public/TeamPage';
import CareersPage from './components/public/CareersPage';
import GalleryPage from './components/public/GalleryPage';
import ContactPage from './components/public/ContactPage';

// Admin Components
import AdminLogin from './components/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import DashboardKPIs from './components/admin/DashboardKPIs';
import AdminCompanyProfile from './components/admin/AdminCompanyProfile';
import AdminServices from './components/admin/AdminServices';
import AdminProjects from './components/admin/AdminProjects';
import AdminTeam from './components/admin/AdminTeam';
import AdminTestimonials from './components/admin/AdminTestimonials';
import AdminCareers from './components/admin/AdminCareers';
import AdminGallery from './components/admin/AdminGallery';
import AdminLeads from './components/admin/AdminLeads';
import AdminUsers from './components/admin/AdminUsers';
import AdminAuditLogs from './components/admin/AdminAuditLogs';

// Helper to scroll to top on navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Protected Admin Route Guard (Section 25 of SRS)
function ProtectedRoute({ children }) {
  const isAuth = authService.isAuthenticated();
  if (!isAuth) {
    return <Navigate to="/admin/login" replace />;
  }
  return <AdminLayout>{children}</AdminLayout>;
}

export default function App() {
  const [profile, setProfile] = useState(null);
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [team, setTeam] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [careers, setCareers] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGlobalPublicData = async () => {
    setLoading(true);
    try {
      const [profRes, svcRes, projRes, teamRes, testRes, carRes, galRes] = await Promise.all([
        publicService.getCompanyProfile().catch(() => ({ data: {} })),
        publicService.getServices().catch(() => ({ data: [] })),
        publicService.getProjects().catch(() => ({ data: [] })),
        publicService.getTeam().catch(() => ({ data: [] })),
        publicService.getTestimonials().catch(() => ({ data: [] })),
        publicService.getCareers().catch(() => ({ data: [] })),
        publicService.getGallery().catch(() => ({ data: [] })),
      ]);

      setProfile(profRes.data);
      setServices(svcRes.data);
      setProjects(projRes.data);
      setTeam(teamRes.data);
      setTestimonials(testRes.data);
      setCareers(carRes.data);
      setGallery(galRes.data);
    } catch (err) {
      console.error("Failed to load initial public telemetry:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGlobalPublicData();
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
        <Routes>
          {/* --- ADMIN DASHBOARD ROUTES --- */}
          <Route path="/admin/login" element={<AdminLogin onLoginSuccess={fetchGlobalPublicData} />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><DashboardKPIs /></ProtectedRoute>} />
          <Route path="/admin/profile" element={<ProtectedRoute><AdminCompanyProfile /></ProtectedRoute>} />
          <Route path="/admin/services" element={<ProtectedRoute><AdminServices /></ProtectedRoute>} />
          <Route path="/admin/projects" element={<ProtectedRoute><AdminProjects /></ProtectedRoute>} />
          <Route path="/admin/team" element={<ProtectedRoute><AdminTeam /></ProtectedRoute>} />
          <Route path="/admin/testimonials" element={<ProtectedRoute><AdminTestimonials /></ProtectedRoute>} />
          <Route path="/admin/careers" element={<ProtectedRoute><AdminCareers /></ProtectedRoute>} />
          <Route path="/admin/gallery" element={<ProtectedRoute><AdminGallery /></ProtectedRoute>} />
          <Route path="/admin/leads" element={<ProtectedRoute><AdminLeads /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/audit-logs" element={<ProtectedRoute><AdminAuditLogs /></ProtectedRoute>} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

          {/* --- PUBLIC PORTFOLIO WEBSITE ROUTES --- */}
          <Route
            path="/*"
            element={
              <div className="flex flex-col min-h-screen">
                <Navbar companyName={profile?.company_name || "Micro Infoweb"} />
                <main className="flex-1">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 animate-spin">
                        <div className="w-full h-full bg-slate-950 rounded-[14px]" />
                      </div>
                      <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest animate-pulse">
                        Initializing Micro Infoweb Mesh...
                      </span>
                    </div>
                  ) : (
                    <Routes>
                      <Route path="/" element={<HomePage profile={profile} services={services} projects={projects} testimonials={testimonials} />} />
                      <Route path="/about" element={<AboutUsPage profile={profile} team={team} />} />
                      <Route path="/services" element={<ServicesPage services={services} />} />
                      <Route path="/projects" element={<ProjectsPage projects={projects} />} />
                      <Route path="/team" element={<TeamPage team={team} />} />
                      <Route path="/careers" element={<CareersPage careers={careers} />} />
                      <Route path="/gallery" element={<GalleryPage gallery={gallery} />} />
                      <Route path="/contact" element={<ContactPage profile={profile} />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  )}
                </main>
                <Footer profile={profile} />
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}
