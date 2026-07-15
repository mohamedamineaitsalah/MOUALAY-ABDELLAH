const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'client', 'src');

const files = {
  'components/layout/Navbar.jsx': `import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { FiGlobe, FiLogOut } from 'react-icons/fi';

const Navbar = () => {
  const { t, toggleLanguage, isArabic } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-primary-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex-shrink-0 flex items-center gap-4">
            <Link to="/" className="text-2xl font-bold text-gold-400 font-heading">
              {isArabic ? 'موسم مولاي عبد الله' : 'Moussem Moulay Abdellah'}
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-6 space-x-reverse">
            <Link to="/" className="hover:text-gold-400 transition-colors">{t('nav.home')}</Link>
            <Link to="/about" className="hover:text-gold-400 transition-colors">{t('nav.about')}</Link>
            <Link to="/program" className="hover:text-gold-400 transition-colors">{t('nav.program')}</Link>
            
            {user?.role === 'admin' && (
              <Link to="/admin/dashboard" className="text-gold-400 hover:text-white transition-colors">{t('nav.dashboard')}</Link>
            )}
            
            <button onClick={toggleLanguage} className="flex items-center gap-2 hover:text-gold-400 transition-colors">
              <FiGlobe /> {t('nav.language')}
            </button>
            
            {user ? (
              <button onClick={handleLogout} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md transition-colors">
                <FiLogOut /> {t('nav.logout')}
              </button>
            ) : (
              <Link to="/login" className="bg-gold-500 hover:bg-gold-600 text-primary-900 px-4 py-2 rounded-md font-bold transition-colors">
                {t('nav.login')}
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;`,

  'components/layout/Footer.jsx': `import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-primary-900 text-white pt-12 pb-8 border-t-4 border-gold-500">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h3 className="text-2xl text-gold-400 mb-4">{t('hero.title')}</h3>
        <p className="text-gray-400 mb-8 max-w-xl mx-auto">{t('footer.description')}</p>
        <div className="border-t border-gray-700 pt-8 mt-8 text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} {t('footer.copyright')}
        </div>
      </div>
    </footer>
  );
};
export default Footer;`,

  'pages/auth/Login.jsx': `import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(email, password);
      toast.success(t('nav.login') + ' ' + 'Success');
      if (res.user.role === 'admin') navigate('/admin/dashboard');
      else navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-sand-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full glass-card p-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-primary-900 mb-8">
            {t('nav.login')}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <input
                type="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-primary-900 bg-gold-500 hover:bg-gold-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500 transition-colors"
            >
              {t('nav.login')}
            </button>
          </div>
          <div className="text-center text-sm text-gray-500 mt-4">
            Admin Account:<br/>
            Mohamedamineaitsalah02@gmail.com / Moulay1
          </div>
        </form>
      </div>
    </div>
  );
};
export default Login;`,

  'layouts/AdminLayout.jsx': `import React from 'react';
import { Navigate, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { FiHome, FiUsers, FiFileText, FiImage, FiVideo, FiCalendar, FiLogOut } from 'react-icons/fi';

const AdminLayout = () => {
  const { user, isAdmin, logout } = useAuth();
  const { t } = useLanguage();

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const menu = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <FiHome /> },
    { name: 'News', path: '/admin/news', icon: <FiFileText /> },
    { name: 'Program', path: '/admin/program', icon: <FiCalendar /> },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100" dir="ltr">
      {/* Sidebar */}
      <aside className="w-64 bg-primary-900 text-white min-h-screen shadow-xl">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gold-400">Admin Panel</h2>
        </div>
        <nav className="mt-6">
          {menu.map((item, idx) => (
            <Link key={idx} to={item.path} className="flex items-center px-6 py-3 text-gray-300 hover:bg-primary-800 hover:text-white transition-colors">
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          ))}
          <button onClick={() => { logout(); window.location.href='/'; }} className="w-full flex items-center px-6 py-3 text-red-400 hover:bg-primary-800 hover:text-red-300 transition-colors mt-8">
            <span className="mr-3"><FiLogOut /></span>
            Logout
          </button>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-8">
          <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
          <Link to="/" className="text-primary-600 hover:text-primary-800 font-medium text-sm border border-primary-600 px-4 py-1 rounded-full">View Site</Link>
        </header>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
export default AdminLayout;`,

  'pages/admin/Dashboard.jsx': `import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { FiUsers, FiFileText, FiImage, FiVideo, FiCalendar } from 'react-icons/fi';

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-lg shadow-sm p-6 border-l-4" style={{ borderColor: color }}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
      </div>
      <div className="p-3 rounded-full bg-gray-50" style={{ color }}>
        {icon}
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        setStats(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>Loading statistics...</div>;
  if (!stats) return <div>Error loading stats</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Overview Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Registered Users" value={stats.users} icon={<FiUsers size={24} />} color="#3b82f6" />
        <StatCard title="News Articles" value={stats.news} icon={<FiFileText size={24} />} color="#10b981" />
        <StatCard title="Gallery Images" value={stats.gallery} icon={<FiImage size={24} />} color="#8b5cf6" />
        <StatCard title="Videos" value={stats.videos} icon={<FiVideo size={24} />} color="#ef4444" />
        <StatCard title="Upcoming Events" value={stats.upcomingEvents} icon={<FiCalendar size={24} />} color="#f59e0b" />
      </div>
    </div>
  );
};
export default Dashboard;`,

  'App.jsx': `import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AdminLayout from './layouts/AdminLayout';

const Home = React.lazy(() => import('./pages/public/Home'));
const Login = React.lazy(() => import('./pages/auth/Login'));
const Dashboard = React.lazy(() => import('./pages/admin/Dashboard'));

const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <Footer />
  </>
);

function App() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-primary-600 text-xl">Loading...</div>}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          {/* Add more admin routes here as they are built */}
        </Route>
      </Routes>
    </Suspense>
  );
}
export default App;`
};

for (const [filepath, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(baseDir, filepath), content);
}
console.log('Frontend scaffolding step 2 done.');
