// frontend/src/pages/ProductoDetalle.jsx
import React, { useEffect, useState } from 'react';
import { getProducto } from '../api/productoService';
import jwt_decode from 'jwt-decode';
import { useParams, Navigate } from 'react-router-dom';

const ProductoDetalle = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const token = localStorage.getItem('token');

  // Determinar rol
  let rol = null;
  if (token) {
    try {
      rol = jwt_decode(token).rol;
    } catch {
      rol = null;
    }
  }

  // Protección de ruta
  if (!token) return <Navigate to="/login" />;
  if (rol !== 'cliente' && rol !== 'admin') return <Navigate to="/login" />;

  useEffect(() => {
    (async () => {
      try {
        const data = await getProducto(id);
        setProducto(data);
      } catch {
        setError('No se pudo cargar el producto.');
      }
    })();
  }, [id]);

  const agregarAlCarrito = () => {
    const carritoLocal = JSON.parse(localStorage.getItem('carrito') || '[]');
    const existe = carritoLocal.find((p) => p.id === producto.id);
    if (existe) {
      existe.cantidad++;
    } else {
      carritoLocal.push({ ...producto, cantidad: 1 });
    }
    localStorage.setItem('carrito', JSON.stringify(carritoLocal));
    setExito('Producto agregado al carrito');
    setTimeout(() => setExito(''), 2000);
  };

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }
  if (!producto) {
    return <div className="container mt-4">Cargando...</div>;
  }

  // Formatear descripción: **negrita** y saltos de línea
  const formattedDesc = producto.descripcion
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');

  return (
    <div className="container mt-4">
      {exito && <div className="alert alert-success">{exito}</div>}

      <div className="card shadow-sm mb-4">
        <div className="row g-0">
          <div className="col-md-6">
            {producto.imagen ? (
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="img-fluid rounded-start"
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            ) : (
              <div
                className="bg-light d-flex align-items-center justify-content-center rounded-start"
                style={{ height: '100%', minHeight: '300px' }}
              >
                Sin imagen
              </div>
            )}
          </div>

          <div className="col-md-6">
            <div className="card-body">
              <h2 className="card-title mb-3">{producto.nombre}</h2>
              <h4 className="text-success mb-3">${producto.precio}</h4>

              <h5 className="text-secondary">Detalle:</h5>
              <p
                className="card-text text-muted mb-4"
                dangerouslySetInnerHTML={{ __html: formattedDesc }}
              ></p>

              {/* Stock visible solo para admin */}
              {rol === 'admin' && (
                <p className="mb-4">
                  <strong>Stock disponible:</strong> {producto.stock}
                </p>
              )}

              <div>
                {rol === 'cliente' && (
                  <button
                    className="btn btn-success me-2"
                    onClick={agregarAlCarrito}
                  >
                    Agregar al carrito
                  </button>
                )}
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => window.history.back()}
                >
                  Volver al catálogo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductoDetalle;
