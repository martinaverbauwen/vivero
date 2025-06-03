// backend/src/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { Usuario } = require('../models');

const register = async (req, res) => {
  const { nombre, email, contraseña } = req.body;
  try {
    const existe = await Usuario.findOne({ where: { email } });
    if (existe) return res.status(400).json({ msg: 'El email ya está registrado.' });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(contraseña, salt);

    await Usuario.create({
      nombre,
      email,
      contraseña: hash,
      rol: 'cliente'
    });
    return res.status(201).json({ msg: 'Usuario registrado correctamente.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Error en el servidor.' });
  }
};

const login = async (req, res) => {
  const { email, contraseña } = req.body;
  try {
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) return res.status(400).json({ msg: 'Credenciales inválidas.' });

    const isMatch = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!isMatch) return res.status(400).json({ msg: 'Credenciales inválidas.' });

    // Token SIN expiración
    const payload = { id: usuario.id, rol: usuario.rol };
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    // <-- no expiresIn

    return res.json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Error en el servidor.' });
  }
};

module.exports = { register, login };
