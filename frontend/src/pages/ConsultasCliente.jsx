// frontend/src/pages/ConsultasCliente.jsx
import React, { useState, useEffect } from 'react';
import {
  crearConsulta,
  listarConsultasCliente
} from '../api/consultaService';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const ConsultasCliente = () => {
  const [mensaje, setMensaje] = useState('');
  const [consultas, setConsultas] = useState([]);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) navigate('/login');
    const dec = jwt_decode(token);
    if (dec.rol !== 'cliente') navigate('/');
    fetchConsultas();
    // eslint-disable-next-line
  }, [token]);

  const fetchConsultas = async () => {
    try {
      const data = await listarConsultasCliente(token);
      setConsultas(data);
    } catch {
      setError('Error al cargar consultas.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await crearConsulta(mensaje, token);
      setMensaje('');
      fetchConsultas();
    } catch {
      setError('Error al crear consulta.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Mis Consultas</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label className="form-label">Nueva Consulta</label>
          <textarea
            className="form-control"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            required
          ></textarea>
        </div>
        <button className="btn btn-success">Enviar Consulta</button>
      </form>

      <h5>Historial de Consultas</h5>
      {consultas.length === 0 ? (
        <p>No tienes consultas.</p>
      ) : (
        <ul className="list-group">
          {consultas.map((c) => (
            <li
              key={c.id}
              className="list-group-item d-flex justify-content-between align-items-start"
            >
              <div>
                <strong>Mensaje:</strong> {c.mensaje} <br />
                <strong>Estado:</strong> {c.estado}{' '}
                {c.estado === 'respondida' && (
                  <>
                    <br />
                    <strong>Respuesta:</strong> {c.respuesta}
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ConsultasCliente;
