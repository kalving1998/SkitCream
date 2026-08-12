const express = require("express");
const cors = require("cors");
require("dotenv").config();

const productoRoutes = require("./routes/productoRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");
const pedidoRoutes = require("./routes/pedidoRoutes");
const categoriaRoutes = require("./routes/categoriaRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/productos", productoRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/pedidos", pedidoRoutes);
app.use("/api/categorias", categoriaRoutes);

app.get("/", function (req, res) {
  res.send("Servidor SkitCream funcionando");
});

const PUERTO = process.env.PORT || 3000;
app.listen(PUERTO, function () {
  console.log("Servidor corriendo en http://localhost:" + PUERTO);
});
