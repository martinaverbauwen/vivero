// backend/src/routes/pedidoRoutes.js
const express = require('express');
const router = express.Router();
const {
  crearPedido,
  listarPedidosCliente,
  listarPedidosAdmin,
  actualizarEstadoPedido,
  generarPdfPedidos
} = require('../controllers/pedidoController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.post('/', authMiddleware, roleMiddleware(['cliente']), crearPedido);

router.get('/', authMiddleware, roleMiddleware(['cliente']), listarPedidosCliente);

router.get('/admin', authMiddleware, roleMiddleware(['admin']), listarPedidosAdmin);
router.put('/estado/:id', authMiddleware, roleMiddleware(['admin']), actualizarEstadoPedido);

router.get(
  '/pdf',
  authMiddleware,
  roleMiddleware(['admin']),
  generarPdfPedidos
);

module.exports = router;
