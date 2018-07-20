<template>
  <!-- Block fixed -->
  <div class="log__bg"
  v-if="logActive"> 

      <div class="log__form-block">

            <div class="log__cancel"
              v-if="authorised"
              @click="goBack">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 95.939 95.939" style="enable-background:new 0 0 95.939 95.939;" xml:space="preserve"><g>	<path d="M62.819,47.97l32.533-32.534c0.781-0.781,0.781-2.047,0-2.828L83.333,0.586C82.958,0.211,82.448,0,81.919,0   c-0.53,0-1.039,0.211-1.414,0.586L47.97,33.121L15.435,0.586c-0.75-0.75-2.078-0.75-2.828,0L0.587,12.608   c-0.781,0.781-0.781,2.047,0,2.828L33.121,47.97L0.587,80.504c-0.781,0.781-0.781,2.047,0,2.828l12.02,12.021   c0.375,0.375,0.884,0.586,1.414,0.586c0.53,0,1.039-0.211,1.414-0.586L47.97,62.818l32.535,32.535   c0.375,0.375,0.884,0.586,1.414,0.586c0.529,0,1.039-0.211,1.414-0.586l12.02-12.021c0.781-0.781,0.781-2.048,0-2.828L62.819,47.97   z" /></g></svg>
            </div> 

            <div class="log__title-block">
                <span class="log__title">
                    Авторизация
                </span>
                <span class="log__or">
                    или <router-link to="/registration/"
                         @keypress="wipeErrors(); stopSpinner();"
                         >Регистрация</router-link>
                </span>  
            </div>
      <form class="log__form" action="" 
       @submit.prevent="onSignIn(); runSpinner();">
        <input 
        name="email"
        label="Mail"
        v-model="email"
        id="email"
        type="email"
        required
        class="inp__mail"
        placeholder="Enter your mail"
        @keypress="wipeErrors">


        <input 
        name="password"
        label="Password"
        v-model="password"
        id="password"
        type="password"
        class="inp__pass"
        placeholder="Your password"
        @keypress="wipeErrors">


        <button type="submit">
            <span
             v-if="!spinnerActive">Вход</span>
            <img
             v-else
             height="30px" src='../../img/spinners/load-spinner-white.svg'>
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
    onSignIn() {
      // vuex

      console.log({ email: this.email, ConfirmPassword: this.confirmPassword });
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
            //this.registerelM
          };
          console.log("Авторизовались, все ОК", newUser.id);
          this.$store.state.userId = newUser.id;
          console.log("Получили UserData по Id ");

          //Раз все ок грузим данные и переходим в столы
          this.$store.dispatch("startGetTasks");
          // this.$router.push("/table/");
          this.$store.dispatch("linksHandlier");
          // console.log('Авторизашка после авторизашки', firebase);
        })
        .catch(error => {
          this.$store.state.authErrorMessage = error.message;
          this.stopSpinner();
         console.log("Это провал. Ошибка: ", error);
       
       });
    },
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    }
  },
  computed: {
    userIdmeth() {
      return this.$store.state.userIdBro;
    },
    getUserData() {
      return this.store.commit("getUser");
    },
    authorised() {
      return this.$store.state.authorised;
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


