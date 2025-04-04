import axiosInstance from './axiosConfig';

export const login = async (email, password) => {
  try {
    const response = await axiosInstance.post('/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error;
  }
};


export const register = async (name, email, password) => {
  const response = await axiosInstance.post('/register', {
    name,
    email,
    password,
  });
  return response.data;
};

export const logout = async () => {
  const response = await axiosInstance.post('/logout');
  return response.data;
};

export const checkSession = async () => {
  const response = await axiosInstance.get('/session');
  return response.data;
};
