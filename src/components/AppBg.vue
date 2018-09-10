<template>
    <transition name="fade"
                mode="out-in">
        <div :style="{ 'background': 'url(' + currentBgImg + ')'}"
             class="appBg"></div>
    </transition>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["activeTableIndex", "themes", "allTasks"]),

    // Картинка фона стола
    currentBgImg() {
      const currentTable = this.allTasks[this.activeTableIndex];
      const themeIndex = currentTable ? currentTable.themeIndex : 0;
      return this.themes[themeIndex].imgBg;
    }
  }
};
</script>

<style lang="scss">
.appBg {
  background-size: cover !important;
  background-position: center !important;
  background-repeat: no-repeat !important;
  position: fixed;
  width: 100vw;
  height: 100vh;
  z-index: -1;
}
</style>

