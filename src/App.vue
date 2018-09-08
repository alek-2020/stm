// FIXME: Поправить ширину назавния рс в хедере, что бы значки не уезжали за границы узкого экрана
// FIXME: После добавления каждой задачи вылезаем ошибка добаления задачи
// FIXME: Изменить надписи в инпутах, поставить placeholders
// TODO: Лоадер на плюс при добавлении задачи


<template>
  <div id="app">
    <!-- Фон -->
    <AppBg />
    <!-- Хедер -->
    <stmHeader v-if="authorised"></stmHeader>
    <!-- Авторизация -->
    <router-view name="LogReg"></router-view>
    <!-- Блок со списками -->
    <router-view name="TableContent"
                 v-if="authorised"></router-view>
    <!-- Критическая ошибка -->
    <router-view name="bigError"
                 v-if="authorised"></router-view>
    <!-- Окна сообщений -->
    <GoodBadNewsMessage/>
    <!-- Спиннер загрузки задач -->
    <BigLoadingSpinner :active="tasksAreLoadingNow" />
  </div>
</template>

<script>
import GoodBadNewsMessage from "./components/MessageNewsGoodBad.vue";
import stmHeader from "./components/Header.vue";
import BigLoadingSpinner from "./components/BigLoadingSpinner.vue";
import AppBg from "./components/AppBg.vue";

import * as firebase from "firebase";

import { mapState, mapActions } from "vuex";

export default {
  name: "app",

  components: {
    stmHeader,
    GoodBadNewsMessage,
    BigLoadingSpinner,
    AppBg
  },

  computed: {
    ...mapState([
      "activeTableIndex",
      "allTasks",
      "tasksAreLoadingNow",
      "authorised"
    ])
  },

  methods: {
    ...mapActions(["authHandle"])
  },

  created() {
    // Проверка статуса авторизации и запись данных юзера
    this.authHandle();
  }
};
</script>

<style lang="scss">
@import "scss/main.scss";

*,
*:after,
*:before {
  box-sizing: border-box;
}

button,
input {
  outline: none;
}

#app {
  display: flex;
  flex-direction: column;
  height: 100%;
}

html {
  min-width: 300px;
  height: 100%;
}
body {
  padding: 0;
  margin: 0;
  height: 100%;
}

ul {
  list-style-type: none;
}

a {
  color: #42b983;
}
</style>
