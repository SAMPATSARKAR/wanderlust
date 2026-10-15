const API_BASE = '/api';

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('wanderlust_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
};

export const api = {
  // Auth API
  auth: {
    login: (credentials) =>
      request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    register: (userData) =>
      request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
    demo: (role) =>
      request('/auth/demo', { method: 'POST', body: JSON.stringify({ role }) }),
    getMe: () => request('/auth/me')
  },

  // Listings API with Server-Side Pagination & Filtering
  listings: {
    getAll: (params = {}) => {
      const query = new URLSearchParams();
      if (params.page) query.append('page', params.page);
      if (params.limit) query.append('limit', params.limit);
      if (params.category && params.category !== 'All') query.append('category', params.category);
      if (params.search) query.append('search', params.search);
      if (params.minPrice) query.append('minPrice', params.minPrice);
      if (params.maxPrice) query.append('maxPrice', params.maxPrice);
      if (params.sort) query.append('sort', params.sort);

      return request(`/listings?${query.toString()}`);
    },
    getById: (id) => request(`/listings/${id}`),
    create: (data) =>
      request('/listings', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) =>
      request(`/listings/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) =>
      request(`/listings/${id}`, { method: 'DELETE' }),
    getMyListings: () => request('/listings/owner/my-listings'),
    getCategories: () => request('/listings/meta/categories'),
    getFeatured: () => request('/listings/meta/featured')
  },

  // Bookings API
  bookings: {
    create: (bookingData) =>
      request('/bookings', { method: 'POST', body: JSON.stringify(bookingData) }),
    getMyTrips: () => request('/bookings/my-trips'),
    getOwnerReservations: () => request('/bookings/owner-reservations'),
    cancel: (id) => request(`/bookings/${id}/cancel`, { method: 'PATCH' }),
    updateStatus: (id, status) =>
      request(`/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })
  },

  // Reviews API
  reviews: {
    add: (listingId, reviewData) =>
      request(`/listings/${listingId}/reviews`, {
        method: 'POST',
        body: JSON.stringify(reviewData)
      }),
    delete: (listingId, reviewId) =>
      request(`/listings/${listingId}/reviews/${reviewId}`, { method: 'DELETE' })
  }
};
