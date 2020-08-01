import Vue from 'vue'
import Vuex from 'vuex'
//mport { db } from './firebase';
import { auth, db } from '../firebase';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userProfile: {},
  },
  getters: {
  },
  mutations: {
    setUserProfile(state, val) {
      state.userProfile = val
    },
  },
  actions: {
    async login({ dispatch }, form) {
      // sign user in
      const { user } = await auth.signInWithEmailAndPassword(form.email, form.password)

      // fetch user profile and set in state
      dispatch('fetchUserProfile', user)
    },
    async fetchUserProfile({ commit }, user) {
      // fetch user profile
      const userProfile = await db.collection("users").doc(user.uid).get()

      // set user profile in state
      commit('setUserProfile', userProfile.data())
      
      // change route to home
      this.$router.push('/')
    }
  },
  modules: {
  }
})
