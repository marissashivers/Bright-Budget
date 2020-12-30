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

        return auth.signInWithEmailAndPassword(payload.email, payload.password)
        .then(() => {
            var user = auth.currentUser;
            commit("setUser", user);
            dispatch("fetchCategories");
            dispatch("fetchPurchases");
        })
        .catch(error => {
            console.log(`GOT ERROR: ` + error.code);
            commit("setError", error.message);
        });
    },
    signOutAction({commit}) {
        firebase
            .auth()
            .signOut()
            .then(() => {
                commit("setUser", null);
                commit("setCategories", []);
                commit("setPurchases", []);
            })
            .catch(error => {
                commit("setError", error.message);
            });
    },
    // ****************************
    // CATEGORIES
    // ****************************
    async fetchCategories({ commit, getters }) {
        var db = firebase.firestore();
        var user = getters.getUser;

        var querySnapshot = await db.collection('users')
            .doc(user.uid)
            .collection('categories')
            .orderBy('category')
            .get();
        
        var categories = [];
        querySnapshot.forEach(doc => {
            categories.push({
                id: doc.id,
                category: doc.data().category
            });
        });
        console.log("fetchCategories from actions invoked -- Firebase");
        commit("setCategories", categories);

        // db.collection('users').doc(user.uid).collection('categories').orderBy('category').onSnapshot((querySnapshot) => {
        //     if (querySnapshot.empty) {
        //         console.log('empty');
        //     } 
        //     else {
        //         var categories = [];
        //         querySnapshot.forEach(doc => {
        //             categories.push(doc.data());
        //         });

        //         commit("setCategories", categories);
        //         console.log("fetchCategories from actions invoked -- Firebase");
        //     }
        // });
    },
    addCategoryAction({ getters, dispatch }, payload) {
        var db = firebase.firestore();
        var user = getters.getUser;
        db.collection('users').doc(user.uid).collection('categories').add({
            category: payload.category
        });
        dispatch('fetchCategories');
    },
    deleteCategoryAction({ getters, dispatch }, payload) {
        var db = firebase.firestore();
        var user = getters.getUser;
        db.collection('users').doc(user.uid).collection('categories').doc(payload).delete().then(function() {
            console.log('Document successfully deleted');
        }).catch(error => {
            console.log("Error occurred while deleting document");
            console.log(error.code);
            console.log(error.message);
        });
        dispatch('fetchCategories');
    },
    // ****************************
    // PURCHASES
    // ****************************
    async fetchPurchases({ commit, getters }) {
        var db = firebase.firestore();
        var user = getters.getUser;

        var querySnapshot = await db.collection('users')
            .doc(user.uid)
            .collection('purchases')
            .orderBy('createdAt')
            .get();
        
        var purchases = [];
        querySnapshot.forEach(doc => {
            purchases.push({
                id: doc.id,
                createdAt: doc.data().createdAt,
                purchaseAmount: doc.data().purchaseAmount,
                purchaseLocation: doc.data().purchaseLocation,
                purchaseCategory: doc.data().purchaseCategory
            });
        });
        console.log("fetchPurchases from actions invoked -- Firebase");
        commit("setPurchases", purchases);
    },
    addPurchaseAction({ getters, dispatch }, payload) {
        var db = firebase.firestore();
        var user = getters.getUser;
        db.collection('users').doc(user.uid).collection('purchases').add({
            createdAt: payload.createdAt,
            purchaseLocation: payload.purchaseLocation,
            purchaseAmount: payload.purchaseAmount,
            purchaseCategory: payload.purchaseCategory
        })
        .then(docRef => {
            // TODO: add ID to purchase object in Vuex store so we can easily edit/delete purchases.
            // Already done for categories.
            console.log(docRef.id);
        });
        dispatch('fetchPurchases');
    },
    deletePurchaseAction({ getters, dispatch }, payload) {
        var db = firebase.firestore();
        var user = getters.getUser;
        db.collection('users').doc(user.uid).collection('purchases').doc(payload).delete().then(function() {
            console.log('Document successfully deleted');
        }).catch(error => {
            console.log("Error occurred while deleting document");
            console.log(error.code);
            console.log(error.message);
        });
        dispatch('fetchPurchases');
    }
};

export default actions;