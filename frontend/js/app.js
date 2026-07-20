// ================= SESIÓN (simulada con localStorage) =================

// Revisamos si hay sesión activa guardada
const sesionActiva = localStorage.getItem("sesionActiva") === "true";

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
    if (!sesionActiva) {
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
    if (!sesionActiva) {
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
  });
});

actualizarBadge();

// ================= LOGIN / REGISTRO =================

const authForm = document.querySelector(".auth-form");

if (
  authForm &&
  (window.location.pathname.includes("login") ||
    window.location.pathname.includes("registro"))
) {
  authForm.addEventListener("submit", function (e) {
    e.preventDefault();

    localStorage.setItem("sesionActiva", "true");

    window.location.href = "categorias.html";
  });
}

// ================= CONTROL DE SESIÓN EN NAVBAR Y PÁGINAS =================

const iconoPerfil = document.querySelector(".icon-btn:not(.cart-btn)");
const iconoCarrito = document.querySelector(".cart-btn");

if (iconoPerfil) {
  iconoPerfil.style.display = sesionActiva ? "flex" : "none";
}
if (iconoCarrito) {
  iconoCarrito.style.display = sesionActiva ? "flex" : "none";
}

if (window.location.pathname.includes("categorias") && !sesionActiva) {
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
