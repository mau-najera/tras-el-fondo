// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDLitjd_iAZP8DoJyos8yf-lvTRzD1kAFU",
  authDomain: "tras-el-fondo-app.firebaseapp.com",
  projectId: "tras-el-fondo-app",
  storageBucket: "tras-el-fondo-app.firebasestorage.app",
  messagingSenderId: "211094636122",
  appId: "1:211094636122:web:60e7a38bb7c2d6fc963a63",
  measurementId: "G-9VMS01BBZZ",
  databaseURL: "https://tras-el-fondo-app-default-rtdb.firebaseio.com/",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

// Función para obtener el día de la semana en español
function getDayOfWeek(dateStr) {
  const [day, month, year] = dateStr.split('/');
  const date = new Date(year, getMonthNumber(month), day);
  const days = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
  return days[date.getDay()];
}

// Función auxiliar para convertir mes en texto a número
function getMonthNumber(month) {
  const months = {
    'ENE': 0, 'FEB': 1, 'MAR': 2, 'ABR': 3, 'MAY': 4, 'JUN': 5,
    'JUL': 6, 'AGO': 7, 'SEP': 8, 'OCT': 9, 'NOV': 10, 'DIC': 11
  };
  return months[month];
}

// Función para generar los botones de fecha
// Función para generar los botones de fecha
function createDateButtons(scheduleData) {
  const dateButtonsContainer = document.getElementById('dateButtons');
  if (!dateButtonsContainer) {
    console.error('No se encontró el contenedor de botones de fecha');
    return;
  }

  dateButtonsContainer.innerHTML = ''; // Limpiar contenedor

  const buttonsFragment = document.createDocumentFragment(); // Usar fragmento para optimizar manipulación DOM

  if (!scheduleData || scheduleData.length === 0) {
    console.log('No hay datos de calendario disponibles');
    return;
  }

  scheduleData.forEach((daySchedule, index) => {
    console.log('Generando botón para:', daySchedule.date);
    
    const [day, month] = daySchedule.date.split('/');
    const dayOfWeek = getDayOfWeek(daySchedule.date);
    
    const button = document.createElement('button');
    button.className = `date-btn ${index === 0 ? 'active' : ''}`;
    button.setAttribute('data-date', daySchedule.date); // Asignar correctamente el data-date
    button.innerHTML = `
      <div class="small">${dayOfWeek}</div>
      <div class="small">${day}/${month}</div>
    `;
    
    buttonsFragment.appendChild(button);
  });

  dateButtonsContainer.appendChild(buttonsFragment); // Solo hacer un appendChild
}

// Función para cargar los eventos desde Firebase
async function loadSchedule() {
  try {
    const scheduleRef = ref(database, 'schedule');
    const snapshot = await get(scheduleRef);
    
    if (snapshot.exists()) {
      const scheduleData = snapshot.val();
      console.log('Datos cargados desde Firebase:', scheduleData);
      createDateButtons(scheduleData);
      renderSchedule(scheduleData);
      setupEventListeners();
    } else {
      console.log("No hay datos de calendario disponibles");
    }
  } catch (error) {
    console.error("Error al cargar el calendario:", error.message);
  }
}

// Función para renderizar los eventos en el DOM
function renderSchedule(scheduleData) {
  const scheduleContainer = document.querySelector('.schedule-container');
  if (!scheduleContainer) {
    console.error('No se encontró el contenedor de eventos');
    return;
  }

  scheduleContainer.innerHTML = '';

  scheduleData.forEach(daySchedule => {
    const scheduleDiv = document.createElement('div');
    scheduleDiv.className = 'schedule fade-in';
    scheduleDiv.setAttribute('data-date', daySchedule.date); // Asegurarse de que se asigna correctamente el data-date
    scheduleDiv.style.display = 'none';

    daySchedule.events.forEach(event => {
      const isBreak = event.titulo === "RECESO";
      scheduleDiv.innerHTML += `
        <div class="event ${isBreak ? 'break' : ''} p-3 border-bottom">
          <div class="row">
            <div class="col-3 text-muted">
              <div class="start-hour">${event.hora_inicio}</div>
              <div class="end-hour">${event.hora_fin}</div>
            </div>
            <div class="col-9">
              ${!isBreak ? `
                <b><div class="fw-medium">${event.titulo}</div></b>
                ${event.ponente ? `<b><div class="small text-muted">${event.ponente}</div></b>` : ''}
                ${event.descripcion ? `<div class="small text-muted">${event.descripcion}</div>` : ''}
              ` : `
                <div class="fw-medium">RECESO</div>
              `}
            </div>
          </div>
        </div>
      `;
    });

    scheduleContainer.appendChild(scheduleDiv);
  });

  // Mostrar el primer día por defecto
  const firstSchedule = document.querySelector('.schedule');
  if (firstSchedule) {
    firstSchedule.style.display = 'block';
  }
}

// Función para configurar los event listeners
function setupEventListeners() {
  const dateButtons = document.querySelectorAll('.date-btn');
  if (dateButtons.length === 0) {
    console.error('No se encontraron botones de fecha');
    return;
  }

  dateButtons.forEach(button => {
    button.addEventListener('click', () => {
      const currentDate = button.getAttribute('data-date');
      console.log("Fecha seleccionada:", currentDate); // Agregar log para ver el valor de data-date
      
      // Actualizar botones
      document.querySelectorAll('.date-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      button.classList.add('active');

      // Actualizar schedules
      document.querySelectorAll('.schedule').forEach(schedule => {
        const scheduleDate = schedule.getAttribute('data-date');
        console.log("Fecha del evento:", scheduleDate); // Verificar si las fechas coinciden

        const shouldShow = scheduleDate === currentDate; // Asegurarse de que las fechas sean iguales
        schedule.style.display = shouldShow ? 'block' : 'none';
        
        if (shouldShow) {
          schedule.classList.remove('fade-out');
          schedule.classList.add('fade-in');
          
          // Reiniciar animaciones
          schedule.querySelectorAll('.event').forEach((event, index) => {
            event.style.animation = 'none';
            event.offsetHeight; // Trigger reflow
            event.style.animation = `slideIn 0.2s forwards ${index * 0.1}s`;
          });
        } else {
          schedule.classList.remove('fade-in');
          schedule.classList.add('fade-out');
        }
      });
    });
  });
}

export { app, analytics, database, loadSchedule };
