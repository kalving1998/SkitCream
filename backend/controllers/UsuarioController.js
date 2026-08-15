const Usuario = require("../models/Usuario");

const bcrypt = require("bcryptjs");

class UsuarioController {
  // CONSULTAR todos los usuarios
  static consultarTodos(req, res) {
    Usuario.consultarTodos(function (error, usuarios) {
      if (error) {
        res.status(500).json({ mensaje: "Error al consultar usuarios", error });
        return;
      }
      res.json(usuarios);
    });
  }

  // CONSULTAR un usuario por id
  static consultarPorId(req, res) {
    const id = req.params.id;
    Usuario.consultarPorId(id, function (error, usuario) {
      if (error) {
        res.status(500).json({ mensaje: "Error al consultar usuario", error });
        return;
      }
      res.json(usuario);
    });
  }

  // REGISTRAR un usuario nuevo
  static insertar(req, res) {
    const datos = req.body;
    if (!datos.nombre || !datos.email || !datos.password) {
      res
        .status(400)
        .json({ mensaje: "Nombre, email y password son obligatorios" });
      return;
    }
    // Encriptar la contraseña
    const passwordEncriptada = bcrypt.hashSync(datos.password, 10);
    datos.password = passwordEncriptada;

    Usuario.insertar(datos, function (error, resultado) {
      if (error) {
        if (error.code === "ER_DUP_ENTRY") {
          res.status(400).json({ mensaje: "El email ya está registrado" });
          return;
        }
        res.status(500).json({ mensaje: "Error al registrar usuario", error });
        return;
      }
      res.json({
        mensaje: "Usuario registrado correctamente",
        id: resultado.insertId,
      });
    });
  }

  // INICIAR SESION
  static login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ mensaje: "Email y password son obligatorios" });
      return;
    }
    Usuario.consultarPorEmail(email, function (error, usuarios) {
      if (error) {
        res.status(500).json({ mensaje: "Error al iniciar sesion", error });
        return;
      }
      if (usuarios.length === 0) {
        res.status(401).json({ mensaje: "Email o password incorrectos" });
        return;
      }
      // Verificar contraseña encriptada
      const passwordCorrecta = bcrypt.compareSync(
        password,
        usuarios[0].password,
      );
      if (!passwordCorrecta) {
        res.status(401).json({ mensaje: "Email o password incorrectos" });
        return;
      }
      const usuario = usuarios[0];
      res.json({
        mensaje: "Login exitoso",
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol,
        },
      });
    });
  }
  // actualizar  contraseña//
  static actualizar(req, res) {
    const id = req.params.id;
    const datos = req.body;

    // Si viene cambio de contraseña
    if (datos.passwordNueva) {
      Usuario.consultarPorId(id, function (error, usuarios) {
        if (error || !usuarios[0]) {
          res.status(500).json({ mensaje: "Error al buscar usuario" });
          return;
        }
        var usuario = usuarios[0];
        var passwordCorrecta = bcrypt.compareSync(
          datos.passwordActual,
          usuarios[0].password,
        );

        if (!passwordCorrecta) {
          res
            .status(401)
            .json({ mensaje: "La contraseña actual es incorrecta" });
          return;
        }
        var passwordEncriptada = bcrypt.hashSync(datos.passwordNueva, 10);
        datos.password = passwordEncriptada;
        Usuario.actualizarConPassword(id, datos, function (error, resultado) {
          if (error) {
            res
              .status(500)
              .json({ mensaje: "Error al actualizar usuario", error });
            return;
          }
          res.json({
            mensaje: "Perfil y contraseña actualizados correctamente",
          });
        });
      });
    } else {
      Usuario.actualizar(id, datos, function (error, resultado) {
        if (error) {
          res
            .status(500)
            .json({ mensaje: "Error al actualizar usuario", error });
          return;
        }
        res.json({ mensaje: "Usuario actualizado correctamente" });
      });
    }
  }

  // ELIMINAR un usuario
  static eliminar(req, res) {
    const id = req.params.id;
    Usuario.eliminar(id, function (error, resultado) {
      if (error) {
        res.status(500).json({ mensaje: "Error al eliminar usuario", error });
        return;
      }
      res.json({ mensaje: "Usuario eliminado correctamente" });
    });
  }

  //recuperar contraseña
  static resetPassword(req, res) {
    const id = req.params.id;
    const { passwordTemporal } = req.body;
    console.log("Reset password - ID:", id, "Password:", passwordTemporal);
    const passwordEncriptada = bcrypt.hashSync(passwordTemporal, 10);
    console.log("Password encriptada:", passwordEncriptada);

    const consulta = "UPDATE usuarios SET password = ? WHERE id = ?";
    const conexion = require("../config/db");
    conexion.query(
      consulta,
      [passwordEncriptada, id],
      function (error, resultado) {
        if (error) {
          res
            .status(500)
            .json({ mensaje: "Error al resetear contraseña", error });
          return;
        }
        console.log("Filas afectadas:", resultado.affectedRows);
        res.json({ mensaje: "Contraseña temporal generada correctamente" });
      },
    );
  }
}
module.exports = UsuarioController;
