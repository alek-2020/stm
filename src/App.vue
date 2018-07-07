<template>
  <div id="app">
    <meta name="viewport" content="width=device-width, initial-scale=1 , maximum-scale=1.0, user-scalable=no">
    
    
    <div
      :style="{ 'background': 'url(' + currentBgImg + ')'}"
      class="bg" 
    >
    </div>

    <stmHeader v-if="authorised"></stmHeader>
    <tableList v-if="authorised"></tableList>
    <!-- <TestFirebase></TestFirebase>   -->
    <!-- <SignIn></SignIn> -->
    <!-- <SignOut></SignOut> -->
    <!-- <router-view></router-view> -->
    <router-view name="LogReg"></router-view>
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
import tableList from "./components/TableList/TableList.vue";
import SignUp from "./components/UserPage/SignUp.vue";
import SignIn from "./components/UserPage/SignIn.vue";
import TestFirebase from "./components/ServerData/TestFirebase.vue";
import stmHeader from "./components/Header/Header.vue";
import SignOut from "./components/UserPage/LogOut.vue";
import TableContent from "./components/Table/Table.vue";

import * as firebase from "firebase";

// import test from "./OtherSrc/svg";

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
    TestFirebase,
    SignOut,
    TableContent
  },

  computed: {
    ...mapGetters({
      currentBgImg: "currentBgImg"
    }),
    authorised() {
      return this.$store.state.authorised;
    }
    // getAllTasks() {
    //   // this.$store.dispatch('altGetUserFB')
    //  }
  },
  methods: {},
  created() {
    //  this.getAllTasks
    //  this.$store.dispatch('testbro');
    const t = this;
    //Проверяем юзера на наличие авторизации
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log("User is signed in", firebase.auth().currentUser.uid);

        t.$store.state.userId = firebase.auth().currentUser.uid;
        let url = t.$route.params.link;
        t.$store.state.activeTableUrl = url;
        t.$store.dispatch("startGetTasks");
        t.$store.state.authorised = true;
        console.log("User is signed in", firebase.auth().currentUser.uid);
     
     } else {
        console.log("No user is signed in");
        t.$store.state.currentBgImg = '/img/bg/stm-bg-2.jpg';
        t.$router.replace('/login/');
      }
    });
  },
  mounted() {}
};
</script>

<style lang="scss">
@import "scss/bootsParts/custom/stm-bootsParts";
@import "scss/normalize";

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

@media all and (max-width: 480px) {
  .t-header__profile,
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
