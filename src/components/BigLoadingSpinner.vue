<template>
    <transition name="fade">
        <div class="table-load-spinner"
             v-if="active" />
    </transition>
</template>

<script>
export default {
  props: {
    active: Boolean
  }
};
</script>


<style lang="scss">
.table-load-spinner {
  height: 80px;
  width: 80px;
  background: rgba(0, 0, 0, 0.6);
  background-image: url("../../img/spinners/load-spinner-white.svg");
  border-radius: 10px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-repeat: no-repeat;
  background-position: center;
}
</style>
