import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const userStr = searchParams.get('user');
    const error = searchParams.get('error');

    if (error) {
      toast.error('Google login failed');
      navigate('/login');
      return;
    }

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        toast.success(`Welcome, ${user.first_name}!`);

        if (user.role === 'admin') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/';
        }
      } catch (e) {
        toast.error('Invalid user data received');
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate]);

  return <LoadingSpinner fullScreen />;
};

export default OAuthCallback;
