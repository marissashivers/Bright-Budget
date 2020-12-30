import { vuexfireMutations } from 'vuexfire'
const mutations = {
    ...vuexfireMutations,
    setUser(state, payload) {
        state.user = payload;
    },
    setCategories(state, payload) {
        state.categories = payload;
        console.log("categories set in mutations");
    },
    setPurchases(state, payload) {
        state.purchases = payload;
        console.log("purchases set in mutations");
    },
    setError(state, payload) {
        state.error = payload;
    },
};

export default mutations;