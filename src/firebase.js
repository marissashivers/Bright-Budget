// src/firebaseConfig.js
import * as firebase from 'firebase';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA1ELuwf4iGgQdzHvYHBF7U5_-BM5pqLJo",
    authDomain: "finance-app-4ee04.firebaseapp.com",
    databaseURL: "https://finance-app-4ee04.firebaseio.com",
    projectId: "finance-app-4ee04",
    storageBucket: "finance-app-4ee04.appspot.com",
    messagingSenderId: "837854113793",
    appId: "1:837854113793:web:062aca56adb289b2ba1000",
    measurementId: "G-2N21KN9QGG"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;

// Give ourselves easier access to database
export const db = firebase.firestore();
export const purchaseCollection = db.collection('purchases');
// db.collection('COLLECTION_NAME');