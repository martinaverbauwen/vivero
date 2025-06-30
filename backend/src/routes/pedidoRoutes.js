// backend/src/routes/pedidoRoutes.js
const express = require('express');
const router = express.Router();
const {
  crearPedido,
  listarPedidosCliente,
  listarPedidosAdmin,
  actualizarEstadoPedido,
  generarPdfPedidos    // <-- importamos la nueva función
} = require('../controllers/pedidoController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.post('/', authMiddleware, roleMiddleware(['cliente']), crearPedido);

router.get('/', authMiddleware, roleMiddleware(['cliente']), listarPedidosCliente);

// Rutas de administración
router.get('/admin', authMiddleware, roleMiddleware(['admin']), listarPedidosAdmin);
router.put('/estado/:id', authMiddleware, roleMiddleware(['admin']), actualizarEstadoPedido);

// Nueva ruta para descargar el PDF con todos los pedidos
router.get(
  '/pdf',
  authMiddleware,
  roleMiddleware(['admin']),
  generarPdfPedidos
);

module.exports = router;
