import { createStore } from 'vuex';

export default createStore({
  state: {
    user: null,
  },

  // Change state
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
  },

  // Functions that call mutations (resolvers in gql)
  actions: {
    setUser({ commit }, user) {
      commit('SET_USER', user);
    },
  },
  modules: {
  },
});
