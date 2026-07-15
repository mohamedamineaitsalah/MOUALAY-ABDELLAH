import React, { createContext, useContext, useState, useEffect } from 'react';
import { settingsService } from '../services/services';
import { useLanguage } from './LanguageContext';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const { isArabic } = useLanguage();
  const [settings, setSettings] = useState({
    site_title_ar: '',
    site_title_en: '',
    site_desc_ar: '',
    site_desc_en: '',
    contact_email: '',
    contact_phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await settingsService.getAll();
      if (res.data && res.data.success) {
        setSettings(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Update document title when settings or language changes
  useEffect(() => {
    if (settings.site_title_en || settings.site_title_ar) {
      document.title = isArabic ? settings.site_title_ar : settings.site_title_en;
    }
  }, [settings, isArabic]);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
