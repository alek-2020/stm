<template>
  <button
  @click="LogOut()">Прочь</button>
</template>

<script>
import * as firebase from 'firebase'

export default {
  data() {
      return {

      }
  },
  methods: {
      LogOut() {
          firebase.auth().signOut()
      }
  }
}
</script>

