// backend/src/models/pedido.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./usuario');

const Pedido = sequelize.define('Pedido', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: { min: 0 }
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'confirmado', 'cancelado'),
    allowNull: false,
    defaultValue: 'pendiente'
  },
  medioPago: {
    type: DataTypes.STRING(50)
  }
}, {
  tableName: 'pedido'
});

// Relaciones
Pedido.belongsTo(Usuario, { foreignKey: 'usuarioId', onDelete: 'CASCADE' });
Usuario.hasMany(Pedido, { foreignKey: 'usuarioId' });

module.exports = Pedido;
