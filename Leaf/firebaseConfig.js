import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD9cKsA2JghkrDHNhOvBmqOUPa8_jx-Dg4",
  authDomain: "leaf-f184f.firebaseapp.com",
  projectId: "leaf-f184f",
  storageBucket: "leaf-f184f.appspot.com",
  messagingSenderId: "958929199285",
  appId: "1:958929199285:web:473b2d7be90466e3659efc",
  measurementId: "G-49C9WMRJM1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getFirestore(app);