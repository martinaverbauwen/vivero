// frontend/src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

const Navbar = () => {
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success">
      <div className="container">
        <Link className="navbar-brand" to="/">
          VIVERO GREEN
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarContent">
          {token ? (
            <>
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                {/* Enlace a catálogo (antes apuntaba a "/") */}

               <li className="nav-item">
                 <Link className="nav-link" to="/productos">
                   Productos
                 </Link>
               </li>

                {/* Solo para clientes */}
                {rol === 'cliente' && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/carrito">
                        Carrito
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/consultas-cliente">
                        Mis Consultas
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/pedidos-cliente">
                        Mis Pedidos
                      </Link>
                    </li>
                  </>
                )}

                {/* Solo para administradores */}
                {rol === 'admin' && (
                  <>
                        <li className="nav-item">
                     <Link className="nav-link" to="/productos-admin">
                       Admin Productos
                     </Link>
                   </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/consultas-admin">
                        Consultas Admin
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/pedidos-admin">
                        Pedidos Admin
                      </Link>
                    </li>
                  </>
                )}
              </ul>

              <button className="btn btn-outline-light" onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </>
          ) : (
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Iniciar Sesión
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">
                  Registrarse
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
