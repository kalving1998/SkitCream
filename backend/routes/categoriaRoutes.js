const express = require("express");
const router = express.Router();
const CategoriaController = require("../controllers/CategoriaController");

// CONSULTAR todas las categorias
router.get("/", CategoriaController.consultarTodas);

// CONSULTAR una categoria por id
router.get("/:id", CategoriaController.consultarPorId);

// INSERTAR una categoria nueva
router.post("/", CategoriaController.insertar);

// ACTUALIZAR una categoria
router.put("/:id", CategoriaController.actualizar);

// ELIMINAR una categoria
router.delete("/:id", CategoriaController.eliminar);

module.exports = router;
