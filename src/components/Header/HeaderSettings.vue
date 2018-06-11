<template>
  <div class="settings-block"
    :class="{'settings-block_active': tableSettingsActive}">
    <div
     class="onePreview"
     v-for="(bg, index) in imgForBg"
     :key="index"
     @click="changeBg(index); saveBg();"
     :style="{background: 'url('+bg+')'}">
    </div>    
  </div>
</template>

<script>
export default {
  data() {
      return {
          imgForBg: [
              '/img/bg/stm-bg-2.jpg',
              '/img/bg/stm-bg-1.jpg',
              '/img/bg/stm-bg-3.jpg',
              '/img/bg/stm-bg-1.jpg',
              '/img/bg/stm-bg-2.jpg'
          ]
      }
  }, 
  methods: {
      changeBg(index) {
        console.log('Работает');
        this.$store.state.currentBgImg = this.imgForBg[index];
        console.log( 'ВАСЯ!!!!!!!', this.$store.state.currentBgImg);
      },
      saveBg() {
        this.$store.dispatch('saveBg');
      }
  },
  computed: {
    tableSettingsActive() {
      return this.$store.state.tableSettingsActive;
    }
  }
}
</script>


<style lang="scss">
  .settings-block {
      width: 100%;
    //   height: 100px;
      max-height: 0;
      transition: max-height .4s;
      overflow: hidden;
      background: rgba(255, 255, 255, 0.3);
      display: flex;

      &_active {
        max-height: 500px;
      }
      
  }

  .onePreview {
      height: 100px;
      width: 100px;
      background-size: contain;
      background-position: center;
      
  }
</style>
