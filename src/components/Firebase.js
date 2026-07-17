// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDKTCwXYM5BlOT8uhYvB5H3Bk4UiIX5aN4",
  authDomain: "velouraz-e708a.firebaseapp.com",
  projectId: "velouraz-e708a",
  storageBucket: "velouraz-e708a.firebasestorage.app",
  messagingSenderId: "427246020538",
  appId: "1:427246020538:web:f709bc8574fbcfe6061f83",
  measurementId: "G-6NH5MQ96B2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
