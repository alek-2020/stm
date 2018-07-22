// TODO: При добавлении задачи появляется скролл, нужно добавить встроенный пересчет высоты vueperfectscrollbar
// TODO: При наведении на плюс сделать поворот его на 90 градусов
// TODO: Попробовать вместо скрола сделать просто окошко с сеткой emoji по горизонтали и вертикали
// TODO: Пофиксить слайдер, сделать нормально v-if и v-show
// TODO: Сделать в авторизации/регистрации иконки не через фон, а псевдоэлементами, что бы браузер при повторной авторизации не перекрывал их

<template>
    <div class="emoji__box">
        <div class="emoji__oneEmoji"
          @click="openEmojiList">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 70.094 70.094"
                    :style="{fill: MainListColor.colorOne}"
                    v-html="currentEmoji">
                </svg>
        </div>
        <vue-perfect-scrollbar class="emoji__box-rel"
          v-show="emojiListActive"
          :settings="scrollSettings">
            <transition-group name="fade"
            class="emoji__box-abs">
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
        </vue-perfect-scrollbar>
    </div>
</template>

<script>
import { svgEmoji } from "./../OtherSrc/svg.js";

import VuePerfectScrollbar from "vue-perfect-scrollbar";

export default {
    data() {
        return {
        //    currentEmojiIndex: 1,
           emojiListActive: false,
           scrollSettings: {
               suppressScrollY: true,
           }
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
           if(emojiInd != null) {
                if(typeof emojiInd == "undefined") { emojiInd = 0 }
                return emojiInd;
           } else {
                return 0;
           }

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
    props: ["MainListColor", "activeTableIndex", "taskListIndex", "emojiState"],
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
    },
    watch: {
       //Закрытие меню из родительского компонента
       // FIXME: Почему то сдесь присваивание работает , но не отражается на сстоянии списка
       
      emojiState: (val) => {
           console.log('Пришел пропс ', val);
           this.emojiListActive = val;
           this.emojiListActive = this.emojiState;
           console.log('Пришел пjпс ', this.emojiListActive);

       }
    }, 
    components: {
        VuePerfectScrollbar
    },
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
           width: calc(100% - 55px);
       }
        &__box-abs {
         display: flex;
         position: absolute;
         top: 5px;
         left: 0;
         width: auto;

       }
       &__box-rel {
           position: relative;
           width: 100%;
           overflow: hidden;
           top: -5px;
           left: 0;
           margin-left: 7px;
           height: 35px;
       }
       &__oneEmoji {
           height: 30px;
           width: 30px;
       }
   }

   .emoji__box {
/////////////////////////
// КАСТОМИЗАЦИЯ СКРОЛЛА
/////////////////////////

////////ОБЫЧНОЕ СОТОЯНИЕ

//Область скролла
& .ps.ps--active-x >
.ps__scrollbar-x-rail {
    display: block;
    background-color: transparent;
    height: 5px;
    transition: height .3s;
    opacity: 1;
    border-radius: 2px;
    transform: translateY(-2px)

}

//скроллбар
& .ps.ps--active-x >
.ps__scrollbar-x-rail >
.ps__scrollbar-x {
    background-color: gray;
    height: 5px;
    border-radius: 2px;
    transition: height .3s;
    opacity: 1;
    border-radius: 0;
    bottom: 0;
}


////////HOVER

//Область скролла
& .ps.ps--active-x >
.ps__scrollbar-x-rail:hover {
   height: 5px;
   transition: height .2s;
   background-color: transparent;
}

//скроллбар
& .ps:hover >
.ps__scrollbar-x-rail:hover >
.ps__scrollbar-x {
    height: 5px;
    // padding: 0;
    background-color: gray;
    opacity: 1;
    border-radius: 0;
    bottom:0
}


//////АCTIVE

& .ps__scrollbar-x-rail {
  top: 0px;
}
//область скролла
& .ps:hover.ps--in-scrolling.ps--x > 
.ps__scrollbar-x-rail {
   background-color: transparent;
   opacity: 1;
}

//скроллбар

& .ps:hover.ps--in-scrolling.ps--x >
.ps__scrollbar-x-rail >
.ps__scrollbar-x {
    background-color: gray;
    opacity: 1;
}


//////АCTIVE NOT HOVER

//область скролла
& .ps.ps--in-scrolling.ps--x > 
.ps__scrollbar-x-rail {
   background-color: transparent;
   opacity: 1;
   height: 5px;
}

//скроллбар

& .ps.ps--in-scrolling.ps--x >
.ps__scrollbar-x-rail >
.ps__scrollbar-x {
    background-color: gray;
    opacity: 1;
       height: 5px;

}

   }
</style>
