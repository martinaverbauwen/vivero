// frontend/src/api/productoService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const getProductos = async () => {
  const resp = await axios.get(`${API_URL}/productos`);
  return resp.data;
};

export const getProducto = async (id) => {
  const resp = await axios.get(`${API_URL}/productos/${id}`);
  return resp.data;
};

export const crearProducto = async (producto, token) => {
  const resp = await axios.post(`${API_URL}/productos`, producto, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return resp.data;
};

export const editarProducto = async (id, producto, token) => {
  const resp = await axios.put(`${API_URL}/productos/${id}`, producto, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return resp.data;
};

export const eliminarProducto = async (id, token) => {
  const resp = await axios.delete(`${API_URL}/productos/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return resp.data;
};
