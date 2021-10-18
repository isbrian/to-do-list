
const state = {
  testTXT: ''
}

const mutations = {
  SET_TXT: (state, val) => {
    state.testTXT = val
  }
}

const actions = {
  getTXT({ commit }, payload) {
    return new Promise((resolve, reject) => {
      console.log('state:' + JSON.stringify(payload))
      commit('SET_TXT', '測試:' + payload.data)
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
