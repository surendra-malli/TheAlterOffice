// // src/services/firebase.ts

// import { initializeApp } from 'firebase/app';
// import { getAuth, GoogleAuthProvider } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore'; // If you plan to use Firestore

// // Your web app's Firebase configuration
// const firebaseConfig = {
//     apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//     authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//     projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//     storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//     appId: process.env.REACT_APP_FIREBASE_APP_ID,
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// // Initialize Firebase Authentication and Firestore
// const auth = getAuth(app);
// const provider = new GoogleAuthProvider();
// const db = getFirestore(app); // Uncomment if using Firestore

// export { auth, provider, db }; // Export the auth and db instances


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore'; // If you plan to use Firestore
const firebaseConfig = {
  apiKey: "AIzaSyDAopgvK9_fgbTp7-DENbvBA4BXRPDOceA",
  authDomain: "thealteroffice-3d44b.firebaseapp.com",
  projectId: "thealteroffice-3d44b",
  storageBucket: "thealteroffice-3d44b.firebasestorage.app",
  messagingSenderId: "425985407181",
  appId: "1:425985407181:web:8e94bec00b4b36d3c0d184",
  measurementId: "G-1825JDC5MT"
};




// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db,app };