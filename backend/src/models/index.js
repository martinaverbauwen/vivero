// backend/src/models/index.js
const sequelize = require('../config/database');
const Usuario = require('./usuario');
const Producto = require('./producto');
const Pedido = require('./pedido');
const DetallePedido = require('./detallePedido');
const Consulta = require('./consulta');

// Ya definimos asociaciones dentro de cada modelo, pero aquí ponemos la función para conectar y sincronizar:
const dbInit = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos exitosa.');
    // No usamos force: true porque la base ya existe
    await sequelize.sync();
    console.log('Modelos sincronizados.');
  } catch (err) {
    console.error('Error al conectar/sincronizar BD:', err);
  }
};

module.exports = {
  sequelize,
  dbInit,
  Usuario,
  Producto,
  Pedido,
  DetallePedido,
  Consulta
};
