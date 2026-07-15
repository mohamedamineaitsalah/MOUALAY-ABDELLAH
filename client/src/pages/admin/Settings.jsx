import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { settingsService, countdownService } from '../../services/services';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';
import { FaGlobe, FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaSave, FaSlidersH } from 'react-icons/fa';

const Settings = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [settingsData, setSettingsData] = useState({
    site_title_ar: '',
    site_title_en: '',
    site_desc_ar: '',
    site_desc_en: '',
    contact_email: '',
    contact_phone: '',
    address: ''
  });

  const [countdownDate, setCountdownDate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [settingsRes, countdownRes] = await Promise.all([
          settingsService.getAll(),
          countdownService.get()
        ]);

        if (settingsRes.data.success) {
          setSettingsData(prev => ({
            ...prev,
            ...settingsRes.data.data
          }));
        }

        if (countdownRes.data.success && countdownRes.data.data?.festival_date) {

          const dateVal = new Date(countdownRes.data.data.festival_date);

          const tzOffset = dateVal.getTimezoneOffset() * 60000;
          const localISODate = new Date(dateVal.getTime() - tzOffset).toISOString().slice(0, 16);
          setCountdownDate(localISODate);
        }
      } catch (err) {
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSettingsChange = (e) => {
    setSettingsData({
      ...settingsData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await settingsService.update(settingsData);
      if (res.data.success) {
        toast.success('Site settings updated successfully');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCountdown = async (e) => {
    e.preventDefault();
    if (!countdownDate) return toast.error('Please select a valid date and time');
    setSaving(true);
    try {
      const res = await countdownService.update(new Date(countdownDate).toISOString());
      if (res.data.success) {
        toast.success('Countdown date updated successfully');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update countdown date');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  const tabs = [
    { id: 'general', name: 'General Settings', icon: FaGlobe },
    { id: 'contact', name: 'Contact Information', icon: FaEnvelope },
    { id: 'countdown', name: 'Countdown Timer', icon: FaClock }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FaSlidersH className="text-gold-600" /> Site Settings
          </h1>
          <p className="mt-2 text-sm text-gray-600">Configure global metadata, contact details, and festival countdown.</p>
        </div>
      </div>

      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row min-h-[480px]">
        
        <div className="w-full md:w-64 bg-gray-50 border-r md:border-b-0 border-b border-gray-100 p-4 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-900 text-white shadow-md shadow-primary-900/10'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className={isActive ? 'text-gold-400' : 'text-gray-400'} />
                {tab.name}
              </button>
            );
          })}
        </div>

        <div className="flex-1 p-8">
          {activeTab === 'general' && (
            <form onSubmit={handleSaveSettings} className="space-y-6">
              <h2 className="text-xl font-bold text-primary-900 border-b pb-3 mb-6">General Website Settings</h2>
              
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Site Title (Arabic)</label>
                  <input
                    type="text"
                    name="site_title_ar"
                    value={settingsData.site_title_ar}
                    onChange={handleSettingsChange}
                    dir="rtl"
                    className="block w-full border border-gray-300 rounded-xl py-3 px-4 focus:ring-primary-500 focus:border-primary-500 text-base"
                    placeholder="موسم مولاي عبد الله أمغار"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Site Title (English)</label>
                  <input
                    type="text"
                    name="site_title_en"
                    value={settingsData.site_title_en}
                    onChange={handleSettingsChange}
                    className="block w-full border border-gray-300 rounded-xl py-3 px-4 focus:ring-primary-500 focus:border-primary-500 text-base"
                    placeholder="Moussem Moulay Abdellah Amghar"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Site Description (Arabic)</label>
                  <textarea
                    rows={4}
                    name="site_desc_ar"
                    value={settingsData.site_desc_ar}
                    onChange={handleSettingsChange}
                    dir="rtl"
                    className="block w-full border border-gray-300 rounded-xl py-3 px-4 focus:ring-primary-500 focus:border-primary-500 text-base"
                    placeholder="الوصف بالعربية..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Site Description (English)</label>
                  <textarea
                    rows={4}
                    name="site_desc_en"
                    value={settingsData.site_desc_en}
                    onChange={handleSettingsChange}
                    className="block w-full border border-gray-300 rounded-xl py-3 px-4 focus:ring-primary-500 focus:border-primary-500 text-base"
                    placeholder="Description in English..."
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-primary-600 text-white hover:bg-primary-700 font-bold py-3 px-8 rounded-xl shadow-lg transition-all duration-200"
                >
                  <FaSave /> {saving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'contact' && (
            <form onSubmit={handleSaveSettings} className="space-y-6">
              <h2 className="text-xl font-bold text-primary-900 border-b pb-3 mb-6">Contact Information</h2>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Email Address</label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="contact_email"
                      value={settingsData.contact_email}
                      onChange={handleSettingsChange}
                      className="pl-11 block w-full border border-gray-300 rounded-xl py-3 px-4 focus:ring-primary-500 focus:border-primary-500 text-base"
                      placeholder="contact@moussem.ma"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Phone Number</label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaPhone className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="contact_phone"
                      value={settingsData.contact_phone}
                      onChange={handleSettingsChange}
                      className="pl-11 block w-full border border-gray-300 rounded-xl py-3 px-4 focus:ring-primary-500 focus:border-primary-500 text-base"
                      placeholder="+212 500 000 000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Physical Address</label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaMapMarkerAlt className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="address"
                      value={settingsData.address}
                      onChange={handleSettingsChange}
                      className="pl-11 block w-full border border-gray-300 rounded-xl py-3 px-4 focus:ring-primary-500 focus:border-primary-500 text-base"
                      placeholder="Moulay Abdellah, El Jadida, Morocco"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-primary-600 text-white hover:bg-primary-700 font-bold py-3 px-8 rounded-xl shadow-lg transition-all duration-200"
                >
                  <FaSave /> {saving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'countdown' && (
            <form onSubmit={handleSaveCountdown} className="space-y-6">
              <h2 className="text-xl font-bold text-primary-900 border-b pb-3 mb-6">Festival Countdown Date</h2>
              
              <div className="p-4 bg-yellow-50 text-yellow-800 rounded-xl border border-yellow-100 text-sm leading-relaxed mb-4">
                Updating this date changes the countdown timer displayed on the homepage hero section. Make sure to specify the exact starting date and time of the next festival edition.
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Festival Launch Date & Time</label>
                <div className="relative rounded-xl shadow-sm">
                  <input
                    type="datetime-local"
                    value={countdownDate}
                    onChange={(e) => setCountdownDate(e.target.value)}
                    className="block w-full border border-gray-300 rounded-xl py-3 px-4 focus:ring-primary-500 focus:border-primary-500 text-base"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-primary-600 text-white hover:bg-primary-700 font-bold py-3 px-8 rounded-xl shadow-lg transition-all duration-200"
                >
                  <FaSave /> {saving ? 'Saving...' : 'Save Date'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
