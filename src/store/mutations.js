import { vuexfireMutations } from 'vuexfire'
const mutations = {
    ...vuexfireMutations,
    setUser(state, payload) {
        state.user = payload;
    },
    setCategories(state, payload) {
        state.categories = payload;
        console.log("MUTATIONS -- Categories set");
    },
    setPurchases(state, payload) {
        state.purchases = payload;
        console.log("MUTATIONS -- Purchases set");
    },
    setError(state, payload) {
        state.error = payload;
    },
};

export default mutations;