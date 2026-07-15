import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(email, password);
      toast.success(t('nav.login') + ' ' + 'Success');
      if (res.user.role === 'admin') navigate('/admin/dashboard');
      else navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-sand-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full glass-card p-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-primary-900 mb-8">
            {t('nav.login')}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <input
                type="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-primary-900 bg-gold-500 hover:bg-gold-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500 transition-colors"
            >
              {t('nav.login')}
            </button>
          </div>
        </form>
        <div className="mt-6 text-center">
          <p className="text-gray-500">
            do you not have an account? <Link to="/register" className="text-primary-600 font-bold hover:underline">register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Login;