// src/firebaseConfig.js
import * as firebase from 'firebase';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;

// Give ourselves easier access to database
export const db = firebase.firestore();
export const purchaseCollection = db.collection('purchases');
// db.collection('COLLECTION_NAME');