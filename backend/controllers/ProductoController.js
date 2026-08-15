const Producto = require("../models/Producto");

class ProductoController {
  // CONSULTAR todos los productos
  static consultarTodos(req, res) {
    Producto.consultarTodos(function (error, productos) {
      if (error) {
        res
          .status(500)
          .json({ mensaje: "Error al consultar productos", error });
        return;
      }
      res.json(productos);
    });
  }

  // CONSULTAR un producto por id
  static consultarPorId(req, res) {
    const id = req.params.id;
    Producto.consultarPorId(id, function (error, producto) {
      if (error) {
        res.status(500).json({ mensaje: "Error al consultar producto", error });
        return;
      }
      res.json(producto);
    });
  }

  // INSERTAR un producto nuevo
  static insertar(req, res) {
    const datos = req.body;
    Producto.insertar(datos, function (error, resultado) {
      if (error) {
        res.status(500).json({ mensaje: "Error al insertar producto", error });
        return;
      }
      res.json({
        mensaje: "Producto insertado correctamente",
        id: resultado.insertId,
      });
    });
  }

  // ACTUALIZAR un producto
  static actualizar(req, res) {
    const id = req.params.id;
    const datos = req.body;
    Producto.actualizar(id, datos, function (error, resultado) {
      if (error) {
        res
          .status(500)
          .json({ mensaje: "Error al actualizar producto", error });
        return;
      }
      res.json({ mensaje: "Producto actualizado correctamente" });
    });
  }

  // ELIMINAR un producto
  static eliminar(req, res) {
    const id = req.params.id;
    Producto.eliminar(id, function (error, resultado) {
      if (error) {
        res.status(500).json({ mensaje: "Error al eliminar producto", error });
        return;
      }
      res.json({ mensaje: "Producto eliminado correctamente" });
    });
  }
  // CONSULTAR productos destacados
  static consultarDestacados(req, res) {
    Producto.consultarDestacados(function (error, productos) {
      if (error) {
        res
          .status(500)
          .json({ mensaje: "Error al consultar destacados", error });
        return;
      }
      res.json(productos);
    });
  }
}

module.exports = ProductoController;
