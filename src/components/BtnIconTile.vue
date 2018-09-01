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
        '<g id="Group_139" data-name="Group 139"> <g id="Group_138" data-name="Group 138"> <path id="Path_228" data-name="Path 228" d="M1087.491,0H98.865A98.864,98.864,0,0,0,0,98.865V1087.5a98.864,98.864,0,0,0,98.865,98.865H1087.5a98.864,98.864,0,0,0,98.865-98.865V98.865A98.873,98.873,0,0,0,1087.491,0Z"/> </g> </g> <g id="Group_141" data-name="Group 141"> <g id="Group_140" data-name="Group 140"> <path id="Path_229" data-name="Path 229" d="M2471.576,0H1482.944a98.864,98.864,0,0,0-98.865,98.865V1087.5a98.864,98.864,0,0,0,98.865,98.865h988.631a98.864,98.864,0,0,0,98.865-98.865V98.865A98.871,98.871,0,0,0,2471.576,0Z"/> </g> </g> <g id="Group_143" data-name="Group 143"> <g id="Group_142" data-name="Group 142"> <path id="Path_230" data-name="Path 230" d="M1087.491,1384.079H98.865A98.864,98.864,0,0,0,0,1482.944v988.631a98.864,98.864,0,0,0,98.865,98.865H1087.5a98.864,98.864,0,0,0,98.865-98.865V1482.944A98.873,98.873,0,0,0,1087.491,1384.079Z"/> </g>  </g> <g id="Group_145" data-name="Group 145"> <g id="Group_144" data-name="Group 144"> <path id="Path_231" data-name="Path 231" d="M2471.576,1384.079H1482.944a98.864,98.864,0,0,0-98.865,98.865v988.631a98.864,98.864,0,0,0,98.865,98.865h988.631a98.864,98.864,0,0,0,98.865-98.865V1482.944A98.871,98.871,0,0,0,2471.576,1384.079Z"/> </g> </g>'
    };
  },
  props: {
    iconColor: String
  }
};
</script>

