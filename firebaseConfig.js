// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA7w5b-SnUlUhMJqDIpKH37v0ahih7oP3A",
  authDomain: "prescriptionsystem-ef7a2.firebaseapp.com",
  projectId: "prescriptionsystem-ef7a2",
  storageBucket: "prescriptionsystem-ef7a2.firebasestorage.app",
  messagingSenderId: "941577016565",
  appId: "1:941577016565:web:1eeabdeb333f261b2c61bc",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
