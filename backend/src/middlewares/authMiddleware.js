// backend/src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { Usuario } = require('../models');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ msg: 'Token faltante.' });

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findByPk(payload.id);
    if (!usuario) return res.status(401).json({ msg: 'Usuario no existe.' });
    req.usuario = usuario;
    next();
  } catch {
    return res.status(401).json({ msg: 'Token inválido.' });
  }
};

module.exports = authMiddleware;
