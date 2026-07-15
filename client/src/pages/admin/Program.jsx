import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { programService } from '../../services/services';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaImage } from 'react-icons/fa';

const ProgramAdmin = () => {
  const { t, isArabic } = useLanguage();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ 
    id: null, title_ar: '', title_en: '', description_ar: '', description_en: '',
    event_date: '', event_time: '', location: ''
  });
  const [imageFile, setImageFile] = useState(null);

  const fetchEvents = () => {
    setLoading(true);
    programService.getAll()
      .then(res => {
        if (res.data.success) setEvents(res.data.data);
      })
      .catch(() => toast.error(t('general.error')))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleOpenModal = (item = null) => {
    if (item) {
      setFormData({
        id: item.id,
        title_ar: item.title_ar, title_en: item.title_en,
        description_ar: item.description_ar, description_en: item.description_en,
        event_date: item.event_date ? item.event_date.split('T')[0] : '',
        event_time: item.event_time ? item.event_time.slice(0, 5) : '',
        location: item.location || ''
      });
    } else {
      setFormData({ 
        id: null, title_ar: '', title_en: '', description_ar: '', description_en: '',
        event_date: '', event_time: '', location: ''
      });
    }
    setImageFile(null);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setImageFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null) data.append(key, formData[key]);
    });
    if (imageFile) data.append('image', imageFile);

    try {
      if (formData.id) await programService.update(formData.id, data);
      else await programService.create(data);
      
      toast.success('Program event saved successfully');
      handleCloseModal();
      fetchEvents();
    } catch (error) {
      toast.error(error.response?.data?.message || t('general.error'));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('admin.confirmDelete'))) {
      try {
        await programService.delete(id);
        toast.success('Event deleted successfully');
        fetchEvents();
      } catch (error) {
        toast.error(t('general.error'));
      }
    }
  };

  if (loading && events.length === 0) return <LoadingSpinner fullScreen />;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('admin.program')}</h1>
          <p className="mt-2 text-sm text-gray-600">Manage festival schedule and events.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-gold-500 text-primary-900 px-4 py-2 rounded-lg font-bold hover:bg-gold-400"
        >
          <FaPlus /> {t('admin.add')}
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
              <th className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Date / Time</th>
              <th className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-right rtl:text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded overflow-hidden">
                      {item.image ? <img src={`/api/uploads/${item.image}`} className="h-10 w-10 object-cover" /> : <FaImage className="h-full w-full p-2 text-gray-400" />}
                    </div>
                    <div className="ml-4 rtl:mr-4 rtl:ml-0">
                      <div className="text-sm font-medium text-gray-900">{isArabic ? item.title_ar : item.title_en}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.event_date && new Date(item.event_date).toLocaleDateString()} {item.event_time && `at ${item.event_time.slice(0,5)}`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.location}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right rtl:text-left text-sm font-medium">
                  <button onClick={() => handleOpenModal(item)} className="text-blue-600 hover:text-blue-900 mr-3 rtl:mr-0 rtl:ml-3"><FaEdit /></button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900"><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={handleCloseModal}></div>
            <div className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl z-10">
              <form onSubmit={handleSubmit}>
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">{formData.id ? 'Edit Event' : 'Add Event'}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">{t('admin.title_ar')}</label>
                    <input type="text" name="title_ar" required value={formData.title_ar} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3" />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">{t('admin.title_en')}</label>
                    <input type="text" name="title_en" required value={formData.title_en} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3" />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <input type="date" name="event_date" value={formData.event_date} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3" />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">Time</label>
                    <input type="time" name="event_time" value={formData.event_time} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <input type="text" name="location" value={formData.location} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">{t('admin.desc_ar')}</label>
                    <textarea name="description_ar" rows="2" value={formData.description_ar} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"></textarea>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">{t('admin.desc_en')}</label>
                    <textarea name="description_en" rows="2" value={formData.description_en} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"></textarea>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">{t('admin.image')}</label>
                    <input type="file" onChange={handleFileChange} accept="image/*" className="mt-1 block w-full" />
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                  <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 sm:ml-3 sm:w-auto sm:text-sm">{t('admin.save')}</button>
                  <button type="button" onClick={handleCloseModal} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">{t('admin.cancel')}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramAdmin;
