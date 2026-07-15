import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { newsService } from '../../services/services';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FaImage, FaCalendarAlt } from 'react-icons/fa';

const News = () => {
  const { t, isArabic } = useLanguage();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    newsService.getAll()
      .then(res => {
        if (res.data.success) setNews(res.data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-sand-50">
      
      <div className="bg-primary-900 py-16 px-4 text-center border-b-4 border-gold-500">
        <h1 className="text-4xl md:text-5xl font-bold text-gold-400 mb-3">
          {isArabic ? 'الأخبار' : 'Latest News'}
        </h1>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          {isArabic
            ? 'تابع آخر أخبار وفعاليات موسم مولاي عبد الله أمغار'
            : 'Stay up to date with the latest news from Moussem Moulay Abdellah Amghar'}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {news.length === 0 ? (
          <div className="text-center py-20 text-gray-400 text-xl">
            {isArabic ? 'لا توجد أخبار حتى الآن' : 'No news articles yet'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {news.map(item => (
              <div
                key={item.id}
                onClick={() => setSelected(item)}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group border border-gray-100 hover:border-gold-300"
              >
                
                <div className="h-52 bg-gray-100 overflow-hidden relative">
                  {item.image ? (
                    <img
                      src={`/api/uploads/${item.image}`}
                      alt={isArabic ? item.title_ar : item.title_en}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <FaImage size={50} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="p-6">
                  {item.created_at && (
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                      <FaCalendarAlt />
                      <span>{new Date(item.created_at).toLocaleDateString(isArabic ? 'ar-MA' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                  )}
                  <div className="mb-3">
                    {item.title_ar && (
                      <h2 className="text-xl font-bold text-primary-900 text-right font-arabic mb-1" dir="rtl">
                        {item.title_ar}
                      </h2>
                    )}
                    {item.title_en && (
                      <h2 className="text-lg font-semibold text-primary-800 text-left line-clamp-1 group-hover:text-gold-600 transition-colors">
                        {item.title_en}
                      </h2>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    {item.description_ar && (
                      <p className="text-gray-600 text-sm line-clamp-2 text-right font-arabic" dir="rtl">
                        {item.description_ar}
                      </p>
                    )}
                    {item.description_en && (
                      <p className="text-gray-500 text-sm line-clamp-2 text-left">
                        {item.description_en}
                      </p>
                    )}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className="text-gold-600 font-semibold text-sm hover:underline">
                      {isArabic ? 'اقرأ المزيد ←' : 'Read more →'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {selected.image && (
              <div className="w-full bg-gray-50 flex items-center justify-center rounded-t-2xl">
                <img
                  src={`/api/uploads/${selected.image}`}
                  alt={selected.title_en || 'News Image'}
                  className="max-w-full max-h-[500px] object-contain rounded-t-2xl"
                />
              </div>
            )}
            <div className="p-8">
              <div className="mb-6">
                {selected.title_ar && (
                  <h2 className="text-2xl font-bold text-primary-900 text-right font-arabic mb-2" dir="rtl">
                    {selected.title_ar}
                  </h2>
                )}
                {selected.title_en && (
                  <h2 className="text-xl font-semibold text-primary-800 text-left">
                    {selected.title_en}
                  </h2>
                )}
              </div>
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                {selected.description_ar && (
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line text-right font-arabic border-b border-gray-200 pb-3" dir="rtl">
                    {selected.description_ar}
                  </p>
                )}
                {selected.description_en && (
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line text-left pt-2">
                    {selected.description_en}
                  </p>
                )}
              </div>
              <button
                onClick={() => setSelected(null)}
                className="mt-8 bg-primary-900 text-white px-6 py-2 rounded-lg hover:bg-primary-800 transition-colors font-semibold"
              >
                {isArabic ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default News;
