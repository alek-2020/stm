<template>
  <div class="settings-block">
    <div
     class="onePreview"
     v-for="(bg, index) in imgForBg"
     :key="index"
     @click="changeBg(index)"
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
      }
  }
}
</script>


<style lang="scss">
  .settings-block {
      width: 100%;
      height: 100px;
      background: rgba(255, 255, 255, 0.3);
  
      display: flex;
      
  }

  .onePreview {
      height: 100px;
      width: 100px;
      background-size: contain;
      background-position: center;
      
  }
</style>
