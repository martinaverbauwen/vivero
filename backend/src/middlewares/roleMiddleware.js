// backend/src/middlewares/roleMiddleware.js
const roleMiddleware = (rolesPermitidos = []) => {
  return (req, res, next) => {
    const { usuario } = req;
    if (!rolesPermitidos.includes(usuario.rol)) {
      return res.status(403).json({ msg: 'Acceso denegado: rol insuficiente.' });
    }
    next();
  };
};

module.exports = roleMiddleware;
