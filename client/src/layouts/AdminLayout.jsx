import React from 'react';
import { Navigate, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { FiHome, FiUsers, FiFileText, FiImage, FiCalendar, FiLogOut, FiSettings, FiMail } from 'react-icons/fi';
import { FaHorse, FaHandshake, FaTachometerAlt } from 'react-icons/fa';

const AdminLayout = () => {
  const { user, isAdmin, logout } = useAuth();
  const { t } = useLanguage();

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const menu = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <FaTachometerAlt /> },
    { name: 'Users', path: '/admin/users', icon: <FiUsers /> },
    { name: 'News', path: '/admin/news', icon: <FiFileText /> },
    { name: 'Festival Program', path: '/admin/program', icon: <FiCalendar /> },
    { name: 'Gallery', path: '/admin/gallery', icon: <FiImage /> },
    { name: 'Participants', path: '/admin/participants', icon: <FaHorse /> },
    { name: 'Sponsors', path: '/admin/sponsors', icon: <FaHandshake /> },
    { name: 'Messages', path: '/admin/messages', icon: <FiMail /> },
    { name: 'Settings', path: '/admin/settings', icon: <FiSettings /> },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100" dir="ltr">
      {/* Sidebar */}
      <aside className="w-64 bg-primary-900 text-white min-h-screen shadow-xl">
        <div className="p-6 border-b border-primary-800 pb-6 mb-2">
          <Link to="/" className="flex items-center justify-center">
            <img src="/images/logo-header-white.png" alt="Moussem Moulay Abdellah Amghar" className="h-20 w-auto object-contain" />
          </Link>
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
export default AdminLayout;