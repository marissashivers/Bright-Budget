import firebase from 'firebase/app';
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
        firebase
            .auth()
            .createUserWithEmailAndPassword(payload.email, payload.password)
            .catch(error => {
                commit("setError", error.message);
            });
    },
    // returns a Promise
    signInAction({ commit }, payload) {
        return firebase
            .auth()
            .signInWithEmailAndPassword(payload.email, payload.password)
            .catch(error => {
                commit("setError", error.message);
            });
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
};

export default actions;