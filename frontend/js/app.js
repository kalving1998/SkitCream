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

    if (password !== password2) {
      alert("Las contraseñas no coinciden");
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
          localStorage.setItem("sesionActiva", "true");
          localStorage.setItem("usuarioId", data.usuario.id);
          localStorage.setItem("usuarioNombre", data.usuario.nombre);
          window.location.href = "categorias.html";
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
    if (!sesionActiva) {
      window.location.href = rutaLogin();
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
