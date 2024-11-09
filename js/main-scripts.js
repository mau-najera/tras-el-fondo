document.addEventListener('DOMContentLoaded', () => {
    // Código para botones de fecha y cambio de programación
    document.querySelectorAll('.date-btn').forEach(button => {
        button.addEventListener('click', () => {
            const currentDate = button.getAttribute('data-date');
            document.querySelectorAll('.schedule').forEach(schedule => {
                if (schedule.getAttribute('data-date') === currentDate) {
                    schedule.style.display = 'block';
                    schedule.classList.remove('fade-out');
                    schedule.classList.add('fade-in');
                } else {
                    schedule.style.display = 'none';
                    schedule.classList.remove('fade-in');
                    schedule.classList.add('fade-out');
                }
            });
            document.querySelectorAll('.date-btn').forEach(btn => {
                btn.classList.remove('active');
            });

            // Añadir clase active al botón clickeado
            button.classList.add('active');

            // Animar salida del contenido actual
            const currentSchedule = document.querySelector('.schedule');
            currentSchedule.classList.remove('fade-in');
            currentSchedule.classList.add('fade-out');

            // Simular carga de nuevos datos
            setTimeout(() => {
                // Reiniciar las animaciones de los eventos
                document.querySelectorAll('.event').forEach((event, index) => {
                    event.style.animation = 'none';
                    event.offsetHeight; // Trigger reflow
                    event.style.animation = `slideIn 0.5s forwards ${index * 0.1}s`;
                });

                // Animar entrada del nuevo contenido
                currentSchedule.classList.remove('fade-out');
                currentSchedule.classList.add('fade-in');
            }, 300);
        });
    });

    // Código para el menú lateral
    document.getElementById('menuButton').addEventListener('click', openNav);
});

function openNav() {
    document.getElementById("mySidebar").style.width = "50vh";
    document.getElementById("mainContent").classList.add("blurred");
}

function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("mainContent").classList.remove("blurred");
}
