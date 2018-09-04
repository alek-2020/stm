<template>

  <div class="log__bg">
    <transition>
      <div class="log__form-block">

        <div class="log__title-block">
          <span class="log__title">
            Регистрация
          </span>
          <span class="log__or">
            or
            <router-link to="/login/"
                         @keypress="wipeErrors(); stopSpinner();
                        ">Login</router-link>
          </span>
        </div>

        <form class="log__form"
              action=""
              @submit.prevent="onSignup(); runSpinner();">

          <input name="email"
                 label="Mail"
                 v-model="email"
                 id="email"
                 type="email"
                 required
                 class="inp__mail"
                 placeholder="Enter your mail"
                 @keypress="wipeErrors">

          <input name="password"
                 label="Password"
                 v-model="password"
                 id="password"
                 type="password"
                 class="inp__pass"
                 placeholder="Your password"
                 @keypress="wipeErrors">

          <button type="submit">
            <span v-if="!spinnerActive">Регистрация</span>
            <img v-else
                 height="30px"
                 src='../../img/spinners/load-spinner-white.svg'>
          </button>

          <RegAuthError>
          </RegAuthError>

        </form>
      </div>
    </transition>
  </div>
</template>

<script>
import * as firebase from "firebase";
import RegAuthError from "./PopupSignInError.vue";

export default {
  data() {
    return {
      spinnerActive: false,
      email: "",
      password: "",
      confirmPassword: "",
      id: ""
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
    }
  },
  computed: {
    comparePasswords() {
      return this.password !== this.confirmPassword;
    },
    authorised() {
      return this.$store.state.authorised;
    },
    userId() {
      return this.$store.state.userId;
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
  padding-left: 45px;
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

.inp {
  &__mail {
    background-image: url("/img/icons/envelope.svg");
    background-size: 23px;
    background-position: 10px, 50%;
    background-repeat: no-repeat;
  }

  &__pass {
    background-image: url("/img/icons/padlock.svg");
    background-size: 23px;
    background-position: 10px, 50%;
    background-repeat: no-repeat;
  }
}
</style>


