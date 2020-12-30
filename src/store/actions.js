import firebase from 'firebase/app';
const actions = {
    signUpAction({ commit }, payload) {
        firebase
            .auth()
            .createUserWithEmailAndPassword(payload.email, payload.password)
            .then(response => {
            commit("setUser", response.user);
            })
            .catch(error => {
            commit("setError", error.message);
            });
    },
    signInAction({ commit }, payload) {
        return firebase
            .auth()
            .signInWithEmailAndPassword(payload.email, payload.password)
            .then(response => {
            commit("setUser", response.user);
            })
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
    }
};

export default actions;