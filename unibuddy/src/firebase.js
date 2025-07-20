
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB5yVPcA6k2Q2NSRgl7dryAk2mo50Ktjd8",
  authDomain: "unibuddy-project.firebaseapp.com",
  projectId: "unibuddy-project",
  storageBucket: "unibuddy-project.firebasestorage.app",
  messagingSenderId: "171130823587",
  appId: "1:171130823587:web:ee4793428ef94d3fa57016",
  measurementId: "G-H21GM0RYT3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getFirestore(app);
