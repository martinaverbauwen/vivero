// backend/src/routes/productoRoutes.js
const express = require('express');
const router = express.Router();
const {
  listaProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} = require('../controllers/productoController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get('/', listaProductos);
router.get('/:id', obtenerProducto);

router.post('/', authMiddleware, roleMiddleware(['admin']), crearProducto);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), actualizarProducto);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), eliminarProducto);

module.exports = router;
