// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCZv6febo-sC6MjJwvgkFwldEsN2-QtA5M",
  authDomain: "wixlings.firebaseapp.com",
  databaseURL: "https://wixlings-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "wixlings",
  storageBucket: "wixlings.appspot.com",
  messagingSenderId: "473235909379",
  appId: "1:473235909379:web:aa8578d20ff5a2b7991736",
  measurementId: "G-E0MTXKGF5C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);