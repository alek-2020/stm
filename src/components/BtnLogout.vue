<template>
  <div to="/login"
       @click="logOut()"
       class="btnLogOut">
    <svg xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 59.886 59.886"
         v-html="logoutIcon"
         :style="{ fill: iconColor }">
    </svg>
  </div>
</template>

<script>
export default {
  data() {
    return {
      logoutIcon:
        '<defs></defs><path  d="M52.868,0H7.018A7.026,7.026,0,0,0,0,7.018v9.357H4.679V7.018A2.342,2.342,0,0,1,7.018,4.679h45.85a2.342,2.342,0,0,1,2.339,2.339v45.85a2.342,2.342,0,0,1-2.339,2.339H7.018a2.342,2.342,0,0,1-2.339-2.339V43.511H0v9.357a7.026,7.026,0,0,0,7.018,7.018h45.85a7.026,7.026,0,0,0,7.018-7.018V7.018A7.026,7.026,0,0,0,52.868,0Z"/><g transform="translate(0 15.406)"><path  d="M28.072,131.716l-3.308,3.308,8.889,8.889H0v4.679H33.653l-8.889,8.889,3.308,3.308,14.537-14.537Z" transform="translate(0 -131.716)"/></g>'
    };
  },
  methods: {
    //Выход
    logOut() {
      this.$store.dispatch("logOut");
    }
  },
  props: {
    iconColor: String
  }
};
</script>

<style lang="scss">
.btnLogOut {
  display: flex;
  justify-content: center;
  align-items: center;
  & svg {
    height: 20px;
    width: auto;
  }
}
</style>
