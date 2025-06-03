// frontend/src/pages/ProductosAdmin.jsx
import React, { useEffect, useState } from 'react';
import { getProductos, eliminarProducto } from '../api/productoService';
import jwt_decode from 'jwt-decode';
import { useNavigate, Link } from 'react-router-dom';

const ProductosAdmin = () => {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // Verificar que el usuario es admin
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    const dec = jwt_decode(token);
    if (dec.rol !== 'admin') {
      navigate('/');
      return;
    }
    fetchProductos();
    // eslint-disable-next-line
  }, [token]);

  const fetchProductos = async () => {
    try {
      const data = await getProductos();
      setProductos(data);
    } catch {
      setError('Error al cargar productos.');
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
    setError('');
    try {
      await eliminarProducto(id, token);
      fetchProductos(); // refrescar lista
    } catch {
      setError('Error al eliminar producto.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Administrar Productos</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {/* Botón para crear nuevo producto */}
      <div className="mb-3">
        <Link to="/productos-admin/nuevo" className="btn btn-success">
          + Nuevo Producto
        </Link>
      </div>
      {productos.length === 0 ? (
        <p>No hay productos.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((prod) => (
              <tr key={prod.id}>
                <td>{prod.id}</td>
                <td>{prod.nombre}</td>
                <td>${prod.precio}</td>
                <td>{prod.stock}</td>
                <td>
                  {/* Editar redirige al formulario con id */}
                  <Link
                    to={`/productos-admin/editar/${prod.id}`}
                    className="btn btn-primary btn-sm me-2"
                  >
                    Editar
                  </Link>
                  {/* Eliminar */}
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleEliminar(prod.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductosAdmin;
