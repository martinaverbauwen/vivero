// frontend/src/pages/Catalogo.jsx
import React, { useEffect, useState } from 'react';
import { getProductos } from '../api/productoService';
import jwt_decode from 'jwt-decode';
import { Link } from 'react-router-dom';

const Catalogo = () => {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await getProductos();
        setProductos(data);
      } catch {
        setError('No se pudieron cargar los productos.');
      }
    })();
  }, []);

  const truncate = (text, max = 100) =>
    text.length > max ? text.slice(0, max) + '…' : text;

  return (
    <div className="container mt-4">
      <h2>Catálogo de Productos</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row">
        {productos.map((prod) => (
          <div className="col-md-4 mb-4" key={prod.id}>
            <div className="card h-100">
              {prod.imagen ? (
                <img
                  src={prod.imagen}
                  className="card-img-top"
                  alt={prod.nombre}
                  style={{ objectFit: 'cover', height: '200px' }}
                />
              ) : (
                <div
                  className="bg-light d-flex align-items-center justify-content-center"
                  style={{ height: '200px' }}
                >
                  Sin imagen
                </div>
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{prod.nombre}</h5>
                <p className="card-text">{truncate(prod.descripcion)}</p>
                <div className="mt-auto">
                  <Link
                    to={`/productos/${prod.id}`}
                    className="btn btn-primary w-100"
                  >
                    Ver Producto
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Catalogo;

