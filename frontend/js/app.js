const API = "https://skitcream.onrender.com/api";
// ================= SESIÓN (simulada con localStorage) =================

// Revisamos si hay sesión activa guardada
function sesionActiva() {
  return localStorage.getItem("sesionActiva") === "true";
}

// ================= MENÚ HAMBURGUESA =================

const menuToggle = document.getElementById("menuToggle");
const menu = document.querySelector(".menu");

if (menuToggle && menu) {
  menuToggle.addEventListener("click", function () {
    menu.classList.toggle("activo");
  });
}

// ================= FAVORITOS =================

let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
const favBtns = document.querySelectorAll(".fav-btn");

function actualizarCorazon(btn) {
  const id = btn.dataset.id;
  if (favoritos.includes(id)) {
    btn.textContent = "♥";
    btn.classList.add("activo");
  } else {
    btn.textContent = "♡";
    btn.classList.remove("activo");
  }
}

favBtns.forEach(function (btn) {
  actualizarCorazon(btn);

  btn.addEventListener("click", function () {
    if (!sesionActiva()) {
      alert("Debes iniciar sesión para agregar a favoritos.");
      window.location.href = rutaLogin();
      return;
    }

    const id = btn.dataset.id;

    if (favoritos.includes(id)) {
      favoritos = favoritos.filter(function (favId) {
        return favId !== id;
      });
    } else {
      favoritos.push(id);
    }

    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    actualizarCorazon(btn);
  });
});

// ================= CARRITO =================

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
const cartBtns = document.querySelectorAll(".cart-add-btn");

function actualizarBadge() {
  const totalUnidades = carrito.reduce(function (total, producto) {
    return total + producto.cantidad;
  }, 0);

  const badge = document.querySelector(".badge");
  if (badge) {
    badge.textContent = totalUnidades;
  }
}

cartBtns.forEach(function (btn) {
  btn.addEventListener("click", function () {
    if (!sesionActiva()) {
      alert("Debes iniciar sesión para agregar al carrito.");
      window.location.href = rutaLogin();
      return;
    }

    const id = btn.dataset.id;
    const nombre = btn.dataset.nombre;
    const precio = Number(btn.dataset.precio);

    const productoExistente = carrito.find(function (p) {
      return p.id === id;
    });

    if (productoExistente) {
      productoExistente.cantidad += 1;
    } else {
      carrito.push({
        id: id,
        nombre: nombre,
        precio: precio,
        cantidad: 1,
      });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarBadge();
    alert(nombre + " agregado al carrito ✓");
  });
});

actualizarBadge();

// ================= LOGIN / REGISTRO =================

const authForm = document.querySelector(".auth-form");

if (authForm && window.location.pathname.includes("registro")) {
  authForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const password = document.getElementById("password").value;
    const password2 = document.getElementById("password2").value;

    // Validar nombre - solo letras y espacios
    const nombre = document.getElementById("nombre").value;
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) {
      alert(
        "El nombre solo puede contener letras, sin números ni caracteres especiales.",
      );
      return;
    }

    // Validar email - formato correcto
    const email = document.getElementById("email").value;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("El correo electrónico no es válido. Ejemplo: tucorreo@gmail.com");
      return;
    }

    // Validar contraseña - mínimo 8 caracteres
    if (password.length < 8) {
      alert("La contraseña debe tener mínimo 8 caracteres.");
      return;
    }

    // Validar que las contraseñas coincidan
    if (password !== password2) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    const datos = {
      nombre: document.getElementById("nombre").value,
      email: document.getElementById("email").value,
      password: password,
    };

    fetch(API + "/usuarios/registro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        if (data.id) {
          localStorage.setItem("sesionActiva", "true");
          localStorage.setItem("usuarioId", data.id);
          localStorage.setItem("usuarioNombre", datos.nombre);
          alert("Cuenta creada exitosamente. Bienvenido " + datos.nombre);
          window.location.href = "login.html";
        } else {
          alert(data.mensaje || "Error al registrar");
        }
      })
      .catch(function () {
        alert("Error de conexion con el servidor");
      });
  });
}

if (authForm && window.location.pathname.includes("login")) {
  // Cargar email guardado si existe
  const emailGuardado = localStorage.getItem("emailRecordado");
  if (emailGuardado) {
    document.getElementById("email").value = emailGuardado;
    document.getElementById("recordarEmail").checked = true;
  }
  authForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const datos = {
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
    };

    fetch(API + "/usuarios/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        if (data.usuario) {
          // Guardar o borrar email según checkbox
          const recordar = document.getElementById("recordarEmail").checked;
          if (recordar) {
            localStorage.setItem("emailRecordado", datos.email);
          } else {
            localStorage.removeItem("emailRecordado");
          }
          localStorage.setItem("sesionActiva", "true");
          localStorage.setItem("usuarioId", data.usuario.id);
          localStorage.setItem("usuarioNombre", data.usuario.nombre);
          if (data.usuario.rol === "admin") {
            window.location.href = "admin.html";
          } else {
            window.location.href = "categorias.html";
          }
        } else {
          alert(data.mensaje || "Email o password incorrectos");
        }
      })
      .catch(function () {
        alert("Error de conexion con el servidor");
      });
  });
}

// ================= CONTROL DE SESIÓN EN NAVBAR Y PÁGINAS =================

const iconoPerfil = document.querySelector(".icon-btn:not(.cart-btn)");
const iconoCarrito = document.querySelector(".cart-btn");

if (iconoPerfil) {
  iconoPerfil.style.display = sesionActiva() ? "flex" : "none";
  iconoPerfil.addEventListener("click", function () {
    if (!sesionActiva()) {
      window.location.href = rutaLogin();
    } else {
      window.location.href = window.location.pathname.includes("/pages/")
        ? "perfil.html"
        : "pages/perfil.html";
    }
  });
}

if (iconoCarrito) {
  iconoCarrito.style.display = sesionActiva() ? "flex" : "none";
  iconoCarrito.addEventListener("click", function () {
    if (!sesionActiva()) {
      window.location.href = rutaLogin();
    } else {
      window.location.href = window.location.pathname.includes("/pages/")
        ? "carrito.html"
        : "pages/carrito.html";
    }
  });
}

if (window.location.pathname.includes("categorias") && !sesionActiva()) {
  alert("Debes iniciar sesión para ver los productos.");
  window.location.href = "login.html";
}

// ================= ZONA PRIVADA =================

const paginasPrivadas = ["categorias", "perfil", "carrito", "checkout"];
const paginaActual = window.location.pathname;
const esPaginaPrivada = paginasPrivadas.some(function (p) {
  return paginaActual.includes(p);
});

// Redirigir al login inmediatamente si no hay sesión
if (esPaginaPrivada) {
  if (!sesionActiva()) {
    window.location.replace(rutaLogin());
  }
}

// Advertencia al salir de zona privada hacia zona pública
if (esPaginaPrivada && sesionActiva()) {
  const enlacesMenu = document.querySelectorAll(".menu a");

  // Cerrar sesión al hacer clic en el logo desde zona privada
  const logo = document.querySelector(".logo");
  if (logo) {
    logo.addEventListener("click", function (e) {
      e.preventDefault();
      const confirmar = confirm(
        "Si sales de esta sección deberás iniciar sesión nuevamente para volver. ¿Deseas continuar?",
      );
      if (confirmar) {
        localStorage.removeItem("sesionActiva");
        localStorage.removeItem("usuarioId");
        localStorage.removeItem("usuarioNombre");
        localStorage.removeItem("usuarioRol");
        window.location.href = logo.querySelector("a")
          ? logo.querySelector("a").href
          : "../index.html";
      }
    });
  }

  enlacesMenu.forEach(function (enlace) {
    const esPrivado = paginasPrivadas.some(function (p) {
      return enlace.href.includes(p);
    });

    if (!esPrivado) {
      enlace.addEventListener("click", function (e) {
        e.preventDefault();
        const confirmar = confirm(
          "Si sales de esta sección deberás iniciar sesión nuevamente para volver. ¿Deseas continuar?",
        );
        if (confirmar) {
          localStorage.removeItem("sesionActiva");
          localStorage.removeItem("usuarioId");
          localStorage.removeItem("usuarioNombre");
          window.location.href = enlace.href;
        }
      });
    }
  });
}

// Función auxiliar: calcula la ruta correcta a login.html según en qué página estemos
function rutaLogin() {
  if (window.location.pathname.includes("/pages/")) {
    return "login.html";
  }
  return "pages/login.html";
}
// ================= FILTRO DE CATEGORÍAS =================

const chips = document.querySelectorAll(".chip");
const productoCards = document.querySelectorAll(".producto-card");

chips.forEach(function (chip) {
  chip.addEventListener("click", function () {
    // 1. Quitamos "active" de todos los chips, y se lo ponemos solo al que clickearon
    chips.forEach(function (c) {
      c.classList.remove("active");
    });
    chip.classList.add("active");

    const categoriaSeleccionada = chip.dataset.categoria;

    // 2. Revisamos cada tarjeta de producto
    productoCards.forEach(function (card) {
      const categoriaCard = card.dataset.categoria;

      if (
        categoriaSeleccionada === "todas" ||
        categoriaCard === categoriaSeleccionada
      ) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
});
// ================= CHECKOUT =================

const checkoutForm = document.querySelector(".checkout-page .auth-form");

if (checkoutForm) {
  checkoutForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const usuarioId = localStorage.getItem("usuarioId");
    if (!usuarioId) {
      alert("Debes iniciar sesión para hacer un pedido");
      window.location.href = "login.html";
      return;
    }

    // Validar campos obligatorios
    if (
      !document.getElementById("nombre").value ||
      !document.getElementById("telefono").value ||
      !document.getElementById("direccion").value ||
      !document.getElementById("municipio").value ||
      !document.getElementById("departamento").value ||
      !document.getElementById("fecha").value
    ) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }
    var telefonoVal = document
      .getElementById("telefono")
      .value.replace(/\D/g, "");
    if (telefonoVal.length !== 10) {
      alert("El teléfono debe tener 10 dígitos. Ej: 3001234567");
      return;
    }

    // Validar que la fecha no sea anterior a hoy
    var fechaVal = new Date(document.getElementById("fecha").value);
    var hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    if (fechaVal < hoy) {
      alert("La fecha de entrega no puede ser una fecha pasada.");
      return;
    }

    const datos = {
      usuario_id: usuarioId,
      nombre: document.getElementById("nombre").value,
      telefono: document.getElementById("telefono").value,
      direccion: document.getElementById("direccion").value,
      municipio: document.getElementById("municipio").value,
      departamento: document.getElementById("departamento").value,
      fecha_entrega: document.getElementById("fecha").value,
      notas: document.getElementById("notas").value,
      total: calcularTotal(),
    };

    fetch(API + "/pedidos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        if (data.id) {
          var carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];
          localStorage.removeItem("carrito");

          // Enviar pedido por WhatsApp
          const nombre = document.getElementById("nombre").value;
          const telefono = document.getElementById("telefono").value;
          const direccion = document.getElementById("direccion").value;
          const municipio = document.getElementById("municipio").value;
          const fecha = document.getElementById("fecha").value;
          const notas = document.getElementById("notas").value;
          const total = datos.total;

          var productosTexto = carritoActual
            .map(function (item) {
              return (
                "• " +
                item.nombre +
                " x" +
                item.cantidad +
                " - $" +
                (item.precio * item.cantidad).toLocaleString()
              );
            })
            .join("\n");

          var mensajeTexto =
            "🛍️ *NUEVO PEDIDO SKITCREAM* 🛍️\n\n" +
            "*Pedido #:* " +
            data.id +
            "\n" +
            "*Nombre:* " +
            nombre +
            "\n" +
            "*Teléfono:* " +
            telefono +
            "\n" +
            "*Dirección:* " +
            direccion +
            ", " +
            municipio +
            "\n" +
            "*Fecha de entrega:* " +
            fecha +
            "\n" +
            "*Notas:* " +
            (notas || "Sin notas") +
            "\n\n" +
            "*Productos:*\n" +
            productosTexto +
            "\n\n" +
            "*Total:* $" +
            Number(total).toLocaleString();

          const numero = "3102078667";
          window.open(
            "https://web.whatsapp.com/send?phone=" +
              numero +
              "&text=" +
              encodeURIComponent(mensajeTexto),
            "_blank",
          );

          alert(
            "¡Pedido confirmado! Tu pedido #" + data.id + " está en camino.",
          );
          window.location.href = "categorias.html";
        } else {
          alert(data.mensaje || "Error al crear el pedido");
        }
      })
      .catch(function () {
        alert("Error de conexion con el servidor");
      });
  });
}

function calcularTotal() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  return carrito.reduce(function (total, item) {
    return total + item.precio * item.cantidad;
  }, 0);
}
// ================= PÁGINA DEL CARRITO =================

function renderizarCarrito() {
  const lista = document.querySelector(".carrito-lista");
  const subtotalEl = document.querySelector(".resumen-fila span:last-child");
  const totalEl = document.querySelector(".resumen-total span:last-child");

  if (!lista) return;

  carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  if (carrito.length === 0) {
    lista.innerHTML =
      "<p style='padding:20px;color:#777'>Tu carrito está vacío.</p>";
    if (subtotalEl) subtotalEl.textContent = "$0";
    if (totalEl) totalEl.textContent = "$0";
    return;
  }

  lista.innerHTML = "";

  carrito.forEach(function (item) {
    const fila = document.createElement("div");
    fila.classList.add("carrito-item");
    fila.innerHTML = `
      <div class="carrito-item-img">
        <img src="${item.imagen || ""}" alt="${item.nombre}" />
      </div>
      <div class="carrito-item-info">
        <h3>${item.nombre}</h3>
        <span class="carrito-item-precio">$${item.precio.toLocaleString()}</span>
      </div>
      <div class="carrito-item-cantidad">
        <button class="qty-btn" onclick="cambiarCantidad('${item.id}', -1)">-</button>
        <span>${item.cantidad}</span>
        <button class="qty-btn" onclick="cambiarCantidad('${item.id}', 1)">+</button>
      </div>
      <button class="carrito-item-eliminar" onclick="eliminarDelCarrito('${item.id}')">
        <i class="fa-solid fa-trash"></i>
      </button>
    `;
    lista.appendChild(fila);
  });

  const subtotal = carrito.reduce(function (total, item) {
    return total + item.precio * item.cantidad;
  }, 0);

  if (subtotalEl) subtotalEl.textContent = "$" + subtotal.toLocaleString();
  if (totalEl) totalEl.textContent = "$" + subtotal.toLocaleString();
}

function cambiarCantidad(id, cambio) {
  carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const item = carrito.find(function (p) {
    return p.id === id;
  });
  if (item) {
    item.cantidad += cambio;
    if (item.cantidad <= 0) {
      carrito = carrito.filter(function (p) {
        return p.id !== id;
      });
    }
  }
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarBadge();
  renderizarCarrito();
}

function eliminarDelCarrito(id) {
  carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito = carrito.filter(function (p) {
    return p.id !== id;
  });
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarBadge();
  renderizarCarrito();
}

// Renderizar al cargar la página del carrito
if (window.location.pathname.includes("carrito")) {
  renderizarCarrito();
}

// ================= FORMULARIO DE CONTACTO - WHATSAPP =================

const contactoForm = document.querySelector(".contacto-page .auth-form");

if (contactoForm) {
  contactoForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const asunto = document.getElementById("asunto").value;
    const mensaje = document.getElementById("mensaje").value;

    if (!nombre || !email || !asunto || !mensaje) {
      alert("Por favor completa todos los campos.");
      return;
    }

    var mensajeContacto =
      "Hola SkitCream! 👋\n\n" +
      "*Nombre:* " +
      nombre +
      "\n" +
      "*Correo:* " +
      email +
      "\n" +
      "*Asunto:* " +
      asunto +
      "\n\n" +
      "*Mensaje:*\n" +
      mensaje;

    const numero = "573102078667";
    window.open(
      "https://web.whatsapp.com/send?phone=" +
        numero +
        "&text=" +
        encodeURIComponent(mensajeContacto),
      "_blank",
    );
  });
}
// ================= PERFIL USUARIO =================

if (window.location.pathname.includes("perfil")) {
  const usuarioId = localStorage.getItem("usuarioId");

  if (!usuarioId) {
    window.location.href = "login.html";
  } else {
    // Cargar datos del usuario desde la base de datos
    fetch(API + "/usuarios/" + usuarioId)
      .then(function (res) {
        return res.json();
      })
      .then(function (usuarios) {
        var usuario = usuarios[0];
        if (usuario) {
          document.getElementById("nombre").value = usuario.nombre;
          document.getElementById("email").value = usuario.email;
          document.querySelector(".perfil-nombre").textContent = usuario.nombre;
          document.querySelector(".perfil-email").textContent = usuario.email;
        }
      })
      .catch(function () {
        console.log("Error cargando perfil");
      });

    // Guardar cambios del perfil
    var perfilForm = document.querySelector(".perfil-seccion .auth-form");
    if (perfilForm) {
      perfilForm.addEventListener("submit", function (e) {
        e.preventDefault();

        var datos = {
          nombre: document.getElementById("nombre").value,
          email: document.getElementById("email").value,
        };
        // Cambiar contraseña si llenó los campos
        var passwordActual = document.getElementById("passwordActual").value;
        var passwordNueva = document.getElementById("passwordNueva").value;
        var passwordConfirmar =
          document.getElementById("passwordConfirmar").value;

        if (passwordActual || passwordNueva || passwordConfirmar) {
          if (!passwordActual || !passwordNueva || !passwordConfirmar) {
            alert("Completa todos los campos de contraseña.");
            return;
          }
          if (passwordNueva.length < 8) {
            alert("La nueva contraseña debe tener mínimo 8 caracteres.");
            return;
          }
          if (passwordNueva !== passwordConfirmar) {
            alert("Las contraseñas nuevas no coinciden.");
            return;
          }
          datos.passwordActual = passwordActual;
          datos.passwordNueva = passwordNueva;
        }

        fetch(API + "/usuarios/" + usuarioId, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datos),
        })
          .then(function (res) {
            return res.json();
          })
          .then(function (data) {
            alert("Perfil actualizado correctamente");
            document.querySelector(".perfil-nombre").textContent = datos.nombre;
            document.querySelector(".perfil-email").textContent = datos.email;
            localStorage.setItem("usuarioNombre", datos.nombre);
          })
          .catch(function () {
            alert("Error actualizando perfil");
          });
      });
    }
  }
}
// ================= FAVORITOS EN PERFIL =================

if (window.location.pathname.includes("perfil")) {
  function renderizarFavoritosPerfil() {
    var grid = document.getElementById("favoritosGrid");
    if (!grid) return;

    var favoritosActuales = JSON.parse(localStorage.getItem("favoritos")) || [];

    if (favoritosActuales.length === 0) {
      grid.innerHTML =
        "<p style='color:#777;padding:20px 0'>No tienes favoritos aún. Ve a Categorías para agregar.</p>";
      return;
    }

    // Cargar productos desde la API
    fetch(API + "/productos")
      .then(function (res) {
        return res.json();
      })
      .then(function (productos) {
        grid.innerHTML = "";

        var hayFavoritos = false;

        productos.forEach(function (producto) {
          if (!favoritosActuales.includes(String(producto.id))) return;

          hayFavoritos = true;
          var card = document.createElement("div");
          card.classList.add("producto-card");
          card.id = "fav-card-" + producto.id;
          card.innerHTML = `
            <div class="producto-imagen">
              <img src="${producto.imagen}" alt="${producto.nombre}" />
              <button class="fav-btn activo" data-id="${producto.id}">♥</button>
            </div>
            <div class="producto-info">
              <h3>${producto.nombre}</h3>
              <div class="producto-footer">
                <span class="precio">$${Number(producto.precio).toLocaleString()}</span>
                <button class="cart-add-btn" data-id="${producto.id}" data-nombre="${producto.nombre}" data-precio="${producto.precio}">🛒</button>
              </div>
            </div>
          `;
          grid.appendChild(card);

          // Quitar de favoritos al hacer clic en corazón
          card.querySelector(".fav-btn").addEventListener("click", function () {
            favoritos = favoritos.filter(function (f) {
              return f !== String(producto.id);
            });
            localStorage.setItem("favoritos", JSON.stringify(favoritos));
            document.getElementById("fav-card-" + producto.id).remove();

            var restantes = JSON.parse(localStorage.getItem("favoritos")) || [];
            if (restantes.length === 0) {
              grid.innerHTML =
                "<p style='color:#777;padding:20px 0'>No tienes favoritos aún. Ve a Categorías para agregar.</p>";
            }
          });

          // Agregar al carrito
          card
            .querySelector(".cart-add-btn")
            .addEventListener("click", function () {
              var existente = carrito.find(function (p) {
                return p.id === String(producto.id);
              });
              if (existente) {
                existente.cantidad += 1;
              } else {
                carrito.push({
                  id: String(producto.id),
                  nombre: producto.nombre,
                  precio: Number(producto.precio),
                  cantidad: 1,
                  imagen: producto.imagen,
                });
              }
              localStorage.setItem("carrito", JSON.stringify(carrito));
              actualizarBadge();
              alert(producto.nombre + " agregado al carrito ✓");
            });
        });

        if (!hayFavoritos) {
          grid.innerHTML =
            "<p style='color:#777;padding:20px 0'>No tienes favoritos aún. Ve a Categorías para agregar.</p>";
        }
      });
  }

  renderizarFavoritosPerfil();
}

// ================= CARGAR PRODUCTOS EN CATEGORÍAS DESDE API =================

if (window.location.pathname.includes("categorias")) {
  function cargarProductosCategorias() {
    fetch(API + "/productos")
      .then(function (res) {
        return res.json();
      })
      .then(function (productos) {
        var grid = document.getElementById("productosGrid");
        if (!grid) return;
        grid.innerHTML = "";
        productos.forEach(function (producto) {
          var esFavorito = favoritos.includes(String(producto.id));
          var card = document.createElement("div");
          card.classList.add("producto-card");
          card.setAttribute("data-categoria", producto.categoria);
          card.innerHTML = `
            <div class="producto-imagen">
              <img src="${producto.imagen}" alt="${producto.nombre}" />
              <button class="fav-btn ${esFavorito ? "activo" : ""}" data-id="${producto.id}">
                ${esFavorito ? "♥" : "♡"}
              </button>
            </div>
            <div class="producto-info">
              <h3>${producto.nombre}</h3>
              <div class="producto-footer">
                <span class="precio">$${Number(producto.precio).toLocaleString()}</span>
                <button class="cart-add-btn" data-id="${producto.id}" data-nombre="${producto.nombre}" data-precio="${producto.precio}">🛒</button>
              </div>
            </div>
          `;
          grid.appendChild(card);

          card.querySelector(".fav-btn").addEventListener("click", function () {
            if (!sesionActiva()) {
              alert("Debes iniciar sesión para agregar a favoritos.");
              window.location.href = rutaLogin();
              return;
            }
            var id = String(producto.id);
            var btn = this;
            if (favoritos.includes(id)) {
              favoritos = favoritos.filter(function (f) {
                return f !== id;
              });
              btn.textContent = "♡";
              btn.classList.remove("activo");
            } else {
              favoritos.push(id);
              btn.textContent = "♥";
              btn.classList.add("activo");
            }
            localStorage.setItem("favoritos", JSON.stringify(favoritos));
          });

          card
            .querySelector(".cart-add-btn")
            .addEventListener("click", function () {
              if (!sesionActiva()) {
                alert("Debes iniciar sesión para agregar al carrito.");
                window.location.href = rutaLogin();
                return;
              }
              var existente = carrito.find(function (p) {
                return p.id === String(producto.id);
              });
              if (existente) {
                existente.cantidad += 1;
              } else {
                carrito.push({
                  id: String(producto.id),
                  nombre: producto.nombre,
                  precio: Number(producto.precio),
                  cantidad: 1,
                  imagen: producto.imagen,
                });
              }
              localStorage.setItem("carrito", JSON.stringify(carrito));
              actualizarBadge();
              alert(producto.nombre + " agregado al carrito ✓");
            });
        });

        aplicarFiltroChips();
      });
  }

  function aplicarFiltroChips() {
    var chips = document.querySelectorAll(".chip");
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) {
          c.classList.remove("active");
        });
        this.classList.add("active");
        var filtro = this.getAttribute("data-categoria");
        var tarjetas = document.querySelectorAll(".producto-card");
        tarjetas.forEach(function (card) {
          if (
            filtro === "Todas" ||
            card.getAttribute("data-categoria") === filtro
          ) {
            card.style.display = "block";
          } else {
            card.style.display = "none";
          }
        });
      });
    });
  }

  // Cargar chips desde API y luego productos
  fetch(API + "/categorias")
    .then(function (res) {
      return res.json();
    })
    .then(function (categorias) {
      var chipsContainer = document.getElementById("chipsContainer");
      if (chipsContainer) {
        chipsContainer.innerHTML = "";
        var chipTodas = document.createElement("span");
        chipTodas.classList.add("chip", "active");
        chipTodas.setAttribute("data-categoria", "Todas");
        chipTodas.textContent = "Todas";
        chipsContainer.appendChild(chipTodas);
        categorias.forEach(function (c) {
          var chip = document.createElement("span");
          chip.classList.add("chip");
          chip.setAttribute("data-categoria", c.nombre);
          chip.textContent = c.nombre;
          chipsContainer.appendChild(chip);
        });
      }
      cargarProductosCategorias();
    });
}
// ================= RECUPERAR CONTRASEÑA =================

if (window.location.pathname.includes("recuperar")) {
  emailjs.init("7HfEHkc6rXKVOUS6Y");

  var recuperarForm = document.querySelector(".auth-form");
  if (recuperarForm) {
    recuperarForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = document.getElementById("email").value;

      if (!email) {
        alert("Por favor ingresa tu correo electrónico.");
        return;
      }

      // Verificar si el email existe
      fetch(API + "/usuarios")
        .then(function (res) {
          return res.json();
        })
        .then(function (usuarios) {
          var usuario = usuarios.find(function (u) {
            return u.email === email;
          });

          if (!usuario) {
            alert("❌ No encontramos una cuenta con ese correo.");
            return;
          }

          // Generar contraseña temporal
          var passwordTemporal =
            "Skit" + Math.random().toString(36).slice(2, 8).toUpperCase();

          // Actualizar contraseña en la base de datos
          fetch(API + "/usuarios/" + usuario.id + "/reset", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ passwordTemporal: passwordTemporal }),
          })
            .then(function (res) {
              return res.json();
            })
            .then(function (data) {
              // Enviar correo con EmailJS
              return emailjs.send("service_odmjoxv", "template_rn5m35o", {
                to_email: email,
                nombre: usuario.nombre,
                password_temporal: passwordTemporal,
              });
            })
            .then(function () {
              alert(
                "✅ Correo enviado con éxito a " +
                  email +
                  ". Revisa tu bandeja de entrada.",
              );
              window.location.href = "login.html";
            })
            .catch(function (error) {
              console.log(error);
              alert("Error al enviar el correo. Intenta de nuevo.");
            });
        });
    });
  }
}
// ================= CERRAR SESIÓN =================
var btnCerrarSesion = document.querySelector(".perfil-salir");
if (btnCerrarSesion) {
  btnCerrarSesion.addEventListener("click", function (e) {
    e.preventDefault();
    localStorage.removeItem("sesionActiva");
    localStorage.removeItem("usuarioId");
    localStorage.removeItem("usuarioNombre");
    localStorage.removeItem("usuarioRol");
    localStorage.removeItem("passwordTemporal");
    localStorage.removeItem("carrito");
    localStorage.removeItem("favoritos");
    window.location.replace("../index.html");
  });
}
// ================= CARGAR PRODUCTOS EN PÁGINA PRODUCTOS =================

if (window.location.pathname.includes("productos")) {
  fetch(API + "/productos")
    .then(function (res) {
      return res.json();
    })
    .then(function (productos) {
      var lista = document.getElementById("productosLista");
      if (!lista) return;
      lista.innerHTML = "";

      productos.forEach(function (producto, index) {
        var esFavorito = favoritos.includes(String(producto.id));
        var fila = document.createElement("div");
        fila.classList.add("producto-fila");

        var contenido = `
          <div class="producto-fila-imagen">
            <img src="${producto.imagen}" alt="${producto.nombre}" />
          </div>
          <div class="producto-fila-texto">
            <span class="producto-fila-categoria">${producto.categoria}</span>
            <h2>${producto.nombre}</h2>
            <p style="max-width:420px; overflow-wrap:break-word; word-break:break-word;">${producto.descripcion || ""}</p>
            <div class="producto-fila-footer">
              <span class="precio">$${Number(producto.precio).toLocaleString("es-CO")}</span>
              <button class="fav-btn ${esFavorito ? "activo" : ""}" data-id="${producto.id}">
                ${esFavorito ? "♥" : "♡"}
              </button>
              <button class="cart-add-btn" data-id="${producto.id}" data-nombre="${producto.nombre}" data-precio="${producto.precio}">🛒</button>
            </div>
          </div>
        `;
        fila.innerHTML = contenido;
        lista.appendChild(fila);

        // Botón favorito
        fila.querySelector(".fav-btn").addEventListener("click", function () {
          if (!sesionActiva()) {
            alert("Debes iniciar sesión para agregar a favoritos.");
            window.location.href = rutaLogin();
            return;
          }
          var id = String(producto.id);
          var btn = this;
          if (favoritos.includes(id)) {
            favoritos = favoritos.filter(function (f) {
              return f !== id;
            });
            btn.textContent = "♡";
            btn.classList.remove("activo");
          } else {
            favoritos.push(id);
            btn.textContent = "♥";
            btn.classList.add("activo");
          }
          localStorage.setItem("favoritos", JSON.stringify(favoritos));
        });

        // Botón carrito
        fila
          .querySelector(".cart-add-btn")
          .addEventListener("click", function () {
            if (!sesionActiva()) {
              alert("Debes iniciar sesión para agregar al carrito.");
              window.location.href = rutaLogin();
              return;
            }
            var existente = carrito.find(function (p) {
              return p.id === String(producto.id);
            });
            if (existente) {
              existente.cantidad += 1;
            } else {
              carrito.push({
                id: String(producto.id),
                nombre: producto.nombre,
                precio: Number(producto.precio),
                cantidad: 1,
              });
            }
            localStorage.setItem("carrito", JSON.stringify(carrito));
            actualizarBadge();
            alert(producto.nombre + " agregado al carrito ✓");
          });
      });
    });
}
// ================= PRODUCTOS DESTACADOS (INDEX) =================

var destacadosGrid = document.getElementById("destacadosGrid");
if (destacadosGrid) {
  fetch(API + "/productos/destacados")
    .then(function (res) {
      return res.json();
    })
    .then(function (productos) {
      destacadosGrid.innerHTML = "";
      productos.forEach(function (producto) {
        var esFavorito = favoritos.includes(String(producto.id));
        var card = document.createElement("div");
        card.classList.add("producto-card");
        card.innerHTML = `
          <div class="producto-imagen">
            <img src="${producto.imagen}" alt="${producto.nombre}" />
            <button class="fav-btn ${esFavorito ? "activo" : ""}" data-id="${producto.id}">
              ${esFavorito ? "♥" : "♡"}
            </button>
          </div>
          <div class="producto-info">
            <h3>${producto.nombre}</h3>
            <div class="producto-footer">
              <span class="precio">$${Number(producto.precio).toLocaleString("es-CO")}</span>
              <button class="cart-add-btn" data-id="${producto.id}" data-nombre="${producto.nombre}" data-precio="${producto.precio}">🛒</button>
            </div>
          </div>
        `;
        destacadosGrid.appendChild(card);

        card.querySelector(".fav-btn").addEventListener("click", function () {
          if (!sesionActiva()) {
            alert("Debes iniciar sesión para agregar a favoritos.");
            window.location.href = rutaLogin();
            return;
          }
          var id = String(producto.id);
          var btn = this;
          if (favoritos.includes(id)) {
            favoritos = favoritos.filter(function (f) {
              return f !== id;
            });
            btn.textContent = "♡";
            btn.classList.remove("activo");
          } else {
            favoritos.push(id);
            btn.textContent = "♥";
            btn.classList.add("activo");
          }
          localStorage.setItem("favoritos", JSON.stringify(favoritos));
        });

        card
          .querySelector(".cart-add-btn")
          .addEventListener("click", function () {
            if (!sesionActiva()) {
              alert("Debes iniciar sesión para agregar al carrito.");
              window.location.href = rutaLogin();
              return;
            }
            var existente = carrito.find(function (p) {
              return p.id === String(producto.id);
            });
            if (existente) {
              existente.cantidad += 1;
            } else {
              carrito.push({
                id: String(producto.id),
                nombre: producto.nombre,
                precio: Number(producto.precio),
                cantidad: 1,
                imagen: producto.imagen,
              });
            }
            localStorage.setItem("carrito", JSON.stringify(carrito));
            actualizarBadge();
            alert(producto.nombre + " agregado al carrito ✓");
          });
      });
    })
    .catch(function () {
      destacadosGrid.innerHTML =
        "<p style='color:#777'>No se pudieron cargar los productos destacados.</p>";
    });
}
