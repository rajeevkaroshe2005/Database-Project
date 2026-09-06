const BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const res = await fetch(url, config);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Request failed');
    }
    return data;
  } catch (err) {
    console.error(`[API Error] ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Services
  getServices: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/services?${query}`);
  },
  getServiceById: (id) => request(`/services/${id}`),
  getCategories: () => request('/services/categories'),
  getLocations: () => request('/services/locations'),
  getServiceInventory: (id, date) => request(`/services/${id}/inventory?date=${date || ''}`),

  // Bookings & Hold
  holdReservation: (serviceId, resourceIds, userId) =>
    request('/bookings/hold', { method: 'POST', body: { serviceId, resourceIds, userId } }),
  releaseReservation: (serviceId, resourceIds, userId) =>
    request('/bookings/release', { method: 'POST', body: { serviceId, resourceIds, userId } }),
  createBooking: (bookingData) =>
    request('/bookings', { method: 'POST', body: bookingData }),
  getUserBookings: (userId, status) =>
    request(`/bookings/user?userId=${userId}&status=${status || ''}`),
  cancelBooking: (bookingId, userId, reason) =>
    request(`/bookings/${bookingId}/cancel`, { method: 'POST', body: { userId, reason } }),
  joinWaitingList: (payload) =>
    request('/bookings/waiting-list', { method: 'POST', body: payload }),

  // Payments
  processPayment: (paymentData) =>
    request('/payments/process', { method: 'POST', body: paymentData }),

  // Coupons
  validateCoupon: (code, amount) =>
    request('/coupons/validate', { method: 'POST', body: { code, amount } }),
  getCoupons: () => request('/coupons'),

  // Reviews
  addReview: (reviewData) =>
    request('/reviews', { method: 'POST', body: reviewData }),

  // Notifications
  getNotifications: (userId) =>
    request(`/notifications?userId=${userId}`),
  markNotificationRead: (notifId) =>
    request(`/notifications/${notifId}/read`, { method: 'PUT' }),

  // Auth & Profile
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: { email, password } }),
  register: (userData) =>
    request('/auth/register', { method: 'POST', body: userData }),
  getProfile: (userId) =>
    request(`/auth/profile?userId=${userId}`),
  switchDemoRole: (role) =>
    request('/auth/switch-demo', { method: 'POST', body: { role } }),

  // Admin
  getAdminAnalytics: () => request('/admin/analytics'),
  getAllBookings: () => request('/admin/bookings'),
  createService: (serviceData) => request('/admin/services', { method: 'POST', body: serviceData }),
  updateService: (id, serviceData) => request(`/admin/services/${id}`, { method: 'PUT', body: serviceData }),
  deleteService: (id) => request(`/admin/services/${id}`, { method: 'DELETE' }),
  getAuditLogs: () => request('/admin/audit-logs'),
  getUsers: () => request('/admin/users'),
  getDatabaseExplorer: () => request('/admin/database'),
  executeSqlQuery: (sql) => request('/admin/query', { method: 'POST', body: { sql } }),
  simulateConcurrency: (data) => request('/admin/simulate-concurrency', { method: 'POST', body: data }),
  explainQuery: (sql) => request('/admin/explain-query', { method: 'POST', body: { sql } }),
  exportSqlDump: () => request('/admin/export-sql')
};
