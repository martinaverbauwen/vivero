// backend/src/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { dbInit } = require('./models');

// Rutas
const authRoutes = require('./routes/authRoutes');
const productoRoutes = require('./routes/productoRoutes');
const consultaRoutes = require('./routes/consultaRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/consultas', consultaRoutes);
app.use('/api/pedidos', pedidoRoutes);

app.get('/', (_req, res) => {
  res.send('Bienvenido a VIVERO GREEN API');
});

const startServer = async () => {
  try {
    await dbInit();
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  } catch (err) {
    console.error('Error al iniciar la aplicación:', err);
  }
};

startServer();
