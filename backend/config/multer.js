const multer = require("multer");
const path = require("path");

// Configurar dónde se guardan las imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../frontend/assets/images/products/"));
  },
  filename: function (req, file, cb) {
    // Nombre original del archivo
    cb(null, file.originalname);
  },
});

// Solo permitir imágenes
const fileFilter = function (req, file, cb) {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten imágenes"), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;
