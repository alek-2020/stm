import Vue from 'vue'
//Router
import router from './Router.js'

// import Router from 'vue-router'
import App from './App.vue'

//импортируем всю байду из firebase
import * as firebase from 'firebase'

//vuex
import { store  } from './store'


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
