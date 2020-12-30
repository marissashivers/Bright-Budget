const getters = {
    getUser(state) {
        return state.user;
    },
    isUserAuth(state) {
        return !!state.user;
    },
    getCategories(state) {
        return state.categories;
    },
    getPurchases(state) {
        return state.purchases;
    },
    getError(state) {
        return state.error;
    }
};
  
  export default getters;