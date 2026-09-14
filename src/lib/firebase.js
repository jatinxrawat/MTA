import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAidJEmii1XBYmMvamStixh2ZlJd4RrIbk",
  authDomain: "mother-teresa-academy-bd65c.firebaseapp.com",
  projectId: "mother-teresa-academy-bd65c",
  storageBucket: "mother-teresa-academy-bd65c.firebasestorage.app",
  messagingSenderId: "1082556446199",
  appId: "1:1082556446199:web:b961f3fe0b09d8c1f3eaf2"
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore (100% Free Tier)
export const db = getFirestore(app);
