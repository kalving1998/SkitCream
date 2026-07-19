// Buscamos el botón hamburguesa y el menú por su id/clase
const menuToggle = document.getElementById("menuToggle");
const menu = document.querySelector(".menu");

// Cuando se hace clic en el botón, alternamos la clase "activo" en el menú
menuToggle.addEventListener("click", function () {
  menu.classList.toggle("activo");
});
// ================= FAVORITOS =================

// 1. Traemos la lista guardada de favoritos, o una lista vacía si no hay nada aún
let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

// 2. Buscamos todos los botones de favorito que existan en la página actual
const favBtns = document.querySelectorAll(".fav-btn");

// 3. Función que revisa si un id está en la lista y pinta el corazón correcto
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

// 4. Cuando la página carga, pintamos el estado correcto en cada botón
favBtns.forEach(function (btn) {
  actualizarCorazon(btn);

  // 5. Cuando el usuario hace clic, agregamos o quitamos el id de la lista
  btn.addEventListener("click", function () {
    const id = btn.dataset.id;

    if (favoritos.includes(id)) {
      favoritos = favoritos.filter(function (favId) {
        return favId !== id;
      });
    } else {
      favoritos.push(id);
    }

    // 6. Guardamos la lista actualizada en localStorage
    localStorage.setItem("favoritos", JSON.stringify(favoritos));

    // 7. Actualizamos el corazón de ese botón
    actualizarCorazon(btn);
  });
});
