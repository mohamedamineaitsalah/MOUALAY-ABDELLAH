const User = require('../models/User');
const News = require('../models/News');
const Gallery = require('../models/Gallery');
const Video = require('../models/Video');
const Sponsor = require('../models/Sponsor');
const Participant = require('../models/Participant');
const Program = require('../models/Program');
const Message = require('../models/Message');

const pool = require('../config/db');

exports.getStats = async (req, res, next) => {
  try {
    const [
      users, news, gallery, videos, sponsors, participants, program, messages,
      recentNews, recentGallery, recentMessages, recentParticipants
    ] = await Promise.all([
      User.count(),
      News.count(),
      Gallery.count(),
      Video.count(),
      Sponsor.count(),
      Participant.count(),
      Program.count(),
      Message.count(),
      pool.query('SELECT title_ar, title_en, created_at FROM news ORDER BY created_at DESC LIMIT 5').then(([r]) => r),
      pool.query('SELECT title_ar, title_en, created_at FROM gallery ORDER BY created_at DESC LIMIT 5').then(([r]) => r),
      pool.query('SELECT name, subject, created_at FROM messages ORDER BY created_at DESC LIMIT 5').then(([r]) => r),
      pool.query('SELECT name_ar, name_en, created_at FROM participants ORDER BY created_at DESC LIMIT 5').then(([r]) => r)
    ]);

    const activities = [];
    
    recentNews.forEach(item => {
      activities.push({
        type: 'news',
        title_ar: `تم نشر خبر جديد: ${item.title_ar}`,
        title_en: `Published a news article: ${item.title_en}`,
        time: item.created_at
      });
    });

    recentGallery.forEach(item => {
      activities.push({
        type: 'gallery',
        title_ar: `تمت إضافة صورة جديدة إلى المعرض`,
        title_en: `Added a new photo to the gallery`,
        time: item.created_at
      });
    });

    recentMessages.forEach(item => {
      activities.push({
        type: 'message',
        title_ar: `رسالة جديدة من ${item.name}: ${item.subject}`,
        title_en: `New message from ${item.name}: ${item.subject}`,
        time: item.created_at
      });
    });

    recentParticipants.forEach(item => {
      activities.push({
        type: 'participant',
        title_ar: `تم تسجيل مشارك جديد: ${item.name_ar}`,
        title_en: `Registered a new participant: ${item.name_en}`,
        time: item.created_at
      });
    });

    activities.sort((a, b) => new Date(b.time) - new Date(a.time));
    const recentActivities = activities.slice(0, 5);

    res.json({
      success: true,
      data: { 
        users, news, gallery, videos, sponsors, participants, program, messages,
        recentActivities 
      }
    });
  } catch (error) { next(error); }
};
