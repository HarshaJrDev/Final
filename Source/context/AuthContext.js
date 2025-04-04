import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Alert } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { navigationRef } from './NavigationService';

const API_URL = 'http://192.168.154.90:2000';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const logoutRef = useRef(null); // to hold a stable logout reference

  const setupAxios = useCallback((userToken) => {
    if (userToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      if (token) {
        try {
          await axios.post(`${API_URL}/logout`);
        } catch (error) {
          console.log('Logout API failed silently:', error.message);
        }
      }
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
      setToken(null);
      setUser(null);
      setupAxios(null);

      navigationRef.current?.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'LoginScreen' }],
        })
      );
    } catch (error) {
      console.log('Logout error:', error);
    } finally {
      setLoading(false);
    }
  }, [token, setupAxios]);

  logoutRef.current = logout;

  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/login`, { email, password });
      const { token: newToken, user: userData } = response.data;

      await AsyncStorage.setItem('authToken', newToken);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      setToken(newToken);
      setUser(userData);
      setupAxios(newToken);
      return true;
    } catch (error) {
      Alert.alert('Login Failed', error.response?.data?.error || 'Server error');
      return false;
    } finally {
      setLoading(false);
    }
  }, [setupAxios]);

  const register = useCallback(async (email, password) => {
    try {
      setLoading(true);
      await axios.post(`${API_URL}/register`, { email, password });
      Alert.alert('Success', 'Registered! Please login.');
      return true;
    } catch (error) {
      Alert.alert('Register Failed', error.response?.data?.error || 'Server error');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        const storedUserData = await AsyncStorage.getItem('userData');
        if (storedToken && storedUserData) {
          const userData = JSON.parse(storedUserData);
          setToken(storedToken);
          setUser(userData);
          setupAxios(storedToken);
        }
      } catch (error) {
        console.log('Load auth error:', error);
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, [setupAxios]);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      async error => {
        if (
          error.response &&
          error.response.status === 401 &&
          error.response.data?.code === 'FORCE_LOGOUT'
        ) {
          console.log('FORCE_LOGOUT received');
          if (logoutRef.current) {
            await logoutRef.current();
          }
          Alert.alert(
            'Session Expired',
            'You have been logged in on another device.',
            [{ text: 'OK' }]
          );
        }
        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
