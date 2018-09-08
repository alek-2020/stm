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
    ]),

    getRoute() {
      return this.$route.path;
    }
  },

  methods: {
    ...mapActions(["authHandle"]),

    callLinksHandler(link) {
      if (!link) link = this.getRoute;
      this.$store.dispatch("linksHandler", { link });
    }
  },

  created() {
    // Проверка статуса авторизации и запись данных юзера
    this.authHandle();
  },

  watch: {
    $route(to, from) {
      // Отправим урл на проверку
      this.callLinksHandler(to.path);

      //Если в приходил ссылка на конкретный стол, то выполняем смену стола
      //Тут расчет на то, что узер вбил ссылку, но минус в том, что метод будет выполняться и когда мы програмно меняем урл
      if (to.params.link != null) {
        this.$store.dispatch("changeActiveTable", this.$route.params.link);
      } else {
        //если в урле есть table и нет ссылки на конкретный стол, то вставляем сслыку активного стола
        if (to.path.indexOf("/table/") === 0) {
        } else {
          //Пока что ничего не делаем
        }
      }
    },
    //Cледим за изменением активного стола, что бы пушить новый адрес
    activeTableIndex(to) {
      if (this.allTasks[this.activeTableIndex] != null) {
        this.$store.state.appRouteLog.push(
          `Выполняем изменение роута из прослушки индекса стола в App`
        );
        this.$store.dispatch("pushActiveTableLink");
      }
    }
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

h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
