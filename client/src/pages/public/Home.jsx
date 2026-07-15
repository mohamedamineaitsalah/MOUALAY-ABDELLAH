import React, { useRef, useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { countdownService, sponsorService } from '../../services/services';
import { motion } from 'framer-motion';

const Home = () => {
  const { t, isArabic } = useLanguage();
  const nextSectionRef = useRef(null);
  
  const [countdown, setCountdown] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [sponsors, setSponsors] = useState([]);

  useEffect(() => {
    countdownService.get().then(res => {
      if (res.data.data?.festival_date) {
        setCountdown(new Date(res.data.data.festival_date).getTime());
      }
    });

    sponsorService.getAll().then(res => {
      if (res.data.success) {
        setSponsors(res.data.data.slice(0, 4)); 
      }
    });
  }, []);

  useEffect(() => {
    if (!countdown) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = countdown - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [countdown]);

  const handleExploreClick = () => {
    nextSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-sand-50">
      
      <section 
        className="relative h-screen flex flex-col items-center justify-center text-white overflow-hidden"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.55)), url("/images/WALLPER.jpeg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col justify-center items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-gold-400 drop-shadow-lg leading-tight md:leading-snug">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-sand-50 drop-shadow-md font-light max-w-3xl mx-auto">
              {t('hero.subtitle')}
            </p>
          </motion.div>

          {countdown && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-10"
            >
              <h3 className="text-lg text-gold-300 mb-4 font-medium uppercase tracking-wider">{t('hero.countdown')}</h3>
              <div className="flex gap-4 md:gap-8 justify-center rtl:flex-row-reverse">
                {[
                  { label: t('hero.days'), value: timeLeft.days },
                  { label: t('hero.hours'), value: timeLeft.hours },
                  { label: t('hero.minutes'), value: timeLeft.minutes },
                  { label: t('hero.seconds'), value: timeLeft.seconds }
                ].map((item, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="w-16 h-16 md:w-24 md:h-24 bg-primary-900/60 backdrop-blur-sm border-2 border-gold-500 rounded-lg flex items-center justify-center shadow-lg shadow-gold-500/20 mb-2">
                      <span className="text-2xl md:text-4xl font-bold text-white">{item.value.toString().padStart(2, '0')}</span>
                    </div>
                    <span className="text-sm md:text-base text-gray-200 font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          <motion.button 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            onClick={handleExploreClick}
            className="bg-gold-500 hover:bg-gold-600 text-primary-900 font-bold py-3 md:py-4 px-8 md:px-10 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 text-lg"
          >
            {t('hero.explore')}
          </motion.button>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer opacity-70 hover:opacity-100" onClick={handleExploreClick}>
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </section>

      <main ref={nextSectionRef}>
        
        <section className="section-padding bg-sand-50 relative">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className={`order-2 md:order-1 ${isArabic ? 'md:text-right text-right' : 'md:text-left text-left'}`}>
              <h2 className="section-title mb-6">{t('about.title')}</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                {t('about.subtitle')}
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                {t('about.history.desc')}
              </p>
              <a href="/about" className="inline-block border-2 border-primary-600 text-primary-700 hover:bg-primary-600 hover:text-white font-bold py-3 px-8 rounded-full transition-colors">
                {t('general.learnMore')}
              </a>
            </div>
            <div className="order-1 md:order-2 relative">
              <div className="absolute inset-0 bg-gold-400 rounded-2xl transform translate-x-4 translate-y-4 opacity-50"></div>
              <img src="/images/WALLPER.jpeg" alt="Discover Moussem" className="relative z-10 w-full h-auto object-cover rounded-2xl shadow-xl aspect-video" />
            </div>
          </div>
        </section>

        {sponsors.length > 0 && (
          <section className="py-16 bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h3 className="text-2xl font-bold text-primary-900 mb-10 uppercase tracking-widest">{t('sponsors.title')}</h3>
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 transition-all duration-500">
                {sponsors.map(sponsor => (
                  <div key={sponsor.id} className="w-32 md:w-48 h-auto transition-transform hover:scale-110 duration-300">
                    {sponsor.website ? (
                      <a href={sponsor.website} target="_blank" rel="noopener noreferrer">
                        {sponsor.logo ? (
                          <img src={`/api/uploads/${sponsor.logo}`} alt={sponsor.name} className="max-w-full h-auto object-contain cursor-pointer" />
                        ) : (
                          <div className="text-xl font-bold text-gray-400 cursor-pointer">{sponsor.name}</div>
                        )}
                      </a>
                    ) : (
                      sponsor.logo ? (
                        <img src={`/api/uploads/${sponsor.logo}`} alt={sponsor.name} className="max-w-full h-auto object-contain" />
                      ) : (
                        <div className="text-xl font-bold text-gray-400">{sponsor.name}</div>
                      )
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Home;