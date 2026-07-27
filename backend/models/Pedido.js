const conexion = require("../config/db");

class Pedido {
  // CONSULTAR todos los pedidos
  static consultarTodos(callback) {
    const consulta = `
            SELECT p.*, u.nombre as nombre_usuario, u.email 
            FROM pedidos p
            JOIN usuarios u ON p.usuario_id = u.id
            ORDER BY p.created_at DESC
        `;
    conexion.query(consulta, callback);
  }

  // CONSULTAR un pedido por id
  static consultarPorId(id, callback) {
    const consulta = `
            SELECT p.*, u.nombre as nombre_usuario, u.email 
            FROM pedidos p
            JOIN usuarios u ON p.usuario_id = u.id
            WHERE p.id = ?
        `;
    conexion.query(consulta, [id], callback);
  }

  // CONSULTAR pedidos por usuario
  static consultarPorUsuario(usuarioId, callback) {
    const consulta =
      "SELECT * FROM pedidos WHERE usuario_id = ? ORDER BY created_at DESC";
    conexion.query(consulta, [usuarioId], callback);
  }

  // INSERTAR un pedido nuevo
  static insertar(datos, callback) {
    const consulta = `
            INSERT INTO pedidos 
            (usuario_id, nombre, telefono, direccion, municipio, departamento, fecha_entrega, notas, total) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
    const valores = [
      datos.usuario_id,
      datos.nombre,
      datos.telefono,
      datos.direccion,
      datos.municipio,
      datos.departamento,
      datos.fecha_entrega,
      datos.notas,
      datos.total,
    ];
    conexion.query(consulta, valores, callback);
  }

  // ACTUALIZAR estado de un pedido
  static actualizarEstado(id, estado, callback) {
    const consulta = "UPDATE pedidos SET estado = ? WHERE id = ?";
    conexion.query(consulta, [estado, id], callback);
  }

  // ELIMINAR un pedido
  static eliminar(id, callback) {
    const consulta = "DELETE FROM pedidos WHERE id = ?";
    conexion.query(consulta, [id], callback);
  }
}

module.exports = Pedido;
