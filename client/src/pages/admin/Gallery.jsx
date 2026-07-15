import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { galleryService, videoService } from '../../services/services';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';
import { FaPlus, FaTrash, FaImage, FaVideo, FaUpload } from 'react-icons/fa';

const GalleryAdmin = () => {
  const { t } = useLanguage();
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('photos');
  const [showModal, setShowModal] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageCaption, setImageCaption] = useState('');
  const [videoData, setVideoData] = useState({ title: '', youtube_url: '' });

  const fetchAll = () => {
    setLoading(true);
    Promise.all([galleryService.getAll(), videoService.getAll()])
      .then(([photosRes, videosRes]) => {
        if (photosRes.data.success) setPhotos(photosRes.data.data);
        if (videosRes.data.success) setVideos(videosRes.data.data);
      })
      .catch(() => toast.error(t('general.error')))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, []);

  const handleDeletePhoto = async (id) => {
    if (!window.confirm(t('admin.confirmDelete'))) return;
    try {
      await galleryService.delete(id);
      toast.success('Photo deleted');
      fetchAll();
    } catch { toast.error(t('general.error')); }
  };

  const handleDeleteVideo = async (id) => {
    if (!window.confirm(t('admin.confirmDelete'))) return;
    try {
      await videoService.delete(id);
      toast.success('Video deleted');
      fetchAll();
    } catch { toast.error(t('general.error')); }
  };

  const handleUploadPhoto = async (e) => {
    e.preventDefault();
    if (!imageFile) return toast.error('Please select an image');
    const data = new FormData();
    data.append('image', imageFile);
    if (imageCaption) data.append('caption', imageCaption);
    data.append('category', 'general');
    try {
      await galleryService.create(data);
      toast.success('Photo uploaded!');
      setShowModal(false);
      setImageFile(null);
      setImageCaption('');
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || t('general.error'));
    }
  };

  const handleAddVideo = async (e) => {
    e.preventDefault();
    if (!videoData.title || !videoData.youtube_url) return toast.error('Title and URL required');
    try {
      await videoService.create(videoData);
      toast.success('Video added!');
      setShowModal(false);
      setVideoData({ title: '', youtube_url: '' });
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || t('general.error'));
    }
  };

  const getYoutubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  if (loading && photos.length === 0 && videos.length === 0) return <LoadingSpinner fullScreen />;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gallery Management</h1>
          <p className="mt-2 text-sm text-gray-600">Manage festival photos and videos.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gold-500 text-primary-900 px-4 py-2 rounded-lg font-bold hover:bg-gold-400"
        >
          <FaPlus /> {activeTab === 'photos' ? 'Upload Photo' : 'Add Video'}
        </button>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="flex -mb-px gap-6">
          <button
            onClick={() => setActiveTab('photos')}
            className={`flex items-center gap-2 pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'photos' ? 'border-gold-500 text-primary-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <FaImage /> Photos ({photos.length})
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`flex items-center gap-2 pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'videos' ? 'border-gold-500 text-primary-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <FaVideo /> Videos ({videos.length})
          </button>
        </nav>
      </div>

      {activeTab === 'photos' && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.length === 0 && <p className="col-span-4 text-center text-gray-500 py-12">No photos yet. Upload your first one!</p>}
          {photos.map((photo) => (
            <div key={photo.id} className="relative group rounded-lg overflow-hidden shadow-md aspect-square bg-gray-100">
              <img src={`/api/uploads/${photo.image}`} alt={photo.caption || 'Gallery'} className="w-full h-full object-cover" />
              {photo.caption && <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 truncate">{photo.caption}</div>}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button onClick={() => handleDeletePhoto(photo.id)} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg"><FaTrash /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'videos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.length === 0 && <p className="col-span-3 text-center text-gray-500 py-12">No videos yet. Add your first YouTube video!</p>}
          {videos.map((video) => {
            const ytId = getYoutubeId(video.youtube_url);
            return (
              <div key={video.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {ytId && <div className="aspect-video"><iframe className="w-full h-full" src={`https://www.youtube.com/embed/${ytId}`} title={video.title} frameBorder="0" allowFullScreen /></div>}
                <div className="p-3 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-800 truncate">{video.title}</span>
                  <button onClick={() => handleDeleteVideo(video.id)} className="text-red-500 hover:text-red-700 ml-2 flex-shrink-0"><FaTrash /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowModal(false)}></div>
            <div className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-md z-10">
              {activeTab === 'photos' ? (
                <form onSubmit={handleUploadPhoto}>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><FaUpload /> Upload Photo</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image File *</label>
                      <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Caption (optional)</label>
                      <input type="text" value={imageCaption} onChange={(e) => setImageCaption(e.target.value)} className="block w-full border border-gray-300 rounded-md py-2 px-3 text-sm" placeholder="Photo caption..." />
                    </div>
                  </div>
                  <div className="mt-5 flex gap-3 justify-end">
                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700">Upload</button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleAddVideo}>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><FaVideo /> Add YouTube Video</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                      <input type="text" value={videoData.title} onChange={(e) => setVideoData({ ...videoData, title: e.target.value })} className="block w-full border border-gray-300 rounded-md py-2 px-3 text-sm" placeholder="Video title..." required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL *</label>
                      <input type="url" value={videoData.youtube_url} onChange={(e) => setVideoData({ ...videoData, youtube_url: e.target.value })} className="block w-full border border-gray-300 rounded-md py-2 px-3 text-sm" placeholder="https://www.youtube.com/watch?v=..." required />
                    </div>
                  </div>
                  <div className="mt-5 flex gap-3 justify-end">
                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700">Add Video</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryAdmin;
