// Import the functions you need from the SDKs you need
// import { getAnalytics } from "firebase/analytics";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBdUfDBTGNqDk_6GQ3ld2h6kn1nulVZC8w",
  authDomain: "barflow-6d5ef.firebaseapp.com",
  projectId: "barflow-6d5ef",
  storageBucket: "barflow-6d5ef.firebasestorage.app",
  messagingSenderId: "692491328267",
  appId: "1:692491328267:web:9766ef2abb2732969f600e",
  measurementId: "G-17P9228E18"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
})

export { auth, db };

