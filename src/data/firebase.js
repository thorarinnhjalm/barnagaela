import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const app = initializeApp({
  apiKey: "AIzaSyAASujbUrEGZ8bTgN_KdP_nhPG5RHFHDh8",
  authDomain: "barnagaela-b9d64.firebaseapp.com",
  projectId: "barnagaela-b9d64",
  storageBucket: "barnagaela-b9d64.firebasestorage.app",
  messagingSenderId: "210468979040",
  appId: "1:210468979040:web:0fb98a746ca756acdc5e05",
});

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
