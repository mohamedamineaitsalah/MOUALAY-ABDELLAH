import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { FaUser, FaEnvelope, FaLock, FaGoogle } from 'react-icons/fa';

const Register = () => {
  const { t } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', email: '', password: '', confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/register', {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password
      });
      if (res.data.success) {
        toast.success(t('auth.register.title') + ' - ' + t('contact.success'));
        await login(formData.email, formData.password);
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || t('general.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <div className="min-h-screen bg-sand-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gold-500 rounded-full flex items-center justify-center text-primary-900 font-bold font-arabic text-3xl shadow-lg">
            م
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-primary-900 font-heading">
          {t('auth.register.title')}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {t('auth.register.subtitle')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.firstName')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pr-3 flex items-center pointer-events-none text-gray-400">
                    <FaUser />
                  </div>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 rtl:pl-3 rtl:pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-shadow"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.lastName')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pr-3 flex items-center pointer-events-none text-gray-400">
                    <FaUser />
                  </div>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 rtl:pl-3 rtl:pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-shadow"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.email')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pr-3 flex items-center pointer-events-none text-gray-400">
                  <FaEnvelope />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 rtl:pl-3 rtl:pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none dir-ltr transition-shadow"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.password')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pr-3 flex items-center pointer-events-none text-gray-400">
                  <FaLock />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full pl-10 rtl:pl-3 rtl:pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none dir-ltr transition-shadow"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.confirmPassword')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pr-3 flex items-center pointer-events-none text-gray-400">
                  <FaLock />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full pl-10 rtl:pl-3 rtl:pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none dir-ltr transition-shadow"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-primary-900 bg-gold-500 hover:bg-gold-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? t('general.loading') : t('auth.registerBtn')}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">{t('auth.or')}</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGoogleLogin}
                className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FaGoogle className="text-red-500 text-lg" />
                {t('auth.googleBtn')}
              </button>
            </div>
          </div>
          
          <div className="mt-8 text-center text-sm text-gray-600">
            {t('auth.hasAccount')}{' '}
            <Link to="/login" className="font-bold text-primary-600 hover:text-primary-500">
              {t('auth.loginBtn')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
