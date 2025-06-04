// frontend/src/pages/Catalogo.jsx
import React, { useEffect, useState } from 'react';
import { getProductos } from '../api/productoService';
import jwt_decode from 'jwt-decode';

const Catalogo = () => {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(''); // Mensaje de éxito
  const [carrito, setCarrito] = useState(() => {
    const saved = localStorage.getItem('carrito');
    return saved ? JSON.parse(saved) : [];
  });

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

  // Efecto para disparar alert() UNA sola vez cuando exito cambie
  useEffect(() => {
    if (exito) {
      alert(exito);
      setExito(''); // Limpiar para no volver a mostrar
    }
  }, [exito]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProductos();
        setProductos(data);
      } catch {
        setError('No se pudieron cargar los productos.');
      }
    };
    fetchData();
  }, []);

  const agregarAlCarrito = (producto) => {
    const existe = carrito.find((p) => p.id === producto.id);
    if (existe) {
      setCarrito(
        carrito.map((p) =>
          p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
        )
      );
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
    setExito('Producto agregado al carrito');
  };

  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);

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
                  style={{ objectFit: 'cover', height: '300px' }}
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
                <p className="card-text">{prod.descripcion}</p>
                <p className="card-text fw-bold">${prod.precio}</p>
                {rol === 'cliente' && (
                  <button
                    className="btn btn-success mt-auto"
                    onClick={() => agregarAlCarrito(prod)}
                  >
                    Agregar al carrito
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Catalogo;
