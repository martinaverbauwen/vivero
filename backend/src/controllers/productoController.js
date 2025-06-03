// backend/src/controllers/productoController.js
const { Producto } = require('../models');

const listaProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll();
    return res.json(productos);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Error al listar productos.' });
  }
};

const obtenerProducto = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return res.status(404).json({ msg: 'Producto no encontrado.' });
    return res.json(producto);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Error al obtener producto.' });
  }
};

const crearProducto = async (req, res) => {
  const { nombre, descripcion, precio, stock, imagen } = req.body;
  try {
    const nuevo = await Producto.create({ nombre, descripcion, precio, stock, imagen });
    return res.status(201).json(nuevo);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Error al crear producto.' });
  }
};

const actualizarProducto = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, stock, imagen } = req.body;
  try {
    const producto = await Producto.findByPk(id);
    if (!producto) return res.status(404).json({ msg: 'Producto no encontrado.' });

    producto.nombre = nombre;
    producto.descripcion = descripcion;
    producto.precio = precio;
    producto.stock = stock;
    producto.imagen = imagen;
    await producto.save();

    return res.json({ msg: 'Producto actualizado.', producto });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Error al actualizar producto.' });
  }
};

const eliminarProducto = async (req, res) => {
  const { id } = req.params;
  try {
    const producto = await Producto.findByPk(id);
    if (!producto) return res.status(404).json({ msg: 'Producto no encontrado.' });

    await producto.destroy();
    return res.json({ msg: 'Producto eliminado.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Error al eliminar producto.' });
  }
};

module.exports = {
  listaProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto
};
