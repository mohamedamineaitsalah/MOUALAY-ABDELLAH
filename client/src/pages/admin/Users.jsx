import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { userService } from '../../services/services';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';
import { FaTrash, FaSearch, FaUserShield, FaUser } from 'react-icons/fa';

const Users = () => {
  const { t } = useLanguage();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = (q = '') => {
    setLoading(true);
    userService.getAll(q)
      .then(res => {
        if (res.data.success) {
          setUsers(res.data.data);
        }
      })
      .catch(() => toast.error(t('general.error')))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(searchTerm);
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('admin.confirmDelete'))) {
      try {
        await userService.delete(id);
        toast.success('User deleted successfully');
        fetchUsers(searchTerm);
      } catch (error) {
        toast.error(error.response?.data?.message || t('general.error'));
      }
    }
  };

  if (loading && users.length === 0) return <LoadingSpinner fullScreen />;

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('admin.users')}</h1>
          <p className="mt-2 text-sm text-gray-600">Manage registered users and administrators.</p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg mb-8 p-4">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pr-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('admin.search')}
              className="w-full pl-10 rtl:pl-3 rtl:pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
          <button type="submit" className="bg-primary-900 text-white px-6 py-2 rounded-lg hover:bg-primary-800 transition-colors">
            {t('admin.search')}
          </button>
        </form>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Provider
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {user.avatar ? (
                          <img className="h-10 w-10 rounded-full object-cover" src={user.avatar} alt="" />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                            {user.role === 'admin' ? <FaUserShield /> : <FaUser />}
                          </div>
                        )}
                      </div>
                      <div className="ml-4 rtl:ml-0 rtl:mr-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.first_name} {user.last_name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dir-ltr text-left">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="capitalize">{user.provider}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right rtl:text-left text-sm font-medium">
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    {t('general.noData')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
