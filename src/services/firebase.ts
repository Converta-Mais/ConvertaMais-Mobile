// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCfeAwcYf_qiWGwl95ir4YcCQP9WXrpuAY",
  authDomain: "convertamais-mobile.firebaseapp.com",
  projectId: "convertamais-mobile",
  storageBucket: "convertamais-mobile.firebasestorage.app",
  messagingSenderId: "1005916176293",
  appId: "1:1005916176293:web:0ee5e3469299442f6a324c",
  measurementId: "G-6DLJHFMNF1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
