// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Welcome from './pages/Welcome';
import Catalogo from './pages/Catalogo';
import ProductosAdmin from './pages/ProductosAdmin';

import Login from './pages/Login';
import Register from './pages/Register';
import Carrito from './pages/Carrito';
import ConsultasCliente from './pages/ConsultasCliente';
import ConsultasAdmin from './pages/ConsultasAdmin';
import PedidosCliente from './pages/PedidosCliente';
import PedidosAdmin from './pages/PedidosAdmin';
import ProductoForm from './pages/ProductoForm';

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Página principal de bienvenida */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Welcome />
            </ProtectedRoute>
          }
        />

        {/* Catálogo de productos (cliente) */}
        <Route
          path="/productos"
          element={
            <ProtectedRoute>
              <Catalogo />
            </ProtectedRoute>
          }
        />

        {/* Login / Register */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas protegidas (cliente o admin) */}
        <Route
          path="/carrito"
          element={
            <ProtectedRoute>
              <Carrito />
            </ProtectedRoute>
          }
        />
        <Route
          path="/consultas-cliente"
          element={
            <ProtectedRoute>
              <ConsultasCliente />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pedidos-cliente"
          element={
            <ProtectedRoute>
              <PedidosCliente />
            </ProtectedRoute>
          }
        />

        {/* Administración de productos */}
        <Route
          path="/productos-admin"
          element={
            <ProtectedRoute>
              <ProductosAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/productos-admin/nuevo"
          element={
            <ProtectedRoute>
              <ProductoForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/productos-admin/editar/:id"
          element={
            <ProtectedRoute>
              <ProductoForm />
            </ProtectedRoute>
          }
        />

        {/* Consultas y pedidos admin */}
        <Route
          path="/consultas-admin"
          element={
            <ProtectedRoute>
              <ConsultasAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pedidos-admin"
          element={
            <ProtectedRoute>
              <PedidosAdmin />
            </ProtectedRoute>
          }
        />

        {/* Cualquier otra ruta → login */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
