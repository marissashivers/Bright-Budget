// src/firebaseConfig.js
import firebase from 'firebase/app';
require('firebase/firestore');
require('firebase/auth');

// Your web app's Firebase configuration
const firebaseConfig = {
  };

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

// Give ourselves easier access to database
const db = firebaseApp.firestore();
const purchaseCollection = db.collection('purchases');
const categoryCollection = db.collection('categories');
const usersCollection = db.collection('users');

const auth = firebase.auth();

export {
  db,
  purchaseCollection,
  categoryCollection,
  usersCollection,
  auth,
}

// npm run build && firebase deploy

