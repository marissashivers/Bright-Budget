import Vue from 'vue'
import Vuex from 'vuex'
//mport { db } from './firebase';
import { db, auth } from '../firebase';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    displayName: null,
    purchases: [],
    categories: [],
    status: null,
    error: null,
  },
  getters: {
    status(state) {
      return state.status;
    },
    user(state) {
      return state.user;
    },
    displayName(state) {
      return state.displayName;
    },
    error(state) {
      return state.error;
    },
    purchases(state) {
      return state.purchases;
    },
    categories(state) {
      return state.categories;
    },
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    setDisplayName(state, payload) {
      state.displayName = payload;
    },
    removeUser(state) {
      state.user = null;
    },
    setStatus(state, payload) {
      state.status = payload;
    },
    setError(state, payload) {
      state.error = payload;
    },
    setPurchases(state, payload) {
      state.purchases = payload;
    },
    setCategories(state, payload) {
      state.categories = payload;
    },
  },
  actions: {
    signUpAction({ commit }, payload) {
      commit('setStatus', 'loading')
      auth.createUserWithEmailAndPassword(payload.email, payload.password)
      .then((response) => {
        // respones will have user
        // user will have uid and will be updated in state
        commit('setUser', response.user.uid)
        commit('setDisplayName', response.user.displayName)
        commit('setStatus', 'success')
        commit('setError', null)
      })
      .catch((error) => {
        commit('setStatus', 'failure')
        commit('setError', error.message)
      })
    },
    signInAction({ commit }, payload) {
      return new Promise((resolve, reject) => {
        auth.signInWithEmailAndPassword(payload.email, payload.password)
        .then((response) => {
          commit('setUser', response.user.uid);
          commit('setDisplayName', response.user.displayName);
          commit('setStatus', 'success');
          commit('setError', null);
          resolve(response);
        })
        .catch((error) => {
          commit('setStatus', 'failure')
          commit('setError', error.message)
          reject(error);
        }) //
      })
    },
    signOutAction({ commit }) {
      auth.signOut()
      .then(() => {
        commit('setUser', null);
        commit('setDisplayName', null);
        commit('setStatus', 'success');
        commit('setError', null);
      })
      .catch((error) => {
        commit('setStatus', 'failure');
        commit('setError', error.message);
      })
    },
    fetchPurchases({ commit }) {
      console.log("here in getter for purchases");
      if (this.state.user) {
        db.collection("users")
        .doc(this.state.user)
        .collection("purchases")
        .orderBy("createdAt")
        .onSnapshot(snapshot => {
          const temps = [];
          snapshot.forEach(doc => {
            temps.push({
              id: doc.id,
              purchaseLocation: doc.data().purchaseLocation,
              purchaseAmount: doc.data().purchaseAmount,
              createdAt: doc.data().createdAt,
              purchaseCategory: doc.data().purchaseCategory
            });
          });
          console.log("purchases set from get purchases action");
          console.log(temps);
          commit("setPurchases", temps.reverse());
        });
      }
      else {
        commit("setPurchases", ["null"]);
      }
    },
    deletePurchase({ commit }, purchaseObject) {
      // deletePurchase: function(purchaseId) {
      //   db.collection("users")
      //   .doc(this.user.uid)
      //   .collection("purchases")
      //   .doc(purchaseId)
      //   .delete();
      // },
      if (this.state.user) {
        console.log("here");
        console.log(purchaseObject);
        db.collection("users")
        .doc(this.state.user)
        .collection("purchases")
        .doc(purchaseObject.id)
        .delete();
      }
      commit("setStatus", "success");
    },
    fetchCategories({ commit }) {
      if (this.state.user) {
        db.collection("users")
        .doc(this.state.user)
        .collection("categories")
        .orderBy("category")
        .onSnapshot(snapshot => {
          const temps = [];
          snapshot.forEach(doc => {
            temps.push({
              id: doc.id,
              category: doc.data().category
            });
          });
          console.log(temps);
          commit("setCategories", temps);
        });
      }
      else {
        commit("setCategories", ["null"]);
      }
    },
  },
  modules: {
  }
})
