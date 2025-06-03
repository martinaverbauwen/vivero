// frontend/src/pages/Carrito.jsx
import React, { useState, useEffect } from 'react';
import { crearPedido } from '../api/pedidoService';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const Carrito = () => {
  const [carrito, setCarrito] = useState(() => {
    const saved = localStorage.getItem('carrito');
    return saved ? JSON.parse(saved) : [];
  });
  const [medioPago, setMedioPago] = useState('efectivo');
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  let rol = null;
  if (token) {
    try {
      const dec = jwt_decode(token);
      rol = dec.rol;
    } catch {
      rol = null;
    }
  }

  useEffect(() => {
    if (!token) navigate('/login');
    if (rol !== 'cliente') navigate('/');
  }, [token, rol, navigate]);

  const calcularTotal = () => {
    return carrito
      .reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0)
      .toFixed(2);
  };

  const handleConfirmar = async () => {
    setError('');
    setExito('');
    const detalles = carrito.map((p) => ({
      productoId: p.id,
      cantidad: p.cantidad
    }));
    try {
      await crearPedido(detalles, medioPago, token);
      setExito('Pedido realizado con éxito.');
      setCarrito([]);
      localStorage.removeItem('carrito');
    } catch (err) {
      setError(err.response?.data?.msg || 'Error al procesar pedido.');
    }
  };

  const manejarCambioCantidad = (id, nuevaCantidad) => {
    setCarrito(
      carrito.map((p) =>
        p.id === id ? { ...p, cantidad: nuevaCantidad } : p
      )
    );
  };

  const eliminarDelCarrito = (id) => {
    const filtrado = carrito.filter((p) => p.id !== id);
    setCarrito(filtrado);
  };

  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);

  return (
    <div className="container mt-4">
      <h2>Tu Carrito</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {exito && <div className="alert alert-success">{exito}</div>}
      {carrito.length === 0 ? (
        <p>No hay productos en el carrito.</p>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unit.</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {carrito.map((p) => (
                <tr key={p.id}>
                  <td>{p.nombre}</td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      style={{ width: '80px' }}
                      min="1"
                      value={p.cantidad}
                      onChange={(e) =>
                        manejarCambioCantidad(p.id, parseInt(e.target.value))
                      }
                    />
                  </td>
                  <td>${p.precio}</td>
                  <td>${(p.precio * p.cantidad).toFixed(2)}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => eliminarDelCarrito(p.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
              <label className="form-label me-2">Medio de Pago:</label>
              <select
                className="form-select d-inline-block"
                style={{ width: '200px' }}
                value={medioPago}
                onChange={(e) => setMedioPago(e.target.value)}
              >
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="transferencia">Transferencia</option>
              </select>
            </div>
            <h4>Total: ${calcularTotal()}</h4>
            <button className="btn btn-success" onClick={handleConfirmar}>
              Confirmar Pedido
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Carrito;
