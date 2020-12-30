import firebase from 'firebase/app';
import 'firebase/firestore';

const actions = {
    // Every time the auth state changes we will update the Global State
    authAction({commit}) {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                commit("setUser", user);
            } 
            else {
                commit("setUser", null);
            }
        });
    },
    // returns a promise. Once it resolved we have to set the user state else we have to catch the error.
    signUpAction({ commit }, payload) {
        var auth = firebase.auth();

        var promise = auth.createUserWithEmailAndPassword(payload.email, payload.password);
        // IF there are any errors stop the process.
        promise.catch(error => {
            console.log(`GOT ERROR: ` + error.code);
            commit("setError", error.message);
        });
        // When no errors create the account
        promise.then(function() {
            var user = auth.currentUser;
            var db = firebase.firestore();

            db.collection('users').doc(user.uid).set({
                email: user.email,
            });
        });
    },
    // returns a Promise
    signInAction({ commit, dispatch }, payload) {
        var auth = firebase.auth();

        var promise = auth.signInWithEmailAndPassword(payload.email, payload.password);
        promise.catch(error => {
            console.log(`GOT ERROR: ` + error.code);
            commit("setError", error.message);
        });
        promise.then(function() {
            var user = auth.currentUser;
            commit("setUser", user);
            dispatch("fetchCategories");
            dispatch("fetchPurchases");
        })
    },
    signOutAction({commit}) {
        firebase
            .auth()
            .signOut()
            .then(() => {
                commit("setUser", null);
            })
            .catch(error => {
                commit("setError", error.message);
            });
    },
    // ****************************
    // CATEGORIES
    // ****************************
    fetchCategories({ commit, getters }) {
        var db = firebase.firestore();
        var user = getters.getUser;

        db.collection('users').doc(user.uid).collection('categories').get().then(querySnapshot =>{
            if (querySnapshot.empty) {
                console.log('empty');
            } 
            else {
                var categories = [];
                querySnapshot.forEach(doc => {
                    categories.push(doc.data());
                });

                commit("setCategories", categories);
                console.log("fetchCategories from actions invoked");
            }
        });
    },
    addCategoryAction({ getters, dispatch }, payload) {
        var db = firebase.firestore();
        var user = getters.getUser;
        db.collection('users').doc(user.uid).collection('categories').add({
            category: payload.category
        });
        dispatch('fetchCategories');
    },
    // ****************************
    // PURCHASES
    // ****************************
    fetchPurchases({ commit, getters }) {
        var db = firebase.firestore();
        var user = getters.getUser;

        db.collection('users').doc(user.uid).collection('purchases').get().then(querySnapshot =>{
            if (querySnapshot.empty) {
                console.log('empty');
            } 
            else {
                var purchases = [];
                querySnapshot.forEach(doc => {
                    purchases.push(doc.data());
                });

                commit("setPurchases", purchases);
                console.log("fetPurchases from actions invoked");
            }
        });
    },
    addPurchaseAction({ getters, dispatch }, payload) {
        var db = firebase.firestore();
        var user = getters.getUser;
        db.collection('users').doc(user.uid).collection('purchases').add({
            createdAt: payload.createdAt,
            purchaseLocation: payload.purchaseLocation,
            purchaseAmount: payload.purchaseAmount,
            purchaseCategory: payload.purchaseCategory
        });
        dispatch('fetchPurchases');
    },
};

export default actions;