// backend/src/controllers/pedidoController.js
const { Pedido, DetallePedido, Producto } = require('../models');

const crearPedido = async (req, res) => {
  /* Se espera en el body:
     {
       detalles: [ { productoId: 1, cantidad: 2 }, ... ],
       medioPago: "efectivo"
     }
  */
  const { detalles, medioPago } = req.body;
  const t = await Pedido.sequelize.transaction();

  try {
    let total = 0;
    for (let item of detalles) {
      const producto = await Producto.findByPk(item.productoId);
      if (!producto) throw new Error(`Producto ID:${item.productoId} no existe.`);
      if (producto.stock < item.cantidad) {
        throw new Error(`Stock insuficiente de ${producto.nombre}.`);
      }
      total += parseFloat(producto.precio) * item.cantidad;
    }

    const pedido = await Pedido.create(
      {
        usuarioId: req.usuario.id,
        total,
        medioPago
      },
      { transaction: t }
    );

    for (let item of detalles) {
      const producto = await Producto.findByPk(item.productoId);
      await DetallePedido.create(
        {
          pedidoId: pedido.id,
          productoId: item.productoId,
          cantidad: item.cantidad,
          precio_unitario: producto.precio
        },
        { transaction: t }
      );
      producto.stock -= item.cantidad;
      await producto.save({ transaction: t });
    }

    await t.commit();
    return res.status(201).json({ msg: 'Pedido creado.', pedidoId: pedido.id });
  } catch (err) {
    await t.rollback();
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

const listarPedidosCliente = async (req, res) => {
  try {
    const pedidos = await Pedido.findAll({
      where: { usuarioId: req.usuario.id },
      include: [{ model: DetallePedido, include: [Producto] }]
    });
    return res.json(pedidos);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Error al listar pedidos.' });
  }
};

const listarPedidosAdmin = async (req, res) => {
  try {
    const pedidos = await Pedido.findAll({
      include: [{ model: DetallePedido, include: [Producto] }]
    });
    return res.json(pedidos);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Error al listar pedidos.' });
  }
};

const actualizarEstadoPedido = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  try {
    const pedido = await Pedido.findByPk(id);
    if (!pedido) return res.status(404).json({ msg: 'Pedido no encontrado.' });

    pedido.estado = estado;
    await pedido.save();
    return res.json({ msg: 'Estado actualizado.', pedido });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Error al actualizar estado.' });
  }
};

module.exports = {
  crearPedido,
  listarPedidosCliente,
  listarPedidosAdmin,
  actualizarEstadoPedido
};
