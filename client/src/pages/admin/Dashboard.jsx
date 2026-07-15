import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { FiUsers, FiFileText, FiImage, FiVideo, FiCalendar, FiMail, FiAward } from 'react-icons/fi';
import { FaHorse, FaHandshake } from 'react-icons/fa';

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-lg shadow-sm p-6 border-l-4" style={{ borderColor: color }}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-800">{value !== undefined ? value : 0}</h3>
      </div>
      <div className="p-3 rounded-full bg-gray-50" style={{ color }}>
        {icon}
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard');
        setStats(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>Loading statistics...</div>;
  if (!stats) return <div>Error loading stats</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Overview Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Registered Users" value={stats.users} icon={<FiUsers size={24} />} color="#3b82f6" />
        <StatCard title="News Articles" value={stats.news} icon={<FiFileText size={24} />} color="#10b981" />
        <StatCard title="Gallery Images" value={stats.gallery} icon={<FiImage size={24} />} color="#8b5cf6" />
        <StatCard title="Videos" value={stats.videos} icon={<FiVideo size={24} />} color="#ef4444" />
        <StatCard title="Festival Program" value={stats.program} icon={<FiCalendar size={24} />} color="#f59e0b" />
        <StatCard title="Participants" value={stats.participants} icon={<FaHorse size={24} />} color="#6366f1" />
        <StatCard title="Sponsors" value={stats.sponsors} icon={<FaHandshake size={24} />} color="#14b8a6" />
        <StatCard title="Messages" value={stats.messages} icon={<FiMail size={24} />} color="#ec4899" />
      </div>
    </div>
  );
};
export default Dashboard;