import { loadSchedule } from "./firebase.js";

document.addEventListener("DOMContentLoaded", async () => {
  await loadSchedule();

  const scheduleContainer = document.querySelector(".schedule-container");

  // Asegurarse que todos los schedules empiecen ocultos excepto el activo
  document.querySelectorAll(".schedule").forEach((schedule) => {
    schedule.style.position = "absolute";
    schedule.style.width = "100%";
    schedule.style.display = "none";
  });

  document.querySelectorAll(".date-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const currentDate = button.getAttribute("data-date");

      // Actualizar botones
      document.querySelectorAll(".date-btn").forEach((btn) => {
        btn.classList.remove("active");
      });
      button.classList.add("active");

      // Cambiar schedules
      document.querySelectorAll(".schedule").forEach((schedule) => {
        if (schedule.getAttribute("data-date") === currentDate) {
          // Reiniciar posición de scroll antes de mostrar
          scheduleContainer.scrollTop = 0;

          // Mostrar el schedule actual
          schedule.style.display = "block";
          schedule.style.position = "relative";
        } else {
          // Ocultar los otros schedules
          schedule.style.display = "none";
          schedule.style.position = "absolute";
        }
      });
    });
  });

  // Inicializar el día activo
  const activeButton = document.querySelector(".date-btn.active");
  if (activeButton) {
    const activeDate = activeButton.getAttribute("data-date");
    const activeSchedule = document.querySelector(
      `.schedule[data-date="${activeDate}"]`
    );
    if (activeSchedule) {
      activeSchedule.style.display = "block";
      activeSchedule.style.position = "relative";
    }
  }

// Función para manejar el input de búsqueda
function handleSearchInput() {
    const searchTerm = document.getElementById("searchBox").value.toLowerCase(); // Obtener el término de búsqueda
    const activeDate = document.querySelector(".date-btn.active").getAttribute("data-date"); // Obtener la fecha activa
    const activeSchedule = document.querySelector(`.schedule[data-date="${activeDate}"]`); // Seleccionar el día activo

    // Si la caja de búsqueda está vacía, quitar el resaltado de todos los eventos
    if (searchTerm === "") {
        activeSchedule.querySelectorAll(".event").forEach((event) => {
            event.classList.remove("highlight"); // Quitar el resaltado
            event.style.display = "block"; // Asegurarse de que todos los eventos sean visibles
        });
        return; // Salir de la función si no hay texto de búsqueda
    }

    // Filtrar los eventos dentro del día activo
    const events = activeSchedule.querySelectorAll(".event");
    events.forEach((event) => {
        const eventTitle = event.querySelector(".fw-medium")
            ? event.querySelector(".fw-medium").textContent.toLowerCase()
            : "";
        const eventPonente = event.querySelector(".small.text-muted")
            ? event.querySelector(".small.text-muted").textContent.toLowerCase()
            : "";

        // Verifica si el título o el ponente contiene el término de búsqueda
        if (
            eventTitle.includes(searchTerm) ||
            eventPonente.includes(searchTerm)
        ) {
            event.style.display = "block"; // Mostrar evento si coincide con la búsqueda
            event.classList.add("highlight"); // Resaltar la coincidencia
        } else {
            event.style.display = "none"; // Ocultar evento si no coincide
            event.classList.remove("highlight"); // Quitar el resalte
        }
    });
}

// Mostrar la caja de búsqueda con animación
document.getElementById("searchBtn").addEventListener("click", (e) => {
    e.stopPropagation(); // Prevenir que el click se propague (por si se hace clic fuera)
    const searchBoxContainer = document.getElementById("searchBoxContainer");
    searchBoxContainer.style.display = "block"; // Mostrar la caja de búsqueda
    document.getElementById("searchBox").focus(); // Enfocar el input de búsqueda
});

// Ocultar la caja de búsqueda cuando el usuario hace clic fuera
document.addEventListener("click", (e) => {
    const searchBoxContainer = document.getElementById("searchBoxContainer");
    const searchBox = document.getElementById("searchBox");

    if (!searchBoxContainer.contains(e.target) && e.target !== searchBox) {
        searchBoxContainer.style.display = "none"; // Ocultar la caja de búsqueda
    }
});

// Agregar el event listener para el input de búsqueda
document
    .getElementById("searchBox")
    .addEventListener("input", handleSearchInput);
    
});
