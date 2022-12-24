// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBmT401Bvkozdd90xVssHhTUypSRfp44c8",
  authDomain: "monkey-blogging-4f8eb.firebaseapp.com",
  projectId: "monkey-blogging-4f8eb",
  storageBucket: "monkey-blogging-4f8eb.appspot.com",
  messagingSenderId: "285572749835",
  appId: "1:285572749835:web:53ce55b28e1185efd0050e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
