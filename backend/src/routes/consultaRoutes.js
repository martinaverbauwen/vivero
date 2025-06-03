// backend/src/routes/consultaRoutes.js
const express = require('express');
const router = express.Router();
const {
  crearConsulta,
  listarConsultasCliente,
  listarConsultasAdmin,
  responderConsulta,
  eliminarConsulta
} = require('../controllers/consultaController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.post('/', authMiddleware, crearConsulta);
router.get('/', authMiddleware, roleMiddleware(['cliente']), listarConsultasCliente);

router.get('/admin', authMiddleware, roleMiddleware(['admin']), listarConsultasAdmin);
router.put('/responder/:id', authMiddleware, roleMiddleware(['admin']), responderConsulta);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), eliminarConsulta);

module.exports = router;
