// backend/src/controllers/consultaController.js
const { Consulta } = require('../models');

const crearConsulta = async (req, res) => {
  const { mensaje } = req.body;
  try {
    const consulta = await Consulta.create({
      usuarioId: req.usuario.id,
      mensaje
    });
    return res.status(201).json(consulta);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Error al crear consulta.' });
  }
};

const listarConsultasCliente = async (req, res) => {
  try {
    const consultas = await Consulta.findAll({
      where: { usuarioId: req.usuario.id }
    });
    return res.json(consultas);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Error al listar consultas.' });
  }
};

const listarConsultasAdmin = async (req, res) => {
  try {
    const consultas = await Consulta.findAll({
      where: { estado: 'pendiente' }
    });
    return res.json(consultas);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Error al listar consultas.' });
  }
};

const responderConsulta = async (req, res) => {
  const { id } = req.params;
  const { respuesta } = req.body;
  try {
    const consulta = await Consulta.findByPk(id);
    if (!consulta) return res.status(404).json({ msg: 'Consulta no encontrada.' });

    consulta.respuesta = respuesta;
    consulta.estado = 'respondida';
    await consulta.save();

    return res.json({ msg: 'Consulta respondida.', consulta });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Error al responder consulta.' });
  }
};

const eliminarConsulta = async (req, res) => {
  const { id } = req.params;
  try {
    const consulta = await Consulta.findByPk(id);
    if (!consulta) return res.status(404).json({ msg: 'Consulta no encontrada.' });

    await consulta.destroy();
    return res.json({ msg: 'Consulta eliminada.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Error al eliminar consulta.' });
  }
};

module.exports = {
  crearConsulta,
  listarConsultasCliente,
  listarConsultasAdmin,
  responderConsulta,
  eliminarConsulta
};
