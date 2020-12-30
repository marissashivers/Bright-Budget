import { vuexfireMutations } from 'vuexfire'
const mutations = {
    ...vuexfireMutations,
    setUser(state, payload) {
        state.user = payload;
    },
    setCategories(state, payload) {
        state.categories = payload;
    },
    setPurchases(state, payload) {
        state.purchases = payload;
    },
    setError(state, payload) {
        state.error = payload;
    },
};

export default mutations;