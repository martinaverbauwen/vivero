// frontend/src/pages/ConsultasAdmin.jsx
import React, { useState, useEffect } from 'react';
import {
  listarConsultasAdmin,
  responderConsulta,
  eliminarConsulta
} from '../api/consultaService';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const ConsultasAdmin = () => {
  const [consultas, setConsultas] = useState([]);
  const [respuesta, setRespuesta] = useState('');
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) navigate('/login');
    const dec = jwt_decode(token);
    if (dec.rol !== 'admin') navigate('/');
    fetchConsultas();
    // eslint-disable-next-line
  }, [token]);

  const fetchConsultas = async () => {
    try {
      const data = await listarConsultasAdmin(token);
      setConsultas(data);
    } catch {
      setError('Error al cargar consultas.');
    }
  };

  const handleResponder = async (id) => {
    if (!respuesta) {
      setError('La respuesta no puede estar vacía.');
      return;
    }
    setError('');
    try {
      await responderConsulta(id, respuesta, token);
      setRespuesta('');
      fetchConsultas();
    } catch {
      setError('Error al responder.');
    }
  };

  const handleEliminar = async (id) => {
    setError('');
    try {
      await eliminarConsulta(id, token);
      fetchConsultas();
    } catch {
      setError('Error al eliminar.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Administrar Consultas</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {consultas.length === 0 ? (
        <p>No hay consultas pendientes.</p>
      ) : (
        consultas.map((c) => (
          <div key={c.id} className="card mb-3">
            <div className="card-body">
              <p>
                <strong>Usuario ID:</strong> {c.usuarioId}
              </p>
              <p>
                <strong>Mensaje:</strong> {c.mensaje}
              </p>
              <div className="mb-3">
                <label className="form-label">Respuesta:</label>
                <textarea
                  className="form-control"
                  value={respuesta}
                  onChange={(e) => setRespuesta(e.target.value)}
                ></textarea>
              </div>
              <button
                className="btn btn-primary me-2"
                onClick={() => handleResponder(c.id)}
              >
                Responder
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleEliminar(c.id)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ConsultasAdmin;
