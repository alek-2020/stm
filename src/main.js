import Vue from 'vue'
import router from './Router.js'
import App from './App.vue'
import * as firebase from 'firebase'
import { store  } from './store'
// import i18n from './i18n.js'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

const messages = {
  en: {
      message: {
          newTable: 'New table',
          newList: 'New list'
      }
  },
  ru: {
      message: {
          newTable: 'Новый стол',
          newList: 'Новый список'
      }
  }
}

const i18n = new VueI18n({
  locale: 'ru', // set locale
  messages, // set locale messages
})

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App),
  created() {
    firebase.initializeApp({
      apiKey: 'AIzaSyC0UItX0OEHtAVGTwVHZnV9kb63KGcdCOQ',
      authDomain: 'stm-14898.firebaseapp.com',
      databaseURL: 'https://stm-14898.firebaseio.com',
      projectId: 'stm-14898',
      storageBucket: 'stm-14898.appspot.com'
    })
  }
})


