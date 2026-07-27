const express = require("express");
const router = express.Router();
const ProductoController = require("../controllers/ProductoController");

// CONSULTAR todos los productos
router.get("/", ProductoController.consultarTodos);

// CONSULTAR un producto por id
router.get("/:id", ProductoController.consultarPorId);

// INSERTAR un producto nuevo
router.post("/", ProductoController.insertar);

// ACTUALIZAR un producto
router.put("/:id", ProductoController.actualizar);

// ELIMINAR un producto
router.delete("/:id", ProductoController.eliminar);

module.exports = router;
