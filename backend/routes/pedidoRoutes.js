const express = require("express");
const router = express.Router();
const PedidoController = require("../controllers/PedidoController");

// CONSULTAR todos los pedidos
router.get("/", PedidoController.consultarTodos);

// CONSULTAR un pedido por id
router.get("/:id", PedidoController.consultarPorId);

// CONSULTAR pedidos por usuario
router.get("/usuario/:usuarioId", PedidoController.consultarPorUsuario);

// INSERTAR un pedido nuevo
router.post("/", PedidoController.insertar);

// ACTUALIZAR estado de un pedido
router.put("/:id", PedidoController.actualizarEstado);

// ELIMINAR un pedido
router.delete("/:id", PedidoController.eliminar);

module.exports = router;
