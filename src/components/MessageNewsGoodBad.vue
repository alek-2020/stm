<template>
  <div>
    <transition 
        name="fade">
        <div class="goodNews"
            v-if="goodNewsMes.length > 1">
        {{ goodNewsMes }}
        </div>
    </transition>

    <transition 
        name="fade">
        <div class="badNews"
            v-if="badNewsMes.length > 1">
            {{ badNewsMes }}
        </div>
    </transition>
  </div>
</template>

<script>
export default {
  computed: {
    goodNewsMes() {
      return this.$store.state.goodNewsMes;
    },
    badNewsMes() {
      return this.$store.state.badNewsMes;
    }
  }
};
</script>

<style lang="scss">
.goodNews {
  color: #3c763d;
  background-color: #dff0d8;
  border-color: #d6e9c6;
  padding-right: 35px;
  padding: 8px 15px;
  border: 1px solid transparent;
  // border-radius: 4px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.badNews {
  color: #a94442;
  background-color: #f2dede;
  border-color: #ebccd1;
  padding-right: 35px;
  padding: 8px 15px;
  border: 1px solid transparent;
  // border-radius: 4px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>

