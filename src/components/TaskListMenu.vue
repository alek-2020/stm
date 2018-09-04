// TODO: для цветов сделать центральное единое хранилище, что бы они подтягивались как для столов, так и для списков задач и т.д.
// TODO: окошко good and bad news make like on the cloudflare.com
// TODO: сделать предпросмотр цвета, что бы он плавно менялся при наведении на цветовую палитру, если щелкаем, то он применяется. Единственное, что нужно учесто это то, как это будет работать на мобильных, т.е. будет ли сразу инициализироваться клик или сначала ховер.

<!-- МЕНЮ В СПИСКЕ -->

<template>
  <div class="list-menu__box">
    <transition-group class="list-menu__colors"
                      name="fade">
      <div class="list-menu__colors-item"
           v-for="(color, index) in paletteColors"
           :key="index"
           v-bind:style="{ background: color.colorOne }"
           v-show="isActive"
           @click="pushNewColor(index)"></div>
    </transition-group>

    <div class="list-menu__dots"
         v-on="{click: activeDots}">
      <img src="/img/icons/more-dots.svg"
           alt=""
           v-bind:class="{'list-menu__dots_rotate': isActive}">
    </div>

  </div>
</template>
      
      

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";

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
      }
    };
  },

  methods: {
    /*переключакт состояние кнопки*/
    activeDots: function() {
      this.isActive = !this.isActive;
      this.$emit("listMenuOpen", this.isActive);
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
    },

    //Отправляет новый цвет в родительский компонент
    pushNewColor(index) {
      this.$emit("newColor", index);
    }
  },

  components: {
    VuePerfectScrollbar
  },

  computed: {
    paletteColors() {
      return this.$store.state.gradients;
    }
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
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;

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

.list-menu__dots_rotate {
  transform: rotate(90deg);
}
</style>