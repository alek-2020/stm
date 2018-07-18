<template>
   <transition
      name="fade">
        <div class="log__error"
          v-if="authErrorMessage.length > 0">
           {{ authErrorMessage }}
        </div>
    </transition>
</template>

<script>
export default {
    computed: {
        authErrorMessage() {
          return this.$store.state.authErrorMessage;
        }
    }
}
</script>

<style lang="scss">

    .log__error {
        text-align: center;
        color: #d81e1e;
        font-family: 'Open Sans', sans-serif;
        line-height: 1.4;
    }
    
</style>

