import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from 'firebase/functions';

// firebase auth info
const firebaseConfig = {
    apiKey: "AIzaSyAU7k32Yn87KrnkCk34qiSvLozLCBq6NZE",
    authDomain: "oseru-44da8.firebaseapp.com",
    projectId: "oseru-44da8",
    storageBucket: "oseru-44da8.appspot.com",
    messagingSenderId: "215273476431",
    appId: "1:215273476431:web:bb78ac27dafcf3d4e5353a",
    measurementId: "G-2FEXLBS386"
  
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

export { auth, db, functions }

