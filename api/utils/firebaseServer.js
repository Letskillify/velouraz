import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyDKTCwXYM5BlOT8uhYvB5H3Bk4UiIX5aN4",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "velouraz-e708a.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "velouraz-e708a",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "velouraz-e708a.firebasestorage.app",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "427246020538",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:427246020538:web:f709bc8574fbcfe6061f83",
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs };
