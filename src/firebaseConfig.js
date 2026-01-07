// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCK-cSj_TpAPL5cAn3nrr-WorS1m158H90",
    authDomain: "gesturize-b.firebaseapp.com",
    projectId: "gesturize-b",
    storageBucket: "gesturize-b.firebasestorage.app",
    messagingSenderId: "710051640696",
    appId: "1:710051640696:web:6e4692cbe4901b05ca448d",
    measurementId: "G-H4ZY1D8HD6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);