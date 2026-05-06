const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://vehicle-service-booking-system-backend.onrender.com/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// API request helper
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: (credentials) => 
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  
  register: (userData) => 
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  
  getProfile: () => 
    apiRequest('/auth/profile'),
};

// Service API
export const serviceAPI = {
  getServices: () => 
    apiRequest('/services'),
};

// Booking API
export const bookingAPI = {
  createBooking: (bookingData) => 
    apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    }),
  
  getBookings: () => 
    apiRequest('/bookings'),
};

// Contact API
export const contactAPI = {
  submitContact: (contactData) => 
    apiRequest('/contact', {
      method: 'POST',
      body: JSON.stringify(contactData),
    }),
};

// Auth helpers
export const authHelpers = {
  setToken: (token) => {
    localStorage.setItem('token', token);
  },
  
  removeToken: () => {
    localStorage.removeItem('token');
  },
  
  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },
  
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};