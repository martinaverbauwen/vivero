// frontend/src/pages/Welcome.jsx
import React from 'react';
import jwt_decode from 'jwt-decode';
import { useNavigate, Navigate } from 'react-router-dom';

const Welcome = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  if (!token) {
    // Si no hay token, redirigir a login
    return <Navigate to="/login" />;
  }

  let rol = null;
  try {
    const dec = jwt_decode(token);
    rol = dec.rol;
  } catch {
    rol = null;
  }

  // Si es cliente, mostramos mensaje con instrucción adicional
  if (rol === 'cliente') {
    return (
      <div className="container mt-5 text-center">
        <h1>Bienvenido a VIVERO GREEN</h1>
        <p className="mt-3 text-muted">
          Presiona <strong>"Productos"</strong> en el menú para dirigirte a nuestro catálogo y realizar tus compras.
        </p>
      </div>
    );
  }

  // Si es admin, solo el mensaje de bienvenida
  if (rol === 'admin') {
    return (
      <div className="container mt-5 text-center">
        <h1>Bienvenido a VIVERO GREEN</h1>
      </div>
    );
  }

  // Si el rol no coincide, redirigimos a login
  return <Navigate to="/login" />;
};

export default Welcome;
