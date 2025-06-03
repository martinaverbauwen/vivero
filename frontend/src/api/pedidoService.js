// frontend/src/api/pedidoService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const crearPedido = async (detalles, medioPago, token) => {
  const resp = await axios.post(
    `${API_URL}/pedidos`,
    { detalles, medioPago },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return resp.data;
};

export const listarPedidosCliente = async (token) => {
  const resp = await axios.get(`${API_URL}/pedidos`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return resp.data;
};

export const listarPedidosAdmin = async (token) => {
  const resp = await axios.get(`${API_URL}/pedidos/admin`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return resp.data;
};

export const actualizarEstadoPedido = async (id, estado, token) => {
  const resp = await axios.put(
    `${API_URL}/pedidos/estado/${id}`,
    { estado },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return resp.data;
};
