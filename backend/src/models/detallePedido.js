// backend/src/models/detallePedido.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Pedido = require('./pedido');
const Producto = require('./producto');

const DetallePedido = sequelize.define('DetallePedido', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1 }
  },
  precio_unitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: { min: 0 }
  }
}, {
  tableName: 'detalle_pedido'
});

// Relaciones
DetallePedido.belongsTo(Pedido, { foreignKey: 'pedidoId', onDelete: 'CASCADE' });
Pedido.hasMany(DetallePedido, { foreignKey: 'pedidoId' });

DetallePedido.belongsTo(Producto, { foreignKey: 'productoId', onDelete: 'RESTRICT' });
Producto.hasMany(DetallePedido, { foreignKey: 'productoId' });

module.exports = DetallePedido;
