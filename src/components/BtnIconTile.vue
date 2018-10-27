<template>
  <div class="btnIconTile">
    <div class="btnIconTile__box"
         :class="{btnIconTile__box_active:active}"
         >
      <div class="btnIconTile__one"
         :style="{background: iconColor}"></div>
      <div class="btnIconTile__two"
           :style="{background: iconColor}"></div>
      <div class="btnIconTile__three"
           :style="{background: iconColor}"></div>
    </div>
  </div>
</template>

<script>
export default {
  data: function() {
    return {};
  },
  props: {
    iconColor: String,
    active: Boolean
  }
};
</script>

<style lang="scss">
.btnIconTile {
  display: flex;
  align-items: center;
  justify-content: center;
  & svg {
    height: 25px;
    width: 25px;
  }
  &__one {
    width: 100%;
  }
  &__two {
    width: 60%;
  }
  &__three {
    width: 75%;
  }
  &__one,
  &__two,
  &__three {
    height: 30%;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 2px;
    transition: width 0.3s, background .3s;
  }
  &__box {
    height: 30px;
    width: 30px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    &_active {
      & .btnIconTile {
        &__one {
          width: 80%;
        }
        &__two {
          width: 100%;
        }
        &__three {
          width: 45%;
        }
      }
    }
  }
}
</style>

