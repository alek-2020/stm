<template>
  <div id="app">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,600,700|Roboto:400,500,700&amp;subset=cyrillic" rel="stylesheet">    
    
    <div
      :style="{ 'background': 'url(' + currentBgImg + ')'}"
      class="bg" 
    >
    </div>

    <stmHeader></stmHeader>
    <tableList></tableList>
    <TestFirebase></TestFirebase>  
    <!-- <SignIn></SignIn> -->
    <!-- <SignOut></SignOut> -->
    <!-- <router-view></router-view> -->
    <router-view name="TableContent"></router-view>
    <router-view name="LogReg"></router-view>
   <TableContent></TableContent> 
    <!-- <router-view name="NotFoundComponent"></router-view> -->

  <!-- <button
   @click="test">
      test
  </button> -->
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

// import test from "./OtherSrc/svg";

import { mapGetters } from 'vuex'

export default {
  name: "app",
  data() {
    return {
    };
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
      currentBgImg: 'currentBgImg'
    }),
  // getAllTasks() {
  //   // this.$store.dispatch('altGetUserFB')
  //  }
  },
  methods: {

  },
  created() {
    //  this.getAllTasks
          //  this.$store.dispatch('testbro');

      this.$store.dispatch('startGetTasks');

 }
}
</script>

<style lang="scss">

@import 'scss/bootsParts/bootsParts';
@import 'scss/normalize';

#app {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

html {
  min-width: 300px;
}
body {
  padding: 0;
  margin: 0;
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
</style>
