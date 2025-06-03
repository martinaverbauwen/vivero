// backend/src/models/consulta.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./usuario');

const Consulta = sequelize.define('Consulta', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  mensaje: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  respuesta: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'respondida'),
    allowNull: false,
    defaultValue: 'pendiente'
  }
}, {
  tableName: 'consulta'
});

Consulta.belongsTo(Usuario, { foreignKey: 'usuarioId', onDelete: 'CASCADE' });
Usuario.hasMany(Consulta, { foreignKey: 'usuarioId' });

module.exports = Consulta;
