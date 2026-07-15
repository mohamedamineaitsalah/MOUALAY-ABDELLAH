import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { participantService } from '../../services/services';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaUser } from 'react-icons/fa';

const ParticipantsAdmin = () => {
  const { t } = useLanguage();
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [formData, setFormData] = useState({ 
    id: null, 
    name_ar: '', 
    name_en: '', 
    city_ar: '', 
    city_en: '', 
    description_ar: '', 
    description_en: '',
    achievements_ar: '',
    achievements_en: ''
  });

  const fetchAll = () => {
    setLoading(true);
    participantService.getAll()
      .then(res => { if (res.data.success) setParticipants(res.data.data); })
      .catch(() => toast.error(t('general.error')))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, []);

  const handleOpen = (item = null) => {
    if (item) {
      setFormData({ 
        id: item.id, 
        name_ar: item.name_ar || item.name || '', 
        name_en: item.name_en || item.name || '', 
        city_ar: item.city_ar || item.city || '', 
        city_en: item.city_en || item.city || '', 
        description_ar: item.description_ar || '', 
        description_en: item.description_en || '',
        achievements_ar: item.achievements_ar || item.achievements || '',
        achievements_en: item.achievements_en || item.achievements || ''
      });
    } else {
      setFormData({ 
        id: null, 
        name_ar: '', 
        name_en: '', 
        city_ar: '', 
        city_en: '', 
        description_ar: '', 
        description_en: '',
        achievements_ar: '',
        achievements_en: ''
      });
    }
    setPhotoFile(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name_en || formData.name_ar);
    data.append('name_ar', formData.name_ar);
    data.append('name_en', formData.name_en);
    data.append('city', formData.city_en || formData.city_ar);
    data.append('city_ar', formData.city_ar);
    data.append('city_en', formData.city_en);
    data.append('description_ar', formData.description_ar);
    data.append('description_en', formData.description_en);
    data.append('achievements_ar', formData.achievements_ar);
    data.append('achievements_en', formData.achievements_en);
    if (photoFile) data.append('photo', photoFile);
    try {
      if (formData.id) await participantService.update(formData.id, data);
      else await participantService.create(data);
      toast.success('Participant saved!');
      setShowModal(false);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || t('general.error'));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.confirmDelete'))) return;
    try {
      await participantService.delete(id);
      toast.success('Participant deleted');
      fetchAll();
    } catch { toast.error(t('general.error')); }
  };

  if (loading && participants.length === 0) return <LoadingSpinner fullScreen />;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Participants Management</h1>
          <p className="mt-2 text-sm text-gray-600">Manage Tbourida groups and participants.</p>
        </div>
        <button onClick={() => handleOpen()} className="flex items-center gap-2 bg-gold-500 text-primary-900 px-4 py-2 rounded-lg font-bold hover:bg-gold-400">
          <FaPlus /> Add Participant
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {participants.length === 0 && (
          <div className="col-span-3 text-center py-16 bg-white rounded-xl shadow">
            <FaUser className="mx-auto text-4xl text-gray-300 mb-3" />
            <p className="text-gray-500">No participants yet. Add your first one!</p>
          </div>
        )}
        {participants.map((p) => (
          <div key={p.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-64 w-full bg-gray-100 overflow-hidden flex items-center justify-center">
                {p.photo ? (
                  <img src={`/api/uploads/${p.photo}`} alt={p.name_en || p.name} className="w-full h-full object-cover object-top" />
                ) : (
                  <FaUser className="text-6xl text-gray-300" />
                )}
              </div>
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-900">{p.name_en || p.name} / {p.name_ar || p.name}</h3>
              {(p.city_en || p.city_ar || p.city) && (
                <p className="text-sm text-gold-600 font-medium mt-1">
                  {p.city_en || p.city || ''} | {p.city_ar || p.city || ''}
                </p>
              )}
              {(p.description_en || p.description_ar) && <p className="text-sm text-gray-600 mt-2 line-clamp-3">{p.description_en || p.description_ar}</p>}
              <div className="flex gap-2 mt-4">
                <button onClick={() => handleOpen(p)} className="flex-1 flex items-center justify-center gap-1 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 py-2 rounded-lg font-medium transition-colors">
                  <FaEdit /> Edit
                </button>
                <button onClick={() => handleDelete(p.id)} className="flex-1 flex items-center justify-center gap-1 text-sm bg-red-50 text-red-600 hover:bg-red-100 py-2 rounded-lg font-medium transition-colors">
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowModal(false)}></div>
            <div className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-lg z-10">
              <form onSubmit={handleSubmit}>
                <h3 className="text-lg font-bold text-gray-900 mb-5">{formData.id ? 'Edit Participant' : 'Add Participant'}</h3>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name (Arabic) *</label>
                      <input type="text" required value={formData.name_ar} onChange={(e) => setFormData({...formData, name_ar: e.target.value})} className="block w-full border border-gray-300 rounded-md py-2 px-3" placeholder="الاسم بالعربية..." dir="rtl" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name (English) *</label>
                      <input type="text" required value={formData.name_en} onChange={(e) => setFormData({...formData, name_en: e.target.value})} className="block w-full border border-gray-300 rounded-md py-2 px-3" placeholder="Name in English..." />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City (Arabic)</label>
                      <input type="text" value={formData.city_ar} onChange={(e) => setFormData({...formData, city_ar: e.target.value})} className="block w-full border border-gray-300 rounded-md py-2 px-3" placeholder="المدينة بالعربية..." dir="rtl" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City (English)</label>
                      <input type="text" value={formData.city_en} onChange={(e) => setFormData({...formData, city_en: e.target.value})} className="block w-full border border-gray-300 rounded-md py-2 px-3" placeholder="City in English..." />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (Arabic)</label>
                    <textarea rows={3} value={formData.description_ar} onChange={(e) => setFormData({...formData, description_ar: e.target.value})} className="block w-full border border-gray-300 rounded-md py-2 px-3" placeholder="الوصف بالعربية..." dir="rtl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (English)</label>
                    <textarea rows={3} value={formData.description_en} onChange={(e) => setFormData({...formData, description_en: e.target.value})} className="block w-full border border-gray-300 rounded-md py-2 px-3" placeholder="Description in English..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Achievements (Arabic)</label>
                      <input type="text" value={formData.achievements_ar} onChange={(e) => setFormData({...formData, achievements_ar: e.target.value})} className="block w-full border border-gray-300 rounded-md py-2 px-3" placeholder="الإنجازات بالعربية..." dir="rtl" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Achievements (English)</label>
                      <input type="text" value={formData.achievements_en} onChange={(e) => setFormData({...formData, achievements_en: e.target.value})} className="block w-full border border-gray-300 rounded-md py-2 px-3" placeholder="Achievements in English..." />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
                    <input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files[0])} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700" />
                  </div>
                </div>
                <div className="mt-6 flex gap-3 justify-end">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700">Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParticipantsAdmin;
