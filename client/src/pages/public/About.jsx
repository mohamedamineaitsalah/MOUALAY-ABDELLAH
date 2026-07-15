import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import AnimatedCounter from '../../components/common/AnimatedCounter';

const About = () => {
  const { t, isArabic } = useLanguage();

  const facts = [
    { number: '+800', label: t('about.facts.years') },
    { number: '150', label: t('about.facts.tribes') },
    { number: '+2000', label: t('about.facts.horses') },
    { number: '500K', label: t('about.facts.participants') },
  ];

  return (
    <div className="bg-sand-50 min-h-screen pb-16">
      
      <div className="bg-primary-900 text-white py-16 mb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-repeat bg-center" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gold-400 font-heading">{t('about.title')}</h1>
          <p className="text-xl max-w-2xl mx-auto">{t('about.subtitle')}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className={`relative order-2 ${isArabic ? 'md:order-2' : 'md:order-1'}`}>
            <div className="absolute inset-0 bg-gold-400 rounded-2xl transform translate-x-4 translate-y-4 opacity-50"></div>
            <img src="/images/WALLPER.jpeg" alt="Tbourida" className="w-full rounded-2xl shadow-2xl relative z-10" />
          </div>
          <div className={`order-1 ${isArabic ? 'md:order-1' : 'md:order-2'}`}>
            <h2 className="text-3xl font-bold text-primary-800 mb-6">{t('about.tbourida.title')}</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6 text-justify">
              {t('about.tbourida.desc')}
            </p>
            <div className="bg-white p-6 rounded-xl border-l-4 border-gold-500 shadow-sm">
              <h3 className="text-xl font-bold text-primary-700 mb-3">{t('about.history.title')}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t('about.history.desc')}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {facts.map((fact, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-md text-center border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="text-4xl md:text-5xl font-bold text-gold-500 mb-2">
                <AnimatedCounter value={fact.number} />
              </div>
              <div className="text-gray-600 font-medium">{fact.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl overflow-hidden shadow-xl flex flex-col md:flex-row">
          <div className="p-10 md:w-1/3 bg-primary-900 text-white flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-gold-400 mb-4">{t('about.location.title')}</h2>
            <p className="text-lg mb-6 leading-relaxed">
              {t('about.location.desc')}
            </p>
          </div>
          <div className="md:w-2/3 h-96">
            <iframe
              title="Moulay Abdellah Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13349.521236544521!2d-8.563969792193566!3d33.195155694723146!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda439bc7a34e0a9%3A0xc6e4ff945037d4e!2sMoulay%20Abdellah!5e0!3m2!1sen!2sma!4v1700000000000!5m2!1sen!2sma"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
