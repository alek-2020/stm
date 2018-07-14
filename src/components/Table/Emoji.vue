// TODO: При добавлении задачи появляется скролл, нужно добавить встроенный пересчет высоты vueperfectscrollbar

<template>
    <div class="emoji__box">
        <div 
        v-for="(oneEmoji, index) in listOfEmoji"
        @click="cnangeEmoji(index)"
        :key="oneEmoji.name"
        class="emoji__one" 
        v-html="oneEmoji.svg">
        </div>
    </div>
</template>

<script>
import { svgEmoji } from "../../OtherSrc/svg.js";

export default {
    data() {
        return {

        }
    },

    computed: {
        listOfEmoji() {
            return svgEmoji;
        }
    },
    methods: {
      cnangeEmoji(index) {
          console.log(index);
      }
    },
    mounted() {
        console.log('Получили emoji', this.listOfEmoji);
    }
}
</script>


<style lang="scss">
   .emoji {
       &__one {
        height: 30px;
        width: 30px;

         &:not(:first-child) {
            margin-left: 5px;
         }
       }
        &__box {
         display: flex;
       }
   }
</style>
