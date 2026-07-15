import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { participantService } from '../../services/services';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FaMapMarkerAlt, FaTrophy } from 'react-icons/fa';

const Participants = () => {
  const { t, isArabic } = useLanguage();
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    participantService.getAll().then(res => {
      if (res.data.success) {
        setParticipants(res.data.data);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="bg-sand-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-900 mb-4">{t('participants.title')}</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t('participants.subtitle')}</p>
        </div>

        {participants.length === 0 ? (
          <div className="text-center py-20 text-gray-500 bg-white rounded-xl shadow-sm">
            {t('participants.empty')}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {participants.map(p => (
              <div key={p.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow group">
                <div className="h-72 w-full overflow-hidden relative bg-gray-200 flex items-center justify-center">
                  {p.photo ? (
                    <img 
                      src={`/api/uploads/${p.photo}`} 
                      alt={isArabic ? (p.name_ar || p.name) : (p.name_en || p.name)} 
                      className="w-full h-full object-cover object-top" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-300">
                      <FaTrophy size={64} />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 rtl:left-4 rtl:right-auto bg-gold-500 text-primary-900 px-4 py-1 rounded-full font-bold shadow-md">
                    {isArabic ? 'مشارك' : 'Participant'}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-primary-800 mb-2">
                    {isArabic ? (p.name_ar || p.name) : (p.name_en || p.name)}
                  </h3>
                  {(isArabic ? (p.city_ar || p.city) : (p.city_en || p.city)) && (
                    <div className="flex items-center gap-2 text-gray-500 mb-4 font-medium">
                      <FaMapMarkerAlt className="text-gold-500" />
                      <span>{isArabic ? (p.city_ar || p.city) : (p.city_en || p.city)}</span>
                    </div>
                  )}
                  <p className="text-gray-600 mb-4">
                    {isArabic ? (p.description_ar || p.description_en) : (p.description_en || p.description_ar)}
                  </p>
                  {(isArabic ? (p.achievements_ar || p.achievements) : (p.achievements_en || p.achievements)) && (
                    <div className="bg-sand-100 p-4 rounded-xl border border-sand-200">
                      <h4 className="font-bold text-primary-700 flex items-center gap-2 mb-2">
                        <FaTrophy className="text-gold-500" />
                        {t('participants.achievements')}
                      </h4>
                      <p className="text-sm text-gray-700">
                        {isArabic ? (p.achievements_ar || p.achievements) : (p.achievements_en || p.achievements)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Participants;
