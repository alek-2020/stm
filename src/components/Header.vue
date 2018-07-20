//TODO: Оформить страницу 404

<template>
 <div class="">
  <div class="t-header">

        <!-- <div class="t-header__logo"
            v-html="logoSVG">  
        </div> -->
<div class="desk-btns__group-1">
       <!--  добавление РС-->
      <div class=" btn-bg-white ml-2"
        @click="AddTableBtn();"
         :class = "{'desk-btns__h-add_active': hPlusActive}"
      >
        <div class="desk-btns__h-add"
        v-html="plusIcon"></div>

        <div class=" desk-btns__check-add"
          >
          <div class="btn btn_hover_gray text px-3"
           @click="HeaderAdd();"
          >Новый стол</div>
          <div class="btn btn btn_hover_gray text"
          @click="addList()"
          > Список задач</div>
        </div>

      </div>
              <!-- v-bind:style="{ 'background': lastTableColor() }" -->
      <!-- Кнопка фильтра -->
      <!-- <div class="btn-filter btn-bg-white ml-2" v-html="filterIcon">
      </div> -->
</div>

        <!-- <input class="t-header__search" placeholder="Search"> -->
        
        <div class="t-header__desk-name"
          @mouseover="showSettings"
          @mouseout="hideSettings"
          >
            <div class="t-header__desk-name-abs">
              <div class="actTabName__box">
                <input class="actTabName__inp" type="text"
                  v-model="actTabName"
                  placeholder="Стол"
                   @focusout='changeTableTitle(actTabName)'
                   @keyup.enter='changeTableTitle(actTabName)'>
                <span class="actTabName__buffer">{{ actTabName }}</span>
              </div>

              <div class="table-settings"
                v-html="settingsIcon"
                :class="{ 'table-settings_hidden': !tableSettingsVisible }"
                @click="showTableSettings"
                ></div>
              
              <div class="delTable"
              v-html="deleteIcon"
              :class="{ 'delTable_hidden': !tableSettingsActive }"
              v-on:click="askConfirmForDelete()"              
              ></div>
              
            </div>
        </div>
        
        <!-- <div class="t-header__logout">
            EXIT
        </div> -->
     <div class="desk-btns__group-2 mr-2">
          
          <div to="/login"
           @click="logOut()" 
            class="t-header__profile btn-bg-white"
            v-html="loginIcon">
            <!-- <img src="/img/icons/log-in.svg" alt=""> -->
          </div>

          <!-- <div class="t-header__star"><img src="/img/icons/star.svg" alt=""></div> -->
          
          <!-- <div class="t-header__menu btn-bg-white mx-2"
            @click="ActivateDots"
            >
            <img src="../../../img/icons/more-dots.svg">
                 
                  <ThreeDotsMenu
                  :class="{ 'header-menu_hidden': !ThreeDotsActive }">
                  </ThreeDotsMenu>
          </div> -->

       </div>
    </div>
    

    <HeaderSettings></HeaderSettings>

    <ConfirmationWindow
      :askConfirm="askConfirm"
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
import HeaderSettings from "./HeaderSettings.vue";
import ThreeDotsMenu from "./HeaderDotsMenu.vue";
import ConfirmationWindow from "./PopupConfirmation.vue";

import { svgHeader } from "./../OtherSrc/svg.js";

import * as firebase from 'firebase'

export default {
  data() {
    return {
      // hPlusActive: false,
      activeTableName: 'Название стола',
      logoSVG:
        '<svg fill="#7e7f87" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 41.5 41.5"><defs></defs><path class="a" d="M12.243,16.808l-2.9,2.905,9.338,9.337L39.425,8.3,36.52,5.4,18.675,23.24ZM37.35,20.75a16.6,16.6,0,1,1-16.6-16.6,16.182,16.182,0,0,1,4.565.623l3.32-3.32A25.256,25.256,0,0,0,20.75,0,20.75,20.75,0,1,0,41.5,20.75Z"/></svg>',
      //    activeTableName: 'Стол Василия',
      SVGCross: "<svg></svg>",
      ThreeDotsActive: false,
      // actTabName: "Колбасный Стол",

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
      askConfirm: false,
    }
  },
  methods: {
    //Новый список
    addList() {
      this.$store.dispatch('addTaskList');
    },
    //Выход
    logOut() {
        this.$store.dispatch('logOut');
    },
    ActivateDots() {
      this.ThreeDotsActive = !this.ThreeDotsActive;
      var a = this.ThreeDotsActive;
    },

    showSettings() {
         this.$store.state.tableSettingsVisible = true;
    },
    hideSettings() {
         console.log('Срабатывает mouseout');
         this.$store.state.tableSettingsVisible = false;
        //  this.$store.state.tableSettingsActive = false;
    },

     changeTableTitle(NewName) {
      const TableId = this.$store.state.allTasks[this.$store.state.activeTableIndex].id;
      this.$store.dispatch("changeTableTitle", { NewName, TableId });
    },

    //Скроллим наш список столов в конец для добавления нового
    //Тут нам нужно бы вызвать хук из скроллера и после прокрутки начать создание стола
    HeaderAdd() {
    
      this.$store.dispatch('addNewTable');
   },

    //добавление рс
    AddTableBtn: function() {
    // this.$store.state.plusActive = !this.$store.state.plusActive;
    //  this.HeaderAdd();
     this.$store.state.addMenuActive = !this.hPlusActive;
    },

    //     lastTableColor() {
    //   var i = this.tables.length - 1;
    //   var colOne = this.tables[i].colorOne;
    //   var colTwo = this.tables[i].colorTwo;
    //   console.log("linear-gradient( to bottom, " + colOne + ", " + colTwo);

    //   return "linear-gradient( to bottom, " + colOne + ", " + colTwo;
    // },

    askConfirmForDelete() {
       this.askConfirm = true;
    },
    delTable(val) {
      if(val) {
         this.$store.dispatch("delActiveTable");
      }
      this.askConfirm = false;
    },
    showTableSettings() {
      console.log('Показали настроюшки');
      this.$store.state.tableSettingsActive = !this.$store.state
        .tableSettingsActive;
    }
  },
  computed: {
    hPlusActive() {
      return this.$store.state.addMenuActive;
    },
    //Получим svg
    filterIcon() {
      return svgHeader.filter;
    },
    loginIcon() {
      return svgHeader.login;
    },
    plusIcon() {
      return svgHeader.plus;
    },
    menuIcon() {
      return svgHeader.menu;
    },
    settingsIcon() {
      return svgHeader.settings;
    },
    deleteIcon() {
      return svgHeader.delete;
    },
    //
    lastTableColor() {
      return this.$store.dispatch("lastTableColor");
    },
    // plusActive() {
    //   return this.$store.state.plusActive;
    // },
    tableSettingsActive() {
      return this.$store.state.tableSettingsActive;
    },
    tableSettingsVisible() {
      return this.$store.state.tableSettingsVisible;
    },
    // visibleTables(){
    //     return this.tasks.filter( user => {
    //         return !tasks.visible
    //     })
    // }

    // activeTableIndex() {
    //   return this.$store.state.activeTableIndex;
    // },
    // allTasks() {
    //   return this.$store.state.allTasks;
    // },
    allTasks() {
        return this.$store.state.allTasks;
    },
    actTableIndex() {
      return this.$store.state.activeTableIndex;
    },
    // activeTableId() {
    //   return this.$store.state.allTasks[this.$store.state.activeTableIndex].id;
    // },
    actTabName: {
      
           //и запишем название нашего стола для хедера

     get: function() {
            if(this.allTasks.length > 0) {
                console.log('get table name ', this.allTasks, this.actTableIndex, this.allTasks[0].name);
                if(this.allTasks[this.actTableIndex]) {
                  return this.allTasks[this.actTableIndex].name;
                }
           } else {
               return 'Название рабочего стола'
           }      },

      set: function(newValue) {
       
       this.allTasks[this.actTableIndex].name = newValue;
      }
    }
  },
  components: {
    HeaderSettings,
    ThreeDotsMenu,
    ConfirmationWindow
  },
  created() {
    console.log("Подтягиваем SVG", svgHeader.filter);
  }
};
</script>

<style lang="scss">
//--- VARIABLES ---//

$h-icons-col: rgb(82, 82, 82);

$h-icons-bg-col: rgba(255, 255, 255, 0.45);

$h-small-icons-col: rgb(56, 56, 56);
//-----------------//

.t-header {
  height: 40px;
  width: 100%;
  min-width: 300px;
  background: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  position: relative;

  &__search {
    box-sizing: border-box;
    height: 30px;
    width: 100px;
    background: white;
    border-radius: 15px;
    border: solid 1px #a2a2a2;
    margin-left: 30px;
    padding: 0 30px 0 12px;
    font-size: 16px;
    font-family: open sans;
    outline: none;
    transition: border 0.2s;
    transition: width 0.4s;

    background-image: url(/src/img/icons/magnifying-glass.svg);
    background-size: 14px;
    background-repeat: no-repeat;
    background-position: calc(100% - 8px) 50%;

    &:focus {
      border-width: 2px;
      width: 200px;
    }

    &::placeholder {
      /* Chrome, Firefox, Opera, Safari 10.1+ */
      color: #c4c4c4;
      opacity: 1;
      /* Firefox */
    }

    &:-ms-input-placeholder {
      /* Internet Explorer 10-11 */
      color: #c4c4c4;
    }

    &::-ms-input-placeholder {
      /* Microsoft Edge */
      color: #c4c4c4;
    }
  }

  &__desk-name {
    font-family: "Open Sans", sans-serif;
    font-size: 18px;
    font-weight: 600;
    display: flex;
    flex-grow: 1;
    justify-content: center;
    white-space: nowrap;
    position: relative;
    // left: 50%;
    // transform: translateX(-50%);
    // width: calc(100vw - 120px);
    overflow: hidden;
    text-align: center;

    // margin: 0 100px;
    text-align: center;
    margin: 0 10px;
    height: 100%;

    &-abs {
      display: flex;
      justify-content: center;
      align-items: center;
      max-width: 100%;
    }
  }

  &__star {
    & img {
      height: 20px;
    }
  }

  &__profile {
    // height: 22px;
    // width: 21px;
    // height: 100%;
    // margin-right: 10px;
    display: flex;
    & svg {
      height: 20px;
      margin: auto;
      fill: $h-icons-col;
    }
  }

  &__menu {
    width: 30px;
    height: 30px;
    display: flex;
    transition: background 0.2s;
    transition: transform 0.3s;
    // margin-left: 10px;
    // margin-right: 20px;
    border-radius: 7px;
    transition: background 0.3s;
    background: #0000000f;
    position: relative;

    &:hover {
      background: rgba(255, 255, 255, 0.8);
    }

    & img {
      width: 15px;
      margin: auto;
      fill: $h-icons-col;
    }
  }

  &__logout {
    font-family: "Open Sans", sans-serif;
    border: solid 2px rgb(75, 75, 75);
    border-radius: 6px;
    padding: 1px 5px;
    margin-right: 10px;
  }
}

// .delTable {
//   margin-left: 5px;

//   & svg {
//     height: 10px;
//     fill: $h-icons-col;
//   }
// }

.desk-btns {
  &__group-1 {
    position: relative;
  }

  &__group-1,
  &__group-2 {
    display: flex;
  }

  &__group-2 {
    position: relative;
    right: 0;
  }

  &__h-add {
    position: relative;
    transition: all 0.7s;
    width: 100%;
    height: 100%;
    display: flex;

    & svg {
      height: 16px;
      margin: auto;
      fill: $h-icons-col;
    }
  }

  &__h-add_active {
    height: 50px;
    & .desk-btns__check-add {
      max-height: 400px;
      padding: 5px;
    }
  }

  &__check-add {
    position: absolute;
    top: 0;
    left: 0;
    margin-top: 35px;
    opacity: .95;
    // background: $h-icons-bg-col;
    background: #efefef;
    border-radius: 4px;
    font-family: Roboto, sans-serif;
    z-index: 100;
    line-height: 1.8;
    white-space: nowrap;
    overflow: hidden;
    transition: all 0.3s;
    max-height: 0;
    padding: 0 5px;
  }
}

.actTabName {
  &__box {
    width: min-content;
    position: relative;
    height: 30px;
    max-width: 100%;
  }

  &__buffer {
    position: relative;
    left: 0;
    padding: 0 5px;
    font-family: "Roboto", sans-serif;
    font-size: 18px;
    font-weight: 400;
    height: 0;
    opacity: 0;
  }

  &__inp {
    border-radius: 6px;
    transition: all 0.2s;
    overflow: hidden;
    text-overflow: ellipsis;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    text-align: left !important;
    margin: 0 auto;
    display: block;
    border-radius: 5px;
    padding: 0 5px;
    border: none;
    background: transparent;
    font-family: "Roboto", sans-serif;
    font-size: 18px;
    max-width: 100%;
    box-sizing: border-box;
  }
}

.table-settings {
  width: 30px;
  display: flex;
  z-index: 5;
  width: 25px;
  opacity: 1;
  transition: all .2s;
  position: relative;
  left: 0;
  margin: 0 5px;

  &:hover svg{
    fill: $h-small-icons-col;
  }
  &_hidden {
    opacity: 0;
    width: 0;
    margin: 0;
  }
  & > svg {
    height: 20px;
    margin: auto;
    fill: gray;
    transition: fill .1s;
  }
}

.delTable {
  width: 25px;
  display: flex;
  position: relative;
  opacity: 1;
  left: 0;
  margin: 0 5;

  transition: all 0.2s;

  &_hidden {
    left: -30px;
    opacity: 0;
    width: 0;
    margin: 0;
  }

  & > svg {
    height: 20px;
    margin: auto;
    fill: $h-small-icons-col;
  }
}

.btn-bg-white {
  position: relative;
  width: 30px;
  height: 30px;
  background: $h-icons-bg-col;
  border-radius: 4px;
  display: flex;
}

.btn-filter {
  & svg {
    height: 18px;
    margin: auto;
    fill: $h-icons-col;
  }
}

.header-menu_hidden {
  width: 0 !important;
  height: 0 !important;
  opacity: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  display: none !important;
}
</style>


