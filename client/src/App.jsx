import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AdminLayout from './layouts/AdminLayout';

const Home = React.lazy(() => import('./pages/public/Home'));
const About = React.lazy(() => import('./pages/public/About'));
const Program = React.lazy(() => import('./pages/public/Program'));
const News = React.lazy(() => import('./pages/public/News'));
const Gallery = React.lazy(() => import('./pages/public/Gallery'));
const Participants = React.lazy(() => import('./pages/public/Participants'));
const Sponsors = React.lazy(() => import('./pages/public/Sponsors'));
const Contact = React.lazy(() => import('./pages/public/Contact'));

const Login = React.lazy(() => import('./pages/auth/Login'));
const Register = React.lazy(() => import('./pages/auth/Register'));
const Dashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const UsersAdmin = React.lazy(() => import('./pages/admin/Users'));
const NewsAdmin = React.lazy(() => import('./pages/admin/News'));
const ProgramAdmin = React.lazy(() => import('./pages/admin/Program'));
const GalleryAdmin = React.lazy(() => import('./pages/admin/Gallery'));
const ParticipantsAdmin = React.lazy(() => import('./pages/admin/Participants'));
const SponsorsAdmin = React.lazy(() => import('./pages/admin/Sponsors'));
const MessagesAdmin = React.lazy(() => import('./pages/admin/Messages'));
const SettingsAdmin = React.lazy(() => import('./pages/admin/Settings'));

const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <Footer />
  </>
);

function App() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-primary-600 text-xl">Loading...</div>}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/program" element={<PublicLayout><Program /></PublicLayout>} />
        <Route path="/news" element={<PublicLayout><News /></PublicLayout>} />
        <Route path="/gallery" element={<PublicLayout><Gallery /></PublicLayout>} />
        <Route path="/participants" element={<PublicLayout><Participants /></PublicLayout>} />
        <Route path="/sponsors" element={<PublicLayout><Sponsors /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
        <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<UsersAdmin />} />
          <Route path="news" element={<NewsAdmin />} />
          <Route path="program" element={<ProgramAdmin />} />
          <Route path="gallery" element={<GalleryAdmin />} />
          <Route path="participants" element={<ParticipantsAdmin />} />
          <Route path="sponsors" element={<SponsorsAdmin />} />
          <Route path="messages" element={<MessagesAdmin />} />
          <Route path="settings" element={<SettingsAdmin />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
export default App;