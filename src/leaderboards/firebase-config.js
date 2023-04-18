import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
  
import { getAuth } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getFunctions } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-functions.js";

const firebaseConfig = {
  apiKey: "AIzaSyDU5XtGo5gNOfZKqA_5_nUUVoDM_cBoZWE",
  authDomain: "leaderboard-333.firebaseapp.com",
  projectId: "leaderboard-333",
  storageBucket: "leaderboard-333.appspot.com",
  messagingSenderId: "567434960342",
  appId: "1:567434960342:web:3ab15d265107af91c1d877",
  measurementId: "G-0NDFR4EWD8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { auth, db }