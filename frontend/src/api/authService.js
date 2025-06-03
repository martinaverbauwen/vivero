// frontend/src/api/authService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const register = async (usuarioData) => {
  const resp = await axios.post(`${API_URL}/auth/register`, usuarioData);
  return resp.data;
};

export const login = async (credentials) => {
  const resp = await axios.post(`${API_URL}/auth/login`, credentials);
  return resp.data;
};
