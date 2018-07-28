import Vue from 'vue'
import router from './Router.js'
import App from './App.vue'
import * as firebase from 'firebase'
import { store  } from './store'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

new Vue({
  el: '#app',
  router,
  store,
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


  //Привязываем роутер к Vue
  // new Vue({
  //   el: '#app',
  //   Router,
  //   render: h => h(App)
  // });
