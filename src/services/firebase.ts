// src/services/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCfeAwcYf_qiWGwl95ir4YcCQP9WXrpuAY",
  authDomain: "convertamais-mobile.firebaseapp.com",
  projectId: "convertamais-mobile",
  storageBucket: "convertamais-mobile.appspot.com",
  messagingSenderId: "1005916176293",
  appId: "1:1005916176293:web:0ee5e3469299442f6a324c",
  measurementId: "G-6DLJHFMNF1"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta as instâncias do Auth e Firestore
export const auth = getAuth(app);
export const firestore = getFirestore(app);
