// TODO: При добавлении задачи появляется скролл, нужно добавить встроенный пересчет высоты vueperfectscrollbar
// TODO: При наведении на плюс сделать поворот его на 90 градусов

<template>
    <div class="emoji__box">
        <div class="emoji__oneEmoji"
          @click="openEmojiList">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 70.094 70.094"
                    :style="{fill: MainListColor.colorOne}"
                    v-html="currentEmoji">
                </svg>
        </div>
        <transition-group name="fade"
          class="emoji__box">
            <div 
                v-for="(oneEmoji, index) in listOfEmoji"
                @click="cnangeEmoji(index)"
                v-show="emojiListActive"
                :key="oneEmoji.name"
                class="emoji__one" 
                v-if="currentEmojiIndex != index"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 70.094 70.094"
                    v-html="oneEmoji.svg"
                    :style="{fill: MainListColor.colorOne}">
                  </svg>
            </div>
        </transition-group>
    </div>
</template>

<script>
import { svgEmoji } from "../../OtherSrc/svg.js";

export default {
    data() {
        return {
        //    currentEmojiIndex: 1,
           emojiListActive: false,
        }
    },

    computed: {
        listOfEmoji() {
            return svgEmoji;
        },
        currentEmoji() {
           return this.listOfEmoji[this.currentEmojiIndex].svg;   
        },
        currentEmojiIndex() {
           let emojiInd = this.allTasks[this.activeTableIndex].taskLists[this.taskListIndex].emojiIndex;
           if(typeof emojiInd == "undefined") { emojiInd = 0 }
           return emojiInd;
        },
        allTasks() {
            return this.$store.state.allTasks;
        },
        // colors() {
        //     return this.$store.state.gradients;
        // },
        // MainListColor() {
        //     console.log( 'цвет списка', this.$store.state.gradients[this.themeColorId]);
        //     return this.$store.state.gradients[this.themeColorId];
        // },
        // themeColorId() {
        //     return this.allTasks[this.activeTableIndex].taskLists[this.taskListIndex].color;
        // },
    },
    props: ["MainListColor", "activeTableIndex", "taskListIndex"],
    methods: {
      cnangeEmoji(index) {
          console.log(index);
          const taskListInd= this.taskListIndex;
          this.$store.dispatch('changeEmojiIndex', {index, taskListInd});
      },
      openEmojiList() {
          this.emojiListActive = !this.emojiListActive;
          //Отправим состояние списка в осн компонент
          this.$emit('listMenuOpen', this.emojiListActive);

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
        margin-left: 5px;

        //  &:not(:first-child) {
        //     margin-left: 5px;
        //  }
       }
        &__box {
         display: flex;
       }
       &__oneEmoji {
           height: 30px;
           width: 30px;
       }
   }
</style>
