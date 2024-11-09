// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
import { getDatabase } from "firebase/database";
// Tu configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyADQ4_F5zTCsVlpJ9DyuG87Jo6pYS6NR-k",
    authDomain: "tras-el-fondo.firebaseapp.com",
    projectId: "tras-el-fondo",
    storageBucket: "tras-el-fondo.firebasestorage.app",
    messagingSenderId: "727864031772",
    appId: "1:727864031772:web:2dd4bcc178af3f8a303dd9",
    measurementId: "G-6VEL89QCRS"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
