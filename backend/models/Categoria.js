const conexion = require("../config/db");

class Categoria {
  // CONSULTAR todas las categorias
  static consultarTodas(callback) {
    const consulta = "SELECT * FROM categorias";
    conexion.query(consulta, callback);
  }

  // CONSULTAR una categoria por id
  static consultarPorId(id, callback) {
    const consulta = "SELECT * FROM categorias WHERE id = ?";
    conexion.query(consulta, [id], callback);
  }

  // INSERTAR una categoria nueva
  static insertar(datos, callback) {
    const consulta =
      "INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)";
    const valores = [datos.nombre, datos.descripcion];
    conexion.query(consulta, valores, callback);
  }

  // ACTUALIZAR una categoria
  static actualizar(id, datos, callback) {
    const consulta =
      "UPDATE categorias SET nombre = ?, descripcion = ? WHERE id = ?";
    const valores = [datos.nombre, datos.descripcion, id];
    conexion.query(consulta, valores, callback);
  }

  // ELIMINAR una categoria
  static eliminar(id, callback) {
    const consulta = "DELETE FROM categorias WHERE id = ?";
    conexion.query(consulta, [id], callback);
  }
}

module.exports = Categoria;
