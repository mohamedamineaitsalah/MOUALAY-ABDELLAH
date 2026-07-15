import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { FiGlobe, FiLogOut, FiUser } from 'react-icons/fi';
import { FaFacebook, FaWhatsapp, FaPhone, FaEnvelope } from 'react-icons/fa';

const Navbar = () => {
  const { t, toggleLanguage, isArabic } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { path: '/', label: t('nav.home') || 'Home' },
    { path: '/about', label: t('nav.about') || 'About' },
    { path: '/program', label: t('nav.program') || 'Program' },
    { path: '/news', label: t('nav.news') || 'News' },
    { path: '/gallery', label: t('nav.gallery') || 'Gallery' },
    { path: '/participants', label: t('nav.participants') || 'Participants' },
    { path: '/sponsors', label: t('nav.sponsors') || 'Sponsors' },
    { path: '/contact', label: t('nav.contact') || 'Contact' }
  ];

  const getNavLinkClass = ({ isActive }) => 
    `transition-colors text-sm font-medium px-3 py-2 rounded-md ${isActive ? "bg-black/20 text-gold-400" : "text-white hover:text-gold-400"}`;

  return (
    <nav className="bg-primary-900 text-white shadow-lg sticky top-0 z-50 border-b border-gold-500/20">
        <div className="max-w-[98%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            
            {/* Logo Section */}
            <div className="flex-shrink-0 flex items-center gap-3">
              <Link to="/" className="flex items-center">
                <img src="/images/logo-header-white.png" alt="Moussem Moulay Abdellah Amghar" className="h-16 w-auto object-contain" />
              </Link>
            </div>
            
            {/* Navigation Links */}
            <div className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <NavLink key={link.path} to={link.path} className={getNavLinkClass}>
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-6">
              <button onClick={toggleLanguage} className="flex items-center gap-2 hover:text-gold-400 transition-colors text-sm font-medium">
                {isArabic ? 'Français' : 'العربية'}
              </button>
              
              {user ? (
                <div className="flex items-center gap-4">
                  <Link to="/admin/dashboard" className="flex items-center gap-2 text-white hover:text-gold-400 transition-colors uppercase text-sm font-medium">
                    <div className="bg-gold-400 text-primary-900 rounded-full w-8 h-8 flex items-center justify-center">
                      <FiUser size={18} />
                    </div>
                    {user.name || 'MR. ADMIN'}
                  </Link>
                  <button onClick={handleLogout} className="text-gray-300 hover:text-red-500 transition-colors" title={t('nav.logout') || 'Logout'}>
                    <FiLogOut size={20} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" className="bg-gold-500 hover:bg-gold-600 text-primary-900 px-5 py-2 rounded-md font-bold transition-colors text-sm">
                    {t('nav.login') || 'Login'}
                  </Link>
                  <Link to="/register" className="bg-white hover:bg-gray-200 text-primary-900 px-5 py-2 rounded-md font-bold transition-colors text-sm">
                    Register
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>
    </nav>
  );
};
export default Navbar;