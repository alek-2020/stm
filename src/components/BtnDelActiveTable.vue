<template>
    <div class="delTable"
         :class="{ 'delTable_hidden': !visible }">
        <svg v-html="deleteIcon"
             id="baseline-delete-24px"
             xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 30.751 30.752">
        </svg>
    </div>
</template>

<script>
export default {
  data() {
    return {
      deleteIcon:
        '<defs><style> .cls-2 { fill: none; }  </style>  </defs>  <path id="Path_169" data-name="Path 169" class="cls-1" d="M6.495,26.918a3,3,0,0,0,2.99,2.99H21.444a3,3,0,0,0,2.99-2.99V8.979H6.495ZM25.928,4.495H20.7L19.2,3H11.727L10.232,4.495H5v2.99H25.928Z" transform="translate(-4.971 -0.978)"/><path id="Path_170" data-name="Path 170" class="cls-2" d="M0,0H30.752V30.752H0Z"/>',
      askConfirm: false
    };
  },
  props: {
    visible: Boolean
  }
};
</script>
         
<style lang="scss">
@import "../scss/helpers/_variables.scss";

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
</style>
         
