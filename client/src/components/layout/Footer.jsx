import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSettings } from '../../contexts/SettingsContext';
import { FaFacebook, FaTwitter, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  const { t, isArabic } = useLanguage();
  const { settings } = useSettings();
  
  const siteTitle = isArabic ? settings?.site_title_ar : settings?.site_title_en;
  const siteDesc = isArabic ? settings?.site_desc_ar : settings?.site_desc_en;
  
  return (
    <footer className="bg-primary-900 text-white pt-12 pb-8 border-t-4 border-gold-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          {/* About Column */}
          <div>
            <h3 className="text-2xl text-gold-400 mb-4">{siteTitle || t('hero.title') || 'Moussem Moulay Abdellah Amghar'}</h3>
            <p className="text-gray-400 mb-6">{siteDesc || t('footer.description') || 'Moussem Moulay Abdellah Amghar - The Biggest Traditional Equestrian & Tbourida Festival in Morocco'}</p>
          </div>

          {/* Quick Links Column */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-xl text-white mb-4 font-bold">Quick Links</h4>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-2 text-gray-400">
              <li><a href="/" className="hover:text-gold-400 transition-colors">Home</a></li>
              <li><a href="/about" className="hover:text-gold-400 transition-colors">About</a></li>
              <li><a href="/program" className="hover:text-gold-400 transition-colors">Program</a></li>
              <li><a href="/news" className="hover:text-gold-400 transition-colors">News</a></li>
              <li><a href="/gallery" className="hover:text-gold-400 transition-colors">Gallery</a></li>
              <li><a href="/participants" className="hover:text-gold-400 transition-colors">Participants</a></li>
              <li><a href="/sponsors" className="hover:text-gold-400 transition-colors">Sponsors</a></li>
              <li><a href="/contact" className="hover:text-gold-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info Column */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-xl text-white mb-4 font-bold">Contact Us</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center gap-3">
                <span className="text-gold-400">&#9742;</span>
                <a href={`tel:${settings?.contact_phone || '0697936897'}`} className="hover:text-white transition-colors">{settings?.contact_phone || '0697936897'}</a>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-gold-400">&#9993;</span>
                <a href={`mailto:${settings?.contact_email || 'mohamedamineaitsalah02@gmail.com'}`} className="hover:text-white transition-colors">{settings?.contact_email || 'mohamedamineaitsalah02@gmail.com'}</a>
              </li>
              <li className="flex gap-4 mt-4">
                <a href="#" className="w-10 h-10 rounded-full bg-primary-800 flex items-center justify-center text-white hover:bg-gold-500 hover:text-primary-900 transition-all" title="Facebook">
                  <FaFacebook size={20} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-primary-800 flex items-center justify-center text-white hover:bg-gold-500 hover:text-primary-900 transition-all" title="X (Twitter)">
                  <FaTwitter size={20} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-primary-800 flex items-center justify-center text-white hover:bg-gold-500 hover:text-primary-900 transition-all" title="YouTube">
                  <FaYoutube size={20} />
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-primary-800 pt-8 mt-12 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} {t('footer.copyright') || 'All Rights Reserved'}
        </div>
      </div>
    </footer>
  );
};
export default Footer;