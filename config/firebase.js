// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import Constants from 'expo-constants';
import { initializeAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
// import 'dotenv/config';

// const firebaseConfig = {
//   apiKey: "AIzaSyCHFnWzsPPOSGcVDUrabF5CaDVX9ix2rvA",
//   authDomain: "afar-security-sharing.firebaseapp.com",
//   projectId: "afar-security-sharing",
//   storageBucket: "afar-security-sharing.appspot.com",
//   messagingSenderId: "1094597378823",
//   appId: "1:1094597378823:web:ec74f77f03ef2e6d00bba2",
//   measurementId: "G-4JG7885E0N"
// };

const firebaseConfig = {
  apiKey: "AIzaSyCkAs1ngVjUIkdP1givr0ihEDC7wvhv9Gc",
  authDomain: "securityinfo-c139b.firebaseapp.com",
  databaseURL: "https://securityinfo-c139b-default-rtdb.firebaseio.com",
  projectId: "securityinfo-c139b",
  storageBucket: "securityinfo-c139b.appspot.com",
  messagingSenderId: "167526671809",
  appId: "1:167526671809:web:2ca41dac571ee5368e3b40",
  measurementId: "G-6KBD7JJ3ME"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app)
export const storage = getStorage(app);
export const database = getFirestore(app);