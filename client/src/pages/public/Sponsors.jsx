import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { sponsorService } from '../../services/services';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FaGlobe, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

const Sponsors = () => {
  const { t } = useLanguage();
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sponsorService.getAll().then(res => {
      if (res.data.success) {
        setSponsors(res.data.data);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="relative min-h-screen border-t border-gray-100 overflow-hidden">
      
      <div className="absolute top-0 left-0 w-full h-full z-0 bg-black">
        <iframe
          src="https://www.youtube.com/embed/J5jXj5znzEw?autoplay=1&loop=1&playlist=J5jXj5znzEw&controls=0&mute=0"
          title="Sponsors Background Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2 opacity-80"
          allowFullScreen
        ></iframe>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">{t('sponsors.title')}</h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto drop-shadow-md">{t('sponsors.subtitle')}</p>
        </div>

        {sponsors.length === 0 ? (
          <div className="text-center py-20 text-gray-500 bg-sand-50 rounded-xl">
            {t('sponsors.empty')}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8">
            {sponsors.map(sponsor => (
              <div key={sponsor.id} className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-all border border-transparent hover:border-gold-300">
                <div className="h-32 w-full flex items-center justify-center mb-6 bg-white rounded-xl p-4 shadow-inner">
                  {sponsor.logo ? (
                    <img src={`/api/uploads/${sponsor.logo}`} alt={sponsor.name} className="max-h-full max-w-full object-contain" />
                  ) : (
                    <span className="text-2xl font-bold text-gray-400">{sponsor.name}</span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-primary-900 mb-3">{sponsor.name}</h3>
                {sponsor.description && (
                  <p className="text-sm text-gray-600 mb-6 line-clamp-3 flex-1">{sponsor.description}</p>
                )}
                
                <div className="flex gap-4 mt-auto pt-4 border-t border-gray-200 w-full justify-center">
                  {sponsor.website && (
                    <a href={sponsor.website} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-600 transition-colors">
                      <FaGlobe size={20} />
                    </a>
                  )}
                  {sponsor.facebook && (
                    <a href={sponsor.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
                      <FaFacebook size={20} />
                    </a>
                  )}
                  {sponsor.instagram && (
                    <a href={sponsor.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-600 transition-colors">
                      <FaInstagram size={20} />
                    </a>
                  )}
                  {sponsor.twitter && (
                    <a href={sponsor.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                      <FaTwitter size={20} />
                    </a>
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

export default Sponsors;
