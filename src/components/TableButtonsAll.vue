<template>
  <div class="desk-btns"
       :class="{smoothScroll: !mouseDownForScroll}">
    <VuePerfectScrollbar class="desk-btns__rel-cont">
      <!-- Отслеживание драга мышью -->
      <div class="desk-btns__cont"
           @mousedown="mDownOnTableList"
           @mousemove="mMoveOnTableList"
           @mouseout="stopScroll"
           @mouseup="stopScroll">

        <!-- кнопка привязанная к РС -->
        <TableListOne v-for="(table, index) in showAllTasks"
                      :key="index"
                      :index='index'
                      :table='table'
                      :ifLasBtn='LastBtn' />

        <!--  добавление РС-->
        <div class=" btn desk-btns__add btn_icon_add-white btn_icon_only"
             v-on:click="AddTableBtn"
             v-bind:style="{ 'background' : addBtnBg }">
        </div>
      </div>
    </VuePerfectScrollbar>
  </div>
</template>

<script>
//скролл
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import TableListOne from "./TableButtonOne.vue";
import { functions } from "firebase";

export default {
  data() {
    return {
      //настройки для скролла
      settings: {
        maxScrollbarLength: 60,
        minScrollbarLength: 200,
        suppressScrollX: true,
        suppressScrollY: true
      },
      tableList: "",
      LastBtn: false,
      initialPosForScroll: "",
      initialScroll: "",
      mouseDownForScroll: false
    };
  },

  methods: {
    AddTableBtn: function() {
      this.$store.dispatch("addNewTable");
    },
    mDownOnTableList(e) {
      this.initialPosForScroll = e;
      const container = document.querySelector(".ps-container");
      this.initialScroll = container.scrollLeft;
      this.mouseDownForScroll = true;
    },

    mMoveOnTableList(e) {
      if (this.mouseDownForScroll) {
        let diff = this.initialPosForScroll.pageX - e.pageX;
        let container = document.querySelector(".ps-container");
        container.scrollLeft = this.initialScroll + diff;
      }
    },
    stopScroll() {
      this.mouseDownForScroll = false;
    },
    OutStopScroll() {},
    //для скролла
    scrollHanle(evt) {},

    getAllBtns() {},

    getTableList() {
      firebase
        .database()
        .ref("users/" + "BjRdscIcrsdy4u4RNqCDb7DDTpj1")
        .once("value")
        .then(data => {
          this.tableList = data;
        })
        .catch(error => {
          console.log("Не получили ", error);
        });
    },

    getTableBtnId: function() {
      let lastEl = this.tables.length - 1;
      let lastId = this.tables[lastEl].BtnId;
      //Если это первы рабочий стол
      if (typeof lastId == "undefined") {
        //ставим 0 исходя из того, что добавим 1 в return
        lastId = 0;
      }
      return lastId + 1;
    },
    getColId: function() {
      //Получим последнюю кнопку
      let lastTableEl = this.tables.length - 1;
      //Получим id цвета на этой кнопке
      let lastTableId = this.tables[lastTableEl].colorId;
      if (
        lastTableId >= this.gradients.length ||
        typeof lastTableId == "undefined"
      ) {
        //ставим 0 исходя из того, что добавим 1 в return
        lastTableId = 0;
      }

      return lastTableId;
    },
    delTable: function() {
      var spliceRes = this.tables.splice(this.activeTable, 1);

      this.addTable();
    },
    ifLastBtn(Index) {
      if (this.tables.length === index + 1 && !this.plusActive) {
        LastBtn = true;
      } else {
        LastBtn = true;
      }
    }
  },

  components: {
    TableListOne,
    VuePerfectScrollbar
  },

  computed: {
    //Индекс текучего рабочего стола
    activeTableIndComp() {
      return this.$store.state.activeTableIndex;
    },

    //Подгрузка cупер JSON для вывода столов
    showAllTasks() {
      return this.$store.state.allTasks;
    },
    plusActive() {
      return this.$store.state.plusActive;
    },
    lastTableColor() {
      return this.$store.dispatch("lastTableColor");
    },
    addBtnBg() {
      if (this.showAllTasks.length > 0) {
        return (
          "linear-gradient( to bottom, " +
          this.showAllTasks[this.showAllTasks.length - 1].colorOne +
          ", " +
          this.showAllTasks[this.showAllTasks.length - 1].colorTwo +
          ")"
        );
      } else {
        return (
          "linear-gradient( to bottom, " +
          this.gradients[1].colorOne +
          ", " +
          this.gradients[1].colorTwo +
          ")"
        );
      }
    },
    gradients() {
      return this.$store.state.gradients;
    }
  }
};
</script>

    
<style lang="scss">
.desk-btns {
  position: relative;

  &__add {
    height: 40px;
    width: 40px;
    margin-left: 10px;
    border-radius: 4px;
  }

  &__cont {
    padding: 7px;
    display: flex;
    position: absolute;
    top: 7px;
    left: 0;

    /*
            & *:not(:first-child) {
                margin-left: 10px;
            }
*/
  }

  &__rel-cont {
    position: relative;
    width: 100%;
    overflow-x: scroll;
    overflow-y: hidden;
    height: 68px;
  }

  &__apply {
    &:before {
      content: "";
      display: block;
      position: absolute;
      background-image: url(/src/img/icons/success.svg);
      background-size: 50%;
      background-position: center;
      background-repeat: no-repeat;
      width: 100%;
      height: 100%;
    }
  }

  /////////////////////////
  // КАСТОМИЗАЦИЯ СКРОЛЛА
  /////////////////////////

  ////////ОБЫЧНОЕ СОТОЯНИЕ

  //Область скролла
  & .ps.ps--active-x > .ps__scrollbar-x-rail {
    display: block;
    background-color: #ffffff31;
    height: 5px;
    transition: height 0.3s;
    opacity: 1;
    border-radius: 0;
  }

  //скроллбар
  & .ps.ps--active-x > .ps__scrollbar-x-rail > .ps__scrollbar-x {
    background-color: #ffffff4b;
    height: 5px;
    transition: height 0.3s;
    // opacity: 1;
    border-radius: 0;
    bottom: 0;
  }

  ////////HOVER

  //Область скролла
  & .ps.ps--active-x > .ps__scrollbar-x-rail:hover {
    height: 10px;
    transition: height 0.2s;
    background-color: #ffffff31;
  }

  //скроллбар
  & .ps:hover > .ps__scrollbar-x-rail:hover > .ps__scrollbar-x {
    height: 10px;
    // padding: 0;
    background-color: rgba(255, 255, 255, 0.6);
    opacity: 1;
    border-radius: 0;
    bottom: 0;
  }

  //////АCTIVE

  & .ps__scrollbar-x-rail {
    top: -1px;
  }
  //область скролла
  & .ps:hover.ps--in-scrolling.ps--x > .ps__scrollbar-x-rail {
    background-color: #ffffff31;
    opacity: 1;
  }

  //скроллбар

  &
    .ps:hover.ps--in-scrolling.ps--x
    > .ps__scrollbar-x-rail
    > .ps__scrollbar-x {
    background-color: rgba(255, 255, 255, 0.6);
    opacity: 1;
  }

  //////АCTIVE NOT HOVER

  //область скролла
  & .ps.ps--in-scrolling.ps--x > .ps__scrollbar-x-rail {
    background-color: #ffffff31;
    opacity: 1;
    height: 10px;
  }

  //скроллбар

  & .ps.ps--in-scrolling.ps--x > .ps__scrollbar-x-rail > .ps__scrollbar-x {
    background-color: rgba(255, 255, 255, 0.6);
    opacity: 1;
    height: 10px;
  }

  //Сделано через родителя, потому что иначе перебиваются настройки плагина
  & .smoothScroll .desk-btns__rel-cont {
    scroll-behavior: smooth;
  }
}
</style>

