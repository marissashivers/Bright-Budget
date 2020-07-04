import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    counter: 0
  },
  getters: {
    doubleClicks: state => {
      return state.counter * 2;
    }
  },
  mutations: {
    increment: state => {
      state.counter++;
    }
  },
  actions: {
  },
  modules: {
  }
})
