//TODO: Оформить страницу 404

<template>
  <div>
    <div class="t-header">

      <!-- Кнопка выезжающего меню -->
      <BtnIconTile :iconColor="iconsColor"
                   class="t-header__slideMenuBtn  btn-bg-white" />

      <!-- Блок с названием и настройками стола -->
      <div class="t-header__name-box"
           @mouseover="showSettingsBtn"
           @mouseout="hideSettingsBtn">

        <HeaderName />
        <BtnTableSettings :visible="tableSettingsBtnVisible"
                          :active="tableSettingsActive"
                          @click.native="showTableSettings" />
        <BtnDelActiveTable :visible="tableSettingsActive"
                           @click.native="askConfirmForDelete()" />

      </div>

      <!-- Выход из учетной записи -->
      <BtnLogout class="t-header__logout btn-bg-white"
                 :iconColor="iconsColor" />
    </div>

    <!-- Выбор темы оформления -->
    <HeaderSettingsBox :active="tableSettingsActive" />

    <!-- Окно подтверждения удаления РС -->
    <ConfirmationWindow :askConfirm="askConfirm"
                        @confirmResponse="delTable">
      <div slot="message">
        Confirm removing table
      </div>
      <div slot="messageTwo">
        Delete
      </div>
      <div slot="action">
        Delete
      </div>
    </ConfirmationWindow>

  </div>
</template>

<script>
import HeaderSettingsBox from "./HeaderSettings.vue";
import ConfirmationWindow from "./PopupConfirmation.vue";
import BtnIconTile from "./BtnIconTile.vue";
import HeaderName from "./HeaderName.vue";
import BtnLogout from "./BtnLogout.vue";
import BtnDelActiveTable from "./BtnDelActiveTable.vue";
import BtnTableSettings from "./BtnTableSettings.vue";
import HeaderSettingsVue from "./HeaderSettings.vue";

import * as firebase from "firebase";

export default {
  data() {
    return {
      activeTableName: "Название стола",
      ThreeDotsActive: false,
      askConfirm: false
    };
  },
  methods: {
    // Показать кнопку открытия настроек стола
    showSettingsBtn() {
      this.$store.state.tableSettingsVisible = true;
    },
    // Скрыть кнопку открытия настроек стола
    hideSettingsBtn() {
      this.$store.state.tableSettingsVisible = false;
    },
    // Показать настройки стола
    showTableSettings() {
      console.log("Покажем настройки");

      this.$store.state.tableSettingsActive = !this.$store.state
        .tableSettingsActive;
    },
    // Переключение состояния правого меню
    ActivateDots() {
      this.ThreeDotsActive = !this.ThreeDotsActive;
      var a = this.ThreeDotsActive;
    },
    // Включение окна подтвержения удаления
    askConfirmForDelete() {
      this.askConfirm = true;
    },
    // Удаление стола
    delTable(val) {
      if (val) {
        this.$store.dispatch("delActiveTable");
      }
      this.askConfirm = false;
    }
  },
  computed: {
    // Цвет иконок в хедере
    iconsColor() {
      return "gray";
    },
    // Состояние настроек(открыти или нет)
    tableSettingsActive() {
      return this.$store.state.tableSettingsActive;
    },
    // Видимость кнопки настроек
    tableSettingsBtnVisible() {
      return this.$store.state.tableSettingsVisible;
    }
  },
  components: {
    HeaderSettingsBox,
    ConfirmationWindow,
    BtnIconTile,
    HeaderName,
    BtnLogout,
    BtnDelActiveTable,
    BtnTableSettings
  }
};
</script>

<style lang="scss">
@import "../scss/helpers/_variables.scss";

.t-header {
  height: 40px;
  width: 100%;
  min-width: 300px;
  background: rgba(255, 255, 255, 0.85);
  display: flex;
  align-items: center;
  position: relative;
  z-index: $zi-header;
  box-shadow: 0 0 13px rgba(0, 0, 0, 0.25);

  &__slideMenuBtn {
    margin-left: 10px;
  }

  &__logout {
    margin-right: 10px;
  }

  &__name-box {
    position: relative;
    flex-grow: 1;
    display: flex;
  }
}

.btn-bg-white {
  position: relative;
  width: 30px;
  height: 30px;
  background: $h-icons-bg-col;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>


