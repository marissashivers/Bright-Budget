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
    budgets: [],
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
    budgets(state) {
      return state.budgets;
    }
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
    setBudgets(state, payload) {
      state.budgets = payload;
    }
  },
  actions: {
    signUpAction({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('setStatus', 'loading')
        auth.createUserWithEmailAndPassword(payload.email, payload.password)
        .then((response) => {
          // respones will have user
          // user will have uid and will be updated in state
          commit('setUser', response.user.uid)
          commit('setDisplayName', response.user.displayName)
          commit('setStatus', 'success')
          commit('setError', null)
          console.log("signed up");
          resolve(response);
        })
        .catch((error) => {
          commit('setStatus', 'failure')
          commit('setError', error.message)
          console.log("sign up failed...");
          reject(error);
        })
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
          console.log("signed in");
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
        console.log("signed out");
      })
      .catch((error) => {
        commit('setStatus', 'failure');
        commit('setError', error.message);
      })
    },
    fetchPurchases({ commit }) {
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
          commit("setPurchases", temps.reverse());
        });
      }
      else {
        commit("setPurchases", ["null"]);
      }
    },
    deletePurchase({ commit }, purchaseObject) {
      if (this.state.user) {
        db.collection("users")
        .doc(this.state.user)
        .collection("purchases")
        .doc(purchaseObject.id)
        .delete();
        commit("setStatus", "success");
        console.log("purchase deleted");
      }
    },
    addPurchase({ commit }, purchaseObject) {
      if (this.state.user) {
        db.collection("users")
        .doc(this.state.user)
        .collection("purchases")
        .add({
          purchaseLocation: purchaseObject.purchaseLocation,
          purchaseAmount: Number(purchaseObject.purchaseAmount),
          createdAt: purchaseObject.createdAt,
          purchaseCategory: purchaseObject.purchaseCategory
        });
        commit("setStatus", "success");
        console.log("purchase added");
      }
    },
    editAndSavePurchase({ commit }, purch) {
      if (this.state.user) {
        db.collection("users")
        .doc(this.state.user)
        .collection("purchases")
        .doc(purch.id)
        .update({
          purchaseLocation: purch.purchaseLocation,
          purchaseAmount: Number(purch.purchaseAmount),
          createdAt: purch.createdAt,
          purchaseCategory: purch.purchaseCategory
        });
        commit("setStatus", "success");
      }
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
          commit("setCategories", temps);
        });
        console.log("fetchCategories completed");
      }
      else {
        commit("setCategories", ["null"]);
      }
    },
    deleteCategory({ commit }, categoryObject) {
      if (this.state.user) {
        db.collection("users")
        .doc(this.state.user)
        .collection("categories")
        .doc(categoryObject.id)
        .delete();
      }
      console.log("category deleted");
      commit("setStatus", "success");
    },
    addCategory({ commit }, cat) {
      if (this.state.user) {
        db.collection("users")
        .doc(this.state.user)
        .collection("categories")
        .add({
          category: cat
        });
        console.log("category added");
        commit("setStatus", "success");
      }
    },
    fetchBudgets({ commit }) {
      if (this.state.user) {
        db.collection("users")
        .doc(this.state.user)
        .collection("budgets")
        .orderBy("budgetCategory")
        .onSnapshot(snapshot => {
          const temps = [];
          snapshot.forEach(doc => {
            temps.push({
              id: doc.id,
              budgetCategory: doc.data().budgetCategory,
              budgetAmount: doc.data().budgetAmount
            });
          });
          commit("setBudgets", temps);
        });
        console.log("fetchBudgets completed");
      }
      else {
        commit("setBudgets", ["null"]);
      }
    },
    addBudget({ commit }, budgetObject) {
      if (this.state.user) {
        db.collection("users")
        .doc(this.state.user)
        .collection("budgets")
        .add({
          budgetAmount: Number(budgetObject.budgetAmount),
          budgetCategory: budgetObject.budgetCategory
        });
        console.log("budget added");
        commit("setStatus", "success");
      }
    },
    deleteBudget({ commit }, budgetObject) {
      if (this.state.user) {
        db.collection("users")
        .doc(this.state.user)
        .collection("budgets")
        .doc(budgetObject.id)
        .delete();
        console.log("budget deleted");
        commit("setStatus", "success");
      }
    },
    editAndSaveBudget({ commit }, budgetObject) {
      if (this.state.user) {
        db.collection("users")
        .doc(this.state.user)
        .collection("budgets")
        .doc(budgetObject.id)
        .update({
          budgetAmount: budgetObject.budgetAmount,
          budgetCategory: budgetObject.budgetCategory
        });
        console.log("budget edited and saved");
        commit("setStatus", "success");
      }
    }
  },
  modules: {
  }
})
