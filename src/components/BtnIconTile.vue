/* Входные параметры компонента:
 *** iconColor - цвет иконки
 ***
 */

<template>
  <!-- Кнопка выезжающего меню -->
  <div class="btn-bg-white">
    <svg xmlns="http://www.w3.org/2000/svg"
         xmlns:xlink="http://www.w3.org/1999/xlink"
         v-html="tile"
         :style="{fill: iconColor}">
    </svg>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
              tile:
        '<g><path id="Path_236" data-name="Path 236" class="cls-1" d="M17.151,0H1.559A1.559,1.559,0,0,0,0,1.559V17.152a1.559,1.559,0,0,0,1.559,1.559H17.152a1.559,1.559,0,0,0,1.559-1.559V1.559A1.559,1.559,0,0,0,17.151,0Z"/> <path id="Path_237" data-name="Path 237" class="cls-1" d="M256.085,0H240.492a1.559,1.559,0,0,0-1.559,1.559V17.152a1.559,1.559,0,0,0,1.559,1.559h15.592a1.559,1.559,0,0,0,1.559-1.559V1.559A1.559,1.559,0,0,0,256.085,0Z" transform="translate(-217.104)"/> <path id="Path_239" data-name="Path 239" class="cls-1" d="M256.085,238.933H240.492a1.559,1.559,0,0,0-1.559,1.559v15.592a1.559,1.559,0,0,0,1.559,1.559h15.592a1.559,1.559,0,0,0,1.559-1.559V240.492A1.559,1.559,0,0,0,256.085,238.933Z" transform="translate(-217.104 -217.104)"/> <path id="Path_238" data-name="Path 238" class="cls-1" d="M17.151,238.933H1.559A1.559,1.559,0,0,0,0,240.492v15.592a1.559,1.559,0,0,0,1.559,1.559H17.152a1.559,1.559,0,0,0,1.559-1.559V240.492A1.559,1.559,0,0,0,17.151,238.933Z" transform="translate(0 -217.104)"/></g>'
    };
  },
  props: {
    iconColor: String
  }
};
</script>

