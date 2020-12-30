const mutations = {
    setUser(state, payload) {
        state.user = payload;
    },
    setError(state, payload) {
        state.error = payload;
    }
};

export default mutations;