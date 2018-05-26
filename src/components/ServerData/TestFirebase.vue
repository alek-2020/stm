<template>
  <div>

      <!-- Потестим отправку на сервер
      <button @click="pushData()">Пушим</button>
      <button @click="getData()">Тащим</button>
      
      {{ dataFromServer }}
      
      <input type="text" :v-model= one>
      <input type="text" :v-model="two">
      <input type="text" :v-model="three">
      <input type="text" :v-model="four">
          {{ one }}{{ two, three. four }}
      Получим с сервака -->

  </div>
</template>

<script>
import * as firebase from "firebase";

export default {
  data() {
    return {
      one: "",
      two: "",
      three: "",
      four: "",
      dataFromServer: []
    };
  },
  methods: {
    pushData: function() {
      firebase
        .database()
        .ref("tables")
        .push("table")
        .then(data => {
          console.log("Это успех! ", data);
        })
        .catch(error => {
          console.log("Полный провал! ", error);
        });
    },

    getData: function() {
      firebase
        .database()
        .ref("tables")
        .once("value")
        .then(data => {
          this.dataFromServer = data.val();
          console.log("Это успех! ", data);
        })
        .catch(error => {
          console.log("Полный провал! ", error);
        });
    }
  }
};
</script>

