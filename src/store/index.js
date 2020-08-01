import Vue from 'vue'
import Vuex from 'vuex'
//mport { db } from './firebase';
import { auth } from '../firebase';
import { router } from '../router/index'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
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
    error(state) {
      return state.error;
    }
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
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
  },
  actions: {
    signUpAction({ commit }, payload) {
      commit('setStatus', 'loading')
      auth.createUserWithEmailAndPassword(payload.email, payload.password)
      .then((response) => {
        // respones will have user
        // user will have uid and will be updated in state
        commit('setUser', response.user.uid)
        commit('setStatus', 'success')
        commit('setError', null)
      })
      .catch((error) => {
        commit('setStatus', 'failure')
        commit('setError', error.message)
      })
    },
    signInAction({ commit }, payload) {
      auth.signInWithEmailAndPassword(payload.email, payload.password)
      .then((response) => {
        commit('setUser', response.user.uid);
        commit('setStatus', 'success');
        commit('setError', null);
        console.log("here")
      })
      .catch((error) => {
        commit('setStatus', 'failure')
        commit('setError', error.message)
      })
      router.replace('/');
    },
    signOutAction({ commit }) {
      auth.signOut()
      .then(() => {
        commit('setUser', null);
        commit('setStatus', 'success');
        commit('setError', null);
        router.push("/login");
      })
      .catch((error) => {
        commit('setStatus', 'failure');
        commit('setError', error.message);
      })
    }
  },
  modules: {
  }
})
