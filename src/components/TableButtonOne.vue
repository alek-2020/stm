<template>

  <button class="btn tableBtn"
          v-bind:style="{ 'background' : 'linear-gradient( to bottom, ' + table.colorOne + ', ' + table.colorTwo }"
          v-bind:class="{'tableBtn__last': ifLasBtn}"
          v-on:click='changeActiveTable(index); changeUrl(table.tableUrl)'
          @dblclick="tableActivation">

    <!-- input для вывода названия -->
    <input :class="{'tableBtn__input_active':inputActive}"
           class="tableBtn__input"
           type="text"
           ref="tableBtnInput"
           :disabled="!inputActive"
           placeholder=""
           v-model="table.name"
           @focusout='changeTableTitle(table.name)'
           @keyup.enter='changeTableTitle(table.name)'>

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
  padding: 0 6px;
  font-family: "Roboto", sans-serif;
  display: inline-block;
  border-radius: 4px;
  color: Gray;
  position: relative;
  outline: none;
  transition: all 1s;
  height: 40px;
  width: 100%;

  &:not(:first-child) {
    margin-top: 5px;
  }

  // инпут внутри кнопки
  &__input {
    height: 76%;
    border-radius: 4px;
    padding: 0 8px;
    border-right: none;
    outline: none;
    font-size: 16px;
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

  // буффер для инпута
  &__inp-buffer {
    font-size: 16px;
    font-weight: 600;
    font-family: "Open Sans", sans-serif;
    white-space: nowrap;
    position: absolute;
    top: -1000px;
    left: -1000px;
    visibility: hidden;
  }

  // стили для рамки активной кн.
  &__one-active {
    position: absolute;
    border: solid 2px #cb4242;
    height: calc(100% + 8px);
    width: calc(100% + 8px);
    top: -4px;
    left: -4px;
    border-radius: 7px;
    box-sizing: border-box;
    //Что бы не перекрывала инпут задвигаем кнопку назад
    z-index: -1;
  }
}
</style>



