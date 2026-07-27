const mysql = require("mysql2");

const conexion = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Portilla98",
  database: "skitcream_db",
});

conexion.connect(function (error) {
  if (error) {
    console.error("Error conectando a la base de datos:", error);
    return;
  }
  console.log("Conexion exitosa a MySQL");
});

module.exports = conexion;
