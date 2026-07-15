import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { galleryService, videoService } from '../../services/services';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { FaPlay } from 'react-icons/fa';

const Gallery = () => {
  const { t, isArabic } = useLanguage();
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('photos');
  const [index, setIndex] = useState(-1);

  useEffect(() => {
    Promise.all([
      galleryService.getAll().catch(() => ({ data: { success: false } })),
      videoService.getAll().catch(() => ({ data: { success: false } }))
    ]).then(([photoRes, videoRes]) => {
      if (photoRes.data?.success) setPhotos(photoRes.data.data);
      if (videoRes.data?.success) setVideos(videoRes.data.data);
      setLoading(false);
    });
  }, []);

  const slides = photos.map(photo => ({
    src: `/api/uploads/${photo.image}`,
    title: isArabic ? photo.title_ar : photo.title_en
  }));

  if (loading) return <LoadingSpinner fullScreen />;

  const getYoutubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="bg-sand-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-900 mb-4">{t('gallery.title')}</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t('gallery.subtitle')}</p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-full p-1 shadow-sm inline-flex">
            <button
              onClick={() => setActiveTab('photos')}
              className={`px-8 py-3 rounded-full text-lg font-medium transition-all ${
                activeTab === 'photos' ? 'bg-primary-900 text-gold-400 shadow-md' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {t('gallery.photos')}
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-8 py-3 rounded-full text-lg font-medium transition-all ${
                activeTab === 'videos' ? 'bg-primary-900 text-gold-400 shadow-md' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {t('gallery.videos')}
            </button>
          </div>
        </div>

        {activeTab === 'photos' && (
          <div>
            {photos.length === 0 ? (
              <div className="text-center py-20 text-gray-500">{t('gallery.empty')}</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {photos.map((photo, i) => (
                  <div 
                    key={photo.id} 
                    className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all aspect-square bg-gray-200"
                    onClick={() => setIndex(i)}
                  >
                    <img 
                      src={`/api/uploads/${photo.image}`} 
                      alt={isArabic ? photo.title_ar : photo.title_en} 
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-4 w-full">
                        <p className="text-white font-medium truncate">
                          {isArabic ? photo.title_ar : photo.title_en}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'videos' && (
          <div>
            {videos.length === 0 ? (
              <div className="text-center py-20 text-gray-500">{t('gallery.emptyVideos')}</div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {videos.map(video => {
                  const yId = getYoutubeId(video.youtube_url);
                  return (
                    <div key={video.id} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                      <div className="relative aspect-video bg-black">
                        {yId ? (
                          <iframe
                            src={`https://www.youtube.com/embed/${yId}`}
                            title={video.title}
                            className="w-full h-full absolute inset-0"
                            allowFullScreen
                          ></iframe>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white bg-gray-800">Invalid YouTube URL</div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-800">{video.title}</h3>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <Lightbox
          index={index}
          open={index >= 0}
          close={() => setIndex(-1)}
          slides={slides}
        />
      </div>
    </div>
  );
};

export default Gallery;
