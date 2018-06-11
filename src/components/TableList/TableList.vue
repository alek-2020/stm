<template>
  <div class="desk-btns"
       :class="{smoothScroll: !mouseDownForScroll}"
  >
    <VuePerfectScrollbar  class="desk-btns__rel-cont" 
     >
     <!-- mousemove нужно сделать по докменту, что бы перетаскивание на сбрабывалось при выходе из области элемента -->
      <div class="desk-btns__cont"
      @mousedown="mDownOnTableList"
      @mousemove="mMoveOnTableList"
      @mouseout="stopScroll"
      @mouseup="stopScroll"

>
                        
              <!-- удаление активного РС -->
              <!-- <button
              v-on:click="delTable">DEL
              </button>
               -->
               <!-- <button
               style="position: fixed; top: 0; left: 0;"
              v-on:click="altDragTableList">BRO
              </button> -->

               
              <!-- кнопка привязанная к РС -->
              <TableListOne
              v-for="(table, index) in showAllTasks"
              :key="index"
              :index = 'index'
              :table = 'table'

              :ifLasBtn = 'LastBtn'
              > </TableListOne>
                
              <!--  добавление РС-->
              <div class="desk-btns__add btn btn_icon_add-white btn_icon_only"
              v-on:click="AddTableBtn"
              v-bind:class = "{'desk-btns__apply': plusActive}"
              ></div>
                            <!-- v-bind:style="{ 'background': lastTableColor() }" -->

              
      </div>
    </VuePerfectScrollbar >

     <!-- <div class="add-list__bg add-table"
      @click="AddTableBtn">
         <img src="../../../img/icons/add-plus-button.svg"
          class='add-list__img'
         >
     </div>  -->




      <!-- <TableListOne
        v-for="(Btn, index) in tableList"
        v-bind:key="index" 
        @click="test2"
        :Btn = Btn
        :Index = index>
      </TableListOne>   -->

    <!-- <button
     @click='getTableList'>
     ПОЛУЧАЕМ БАЗУ
     </button> -->
     <!-- {{ tableList }} -->

  </div>
</template>


<script>
import Vue from "vue";

//скролл
import VuePerfectScrollbar from 'vue-perfect-scrollbar'


//vuex
import { store } from "../../store";

import TableListOne from "./TableListOneBtn.vue";
import { functions } from "firebase";
// import * as firebase from "firebase";

export default Vue.extend({
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
      initialPosForScroll: '',
      initialScroll: '',
      mouseDownForScroll: false
     
     
    };
  },

  methods: {

        AddTableBtn: function() {
      this.$store.dispatch("checkTableInput");

    },
    mDownOnTableList(e) {
        console.log('down-down', e);
        this.initialPosForScroll = e;
        const container = document.querySelector('.ps-container');
        this.initialScroll = container.scrollLeft;
        this.mouseDownForScroll = true;
 
    },

    mMoveOnTableList(e) {
      if(this.mouseDownForScroll) {
        let diff = this.initialPosForScroll.pageX - e.pageX;
        let container = document.querySelector('.ps-container');
        container.scrollLeft = this.initialScroll + diff;
                console.log('move', diff);
      }
    },
    stopScroll() {
      
      this.mouseDownForScroll = false;
      console.log('hi')
    },
    OutStopScroll() {

    },
    //   altDragTableList() {
    //   // const list = document.getElementById('ball');
    //   let container = document.querySelector('.ps-container');

    //  container.scrollLeft += 50;
    //   console.log('v', container.scrollLeft);
    // },
    //для скролла
    scrollHanle(evt) {
      console.log(evt)
    },

    getAllBtns() {},
    test2() {
      console.log("А тут Ок!");
    },
    getTableList() {
      firebase
        .database()
        .ref("users/" + "BjRdscIcrsdy4u4RNqCDb7DDTpj1")
        .once("value")
        .then(data => {
          console.log("Получили ", data);
          this.tableList = data;
        })
        .catch(error => {
          console.log("Не получили ", error);
        });
    },





    getTableBtnId: function() {
      let lastEl = this.tables.length - 1;
      let lastId = this.tables[lastEl].BtnId;
      //console.log('id последнего элемента ', lastId, '. Его номер ', lastEl);
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
      // let lastId = this.gradients[lastEl].colId;
      //console.log('выведем ', lastTableId);
      //console.log(typeof(lastTableId) == "undefined");
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
      console.log("Массив до удаления ", this.tables);
      var spliceRes = this.tables.splice(this.activeTable, 1);
      console.log(
        "Массив после удаления ",
        this.tables,
        " Удаленные строки ",
        spliceRes
      );
      this.addTable();
    },
    ifLastBtn(Index) {
      if (this.tables.length === index + 1 && !this.plusActive) {
        LastBtn = true;
      } else {
        LastBtn = false;
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
        return this.$store.dispatch('lastTableColor');
    }
  },
  

});
</script>

    
<style lang="scss">
.desk-btns {
  position: relative;

  &__add {
    background: rgb(134, 134, 134);
    height: 40px;
    width: 40px;
    margin-left: 10px;
    border-radius: 7px;
  } 

  &__cont {
    padding: 10px;
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
    height: 80px;
    // scroll-behavior: smooth;

  }


  &__apply {
    // margin-left: -10px;

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
}



/////////////////////////
// КАСТОМИЗАЦИЯ СКРОЛЛА
/////////////////////////

////////ОБЫЧНОЕ СОТОЯНИЕ

//Область скролла
.ps.ps--active-x >
.ps__scrollbar-x-rail {
    display: block;
    background-color: #ffffff31;
    height: 5px;
    transition: height .3s;
    opacity: 1;
    border-radius: 0;
}

//скроллбар
.ps.ps--active-x >
.ps__scrollbar-x-rail >
.ps__scrollbar-x {
    background-color: #ffffff4b;
    height: 5px;
    transition: height .3s;
    // opacity: 1;
    border-radius: 0;
    bottom: 0;
}


////////HOVER

//Область скролла
.ps.ps--active-x >
.ps__scrollbar-x-rail:hover {
   height: 10px;
   transition: height .2s;
    background-color: #ffffff31;
}

//скроллбар
.ps:hover >
.ps__scrollbar-x-rail:hover >
.ps__scrollbar-x {
    height: 10px;
    // padding: 0;
    background-color: rgba(255, 255, 255, 0.6);
    opacity: 1;
    border-radius: 0;
    bottom:0
}


//////АCTIVE

.ps__scrollbar-x-rail {
  top: -1px;
}
//область скролла
.ps:hover.ps--in-scrolling.ps--x > 
.ps__scrollbar-x-rail {
   background-color: #ffffff31;
   opacity: 1;
}

//скроллбар

.ps:hover.ps--in-scrolling.ps--x >
.ps__scrollbar-x-rail >
.ps__scrollbar-x {
    background-color: rgba(255, 255, 255, 0.6);
    opacity: 1;
}


//////АCTIVE NOT HOVER

//область скролла
.ps.ps--in-scrolling.ps--x > 
.ps__scrollbar-x-rail {
   background-color: #ffffff31;
   opacity: 1;
   height: 10px;
}

//скроллбар

.ps.ps--in-scrolling.ps--x >
.ps__scrollbar-x-rail >
.ps__scrollbar-x {
    background-color: rgba(255, 255, 255, 0.6);
    opacity: 1;
}

//Сделано через родителя, потому что иначе перебиваются настройки плагина
.smoothScroll .desk-btns__rel-cont{
    scroll-behavior: smooth;
}

</style>

