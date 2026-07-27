const Pedido = require("../models/Pedido");

class PedidoController {
  // CONSULTAR todos los pedidos
  static consultarTodos(req, res) {
    Pedido.consultarTodos(function (error, pedidos) {
      if (error) {
        res.status(500).json({ mensaje: "Error al consultar pedidos", error });
        return;
      }
      res.json(pedidos);
    });
  }

  // CONSULTAR un pedido por id
  static consultarPorId(req, res) {
    const id = req.params.id;
    Pedido.consultarPorId(id, function (error, pedido) {
      if (error) {
        res.status(500).json({ mensaje: "Error al consultar pedido", error });
        return;
      }
      res.json(pedido);
    });
  }

  // CONSULTAR pedidos por usuario
  static consultarPorUsuario(req, res) {
    const usuarioId = req.params.usuarioId;
    Pedido.consultarPorUsuario(usuarioId, function (error, pedidos) {
      if (error) {
        res
          .status(500)
          .json({ mensaje: "Error al consultar pedidos del usuario", error });
        return;
      }
      res.json(pedidos);
    });
  }

  // INSERTAR un pedido nuevo
  static insertar(req, res) {
    const datos = req.body;
    if (
      !datos.usuario_id ||
      !datos.nombre ||
      !datos.telefono ||
      !datos.direccion ||
      !datos.total
    ) {
      res.status(400).json({ mensaje: "Faltan datos obligatorios del pedido" });
      return;
    }
    Pedido.insertar(datos, function (error, resultado) {
      if (error) {
        res.status(500).json({ mensaje: "Error al crear pedido", error });
        return;
      }
      res.json({
        mensaje: "Pedido creado correctamente",
        id: resultado.insertId,
      });
    });
  }

  // ACTUALIZAR estado de un pedido
  static actualizarEstado(req, res) {
    const id = req.params.id;
    const { estado } = req.body;
    if (!estado) {
      res.status(400).json({ mensaje: "El estado es obligatorio" });
      return;
    }
    Pedido.actualizarEstado(id, estado, function (error, resultado) {
      if (error) {
        res
          .status(500)
          .json({ mensaje: "Error al actualizar estado del pedido", error });
        return;
      }
      res.json({ mensaje: "Estado actualizado correctamente" });
    });
  }

  // ELIMINAR un pedido
  static eliminar(req, res) {
    const id = req.params.id;
    Pedido.eliminar(id, function (error, resultado) {
      if (error) {
        res.status(500).json({ mensaje: "Error al eliminar pedido", error });
        return;
      }
      res.json({ mensaje: "Pedido eliminado correctamente" });
    });
  }
}

module.exports = PedidoController;
