import api from './api';

export const newsService = {
  getAll: (q) => api.get('/news', { params: q ? { q } : {} }),
  getOne: (id) => api.get(`/news/${id}`),
  create: (formData) => api.post('/news', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) => api.put(`/news/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/news/${id}`),
};

export const programService = {
  getAll: () => api.get('/program'),
  getOne: (id) => api.get(`/program/${id}`),
  create: (formData) => api.post('/program', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) => api.put(`/program/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/program/${id}`),
};

export const galleryService = {
  getAll: (category) => api.get('/gallery', { params: category ? { category } : {} }),
  create: (formData) => api.post('/gallery', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/gallery/${id}`),
};

export const videoService = {
  getAll: () => api.get('/videos'),
  create: (data) => api.post('/videos', data),
  delete: (id) => api.delete(`/videos/${id}`),
};

export const participantService = {
  getAll: () => api.get('/participants'),
  getOne: (id) => api.get(`/participants/${id}`),
  create: (formData) => api.post('/participants', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) => api.put(`/participants/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/participants/${id}`),
};

export const sponsorService = {
  getAll: () => api.get('/sponsors'),
  getOne: (id) => api.get(`/sponsors/${id}`),
  create: (formData) => api.post('/sponsors', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) => api.put(`/sponsors/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/sponsors/${id}`),
};

export const messageService = {
  getAll: () => api.get('/messages'),
  create: (data) => api.post('/messages', data),
  markAsRead: (id) => api.patch(`/messages/${id}/read`),
  delete: (id) => api.delete(`/messages/${id}`),
};

export const settingsService = {
  getAll: () => api.get('/settings'),
  update: (data) => api.put('/settings', data),
};

export const countdownService = {
  get: () => api.get('/countdown'),
  update: (festival_date) => api.put('/countdown', { festival_date }),
};

export const userService = {
  getAll: (q) => api.get('/users', { params: q ? { q } : {} }),
  getOne: (id) => api.get(`/users/${id}`),
  delete: (id) => api.delete(`/users/${id}`),
};

export const dashboardService = {
  getStats: () => api.get('/dashboard'),
};
