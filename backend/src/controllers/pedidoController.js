// backend/src/controllers/pedidoController.js
const PDFDocument = require('pdfkit');
const { Pedido, DetallePedido, Producto, Usuario } = require('../models');

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


const generarPdfPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.findAll({
      include: [
        { model: Usuario, attributes: ['nombre', 'email'] },
        { 
          model: DetallePedido,
          include: [{ model: Producto, attributes: ['nombre', 'precio'] }]
        }
      ]
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="pedidos.pdf"');

    const doc = new PDFDocument({ margin: 30 });
    doc.pipe(res);

    doc.fontSize(18).text('📄 Listado de Pedidos', { align: 'center' });
    doc.moveDown();

    // Detalle de cada pedido
    pedidos.forEach(p => {
      doc.fontSize(12)
         .text(`Pedido #${p.id} — Cliente: ${p.Usuario.nombre} (${p.Usuario.email})`);

      if (p.fecha) {
        doc.text(`Fecha: ${new Date(p.fecha).toLocaleString()} | Estado: ${p.estado}`);
      } else if (p.createdAt) {
        doc.text(`Fecha: ${p.createdAt.toLocaleString()} | Estado: ${p.estado}`);
      }
      doc.moveDown(0.3);

      p.DetallePedidos.forEach(d => {
        doc.text(`   • ${d.cantidad} × ${d.Producto.nombre} @ $${d.Producto.precio}`);
      });

      doc.moveDown();
    });

    doc.end();
  } catch (err) {
    console.error('Error generando PDF:', err);
    res.status(500).json({ msg: 'Error generando PDF' });
  }
};

module.exports = {
  crearPedido,
  listarPedidosCliente,
  listarPedidosAdmin,
  actualizarEstadoPedido,
  generarPdfPedidos
};
