const conexion = require("../config/db");

class Producto {
  // CONSULTAR todos los productos
  static consultarTodos(callback) {
    const consulta = "SELECT * FROM productos";
    conexion.query(consulta, callback);
  }

  // CONSULTAR un producto por id
  static consultarPorId(id, callback) {
    const consulta = "SELECT * FROM productos WHERE id = ?";
    conexion.query(consulta, [id], callback);
  }

  // INSERTAR un producto nuevo
  static insertar(datos, callback) {
    const consulta =
      "INSERT INTO productos (nombre, descripcion, precio, categoria, imagen) VALUES (?, ?, ?, ?, ?)";
    const valores = [
      datos.nombre,
      datos.descripcion,
      datos.precio,
      datos.categoria,
      datos.imagen,
    ];
    conexion.query(consulta, valores, callback);
  }

  // ACTUALIZAR un producto
  static actualizar(id, datos, callback) {
    const consulta =
      "UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, categoria = ?, imagen = ? WHERE id = ?";
    const valores = [
      datos.nombre,
      datos.descripcion,
      datos.precio,
      datos.categoria,
      datos.imagen,
      id,
    ];
    conexion.query(consulta, valores, callback);
  }

  // ELIMINAR un producto
  static eliminar(id, callback) {
    const consulta = "DELETE FROM productos WHERE id = ?";
    conexion.query(consulta, [id], callback);
  }
}

module.exports = Producto;
