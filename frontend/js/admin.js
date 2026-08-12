// ================= PANEL DE ADMINISTRADOR =================

const API = "http://localhost:3000/api";

// ================= NAVEGACIÓN =================

function mostrarSeccion(seccion) {
  document.querySelectorAll(".admin-seccion").forEach(function (s) {
    s.classList.remove("activa");
  });
  document.querySelectorAll(".admin-nav-item").forEach(function (n) {
    n.classList.remove("active");
  });
  document.getElementById(seccion).classList.add("activa");
  event.currentTarget.classList.add("active");

  if (seccion === "productos") cargarProductos();
  if (seccion === "usuarios") cargarUsuarios();
  if (seccion === "pedidos") cargarPedidos();
  if (seccion === "categorias") cargarCategorias();
}

// ================= PRODUCTOS =================

function cargarProductos() {
  fetch(API + "/productos")
    .then(function (res) {
      return res.json();
    })
    .then(function (productos) {
      var html = "<table class='admin-tabla'>";
      html +=
        "<tr><th>ID</th><th>Nombre</th><th>Precio</th><th>Categoría</th><th>Acciones</th></tr>";
      productos.forEach(function (p) {
        html += "<tr>";
        html += "<td>" + p.id + "</td>";
        html += "<td>" + p.nombre + "</td>";
        html += "<td>$" + Number(p.precio).toLocaleString() + "</td>";
        html += "<td>" + p.categoria + "</td>";
        html += "<td style='display:flex;gap:8px;'>";
        html +=
          "<button class='btn-admin btn-editar' onclick='editarProducto(" +
          JSON.stringify(p).replace(/'/g, "\\'") +
          ")'><i class='fa-solid fa-pen'></i></button>";
        html +=
          "<button class='btn-admin btn-eliminar' onclick='eliminarProducto(" +
          p.id +
          ")'><i class='fa-solid fa-trash'></i></button>";
        html += "</td></tr>";
      });
      html += "</table>";
      document.getElementById("tablaProductos").innerHTML = html;
    });
}

function mostrarFormProducto() {
  document.getElementById("formProducto").style.display = "block";
  document.getElementById("formProductoTitulo").textContent =
    "Agregar producto";
  document.getElementById("productoId").value = "";
  document.getElementById("productoNombre").value = "";
  document.getElementById("productoDescripcion").value = "";
  document.getElementById("productoPrecio").value = "";
  document.getElementById("productoImagen").value = "";
}

function cancelarFormProducto() {
  document.getElementById("formProducto").style.display = "none";
}

function editarProducto(p) {
  document.getElementById("formProducto").style.display = "block";
  document.getElementById("formProductoTitulo").textContent = "Editar producto";
  document.getElementById("productoId").value = p.id;
  document.getElementById("productoNombre").value = p.nombre;
  document.getElementById("productoDescripcion").value = p.descripcion;
  document.getElementById("productoPrecio").value = p.precio;
  document.getElementById("productoCategoria").value = p.categoria;
  document.getElementById("productoImagen").value = p.imagen;
}

function guardarProducto() {
  var id = document.getElementById("productoId").value;
  var datos = {
    nombre: document.getElementById("productoNombre").value,
    descripcion: document.getElementById("productoDescripcion").value,
    precio: document.getElementById("productoPrecio").value,
    categoria: document.getElementById("productoCategoria").value,
    imagen: document.getElementById("productoImagen").value,
  };

  if (!datos.nombre || !datos.precio) {
    alert("Nombre y precio son obligatorios");
    return;
  }

  var metodo = id ? "PUT" : "POST";
  var url = id ? API + "/productos/" + id : API + "/productos";

  fetch(url, {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  })
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      alert(data.mensaje);
      cancelarFormProducto();
      cargarProductos();
    });
}

function eliminarProducto(id) {
  if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
  fetch(API + "/productos/" + id, { method: "DELETE" })
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      alert(data.mensaje);
      cargarProductos();
    });
}

// ================= USUARIOS =================

function cargarUsuarios() {
  fetch(API + "/usuarios")
    .then(function (res) {
      return res.json();
    })
    .then(function (usuarios) {
      var html = "<table class='admin-tabla'>";
      html +=
        "<tr><th>ID</th><th>Nombre</th><th>Email</th><th>Fecha registro</th></tr>";
      usuarios.forEach(function (u) {
        var fecha = new Date(u.created_at).toLocaleDateString("es-CO");
        html += "<tr>";
        html += "<td>" + u.id + "</td>";
        html += "<td>" + u.nombre + "</td>";
        html += "<td>" + u.email + "</td>";
        html += "<td>" + fecha + "</td>";
        html += "</tr>";
      });
      html += "</table>";
      document.getElementById("tablaUsuarios").innerHTML = html;
    });
}

// ================= PEDIDOS =================

function cargarPedidos() {
  fetch(API + "/pedidos")
    .then(function (res) {
      return res.json();
    })
    .then(function (pedidos) {
      if (pedidos.length === 0) {
        document.getElementById("tablaPedidos").innerHTML =
          "<p style='color:#777;padding:20px'>No hay pedidos aún.</p>";
        return;
      }
      var html = "<table class='admin-tabla'>";
      html +=
        "<tr><th>ID</th><th>Cliente</th><th>Total</th><th>Fecha entrega</th><th>Estado</th><th>Acción</th></tr>";
      pedidos.forEach(function (p) {
        var fecha = new Date(p.fecha_entrega).toLocaleDateString("es-CO");
        html += "<tr>";
        html += "<td>#" + p.id + "</td>";
        html += "<td>" + p.nombre + "</td>";
        html += "<td>$" + Number(p.total).toLocaleString() + "</td>";
        html += "<td>" + fecha + "</td>";
        html +=
          "<td><span class='badge-estado badge-" +
          p.estado +
          "'>" +
          p.estado +
          "</span></td>";
        html +=
          "<td><select onchange='cambiarEstado(" +
          p.id +
          ", this.value)' class='admin-select'>";
        html +=
          "<option value='pendiente'" +
          (p.estado === "pendiente" ? " selected" : "") +
          ">Pendiente</option>";
        html +=
          "<option value='proceso'" +
          (p.estado === "proceso" ? " selected" : "") +
          ">En proceso</option>";
        html +=
          "<option value='entregado'" +
          (p.estado === "entregado" ? " selected" : "") +
          ">Entregado</option>";
        html += "</select></td>";
        html += "</tr>";
      });
      html += "</table>";
      document.getElementById("tablaPedidos").innerHTML = html;
    });
}

function cambiarEstado(id, estado) {
  fetch(API + "/pedidos/" + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ estado: estado }),
  })
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      alert("Estado actualizado: " + estado);
      cargarPedidos();
    });
}

// ================= INICIALIZAR =================
cargarProductos();
// ================= CERRAR SESIÓN ADMIN =================
document.querySelector(".admin-salir").addEventListener("click", function (e) {
  e.preventDefault();
  localStorage.removeItem("sesionActiva");
  localStorage.removeItem("usuarioId");
  localStorage.removeItem("usuarioNombre");
  localStorage.removeItem("usuarioRol");
  window.location.href = "../index.html";
});
// ================= CATEGORÍAS =================

function cargarCategorias() {
  fetch(API + "/categorias")
    .then(function (res) {
      return res.json();
    })
    .then(function (categorias) {
      var html = "<table class='admin-tabla'>";
      html +=
        "<tr><th>ID</th><th>Nombre</th><th>Descripción</th><th>Acciones</th></tr>";
      categorias.forEach(function (c) {
        html += "<tr>";
        html += "<td>" + c.id + "</td>";
        html += "<td>" + c.nombre + "</td>";
        html += "<td>" + (c.descripcion || "Sin descripción") + "</td>";
        html += "<td style='display:flex;gap:8px;'>";
        html +=
          "<button class='btn-admin btn-editar' onclick='editarCategoria(" +
          JSON.stringify(c).replace(/'/g, "\\'") +
          ")'><i class='fa-solid fa-pen'></i></button>";
        html +=
          "<button class='btn-admin btn-eliminar' onclick='eliminarCategoria(" +
          c.id +
          ")'><i class='fa-solid fa-trash'></i></button>";
        html += "</td></tr>";
      });
      html += "</table>";
      document.getElementById("tablaCategorias").innerHTML = html;
    });
}

function mostrarFormCategoria() {
  document.getElementById("formCategoria").style.display = "block";
  document.getElementById("formCategoriaTitulo").textContent =
    "Agregar categoría";
  document.getElementById("categoriaId").value = "";
  document.getElementById("categoriaNombre").value = "";
  document.getElementById("categoriaDescripcion").value = "";
}

function cancelarFormCategoria() {
  document.getElementById("formCategoria").style.display = "none";
}

function editarCategoria(c) {
  document.getElementById("formCategoria").style.display = "block";
  document.getElementById("formCategoriaTitulo").textContent =
    "Editar categoría";
  document.getElementById("categoriaId").value = c.id;
  document.getElementById("categoriaNombre").value = c.nombre;
  document.getElementById("categoriaDescripcion").value = c.descripcion || "";
}

function guardarCategoria() {
  var id = document.getElementById("categoriaId").value;
  var datos = {
    nombre: document.getElementById("categoriaNombre").value,
    descripcion: document.getElementById("categoriaDescripcion").value,
  };

  if (!datos.nombre) {
    alert("El nombre es obligatorio");
    return;
  }

  var metodo = id ? "PUT" : "POST";
  var url = id ? API + "/categorias/" + id : API + "/categorias";

  fetch(url, {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  })
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      alert(data.mensaje);
      cancelarFormCategoria();
      cargarCategorias();
    });
}

function eliminarCategoria(id) {
  if (!confirm("¿Seguro que deseas eliminar esta categoría?")) return;
  fetch(API + "/categorias/" + id, { method: "DELETE" })
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      alert(data.mensaje);
      cargarCategorias();
    });
}
