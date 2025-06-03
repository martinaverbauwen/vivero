// frontend/src/api/consultaService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const crearConsulta = async (mensaje, token) => {
  const resp = await axios.post(
    `${API_URL}/consultas`,
    { mensaje },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return resp.data;
};

export const listarConsultasCliente = async (token) => {
  const resp = await axios.get(`${API_URL}/consultas`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return resp.data;
};

export const listarConsultasAdmin = async (token) => {
  const resp = await axios.get(`${API_URL}/consultas/admin`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return resp.data;
};

export const responderConsulta = async (id, respuesta, token) => {
  const resp = await axios.put(
    `${API_URL}/consultas/responder/${id}`,
    { respuesta },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return resp.data;
};

export const eliminarConsulta = async (id, token) => {
  const resp = await axios.delete(`${API_URL}/consultas/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return resp.data;
};
