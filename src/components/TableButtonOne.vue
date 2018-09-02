<template>

  <button class="btn tableBtn"
          :style="{backgroundImage: 'url(' + btnBg + ')'}"
          v-bind:class="{'tableBtn__last': ifLasBtn}"
          v-on:click='changeActiveTable(index); changeUrl(table.tableUrl)'
          @dblclick="tableActivation">
    <div class="tableBtn__nameBg">
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
export default {
  data() {
    return {
      inputActive: false
    };
  },
  props: ["table", "index", "ifLasBtn"],
  methods: {
    tableActivation() {
      let t = this;
      this.inputActive = true;
      window.addEventListener("click", this.checkOuterClick);
    },
    checkOuterClick(el) {
      // console.log("Идентифkkикатор", el);
      if (el.target != this.$refs.tableBtnInput) {
        // console.log("Идентификатор", el.target != this.$refs.headerInput, el);
        this.inputActive = false;
        window.removeEventListener("click", this.checkOuterClick);
      }
    },
    changeUrl(url) {
      this.$store.dispatch("linksHandler", { toLink: `/table/${url}` });
    },

    changeActiveTable(index) {
      this.$store.state.activeTableIndex = index;
      //пишем на сервер index стола
      this.$store.dispatch("updateActiveTable", index);
      //Стартуем подгрузку задач, я сказал стартуем
      this.$store.dispatch("startGetTasks");
    },

    changeTableTitle(NewName) {
      const TableId = this.table.id;
      this.$store.dispatch("changeTableTitle", { NewName, TableId });
    }
  },
  computed: {
    actTableInd() {
      return this.$store.state.activeTableIndex;
    },
    btnBg() {
      return this.$store.state.imgForBg[this.table.bgIndex];
    }
  }
  //   ,
  //     watch: {
  //             people(newVal, oldVal) { // watch it
  //               console.log(this.people)}
  //             }
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
  }
  // инпут внутри кнопки
  &__input {
    height: 76%;
    border-radius: 4px;
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
    &_active {
      background: rgb(255, 255, 255);
      user-select: unset;
      color: #6b6b6b;
    }
  }
}
</style>



