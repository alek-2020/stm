<template>

<button
  class="btn desk-btns__one"
  v-bind:style="{ 'background' : 'linear-gradient( to bottom, ' + table.colorOne + ', ' + table.colorTwo }"
  v-bind:class="{'desk-btns__last': ifLasBtn}"
  v-bind:id=" 'tableBtn-' + table.BtnId"
  v-on:click = 'changeActiveTable(index); changeUrl(table.tableUrl)'
  @dblclick="tableActivation"
  >

      <!-- input для вывода названия -->
      <input 
      :class="{'desk-btns__input_active':inputActive}"
      class="desk-btns__input" 
      type="text"
      ref="tableBtnInput"
      :disabled="!inputActive"
      placeholder=""
      v-model="table.name"
      @focusout='changeTableTitle(table.name)'
      @keyup.enter='changeTableTitle(table.name)'
      > 


      <!-- span для определения ширины адаптивного inputa -->
      <!-- <span class="desk-btns__inp-buffer"
      ref="inpBuffer">{{ table.name }}</span>
       -->

      <!-- рамка для активной кнопки  -->
      <div 
      v-bind:class="{'desk-btns__one-active': actTableInd === index }"
      :style="{'border-color': table.colorOne}"
      ></div>

</button>

</template>


<script>

export default ({
  data() {
    return {
      inputActive: false,
      // gradients: [
      //   {
      //     colId: 1,
      //     colorOne: "#d24242",
      //     colorTwo: "#af4242"
      //   },
      //   {
      //     colId: 2,
      //     colorOne: "#f85725",
      //     colorTwo: "#8a5e41"
      //   },
      //   {
      //     colId: 3,
      //     colorOne: "#e15656",
      //     colorTwo: "#825a5a"
      //   },
      //   {
      //     colId: 4,
      //     colorOne: "#8fb554",
      //     colorTwo: "#5b917d"
      //   },
      //   {
      //     colId: 5,
      //     colorOne: "#2a2a39",
      //     colorTwo: "#535472"
      //   },
      //   {
      //     colId: 6,
      //     colorOne: "#535472",
      //     colorTwo: "#2a2a39"
      //   },
      //   {
      //     colId: 7,
      //     colorOne: "#582121",
      //     colorTwo: "#bf3737"
      //   }
      // ] //,
    };
  },
  props: ["table", "index", "ifLasBtn"],
  methods: {
    tableActivation() {
      let t = this;
      console.log("Раз");
      this.inputActive = true;
      window.addEventListener("click", this.checkOuterClick);
    },
    checkOuterClick(el) {
      console.log("Идентифkkикатор", el);
      if (el.target != this.$refs.tableBtnInput) {
        console.log("Идентификатор", el.target != this.$refs.headerInput, el);
        this.inputActive = false;
        window.removeEventListener("click",  this.checkOuterClick);
      }
    },
    changeUrl(url) {
      this.$store.dispatch('linksHandler', { toLink: `/table/${url}` });
    },

    changeActiveTable(index) {
      this.$store.state.activeTableIndex = index;
      //пишем на сервер index стола
      this.$store.dispatch('updateActiveTable', index);
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
});
</script>


<style lang="scss">
.desk-btns {
  //  базовые стили кнопки
  &__one {
    padding: 0 6px;
    font-family: "Roboto", sans-serif;
    background: linear-gradient(to bottom, #d24242, #af4242);
    display: inline-block;
    border-radius: 4px;
    color: white;
    position: relative;
    border: none;
    outline: none;
    min-width: 50px;
    transition: all 1s;
    height: 40px;

    &:not(:first-child) {
      margin-left: 10px;
    }
  }

  // стили последнего элемента()
  &__last {
    min-width: 10px;
    overflow: hidden;
    margin-right: -25px;
  }

  // &:last-child{
  //     width: 1px;
  // }

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
    /*            display: none;*/
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



