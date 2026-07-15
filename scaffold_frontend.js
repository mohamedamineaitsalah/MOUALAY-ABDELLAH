const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'client', 'src');

const dirs = [
  'assets',
  'components/common',
  'components/layout',
  'components/sections',
  'contexts',
  'hooks',
  'layouts',
  'pages/public',
  'pages/admin',
  'pages/auth',
  'pages/errors',
  'services',
  'utils'
];

dirs.forEach(dir => {
  fs.mkdirSync(path.join(baseDir, dir), { recursive: true });
});

const files = {
  'utils/translations.js': `const translations = {
  // Nav
  'nav.home': { ar: 'الرئيسية', en: 'Home' },
  'nav.about': { ar: 'حول الموسم', en: 'About' },
  'nav.program': { ar: 'البرنامج', en: 'Program' },
  'nav.gallery': { ar: 'المعرض', en: 'Gallery' },
  'nav.participants': { ar: 'المشاركون', en: 'Participants' },
  'nav.sponsors': { ar: 'الرعاة', en: 'Sponsors' },
  'nav.news': { ar: 'الأخبار', en: 'News' },
  'nav.contact': { ar: 'اتصل بنا', en: 'Contact' },
  'nav.login': { ar: 'تسجيل الدخول', en: 'Login' },
  'nav.register': { ar: 'إنشاء حساب', en: 'Register' },
  'nav.dashboard': { ar: 'لوحة التحكم', en: 'Dashboard' },
  'nav.logout': { ar: 'تسجيل الخروج', en: 'Logout' },
  'nav.language': { ar: 'English', en: 'العربية' },

  // Hero
  'hero.title': { ar: 'موسم مولاي عبد الله أمغار', en: 'Moussem Moulay Abdellah Amghar' },
  'hero.subtitle': { ar: 'أكبر تجمع للتبوريدة والفروسية التقليدية في المغرب', en: 'The Biggest Traditional Equestrian & Tbourida Festival in Morocco' },
  'hero.explore': { ar: 'اكتشف الموسم', en: 'Explore the Festival' },
  'hero.program': { ar: 'البرنامج', en: 'Festival Program' },
  
  // Footer
  'footer.quickLinks': { ar: 'روابط سريعة', en: 'Quick Links' },
  'footer.followUs': { ar: 'تابعونا', en: 'Follow Us' },
  'footer.copyright': { ar: 'جميع الحقوق محفوظة', en: 'All Rights Reserved' },
  'footer.description': { ar: 'موسم مولاي عبد الله أمغار - أكبر تجمع للتبوريدة والفروسية التقليدية في المغرب', en: 'Moussem Moulay Abdellah Amghar - The Biggest Traditional Equestrian & Tbourida Festival in Morocco' }
};
export default translations;`,
  
  'contexts/LanguageContext.jsx': `import React, { createContext, useState, useContext, useEffect } from 'react';
import translations from '../utils/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'ar');

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
  };

  const t = (key) => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, isArabic: language === 'ar', dir: language === 'ar' ? 'rtl' : 'ltr' }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);`,

  'contexts/AuthContext.jsx': `import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = \`Bearer \${token}\`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    setToken(res.data.token);
    setUser(res.data.user);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    return res.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated: !!user, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);`,

  'services/api.js': `import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;`,

  'App.jsx': `import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const Home = React.lazy(() => import('./pages/public/Home'));

function App() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Suspense>
  );
}
export default App;`,

  'main.jsx': `import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <App />
          <ToastContainer position="top-right" autoClose={3000} />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>
);`,

  'pages/public/Home.jsx': `import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const Home = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-sand-50">
      <header className="bg-primary-600 text-gold-500 p-4 shadow-md">
        <h1 className="text-3xl text-center">{t('hero.title')}</h1>
      </header>
      <main className="section-padding text-center">
        <h2 className="text-2xl mb-4">{t('hero.subtitle')}</h2>
        <p className="max-w-2xl mx-auto mb-8 text-gray-700">Moussem Moulay Abdellah Amghar web platform is under construction.</p>
        <button className="bg-gold-500 text-primary-900 px-6 py-2 rounded-md font-bold">{t('hero.explore')}</button>
      </main>
    </div>
  );
};
export default Home;`
};

for (const [filepath, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(baseDir, filepath), content);
}
console.log('Frontend scaffolding step 1 done.');
