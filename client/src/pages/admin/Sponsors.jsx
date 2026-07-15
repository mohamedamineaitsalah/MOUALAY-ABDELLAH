import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { sponsorService } from '../../services/services';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaImage } from 'react-icons/fa';

const SponsorsAdmin = () => {
  const { t } = useLanguage();
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ 
    id: null, name: '', description: '', website: '', twitter: '', facebook: '', instagram: '', existingLogo: null
  });
  const [imageFile, setImageFile] = useState(null);

  const fetchSponsors = () => {
    setLoading(true);
    sponsorService.getAll()
      .then(res => {
        if (res.data.success) setSponsors(res.data.data);
      })
      .catch(() => toast.error(t('general.error')))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  const handleOpenModal = (item = null) => {
    if (item) {
      setFormData({
        id: item.id,
        name: item.name || '',
        description: item.description || '',
        website: item.website || '',
        twitter: item.twitter || '',
        facebook: item.facebook || '',
        instagram: item.instagram || '',
        existingLogo: item.logo || null
      });
    } else {
      setFormData({ 
        id: null, name: '', description: '', website: '', twitter: '', facebook: '', instagram: '', existingLogo: null
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
    if (imageFile) data.append('logo', imageFile);

    try {
      if (formData.id) await sponsorService.update(formData.id, data);
      else await sponsorService.create(data);
      
      toast.success('Sponsor saved successfully');
      handleCloseModal();
      fetchSponsors();
    } catch (error) {
      toast.error(error.response?.data?.message || t('general.error'));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('admin.confirmDelete'))) {
      try {
        await sponsorService.delete(id);
        toast.success('Sponsor deleted successfully');
        fetchSponsors();
      } catch (error) {
        toast.error(t('general.error'));
      }
    }
  };

  if (loading && sponsors.length === 0) return <LoadingSpinner fullScreen />;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('admin.sponsors') || 'Sponsors'}</h1>
          <p className="mt-2 text-sm text-gray-600">Manage festival sponsors and partners.</p>
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
              <th className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Sponsor</th>
              <th className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Website</th>
              <th className="px-6 py-3 text-right rtl:text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sponsors.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
                      {item.logo ? <img src={`/api/uploads/${item.logo}`} className="h-10 w-10 object-contain p-1" /> : <FaImage className="text-gray-400" />}
                    </div>
                    <div className="ml-4 rtl:mr-4 rtl:ml-0">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-500">{item.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500">
                  {item.website && <a href={item.website} target="_blank" rel="noreferrer">{item.website}</a>}
                </td>
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
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">{formData.id ? 'Edit Sponsor' : 'Add Sponsor'}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input type="text" name="name" required value={formData.name} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <input type="text" name="description" value={formData.description} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Logo</label>
                    {imageFile ? (
                      <div className="mt-2 mb-2">
                        <img src={URL.createObjectURL(imageFile)} alt="Preview" className="h-20 w-20 object-contain rounded border p-1" />
                      </div>
                    ) : formData.existingLogo ? (
                      <div className="mt-2 mb-2">
                        <img src={`/api/uploads/${formData.existingLogo}`} alt="Current Logo" className="h-20 w-20 object-contain rounded border p-1" />
                      </div>
                    ) : null}
                    <input type="file" onChange={handleFileChange} accept="image/*" className="mt-1 block w-full" />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">Website</label>
                    <input type="text" name="website" value={formData.website} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3" />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">Facebook</label>
                    <input type="text" name="facebook" value={formData.facebook} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3" />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">Instagram</label>
                    <input type="text" name="instagram" value={formData.instagram} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3" />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">X (Twitter)</label>
                    <input type="text" name="twitter" value={formData.twitter} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3" />
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

export default SponsorsAdmin;
