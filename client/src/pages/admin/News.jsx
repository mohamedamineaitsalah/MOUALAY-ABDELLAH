import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { newsService } from '../../services/services';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaImage } from 'react-icons/fa';

const NewsAdmin = () => {
  const { t, isArabic } = useLanguage();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: null, title_ar: '', title_en: '', description_ar: '', description_en: '' });
  const [imageFile, setImageFile] = useState(null);

  const fetchNews = () => {
    setLoading(true);
    newsService.getAll()
      .then(res => {
        if (res.data.success) setNews(res.data.data);
      })
      .catch(() => toast.error(t('general.error')))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleOpenModal = (item = null) => {
    if (item) {
      setFormData({
        id: item.id,
        title_ar: item.title_ar, title_en: item.title_en,
        description_ar: item.description_ar, description_en: item.description_en
      });
    } else {
      setFormData({ id: null, title_ar: '', title_en: '', description_ar: '', description_en: '' });
    }
    setImageFile(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title_ar', formData.title_ar);
    data.append('title_en', formData.title_en);
    data.append('description_ar', formData.description_ar);
    data.append('description_en', formData.description_en);
    if (imageFile) data.append('image', imageFile);

    try {
      if (formData.id) {
        await newsService.update(formData.id, data);
        toast.success('News updated successfully');
      } else {
        await newsService.create(data);
        toast.success('News added successfully');
      }
      handleCloseModal();
      fetchNews();
    } catch (error) {
      toast.error(error.response?.data?.message || t('general.error'));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('admin.confirmDelete'))) {
      try {
        await newsService.delete(id);
        toast.success('News deleted successfully');
        fetchNews();
      } catch (error) {
        toast.error(t('general.error'));
      }
    }
  };

  if (loading && news.length === 0) return <LoadingSpinner fullScreen />;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('admin.news')}</h1>
          <p className="mt-2 text-sm text-gray-600">Manage news articles.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-gold-500 text-primary-900 px-4 py-2 rounded-lg font-bold hover:bg-gold-400 transition-colors"
        >
          <FaPlus /> {t('admin.add')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {news.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden flex flex-col">
            <div className="h-48 bg-gray-200 relative">
              {item.image ? (
                <img src={`/api/uploads/${item.image}`} alt={item.title_en} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <FaImage size={40} />
                </div>
              )}
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                {isArabic ? item.title_ar : item.title_en}
              </h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-3">
                {isArabic ? item.description_ar : item.description_en}
              </p>
              <div className="mt-auto flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleOpenModal(item)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {news.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
          {t('general.noData')}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={handleCloseModal}></div>
            <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 w-full sm:max-w-lg z-10">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {formData.id ? t('admin.edit') : t('admin.add')} {t('admin.news')}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">{t('admin.title_ar')}</label>
                      <input type="text" name="title_ar" required value={formData.title_ar} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">{t('admin.title_en')}</label>
                      <input type="text" name="title_en" required value={formData.title_en} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">{t('admin.desc_ar')}</label>
                      <textarea name="description_ar" required rows="3" value={formData.description_ar} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">{t('admin.desc_en')}</label>
                      <textarea name="description_en" required rows="3" value={formData.description_en} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">{t('admin.image')}</label>
                      <input type="file" onChange={handleFileChange} accept="image/*" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm rtl:ml-0 rtl:mr-3">
                    {t('admin.save')}
                  </button>
                  <button type="button" onClick={handleCloseModal} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm rtl:ml-0 rtl:mr-3">
                    {t('admin.cancel')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsAdmin;
