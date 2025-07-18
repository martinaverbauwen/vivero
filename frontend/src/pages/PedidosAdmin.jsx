// frontend/src/pages/PedidosAdmin.jsx
import React, { useState, useEffect } from 'react';
import {
  listarPedidosAdmin,
  actualizarEstadoPedido
} from '../api/pedidoService';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const PedidosAdmin = () => {
  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) navigate('/login');
    const dec = jwt_decode(token);
    if (dec.rol !== 'admin') navigate('/');
    fetchPedidos();
    // eslint-disable-next-line
  }, [token]);

  const fetchPedidos = async () => {
    try {
      const data = await listarPedidosAdmin(token);
      setPedidos(data);
    } catch {
      setError('Error al cargar pedidos.');
    }
  };

  const handleEstado = async (id, nuevoEstado) => {
    setError('');
    try {
      await actualizarEstadoPedido(id, nuevoEstado, token);
      fetchPedidos();
    } catch {
      setError('Error al actualizar estado.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Administrar Pedidos</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {pedidos.length === 0 ? (
        <p>No hay pedidos.</p>
      ) : (
        pedidos.map((p) => (
          <div key={p.id} className="card mb-3">
            <div className="card-body">
              <p>
                <strong>Pedido ID:</strong> {p.id}
              </p>
              <p>
                <strong>Estado:</strong> {p.estado}
              </p>
              <p>
                <strong>Total:</strong> ${p.total}
              </p>
              <p>
                <strong>Medio Pago:</strong> {p.medioPago}
              </p>
              <button
                className="btn btn-success btn-sm me-2"
                disabled={p.estado === 'confirmado'}
                onClick={() => handleEstado(p.id, 'confirmado')}
              >
                Confirmar
              </button>
              <button
                className="btn btn-danger btn-sm"
                disabled={p.estado === 'cancelado'}
                onClick={() => handleEstado(p.id, 'cancelado')}
              >
                Cancelar
              </button>
              <h6 className="mt-3">Detalle:</h6>
              <ul>
                {p.DetallePedidos.map((d) => (
                  <li key={d.id}>
                    {d.Producto.nombre} x {d.cantidad} = $
                    {(d.precio_unitario * d.cantidad).toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PedidosAdmin;
