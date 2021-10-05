import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

/* ----------------------------------------------------------------------------------------
state等同於data
mutations是改變state的方法，但只能同步更新
大部分都是靠actions採用非同步方式，呼叫mutations更新

mutations也可以透過同步方式直接取得回傳值
const { funcArray } = await store.dispatch('user/getInfo')

取state值，大部分都在computed中進行：
computed: {
  doneTodosCount () {
    return this.$store.state.todos.filter(todo => todo.done).length
  }
}

可以通过让 getter 返回一个函数，来实现给 getter 传参。在你对 store 里的数组进行查询时非常有用。
getters: {
  // ...
  getTodoById: (state) => (id) => {
    return state.todos.find(todo => todo.id === id)
  }
}
> store.getters.getTodoById(2) // -> { id: 2, text: '...', done: false }

更多介紹：https://vuex.vuejs.org/zh/guide/getters.html

其實，原來的專案很少在使用state的非同步更新資訊！！
比較常使用localStorage

window.localStorage.setItem('isShowVersion', false)
let preVersion = window.localStorage.getItem('Version')
---------------------------------------------------------------------------------------- */

/* ---------------------------
state 唯一数据源，如果vue的data
--------------------------- */
const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: []
}

/* -----------------------------------------
mutations
类似于事件，更改狀態的唯一方法就是提交 mutation
每个 mutation 都有一个字符串的 事件类型 (type) 和 一个 回调函数 (handler)，并且它会接受 state 作为第一个参数
-> [types.USER_INFO](state, userInfo) 的userInfo才是要傳遞的第一個參數，state當成是固定規則

用store.commit提交mutations
不能异步操作
----------------------------------------- */
const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

/* -----------------------------------------
actions
类似于 mutation不同在于：
Action 提交的是 mutation，而不是直接变更状态。
Action 可以包含任意异步操作。

元件中透過dispatch呼叫的是actions，再由actions透過commit('xxx', result)呼叫mutations
通過store.dispatch觸發
-> this.$store.dispatch("setUserInfo", this.userInfo);
----------------------------------------- */
const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      console.log('username:' + username)
      console.log('password:' + password)

      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { roles, name, avatar, introduction } = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
