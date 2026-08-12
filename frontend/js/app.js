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

    fetch("http://localhost:3000/api/usuarios/registro", {
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

    fetch("http://localhost:3000/api/usuarios/login", {
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

    fetch("http://localhost:3000/api/pedidos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        if (data.id) {
          localStorage.removeItem("carrito");

          // Enviar pedido por WhatsApp
          const nombre = document.getElementById("nombre").value;
          const telefono = document.getElementById("telefono").value;
          const direccion = document.getElementById("direccion").value;
          const municipio = document.getElementById("municipio").value;
          const fecha = document.getElementById("fecha").value;
          const notas = document.getElementById("notas").value;
          const total = datos.total;

          const texto =
            `🛍️ *NUEVO PEDIDO SKITCREAM* 🛍️%0A%0A` +
            `*Pedido #:* ${data.id}%0A` +
            `*Nombre:* ${nombre}%0A` +
            `*Teléfono:* ${telefono}%0A` +
            `*Dirección:* ${direccion}, ${municipio}%0A` +
            `*Fecha de entrega:* ${fecha}%0A` +
            `*Notas:* ${notas || "Sin notas"}%0A` +
            `*Total:* $${Number(total).toLocaleString()}`;

          const numero = "+573103613070";
          window.open(`https://wa.me/${numero}?text=${texto}`, "_blank");

          alert(
            "¡Pedido confirmado! Tu pedido #" + data.id + " está en camino.",
          );
          window.location.href = "productos.html";
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
        <img src="../assets/images/products/${item.id.toLowerCase()}.jpg" alt="${item.nombre}" />
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

    const texto = `Hola SkitCream! 👋%0A%0A*Nombre:* ${nombre}%0A*Correo:* ${email}%0A*Asunto:* ${asunto}%0A%0A*Mensaje:*%0A${mensaje}`;
    const numero = "+573103613070"; // Cambia este número por el WhatsApp del negocio
    window.open(`https://wa.me/${numero}?text=${texto}`, "_blank");
  });
}
// ================= PERFIL USUARIO =================

if (window.location.pathname.includes("perfil")) {
  const usuarioId = localStorage.getItem("usuarioId");

  if (!usuarioId) {
    window.location.href = "login.html";
  } else {
    // Cargar datos del usuario desde la base de datos
    fetch("http://localhost:3000/api/usuarios/" + usuarioId)
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

        fetch("http://localhost:3000/api/usuarios/" + usuarioId, {
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
  var todosLosProductos = [
    {
      id: "Red-velvet",
      nombre: "Torta Red Velvet",
      precio: 65000,
      imagen: "red-velvet.jpg",
    },
    {
      id: "Fresas-con-crema",
      nombre: "Fresas con Crema",
      precio: 15500,
      imagen: "fresas.jpg",
    },
    {
      id: "Cappuccino",
      nombre: "Cappuccino",
      precio: 8500,
      imagen: "cappuccino.jpg",
    },
    {
      id: "Torta-Dos-Amores",
      nombre: "Torta Dos Amores",
      precio: 68000,
      imagen: "dos-amores.jpg",
    },
  ];

  function renderizarFavoritosPerfil() {
    var grid = document.getElementById("favoritosGrid");
    if (!grid) return;

    var favoritosActuales = JSON.parse(localStorage.getItem("favoritos")) || [];

    if (favoritosActuales.length === 0) {
      grid.innerHTML =
        "<p style='color:#777;padding:20px 0'>No tienes favoritos aún. Ve a Categorías para agregar.</p>";
      return;
    }

    grid.innerHTML = "";

    todosLosProductos.forEach(function (producto) {
      if (!favoritosActuales.includes(producto.id)) return;

      var card = document.createElement("div");
      card.classList.add("producto-card");
      card.id = "fav-card-" + producto.id;
      card.innerHTML = `
        <div class="producto-imagen">
          <img src="../assets/images/products/${producto.imagen}" alt="${producto.nombre}" />
          <button class="fav-btn activo" data-id="${producto.id}">♥</button>
        </div>
        <div class="producto-info">
          <h3>${producto.nombre}</h3>
          <div class="producto-footer">
            <span class="precio">$${producto.precio.toLocaleString()}</span>
            <button class="cart-add-btn" data-id="${producto.id}" data-nombre="${producto.nombre}" data-precio="${producto.precio}">🛒</button>
          </div>
        </div>
      `;
      grid.appendChild(card);

      // Botón de favorito — al hacer clic quita de favoritos y desaparece
      card.querySelector(".fav-btn").addEventListener("click", function () {
        favoritos = favoritos.filter(function (favId) {
          return favId !== producto.id;
        });
        localStorage.setItem("favoritos", JSON.stringify(favoritos));
        document.getElementById("fav-card-" + producto.id).remove();

        var favoritosActualizados =
          JSON.parse(localStorage.getItem("favoritos")) || [];
        if (favoritosActualizados.length === 0) {
          grid.innerHTML =
            "<p style='color:#777;padding:20px 0'>No tienes favoritos aún. Ve a Categorías para agregar.</p>";
        }
      });

      // Botón de carrito
      card
        .querySelector(".cart-add-btn")
        .addEventListener("click", function () {
          var id = producto.id;
          var nombre = producto.nombre;
          var precio = producto.precio;

          var productoExistente = carrito.find(function (p) {
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
  }

  renderizarFavoritosPerfil();
}

// ================= CARGAR PRODUCTOS EN CATEGORÍAS DESDE API =================

if (window.location.pathname.includes("categorias")) {
  function cargarProductosCategorias() {
    fetch("http://localhost:3000/api/productos")
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
              <img src="../assets/images/products/${producto.imagen}" alt="${producto.nombre}" />
              <button class="fav-btn ${esFavorito ? "activo" : ""}" data-id="${producto.id}">
                ${esFavorito ? "♥" : "♡"}
              </button>
            </div>
            <div class="producto-info">
              <h3>${producto.nombre}</h3>
              <div class="producto-footer">
                <span class="precio">$${Number(producto.precio).toLocaleString()}</span>
                <button class="cart-add-btn" 
                  data-id="${producto.id}" 
                  data-nombre="${producto.nombre}" 
                  data-precio="${producto.precio}">
                  🛒
                </button>
              </div>
            </div>
          `;
          grid.appendChild(card);

          // Botón favorito
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

          // Botón carrito
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
                });
              }
              localStorage.setItem("carrito", JSON.stringify(carrito));
              actualizarBadge();
              alert(producto.nombre + " agregado al carrito ✓");
            });
        });

        // Aplicar filtros de chips después de cargar
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

  cargarProductosCategorias();
}
