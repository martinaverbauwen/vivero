// frontend/src/pages/PedidosCliente.jsx
import React, { useState, useEffect } from 'react';
import { listarPedidosCliente } from '../api/pedidoService';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const PedidosCliente = () => {
  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) navigate('/login');
    const dec = jwt_decode(token);
    if (dec.rol !== 'cliente') navigate('/');
    fetchPedidos();
    // eslint-disable-next-line
  }, [token]);

  const fetchPedidos = async () => {
    try {
      const data = await listarPedidosCliente(token);
      setPedidos(data);
    } catch {
      setError('Error al cargar pedidos.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Mis Pedidos</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {pedidos.length === 0 ? (
        <p>No tienes pedidos.</p>
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
              <h6>Detalle:</h6>
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

export default PedidosCliente;
