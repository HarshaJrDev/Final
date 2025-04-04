import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';

// This utility handles session management to ensure only one active session per user
const SESSION_KEY = '@task_manager_session';
const API_URL = 'https://your-api-url.com/api';

// Get unique device identifier
const getDeviceId = async () => {
  let deviceId;
  if (Platform.OS === 'web') {
    // For web, use a random ID stored in localStorage
    deviceId = localStorage.getItem('device_id');
    if (!deviceId) {
      deviceId = `web_${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem('device_id', deviceId);
    }
  } else {
    // For mobile, use device unique ID
    deviceId = await DeviceInfo.getUniqueId();
  }
  return deviceId;
};

// Set up axios instance with authentication token
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  async config => {
    const sessionData = await getSessionData();
    if (sessionData?.token) {
      config.headers.Authorization = `Bearer ${sessionData.token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Handle response errors
api.interceptors.response.use(
  response => response,
  async error => {
    if (error?.response?.status === 401) {
      // If unauthorized, clear session and redirect to login
      await clearSession();
      // You would typically use navigation here, but we'll keep it simple
    }
    return Promise.reject(error);
  },
);

// Save session data
const saveSession = async (userData, token) => {
  const deviceId = await getDeviceId();
  const sessionData = {
    user: userData,
    token,
    deviceId,
    timestamp: new Date().toISOString(),
  };
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));

  // Register the session with the backend
  try {
    await api.post('/sessions/register', {deviceId, userId: userData.id});
  } catch (error) {
    console.error('Failed to register session:', error);
  }
};

// Get current session data
const getSessionData = async () => {
  try {
    const sessionData = await AsyncStorage.getItem(SESSION_KEY);
    return sessionData ? JSON.parse(sessionData) : null;
  } catch (error) {
    console.error('Error retrieving session data:', error);
    return null;
  }
};

// Check if user is authenticated
const isAuthenticated = async () => {
  const sessionData = await getSessionData();
  return !!sessionData?.token;
};

// Clear session when logging out
const clearSession = async () => {
  try {
    const sessionData = await getSessionData();
    if (sessionData) {
      // Inform backend about logout
      await api.post('/sessions/revoke', {
        deviceId: sessionData.deviceId,
        userId: sessionData.user.id,
      });
    }
    await AsyncStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error('Error during logout:', error);
    // Attempt to remove local data even if API call fails
    await AsyncStorage.removeItem(SESSION_KEY);
  }
};

// Verify session is still valid
const verifySession = async () => {
  try {
    const sessionData = await getSessionData();
    if (!sessionData) return false;

    const response = await api.get('/sessions/verify', {
      params: {deviceId: sessionData.deviceId, userId: sessionData.user.id},
    });

    if (response.data.valid === false) {
      // This session has been invalidated (logged out from another device)
      await clearSession();
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error verifying session:', error);
    return false;
  }
};

// Periodic session check (call this when app starts or resumes)
const setupSessionMonitor = onSessionInvalid => {
  // Check immediately
  verifySession().then(valid => {
    if (!valid && onSessionInvalid) onSessionInvalid();
  });

  // Check every 5 minutes
  const intervalId = setInterval(() => {
    verifySession().then(valid => {
      if (!valid && onSessionInvalid) onSessionInvalid();
    });
  }, 5 * 60 * 1000);

  // Return cleanup function
  return () => clearInterval(intervalId);
};

export {
  api,
  saveSession,
  getSessionData,
  isAuthenticated,
  clearSession,
  verifySession,
  setupSessionMonitor,
};
