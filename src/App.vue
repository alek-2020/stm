// FIXME: Поправить ширину назавния рс в хедере, что бы значки не уезжали за границы узкого экрана
// FIXME: После добавления каждой задачи вылезаем ошибка добаления задачи
// FIXME: Изменить надписи в инпутах, поставить placeholders
// TODO: Лоадер на плюс при добавлении задачи


<template>
  <div id="app">
    <meta name="viewport" content="width=device-width, initial-scale=1 , maximum-scale=1.0, user-scalable=no">
    
    <!-- Фон -->
    <transition
    name="fade"
    mode="out-in">
      <div
        :style="{ 'background': 'url(' + currentBgImg + ')'}"
        class="bg" 
      ></div>
    </transition>

    <transition
      name="fade"
      mode="out-in">
       <stmHeader v-if="authorised"></stmHeader>
    </transition>

    <transition
      name="fade"
      mode="out-in">
        <tableList v-if="authorised"></tableList>
    </transition>

    <!-- Авторизация -->
    <transition
    name="fade"
    mode="out-in">
      <router-view name="LogReg"></router-view>
    </transition>

    <transition
      name="fade"
      mode="out-in">
       <router-view name="TableContent"  v-if="authorised"></router-view>
    </transition> 

   <!-- <TableContent></TableContent>  -->

    <!-- <router-view name="NotFoundComponent"></router-view> -->

  <!-- <button
   @click="test">
      test
  </button> -->

  <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,600,700|Roboto:400,500,700&amp;subset=cyrillic" rel="stylesheet">    

  </div>
</template>

<script>
import tableList from "./components/TableButtonsAll.vue";
import SignUp from "./components/PopupSignUp.vue";
import SignIn from "./components/PopUpSignIn.vue";
import stmHeader from "./components/Header.vue";
import TableContent from "./components/TableBody.vue";

import * as firebase from "firebase";

import { mapGetters } from "vuex";

export default {
  name: "app",
  data() {
    return {};
  },
  components: {
    tableList,
    SignUp,
    SignIn,
    stmHeader,
    TableContent
  },

  computed: {
    ...mapGetters({
      currentBgImg: "currentBgImg",
      authorised: "authorised"
    })
  },
  methods: {},
  created() {
    const t = this;
    //Проверяем юзера на наличие авторизации
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        t.$store.state.userId = firebase.auth().currentUser.uid;
        let url = t.$route.params.link;
        t.$store.state.activeTableUrl = url;
        t.$store.dispatch("startGetTasks");
        t.$store.state.authorised = true;
        console.log("User is signed in", firebase.auth().currentUser.uid);
      } else {
        console.log("No user is signed in");
        t.$store.state.currentBgImg = "/img/bg/stm-bg-2.jpg";
        //Засейвим фон
        t.$router.replace("/login/");
      }
    });
  },
  mounted() {}
};
</script>

<style lang="scss">
@import "scss/main.scss";

*,
*:after,
*:before {
  box-sizing: border-box;
}

button,
input {
  outline: none;
}

#app {
  display: flex;
  flex-direction: column;
  height: 100%;
}

html {
  min-width: 300px;
  height: 100%;
}
body {
  padding: 0;
  margin: 0;
  height: 100%;
}

h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.bg {
  background-size: cover !important;
  background-position: center !important;
  background-repeat: no-repeat !important;
  position: fixed;
  width: 100vw;
  height: 100vh;
  z-index: -1;
}

// @media all and (max-width: 480px) {
//   .t-header__profile,
//   .btn-filter {
//     display: none !important;
//   }
// }

@media all and (max-width: 480px) {
  .btn-filter {
    display: none !important;
  }
}

///Transition
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
