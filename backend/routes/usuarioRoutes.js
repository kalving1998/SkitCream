const express = require("express");
const router = express.Router();
const UsuarioController = require("../controllers/UsuarioController");

router.get("/", UsuarioController.consultarTodos);
router.get("/:id", UsuarioController.consultarPorId);
router.post("/registro", UsuarioController.insertar);
router.post("/login", UsuarioController.login);
router.put("/:id", UsuarioController.actualizar);
router.delete("/:id", UsuarioController.eliminar);

module.exports = router;
