// TODO: для цветов сделать центральное единое хранилище, что бы они подтягивались как для столов, так и для списков задач и т.д.
// TODO: окошко good and bad news make like on the cloudflare.com
// TODO: сделать предпросмотр цвета, что бы он плавно менялся при наведении на цветовую палитру, если щелкаем, то он применяется. Единственное, что нужно учесто это то, как это будет работать на мобильных, т.е. будет ли сразу инициализироваться клик или сначала ховер.

<!-- МЕНЮ В СПИСКЕ -->

<template>
    <div class="list-menu__box">
        <!-- <div class="list-menu" 
          v-on:mouseout="persTimer" 
          v-on:mouseover="persStopTimer">
            <div class="list-menu__hidden-container" 
              v-bind:class="{widthZero: !isActive}">
                <div class="list-menu__hidden">
                    <div class="list-menu__emoji" v-html="emojiSVG"></div>
                    <div id="persColor" class="list-menu__color" v-on="{ click: switchDotsCol }"
                    n-on>

                    </div>
                </div>
            </div>

        </div>  -->
<!--выпадающая цветовая палитра в меню списка-->
      <!-- <div class="list-menu__colors" 
          v-bind:class="{widthZero: !persHide.activeDotsCol}"
          > -->
          <transition-group
            class="list-menu__colors"
            name="fade">
            <div class="list-menu__colors-item"
              v-for="(color, index) in paletteColors"
              :key="index"
              v-bind:style="{ background: color.colorOne }"
              v-show="isActive"
              @click="pushNewColor(index)"
            ></div>
          </transition-group>             
      <!-- </div> -->

      <div class="list-menu__dots" 
         v-on="{click: activeDots}">
          <img src="/img/icons/more-dots.svg" 
           alt="" 
           v-bind:class="{'list-menu__dots_rotate': isActive}">
      </div>

    </div>
</template>
      
      

<script>
export default {
  template: "#list-dots-menu",
  props: ["themeColor"],
  data: function() {
    return {
      emojiSVG: "",
      taskList: "",
      isActive: false,
      persTimerId: -1,

      colDots: {
        activeDotsCol: true
      },
      // paletteColors: [
      //   {
      //     color: "#a02a2a",
      //     name: "beuty"
      //   },
      //   {
      //     color: "#1b60ce",
      //     name: "beuty"
      //   },
      //   {
      //     color: "#0e8432",
      //     name: "beuty"
      //   },
      //   {
      //     color: "#db1edb",
      //     name: "beuty"
      //   }
      // ]
    };
  },

  methods: {
    /*переключакт состояние кнопки*/
    activeDots: function() {
      this.isActive = !this.isActive;
      this.$emit('listMenuOpen', this.isActive);
      // console.log(this.themeColor);
    },

    /*запускает таймер*/
    persTimer: function() {
      if (this.isActive && this.persTimerId < 0) {
        this.persTimerId = setTimeout(this.persHide, 2000);
      }
    },

    /*сбрасывает таймер*/
    persStopTimer: function() {
      if (this.isActive && this.persTimerId >= 0) {
        clearTimeout(this.persTimerId);
        this.persTimerId = -1;
      }
    },

    /*отключает кнопку*/
    persHide: function() {
      this.isActive = false;
    },

    /*активно меню выбора цвета на списке задач*/
    switchDotsCol: function() {
      this.persHide.activeDotsCol = !this.persHide.activeDotsCol;
      console.log(this.persHide.activeDotsCol);
    },

    //Отправляет новый цвет в родительский компонент
    pushNewColor(index) {
      this.$emit('newColor', index);
      // this.$store.state.allTasks;
    }
  },

  computed: {
    paletteColors() {return this.$store.state.gradients}
  }

};
</script>


<style lang="scss">
.list-menu {
  display: flex;
  flex-wrap: nowrap;
  position: absolute;
  right: 5px;
  top: 5px;
  align-items: center;
  height: 20px;

  &__box {
    display: flex;
  }

  &__colors {
    display: flex;
  }

  &__colors-item {
    height: 25px;
    width: 25px;
    visibility: visible !important;
    border-radius: 4px;

    &:not(:last-child) {
      margin-right: 5px;
    }
  }

  &__dots {
    height: 25px;
    width: 25px;
    margin-left: 5px;
    // background-size: 100%;
    // background-position: center;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    // transition: background 0.2s;
    // transition: transform 0.3s;

    &:hover {
      background: #dedede;
    }

    & img {
      height: 16px;
      width: 16px;
      transition: transform 0.3s;
    }
  }
}

  // &__hidden-container {
  //   position: relative;
  //   overflow: hidden;
  //   transition: all 0.3s;
  //   width: 43px;
  //   height: 20px;
  //   background: #e8e8e8;
  // }

  // &__hidden {
  //   display: flex;
  //   align-items: center;
  //   position: absolute;
  //   top: 0;
  //   right: 0;

  //   & > *:not(:last-child) {
  //     margin-right: 5px;
  //   }
  // }

  // &__emoji {
  //   position: relative;
  //   height: 20px;
  //   width: 20px;
  //   background-size: 100%;
  //   transition: all 0.2s;
  //   display: flex;

  //   & svg {
  //     height: 18px;
  //     width: 18px;
  //     margin: auto;
  //   }

  //   &:hover svg {
  //     transform: scale(1.05);
  //   }
  // }

//   &__color {
//     position: relative;
//     height: 17px;
//     width: 17px;
//     background: linear-gradient(320deg, #47d0ad, #cf47d0, #a52222);
//     background-size: 300% 300%;
//     border-radius: 4px;
//     transition: all 0.2s;
//     animation: colorIconAnimate 10s ease infinite;
//     animation-play-state: paused;

//     &:hover {
//       transform: scale(1.05);
//       animation-play-state: running;
//     }
  
// }

/*анимация при наведении на cмайл*/

// .list-menu__emoji {
//   & stop {
//     animation: emojiAnimate 10s infinite;
//     animation-play-state: paused;
//   }

//   &:hover stop {
//     animation-play-state: running;
//   }
// }

// .stop-2 {
//   animation-delay: 5s;
// }

// @keyframes emojiAnimate {
//   15% {
//     stop-color: crimson;
//   }
//   30% {
//     stop-color: #d3b930;
//   }
//   45% {
//     stop-color: teal;
//   }
//   60% {
//     stop-color: yellowgreen;
//   }
//   75% {
//     stop-color: orangered;
//   }
//   90% {
//     stop-color: purple;
//   }
// }

// /*анимация при наведении на 'выбор цвета'*/

// @keyframes colorIconAnimate {
//   0% {
//     background-position: 13% 0%;
//   }
//   50% {
//     background-position: 88% 100%;
//   }
//   100% {
//     background-position: 13% 0%;
//   }
// }

// .col-palette {
//   width: 150px;
//   height: 10px;
//   background: gray;
//   z-index: 1000;
//   right: 0;
//   position: relative;
//   right: 20px;
//   transition: all 0.4s;

//   &__item {
//     height: 100%;
//     width: 20px;
//     background: yellow;
//   }
// }

.list-menu__dots_rotate {
  transform: rotate(90deg);
}
</style>