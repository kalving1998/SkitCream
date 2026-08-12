const Categoria = require("../models/Categoria");

class CategoriaController {
  // CONSULTAR todas las categorias
  static consultarTodas(req, res) {
    Categoria.consultarTodas(function (error, categorias) {
      if (error) {
        res
          .status(500)
          .json({ mensaje: "Error al consultar categorias", error });
        return;
      }
      res.json(categorias);
    });
  }

  // CONSULTAR una categoria por id
  static consultarPorId(req, res) {
    const id = req.params.id;
    Categoria.consultarPorId(id, function (error, categoria) {
      if (error) {
        res
          .status(500)
          .json({ mensaje: "Error al consultar categoria", error });
        return;
      }
      res.json(categoria);
    });
  }

  // INSERTAR una categoria nueva
  static insertar(req, res) {
    const datos = req.body;
    if (!datos.nombre) {
      res.status(400).json({ mensaje: "El nombre es obligatorio" });
      return;
    }
    Categoria.insertar(datos, function (error, resultado) {
      if (error) {
        res.status(500).json({ mensaje: "Error al crear categoria", error });
        return;
      }
      res.json({
        mensaje: "Categoria creada correctamente",
        id: resultado.insertId,
      });
    });
  }

  // ACTUALIZAR una categoria
  static actualizar(req, res) {
    const id = req.params.id;
    const datos = req.body;
    Categoria.actualizar(id, datos, function (error, resultado) {
      if (error) {
        res
          .status(500)
          .json({ mensaje: "Error al actualizar categoria", error });
        return;
      }
      res.json({ mensaje: "Categoria actualizada correctamente" });
    });
  }

  // ELIMINAR una categoria
  static eliminar(req, res) {
    const id = req.params.id;
    Categoria.eliminar(id, function (error, resultado) {
      if (error) {
        res.status(500).json({ mensaje: "Error al eliminar categoria", error });
        return;
      }
      res.json({ mensaje: "Categoria eliminada correctamente" });
    });
  }
}

module.exports = CategoriaController;
