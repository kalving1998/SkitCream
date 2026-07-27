const conexion = require("../config/db");

class Usuario {
  // CONSULTAR todos los usuarios
  static consultarTodos(callback) {
    const consulta = "SELECT id, nombre, email, created_at FROM usuarios";
    conexion.query(consulta, callback);
  }

  // CONSULTAR un usuario por id
  static consultarPorId(id, callback) {
    const consulta =
      "SELECT id, nombre, email, created_at FROM usuarios WHERE id = ?";
    conexion.query(consulta, [id], callback);
  }

  // CONSULTAR un usuario por email
  static consultarPorEmail(email, callback) {
    const consulta = "SELECT * FROM usuarios WHERE email = ?";
    conexion.query(consulta, [email], callback);
  }

  // INSERTAR un usuario nuevo
  static insertar(datos, callback) {
    const consulta =
      "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)";
    const valores = [datos.nombre, datos.email, datos.password];
    conexion.query(consulta, valores, callback);
  }

  // ACTUALIZAR un usuario
  static actualizar(id, datos, callback) {
    const consulta = "UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?";
    const valores = [datos.nombre, datos.email, id];
    conexion.query(consulta, valores, callback);
  }

  // ELIMINAR un usuario
  static eliminar(id, callback) {
    const consulta = "DELETE FROM usuarios WHERE id = ?";
    conexion.query(consulta, [id], callback);
  }
}

module.exports = Usuario;
