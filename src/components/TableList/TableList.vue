<template>
  <div class="desk-btns">
    <div class="desk-btns__rel-cont">
      <div class="desk-btns__cont">
                        
              <!-- удаление активного РС -->
              <button
              v-on:click="delTable">DEL
              </button>

    
              
              <!-- кнопка привязанная к РС -->
              <TableListOne
              v-for="(table, index) in showAllTasks"
              :key="index"
              :index = 'index'
              :table = 'table'

              :ifLasBtn = 'LastBtn'
              > </TableListOne>
                
              <!--  добавление РС-->
              <!-- <div class="desk-btns__add"
              v-on:click="AddTableBtn"
              v-bind:class = "{'desk-btns__apply': plusActive}"
              v-bind:style="{ 'background': lastTableColor() }"
              ></div> -->
              
      </div>
    </div>

     <!-- <div class="add-list__bg add-table"
      @click="AddTableBtn">
         <img src="../../../img/icons/add-plus-button.svg"
          class='add-list__img'
         >
     </div>  -->

      <!--  добавление РС-->
      <div class="desk-btns__add"
        @click="AddTableBtn"
        v-bind:class = "{'desk-btns__apply': plusActive}"
        v-bind:style="{ 'background': lastTableColor() }"
      ></div>


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

//vuex
import { store } from "../../store";

import TableListOne from "./TableListOneBtn.vue";
// import * as firebase from "firebase";

export default Vue.extend({
  data() {
    return {
      tableList: "",
      plusActive: false,
      LastBtn: false,
      tables: [
        {
          BtnId: 243,
          name: "Название стола",
          colOne: "#fff",
          colTwo: "#ccc",
          colorId: "4"
        },
        {
          BtnId: 2453,
          name: "Название стола",
          colOne: "#fff",
          colTwo: "#ccc",
          colorId: "4"
        },
        {
          BtnId: 23435,
          name: "Название стола",
          colOne: "#fff",
          colTwo: "#ccc",
          colorId: "4"
        },
        {
          BtnId: 223,
          name: "Название стола",
          colOne: "#fff",
          colTwo: "#ccc",
          colorId: "4"
        }
      ],
        gradients: [
                {
                    colId: 1,
                    colorOne: "#d24242",
                    colorTwo: "#af4242"
                },
                {
                    colId: 2,
                    colorOne: "#f85725",
                    colorTwo: "#8a5e41"
                },
                {
                    colId: 3,
                    colorOne: "#e15656",
                    colorTwo: "#825a5a"
                },
                {
                    colId: 4,
                    colorOne: "#8fb554",
                    colorTwo: "#5b917d"
                },
                {
                    colId: 5,    
                    colorOne: "#2a2a39",
                    colorTwo: "#535472"
                },
                {
                    colId: 6,
                    colorOne: "#535472",
                    colorTwo: "#2a2a39"
                },
                {
                    colId: 7,
                    colorOne: "#582121",
                    colorTwo: "#bf3737"
                }  
            ]
    };
  },

  methods: {
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
    AddTableBtn: function() {
      //Если плюс активен, то пушим
      if (this.plusActive) {
        this.pushNewTable();
      }

      this.plusActive = !this.plusActive;
    },
    lastTableColor() {
      var i = this.tables.length - 1;
      var colOne = this.tables[i].colorOne;
      var colTwo = this.tables[i].colorTwo;
      console.log("linear-gradient( to bottom, " + colOne + ", " + colTwo);

      return "linear-gradient( to bottom, " + colOne + ", " + colTwo;
    },


    pushNewTable: function() {
      // let lastColId = this.getColId();
      const lastColId = 3;

      // const newTableBtn = {
      //   name: this.newTableName,
      //   colorOne: this.gradients[lastColId].colorOne,
      //   colorTwo: this.gradients[lastColId].colorTwo,
      //   colorId: lastColId + 1
      // };
      
            const newTableBtn = {
        name: 'Это стол Брат',
        colorOne: this.gradients[lastColId].colorOne,
        colorTwo: this.gradients[lastColId].colorTwo,
        colorId: lastColId + 1
      };

      //Запускаем последовательный процесс добавления стола
      this.$store.dispatch('pushNewTable', newTableBtn)
      // console.log(this.newTableName);
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
    TableListOne
  },

  computed: {
    //Индекс текучего рабочего стола
    activeTableIndComp() {
      return this.$store.state.activeTableIndex;
    },

    //Подгрузка cупер JSON для вывода столов
    showAllTasks() {
      return this.$store.state.allTasks;
    }
  }
});
</script>

    
<style lang="scss">
.desk-btns {
  &__cont {
    padding: 10px;
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    

    /*
            & *:not(:first-child) {
                margin-left: 10px;
            }
*/
  }

  &__rel-cont {
    position: relative;
    width: calc(100% - 70px);
    border: solid;
    overflow-x: scroll;
    overflow-y: hidden;
    height: 80px;

  }

  &__add {
    height: 40px;
    min-width: 40px;
    border-radius: 7px;
    font-size: 20px;
    border: none;
    background-color: #ee5727;
    z-index: 1000;
    position: relative;
    margin-left: 10px;
    transition: all 0.7s;

    &:before {
      content: "";
      display: block;
      position: absolute;
      background-image: url(/src/img/icons/add.svg);
      background-size: 50%;
      background-position: center;
      background-repeat: no-repeat;
      width: 100%;
      height: 100%;
    }
  }

  &__apply {
    margin-left: -10px;

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


       
    .desk-btns {
        &__add {
            height: 40px;
            min-width: 40px;
            border-radius: 7px;
            font-size: 20px;
            border: none;
            background-color: #ee5727;
            z-index: 1000;
            position: relative;
            margin-left: 10px;
            transition: all .7s;
            position: absolute;
            top: 10px;
            right: 10px;

            &:before {
                content: '';
                display: block;
                position: absolute;
                background-image: url(../../../img/icons/add-task.svg); 
                background-size: 50%;
                background-position: center;
                background-repeat: no-repeat;
                width: 100%;
                height: 100%;
             }
            }
        }
</style>

