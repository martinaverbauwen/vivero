// frontend/src/pages/Catalogo.jsx
import React, { useEffect, useState } from 'react';
import { getProductos } from '../api/productoService';
import jwt_decode from 'jwt-decode';
import { Link } from 'react-router-dom';

const Catalogo = () => {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');        // Mensaje de éxito
  const [carrito, setCarrito] = useState(() => { // Estado del carrito
    const saved = localStorage.getItem('carrito');
    return saved ? JSON.parse(saved) : [];
  });

  // Obtener rol desde token
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

  // Alert() solo una vez al cambiar exito
  useEffect(() => {
    if (exito) {
      alert(exito);
      setExito('');
    }
  }, [exito]);

  // Guardar carrito en localStorage
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);

  // Traer productos
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

  // Función para agregar al carrito
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

  // Cortar la descripción si es muy larga
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
                <p className="card-text">{truncate(prod.descripcion)}</p>
                <div className="mt-auto">
                  <Link
                    to={`/productos/${prod.id}`}
                    className="btn btn-primary w-100 mb-2"
                  >
                    Ver Producto
                  </Link>
                  {rol === 'cliente' && (
                    <button
                      className="btn btn-success w-100"
                      onClick={() => agregarAlCarrito(prod)}
                    >
                      Agregar al carrito
                    </button>
                  )}
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

