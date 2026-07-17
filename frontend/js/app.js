// Buscamos el botón hamburguesa y el menú por su id/clase
const menuToggle = document.getElementById("menuToggle");
const menu = document.querySelector(".menu");

// Cuando se hace clic en el botón, alternamos la clase "activo" en el menú
menuToggle.addEventListener("click", function () {
  menu.classList.toggle("activo");
});
