// TODO: Покрутить цвета списков, что бы смотрелись нормально
// TODO: Сделать цвета списков привязанными к заставке, так что при смене они тоже менялись, кроме тех, где юзер поставил свой цвет 

<template>
  <!-- Block fixed -->
  <div class="log__bg"
       v-if="logActive">

    <div class="log__form-block">

      <div class="log__title-block">
        <span class="log__title">
          {{ reg ? 'Регистрация' : 'Авторизация' }}
        </span>
        <span class="log__or">
          или
          <router-link :to='returnLink'
                       @keypress="wipeErrors(); stopSpinner();">{{ reg ? 'Авторизация' : 'Регистрация' }}</router-link>
        </span>
      </div>
      <form class="log__form"
            action=""
            @submit.prevent="submitForm(); runSpinner();">
        <label for="email"
               class="log__input-label log__input-label_mail">
          <input name="email"
                 v-model="email"
                 id="email"
                 type="email"
                 required
                 class="inp__mail"
                 placeholder="Enter your mail"
                 @keypress="wipeErrors">
        </label>

        <label for="password"
               class="log__input-label log__input-label_password">
          <input name="password"
                 v-model="password"
                 id="password"
                 type="password"
                 class="inp__pass"
                 placeholder="Your password"
                 @keypress="wipeErrors">
        </label>

        <button type="submit">
          <span v-if="!spinnerActive">
            {{ reg ? 'Регистрация' : 'Вход' }}
          </span>
          <img v-else
               height="30px"
               src='../../img/spinners/load-spinner-white.svg'>
        </button>

        <RegAuthError>
        </RegAuthError>

      </form>
    </div>
  </div>
</template>

<script>
import * as firebase from "firebase";
import RegAuthError from "./PopupSignInError.vue";

export default {
  data() {
    return {
      //Триггер для включения режима регистрации
      reg: false,
      spinnerActive: false,
      email: "",
      password: "",
      id: "",
      logActive: true,
      blabla: ""
    };
  },
  methods: {
    //включаем спиннер
    runSpinner() {
      this.spinnerActive = true;
    },

    stopSpinner() {
      this.spinnerActive = false;
    },
    //Убираем ошибку
    wipeErrors() {
      this.$store.state.authErrorMessage = "";
    },
    submitForm() {
      this.reg ? this.onSignUp() : this.onSignIn();
    },
    onSignIn() {
      const t = this;
      //Перед авторизацией делаем сессию бесконечной
      firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(function() {
          return firebase
            .auth()
            .signInWithEmailAndPassword(t.email, t.password);
        })
        .then(user => {
          const newUser = {
            id: user.user.uid
          };
          this.$store.state.userId = newUser.id;
          this.$store.dispatch("linksHandler", { link: this.route });
          //Раз все ок грузим данные и переходим в столы
          this.$store.dispatch("firstFetchingData");
          this.$store.state.appRouteLog.push(
            "routeHandler - вызываем послу авторизации"
          );
          this.$store.dispatch("linksHandler", { toLink: "/" });
        })
        .catch(error => {
          this.$store.state.authErrorMessage = error.message;
          this.stopSpinner();
          console.log("Это провал. Ошибка: ", error);
        });
    },
    onSignUp() {
      //Создаем юзера в файрбазе
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(user => {
          this.$store.state.userId = user.uid;
          //Сейвим стандартный бг
          this.$store.dispatch("saveBg");

          //Раз все ок грузим данные и переходим в столы
          this.$store.dispatch("firstFetchingData");
          this.$store.state.appRouteLog.push(
            "routeHandler - вызываем послу авторизации"
          );
          this.$store.dispatch("linksHandler", { toLink: "/" });
        })
        .catch(error => {
          console.log("Полный провал. Ошибка: ", error);
          this.$store.state.authErrorMessage = error.message;
          this.stopSpinner();
        });
    },
    enableRegMode() {
      //Если компонент появился на стр регистрации
      if (this.route == "/registration/") {
        this.reg = true;
      } else {
        this.reg = false;
      }
    }
  },

  mounted() {},
  watch: {
    route: {
      handler: "enableRegMode",
      immediate: true
    }
  },
  computed: {
    returnLink() {
      if (this.reg) {
        return "/login/";
      } else {
        return "/registration/";
      }
    },
    userIdmeth() {
      return this.$store.state.userIdBro;
    },
    getUserData() {
      return this.store.commit("getUser");
    },
    authorised() {
      return this.$store.state.authorised;
    },
    route() {
      return this.$route.path;
    }
  },
  components: {
    RegAuthError
  }
};
</script>

<style lang="scss">
.log {
  &__bg {
    position: fixed;
    height: 100vh;
    width: 100vw;
    background-color: #000000ad;
    z-index: 1000;
    top: 0;
    left: 0;
    display: flex;
  }

  &__form-block {
    background: #fff;
    width: 450px;
    max-width: 95%;
    min-width: 300px;
    height: auto;
    display: flex;
    margin: auto;
    border-radius: 3px;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 15px;
    box-sizing: border-box;
    font-family: "Open Sans", sans-serif;
    color: #3c3c3c;
    position: relative;
    transition: height 2s;
  }

  &__form {
    display: flex;
    flex-direction: column;
    width: 60%;
    min-width: 250px;

    & > *:not(:first-child) {
      margin-top: 15px;
    }

    & button {
      height: 50px;
      width: 100%;
      font-size: 17px;
      font-weight: 500;
      border: none;
      background: linear-gradient(135deg, #d11111, #f97714);
      color: white;
      border-radius: 7px;
      margin-top: 22px !important;
    }
  }

  &__title-block {
    display: flex;
    flex-direction: column;
    text-align: center;
    margin-bottom: 20px;
  }

  &__title {
    font-family: "Roboto", sans-serif;
    font-size: 25px;
    font-weight: 600;
  }

  &__cancel {
    height: 15px;
    width: 15px;
    position: absolute;
    top: 10px;
    right: 10px;

    & svg {
      height: 100%;
      width: 100%;
      fill: #808080;
    }

    &:hover svg {
      fill: #a1a1a1;
    }
  }
}

.log__form input {
  height: 40px;
  width: 100%;
  border-radius: 3px;
  border: solid 1px #bebebe;
  box-sizing: border-box;
  padding-left: 40px;
  /*Отступ для центрирования по большим символам*/
  padding-top: 4px;
  font-size: 18px;
  outline: none;

  &:hover {
    border: solid 1px gray;
  }

  &:focus {
    border: solid 1px gray;
  }
}

.log__input-label {
  position: relative;
  &:before {
    content: "";
    display: block;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    top: 50%;
    transform: translateY(-50%);
    left: 8px;
    position: absolute;
    height: 60%;
    width: 25px;
  }
}

.log__input-label_mail:before {
  background-image: url("/img/icons/envelope.svg");
}

.log__input-label_password:before {
  background-image: url("/img/icons/padlock.svg");
}
</style>


