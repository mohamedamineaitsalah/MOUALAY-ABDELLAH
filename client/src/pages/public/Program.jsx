import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { programService } from '../../services/services';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

const Program = () => {
  const { t, isArabic } = useLanguage();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    programService.getAll().then(res => {
      if (res.data.success) {
        setEvents(res.data.data);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="bg-sand-50 min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-900 mb-4">{t('program.title')}</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t('program.subtitle')}</p>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <FaCalendarAlt className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <p className="text-xl text-gray-500">{t('program.empty')}</p>
          </div>
        ) : (
          <div className="relative border-l-4 border-gold-400 rtl:border-l-0 rtl:border-r-4 ml-6 rtl:ml-0 rtl:mr-6">
            {events.map((event, index) => (
              <div key={event.id} className="mb-10 ml-8 rtl:ml-0 rtl:mr-8 relative">
                
                <span className="absolute -left-10 rtl:auto rtl:-right-10 top-1.5 flex h-4 w-4 rounded-full bg-primary-600 ring-4 ring-white"></span>
                
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="md:flex">
                    {event.image && (
                      <div className="md:w-1/3 relative overflow-hidden bg-gray-900 flex items-center justify-center min-h-[250px] md:min-h-full">
                        <img 
                          src={`/api/uploads/${event.image}`} 
                          alt="" 
                          className="absolute inset-0 w-full h-full object-cover blur-lg scale-110 opacity-40 select-none pointer-events-none"
                        />
                        <img 
                          src={`/api/uploads/${event.image}`} 
                          alt={isArabic ? event.title_ar : event.title_en} 
                          className="relative z-10 w-full h-full object-contain max-h-[350px] md:max-h-full object-center" 
                        />
                      </div>
                    )}
                    <div className={`p-6 ${event.image ? 'md:w-2/3' : 'w-full'}`}>
                      <div className="mb-4">
                        {event.title_ar && (
                          <h3 className="text-2xl font-bold text-primary-800 text-right font-arabic mb-1" dir="rtl">
                            {event.title_ar}
                          </h3>
                        )}
                        {event.title_en && (
                          <h3 className="text-xl font-semibold text-primary-700 text-left">
                            {event.title_en}
                          </h3>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-4 mb-4 text-sm font-medium text-gray-600">
                        {event.event_date && (
                          <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full">
                            <FaCalendarAlt className="text-gold-500" />
                            <span>{new Date(event.event_date).toLocaleDateString('en-GB')}</span>
                          </div>
                        )}
                        {event.event_time && (
                          <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full">
                            <FaClock className="text-gold-500" />
                            <span className="dir-ltr">{event.event_time.slice(0, 5)}</span>
                          </div>
                        )}
                        {event.location && (
                          <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full">
                            <FaMapMarkerAlt className="text-gold-500" />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                        {event.description_ar && (
                          <p className="text-gray-700 leading-relaxed text-right font-arabic border-b border-gray-200 pb-2" dir="rtl">
                            {event.description_ar}
                          </p>
                        )}
                        {event.description_en && (
                          <p className="text-gray-600 leading-relaxed text-left pt-1">
                            {event.description_en}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Program;
