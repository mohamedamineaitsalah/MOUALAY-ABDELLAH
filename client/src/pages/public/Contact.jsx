import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { messageService } from '../../services/services';
import { toast } from 'react-toastify';
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const Contact = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await messageService.create(formData);
      if (res.data.success) {
        toast.success(t('contact.success'));
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (error) {
      toast.error(t('contact.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-sand-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-900 mb-4">{t('contact.title')}</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t('contact.subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 bg-white rounded-3xl overflow-hidden shadow-xl">
          
          <div className="p-8 md:p-12">
            <h3 className="text-2xl font-bold text-primary-800 mb-8">{t('contact.title')}</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('contact.name')}</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('contact.email')}</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all outline-none dir-ltr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('contact.subject')}</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('contact.message')}</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all outline-none resize-none"
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 px-6 rounded-xl text-primary-900 font-bold text-lg transition-all ${
                  isSubmitting ? 'bg-gold-300 cursor-not-allowed' : 'bg-gold-500 hover:bg-gold-400 hover:shadow-lg'
                }`}
              >
                {isSubmitting ? t('contact.sending') : t('contact.send')}
              </button>
            </form>
          </div>

          <div className="bg-primary-900 text-white flex flex-col">
            <div className="p-8 md:p-12 flex-1">
              <h3 className="text-2xl font-bold text-gold-400 mb-8">{t('footer.contact')}</h3>
              <ul className="space-y-6 mb-8">
                <li className="flex items-start gap-4">
                  <FaMapMarkerAlt className="text-gold-500 mt-1 flex-shrink-0 text-xl" />
                  <span className="text-gray-300 text-lg">{t('about.location.desc')}</span>
                </li>
                <li className="flex items-center gap-4">
                  <FaPhone className="text-gold-500 flex-shrink-0 text-xl" />
                  <span className="text-gray-300 text-lg dir-ltr inline-block text-left">0697936897</span>
                </li>
                <li className="flex items-center gap-4">
                  <FaEnvelope className="text-gold-500 flex-shrink-0 text-xl" />
                  <span className="text-gray-300 text-lg">mohamedamineaitsalah02@gmail.com</span>
                </li>
              </ul>
            </div>
            <div className="h-64 w-full">
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
    </div>
  );
};

export default Contact;
