<template>
    <transition name="scale-up"
                appear>
        <div class="confirm__bg">
            <div class="confirm__box">
                <div class="confirm__close btn_icon_cancel m-before-0"></div>
                <div class="confirm__mes">
                    <slot name="message">
                        Confirm your action
                    </slot>
                </div>
                <div class="confirm__btns-box">
                    <button class="btn btn_black-b confirm__btn-cancel">Cancel</button>
                    <button class="btn btn_orange-g confirm__btn-apply">
                        <slot name="action">
                            Confirm
                        </slot>
                    </button>
                </div>
            </div>
        </div>
    </transition>
</template>
тень на попапе
поворот креста при наведении

<script>
export default {
  data() {
    return {};
  },
  methods: {},

  watch: {}
};
</script>

<style lang="scss">
.confirm__bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  z-index: 100;
}
.confirm__box {
  position: fixed;
  background: #fff;
  box-shadow: 0px 5px 10px 5px rgba(0, 0, 0, 0.3);
  width: 250px;
  max-width: 95%;
  min-width: 250px;
  height: auto;
  display: flex;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 15px;
  padding-top: 25px;
  font-family: "Open Sans", sans-serif;
  color: #3c3c3c;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: relative;
}
.confirm__mes {
  font-family: "Open Sans", sans-serif;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;

  & > * {
    text-align: center;
    display: block;
  }
}
.confirm__btns-box {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.confirm__btn-apply {
  width: 55%;
  height: 40px;
}
.confirm__btn-cancel {
  width: 40%;
  height: 40px;
}
.confirm__close {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>

 