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
    { component: LikeComment, path: '/likecomment' }
  ]
})

const store = new Vuex.Store({
  state: {
    socket: null,
    userId: 1,
    message: '',
    currentPage: 1,
    images: []
  },
  mutations: {
    setSocket(state, newSocket) {
      state.socket = newSocket
    },
    setImages(state, newImages) {
      state.images = newImages
    },
    appendImages(state, newImages) {
      newImages.forEach(newImage => {
        if(!state.images.some(image => image.imageId === newImage.imageId)) {
          state.images.push(newImage)
        }
      })
    },
    setMessage(state, newMessage) {
      state.message = newMessage
    },
    setCurrentPage(state, newCurrentPage) {
      state.currentPage = newCurrentPage
      this.$store.dispatch('sendCurrentPage')
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
