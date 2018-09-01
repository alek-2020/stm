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
  },
  methods: {
    //Скроллим наш список столов в конец для добавления нового
    //Тут нам нужно бы вызвать хук из скроллера и после прокрутки начать создание стола
    HeaderAdd() {
      this.$store.dispatch("addNewTable");
    },
    //добавление рс
    AddTableBtn: function() {
      // this.$store.state.plusActive = !this.$store.state.plusActive;
      //  this.HeaderAdd();
      this.$store.state.addMenuActive = !this.hPlusActive;
    },
    delTable(val) {
      if (val) {
        this.$store.dispatch("delActiveTable");
      }
      this.askConfirm = false;
    }
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
