// frontend/src/pages/ProductoForm.jsx
import React, { useState, useEffect } from 'react';
import {
  crearProducto,
  editarProducto,
  getProducto
} from '../api/productoService';
import jwt_decode from 'jwt-decode';
import { useNavigate, useParams } from 'react-router-dom';

const ProductoForm = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [imagen, setImagen] = useState('');
  const [error, setError] = useState('');
  const { id } = useParams();
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
    if (rol !== 'admin') navigate('/');
    if (id) fetchProducto();
    // eslint-disable-next-line
  }, [id, token]);

  const fetchProducto = async () => {
    try {
      const data = await getProducto(id);
      setNombre(data.nombre);
      setDescripcion(data.descripcion);
      setPrecio(data.precio);
      setStock(data.stock);
      setImagen(data.imagen);
    } catch {
      setError('Error al cargar producto.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const prodData = { nombre, descripcion, precio, stock, imagen };
    try {
      if (id) {
        await editarProducto(id, prodData, token);
      } else {
        await crearProducto(prodData, token);
      }
      navigate('/');
    } catch {
      setError('Error al guardar producto.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>{id ? 'Editar Producto' : 'Nuevo Producto'}</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input
            type="text"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <textarea
            className="form-control"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Precio</label>
          <input
            type="number"
            className="form-control"
            step="0.01"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Stock</label>
          <input
            type="number"
            className="form-control"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">URL de Imagen</label>
          <input
            type="text"
            className="form-control"
            value={imagen}
            onChange={(e) => setImagen(e.target.value)}
          />
        </div>
        <button className="btn btn-success">{id ? 'Actualizar' : 'Crear'}</button>
      </form>
    </div>
  );
};

export default ProductoForm;
