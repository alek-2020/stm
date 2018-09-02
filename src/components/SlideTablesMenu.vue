/* Входные параметры компонента:
 *** paddingTop - отступ сверху
 ***
*/

<template>
  <div class="slideMenu"
       :style="{ height: `calc(100vh - ${paddingTop}px)`, top: paddingTop + 'px'}"
       :class="{slideMenu_active: active}">
  </div>
</template>

<script>
export default {
  data: function() {
    return {};
  },
  props: {
    paddingTop: String,
    active: Boolean
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
    }
  }
};
</script>

<style lang="scss">
@import "../scss/helpers/_variables.scss";

.slideMenu {
  width: 250px;
  background: white;
  position: absolute;
  transform: translateX(-100%);
  transition: transform 0.4s;
  left: 0;
  z-index: $zi-slideMenu;
  box-shadow: 0 0 13px rgba(0, 0, 0, 0.25);
  &_active {
    transform: translateX(0);
  }
}
</style>
