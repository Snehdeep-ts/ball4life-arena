import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAX3aqfjRCLcpei-7r_z1K0nIvlgeTS54I',
  authDomain: 'ball4life-arena.firebaseapp.com',
  projectId: 'ball4life-arena',
  storageBucket: 'ball4life-arena.firebasestorage.app',
  messagingSenderId: '968319619043',
  appId: '1:968319619043:web:61e059a26b7929b8325ad6',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
