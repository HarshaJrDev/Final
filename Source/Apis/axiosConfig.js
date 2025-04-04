import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const axiosInstance = axios.create({
  baseURL: 'http://192.168.154.90:5000',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
axiosInstance.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

// Handle token expiration
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Force logout if token is invalid
      AsyncStorage.removeItem('authToken');
      // Navigate to login (this will be handled by the AuthContext)

      return Promise.reject(error);
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
