import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.new_password && formData.new_password !== formData.confirm_password) {
      return toast.error("New passwords do not match");
    }

    setLoading(true);
    try {
      const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email
      };
      
      if (formData.new_password) {
        payload.current_password = formData.current_password;
        payload.new_password = formData.new_password;
      }

      const res = await api.put('/auth/profile', payload);
      
      if (res.data.success) {
        toast.success("Profile updated successfully");
        updateUser(res.data.data);

        setFormData(prev => ({
          ...prev,
          current_password: '',
          new_password: '',
          confirm_password: ''
        }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
        <p className="mt-2 text-sm text-gray-600">Update your personal information and password.</p>
      </div>

      <div className="bg-white shadow rounded-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Personal Information</h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="first_name"
                  required
                  value={formData.first_name}
                  onChange={handleChange}
                  className="pl-10 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="last_name"
                  required
                  value={formData.last_name}
                  onChange={handleChange}
                  className="pl-10 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                />
              </div>
            </div>

            <div className="md:col-span-2 mt-6">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Security</h3>
              <p className="text-sm text-gray-500 mb-4">Leave blank if you do not want to change your password.</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Current Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  name="current_password"
                  value={formData.current_password}
                  onChange={handleChange}
                  className="pl-10 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  name="new_password"
                  value={formData.new_password}
                  onChange={handleChange}
                  className="pl-10 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  className="pl-10 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                />
              </div>
            </div>

          </div>

          <div className="pt-4 border-t border-gray-200 mt-8 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-bold rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
