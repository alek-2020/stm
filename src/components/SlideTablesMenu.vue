/* Входные параметры компонента:
 *** paddingTop - отступ сверху
 ***
*/

<template>
  <div class="slideMenu"
       :style="{ height: `calc(100vh - ${paddingTop}px)`, top: paddingTop + 'px'}">
  </div>
</template>

<script>
export default {
  data: function() {
    return {};
  },
  props: {
    paddingTop: String
  }
};
</script>

<style lang="scss">
@import "../scss/helpers/_variables.scss";

.slideMenu {
  //   height: calc(100vh - 40px);
  width: 200px;
  background: white;
  position: absolute;
  //   top: 40px;
  left: 0;
  z-index: $zi-slideMenu;
  box-shadow: 0 0 13px rgba(0, 0, 0, 0.25);
}
</style>
