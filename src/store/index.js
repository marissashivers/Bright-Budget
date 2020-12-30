import Vue from "vue";
import Vuex from "vuex";
import mutations from "./mutations";
import actions from "./actions";
import getters from "./getters";

Vue.use(Vuex);

const initialState = () => {
  return { 
    user: null, 
    error: null 
  };
};

export default new Vuex.Store({
  state: initialState(),
  mutations: mutations,
  actions: actions,
  getters: getters
});