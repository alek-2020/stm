<template>
  <button class="btn tableBtn"
          :style="{backgroundImage: 'url(' + btnBg + ')'}"
          v-on:click='changeActiveTable(index);'
          @dblclick="inputActivate">
    <div class="tableBtn__nameBg"
         v-bind:class="{'tableBtn__nameBg_active': activeTableIndex === index && !inputActive }">
      <!-- input для вывода названия -->
      <input :class="{'tableBtn__input_active':inputActive}"
             class="tableBtn__input"
             type="text"
             ref="tableBtnInput"
             :disabled="!inputActive"
             v-model="table.name"
             @focusout='changeTableTitle(table.name)'
             @keyup.enter='changeTableTitle(table.name)'>
    </div>
  </button>
</template>


<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      inputActive: false
    };
  },
  props: ["table", "index", "ifLasBtn"],
  methods: {
    ...mapActions([
      "updateActiveTable",
      "changeTableTitle",
      "pushActiveTableLink"
    ]),
    // Активируем инпут для редактирования заголовка стола
    inputActivate() {
      this.inputActive = true;
      window.addEventListener("click", this.checkOuterClick);
    },

    // Отслеживаем внешний клик, что бы выключить активный инпут
    checkOuterClick(el) {
      if (el.target != this.$refs.tableBtnInput) {
        this.inputActive = false;
        window.removeEventListener("click", this.checkOuterClick);
      }
    },

    // Переключаем стол на текущий
    changeActiveTable(index) {
      // Запишем индекс во vuex
      this.$store.state.activeTableIndex = index;
      // Пишем на сервер активный индекс
      this.updateActiveTable(index);
      // Пушим новую ссылку
      this.pushActiveTableLink();
    },

    // Корректировка названия стола
    changeTableTitle(NewName) {
      const TableId = this.table.id;
      this.changeTableTitle({ NewName, TableId });
    }
  },
  computed: {
    ...mapState(["activeTableIndex", "themes"]),

    // Фон для кнопки
    btnBg() {
      return this.themes[this.table.themeIndex].imgBg;
    }
  }
};
</script>


<style lang="scss">
.tableBtn {
  //  базовые стили кнопки
  font-family: "Roboto", sans-serif;
  display: inline-block;
  border-radius: 4px;
  padding: 0;
  position: relative;
  outline: none;
  transition: all 1s;
  height: 40px;
  width: 100%;
  background-size: cover;
  background-position: center;
  overflow: hidden;

  &:not(:first-child) {
    margin-top: 5px;
  }

  // Фон для назавния
  &__nameBg {
    background: rgba(0, 0, 0, 0.5);
    height: 100%;
    margin: 0 0 0 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: margin 0.3s 0.3s;
    &_active {
      margin: 0 0 0 40px;
    }
  }
  // инпут внутри кнопки
  &__input {
    height: calc(100% - 6px);
    width: calc(100% - 6px);
    border-radius: 2px;
    padding: 0 8px 0 25px;
    border-right: none;
    outline: none;
    font-size: 14px;
    font-weight: 600;
    border: none;
    background: transparent;
    color: white;
    font-family: "Open Sans", sans-serif;
    white-space: nowrap;
    box-sizing: border-box;
    z-index: 10;
    transition: background 0.6s, margin 0.2s 0.6s;
    &_active {
      background: rgb(255, 255, 255);
      user-select: unset;
      color: #333;
      padding: 0 10px;
    }
  }
}
</style>



