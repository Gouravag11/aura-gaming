// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDVvt0zCIgMj48OWb6W1ENej7zNCi7FoRM",
  authDomain: "aura-gaming11.firebaseapp.com",
  projectId: "aura-gaming11",
  storageBucket: "aura-gaming11.appspot.com",
  messagingSenderId: "418642788373",
  appId: "1:418642788373:web:bb0294382570d245b70e1c",
  measurementId: "G-69ZPPJWZM0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };