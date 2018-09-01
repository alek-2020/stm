//TODO: Оформить страницу 404

<template>
  <div>
    <div class="t-header">

      <!-- Кнопка выезжающего меню -->
      <BtnIconTile :iconColor="iconsColor"
                   class="t-header__slideMenu" />

      <!-- Блок с названием и настройками стола -->
      <div class="t-header__name-box"
           @mouseover="showSettings"
           @mouseout="hideSettings">
        <HeaderName />

        <BtnTableSettings :visible="tableSettingsVisible"
                          :active="tableSettingsActive"
                          @toggle="showTableSettings" />

        <BtnDelActiveTable :visible="tableSettingsActive" />
      </div>

      <BtnLogout class="t-header__profile btn-bg-white"
                 :iconColor="iconsColor" />
    </div>

    <!-- Выбор темы оформления -->
    <HeaderSettings :active="tableSettingsActive" />

    <!-- Подтверждения удаления РС -->
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
import HeaderSettings from "./HeaderSettings.vue";
import ThreeDotsMenu from "./HeaderDotsMenu.vue";
import ConfirmationWindow from "./PopupConfirmation.vue";
import BtnIconTile from "./BtnIconTile.vue";
import HeaderName from "./HeaderName.vue";
import BtnLogout from "./BtnLogout.vue";
import BtnDelActiveTable from "./BtnDelActiveTable.vue";
import BtnTableSettings from "./BtnTableSettings.vue";
import HeaderSettingsVue from "./HeaderSettings.vue";

import { svgHeader } from "./../OtherSrc/svg.js";

import * as firebase from "firebase";

export default {
  data() {
    return {
      iconsColor: "gray",
      activeTableName: "Название стола",
      logoSVG:
        '<svg fill="#7e7f87" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 41.5 41.5"><defs></defs><path class="a" d="M12.243,16.808l-2.9,2.905,9.338,9.337L39.425,8.3,36.52,5.4,18.675,23.24ZM37.35,20.75a16.6,16.6,0,1,1-16.6-16.6,16.182,16.182,0,0,1,4.565.623l3.32-3.32A25.256,25.256,0,0,0,20.75,0,20.75,20.75,0,1,0,41.5,20.75Z"/></svg>',
      SVGCross: "<svg></svg>",
      ThreeDotsActive: false,
      askConfirm: false
    };
  },
  methods: {
    showSettings() {
      this.$store.state.tableSettingsVisible = true;
    },
    hideSettings() {
      // console.log("Срабатывает mouseout");
      this.$store.state.tableSettingsVisible = false;
      //  this.$store.state.tableSettingsActive = false;
    },
    //Новый список
    addList() {
      this.$store.dispatch("addTaskList");
    },

    ActivateDots() {
      this.ThreeDotsActive = !this.ThreeDotsActive;
      var a = this.ThreeDotsActive;
    },

    showSettings() {
      this.$store.state.tableSettingsVisible = true;
    },
    hideSettings() {
      // console.log("Срабатывает mouseout");
      this.$store.state.tableSettingsVisible = false;
      //  this.$store.state.tableSettingsActive = false;
    },

    //Скроллим наш список столов в конец для добавления нового
    //Тут нам нужно бы вызвать хук из скроллера и после прокрутки начать создание стола
    HeaderAdd() {
      this.$store.dispatch("addNewTable");
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
      if (val) {
        this.$store.dispatch("delActiveTable");
      }
      this.askConfirm = false;
    },
    showTableSettings() {
      console.log("Покажем настройки");

      this.$store.state.tableSettingsActive = !this.$store.state
        .tableSettingsActive;
    }
  },
  computed: {
    lastTableColor() {
      return this.$store.dispatch("lastTableColor");
    },
    // tableSettingBoxActive() {

    // }
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
    }
    // activeTableId() {
    //   return this.$store.state.allTasks[this.$store.state.activeTableIndex].id;
    // },
  },
  components: {
    HeaderSettings,
    ThreeDotsMenu,
    ConfirmationWindow,
    BtnIconTile,
    HeaderName,
    BtnLogout,
    BtnDelActiveTable,
    BtnTableSettings
  },
  created() {
    console.log("Подтягиваем SVG", svgHeader.filter);
  }
};
</script>

<style lang="scss">
@import "../scss/helpers/_variables.scss";

//--- VARIABLES ---//

$h-icons-col: rgb(82, 82, 82);
$h-icons-bg-col: rgba(255, 255, 255, 0.45);
$h-small-icons-col: rgb(56, 56, 56);
//-----------------//

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

  &__slideMenu {
    left: 10px;
  }

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

  &__star {
    & img {
      height: 20px;
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

.t-header {
  &__name-box {
    position: relative;
    flex-grow: 1;
  }

  &__name-box,
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
      max-width: 400px;
      padding: 8px;
      // display: block;
      visibility: visible;
      opacity: 0.95;
      & > div {
        border: solid 1px #656565;
        padding: 5px 10px 5px 5px;
        justify-content: flex-start !important;
      }
    }
  }

  &__check-add {
    visibility: hidden;
    // visibility: hidden;
    position: absolute;
    top: 0;
    left: 0;
    margin-top: 45px;
    opacity: 0;
    // background: $h-icons-bg-col;
    background: #efefef;
    border-radius: 4px;
    font-family: Roboto, sans-serif;
    z-index: 100;
    line-height: 1.8;
    white-space: nowrap;
    overflow: hidden;
    transition: all 0.3s;
    max-height: 20px;
    max-width: 20px;
    padding: 0 5px;
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

  &:hover svg {
    fill: $h-small-icons-col;
  }

  &_hidden {
    left: -30px;
    opacity: 0;
    width: 0;
    margin: 0;
  }

  & > svg {
    height: 20px;
    margin: auto;
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


