<template>
  <div class="check-box">
    <svg xmlns="http://www.w3.org/2000/svg"
         xmlns:xlink="http://www.w3.org/1999/xlink"
         version="1.1"
         id="Capa_1"
         x="0px"
         y="0px"
         viewBox="0 0 405.272 405.272"
         style="enable-background:new 0 0 405.272 405.272;"
         xml:space="preserve"
         v-html="check">
    </svg>
  </div>
</template>

<script>
export default {
  data() {
    return {
      check:
        '<g> <path d="M393.401,124.425L179.603,338.208c-15.832,15.835-41.514,15.835-57.361,0L11.878,227.836   c-15.838-15.835-15.838-41.52,0-57.358c15.841-15.841,41.521-15.841,57.355-0.006l81.698,81.699L336.037,67.064   c15.841-15.841,41.523-15.829,57.358,0C409.23,82.902,409.23,108.578,393.401,124.425z" fill="#FFFFFF"/> </g>'
    };
  }
};
</script>
<style lang="scss">
.check-box {
  height: 20px;
  width: 20px;
  background: #dedede;
  border-radius: 5px;
  position: absolute;
  top: 50%;
  right: 11px;
  opacity: 0;
  transform: translateY(-50%);
  transition: all cubic-bezier(0, 0, 0.2, 1) 0.3s;
  transition-delay: 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background: #c5c5c5;
  }
  &:active {
    transform: translateY(-50%) scale(0.9);
    background: #a0a0a0;
  }
  & svg {
    height: 15px;
    width: auto;
  }
}
</style>

