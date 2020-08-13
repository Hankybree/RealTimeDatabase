import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'

import LogIn from './components/LogIn.vue'
import LikeComment from './components/LikeComment.vue'

import { actions } from './scripts/actions.js'

Vue.use(VueRouter)
Vue.use(Vuex)

const router = new VueRouter({
  routes: [
    { component: LogIn, path: '/' },
    { component: LikeComment, path: '/likecomment'}
  ]
})

const store = new Vuex.Store({
  state: {
    socket: null,
    images: []
  },
  mutations: {
    setSocket(state, newSocket) {
      state.socket = newSocket
    },
    setImages(state, newImages) {
      state.images = newImages
    }
  },
  actions: actions
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
