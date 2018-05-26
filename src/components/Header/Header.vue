<template>
 <div class="">
  <div class="t-header">

        <div class="t-header__logo"
            v-html="logoSVG">  
        </div>
        
        <input class="t-header__search" placeholder="Search">
        
        <div class="t-header__desk-name">
            <div class="t-header__desk-name-abs">
              {{ activeTableName }}
              <div class="delTable"
              v-html="SVGCross"
              v-on:click="delTable()"              
              ></div>
              
            </div>
        </div>
        
        <!-- <div class="t-header__logout">
            EXIT
        </div> -->

        <router-link to="/login" class="t-header__profile">
          <img src="/img/icons/log-in.svg" alt="">
        </router-link>

        <!-- <div class="t-header__star"><img src="/img/icons/star.svg" alt=""></div> -->
        
        <div class="t-header__menu"
          @click="ActivateDots">
            <img src="/img/icons/more-dots.svg" alt="">
                <ThreeDotsMenu
                v-if="ThreeDotsActive">
                </ThreeDotsMenu>
        </div>
    </div>
    

    <HeaderSettings></HeaderSettings>
</div>
</template>

<script>
import HeaderSettings from './HeaderSettings.vue'
import ThreeDotsMenu from './ThreeDotsMenu.vue'
// import * as test from '@OtherSrc/svg.js'

//   console.log(test);


export default {
   data() {
       return{
           logoSVG: '<svg fill="#7e7f87" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 41.5 41.5"><defs></defs><path class="a" d="M12.243,16.808l-2.9,2.905,9.338,9.337L39.425,8.3,36.52,5.4,18.675,23.24ZM37.35,20.75a16.6,16.6,0,1,1-16.6-16.6,16.182,16.182,0,0,1,4.565.623l3.32-3.32A25.256,25.256,0,0,0,20.75,0,20.75,20.75,0,1,0,41.5,20.75Z"/></svg>',
        //    activeTableName: 'Стол Василия',
           SVGCross: '<svg></svg>',
           ThreeDotsActive: false

       }
   }, 
   methods: {
      ActivateDots() {
          this.ThreeDotsActive = !this.ThreeDotsActive;
      }
   },
   computed: {
        // visibleTables(){
        //     return this.tasks.filter( user => {
        //         return !tasks.visible
        //     })
        // }
        activeTableIndex() {
          return this.$store.state.activeTableIndex;
        },
        allTasks() {
            return this.$store.state.allTasks;
        },
        activeTableName() {
            return this.allTasks[0].name;
        },

   },
   components: {
       HeaderSettings,
       ThreeDotsMenu
   }
}
</script>

<style lang="scss">
    .t-header {
        height: 40px;
        width: 100%;
        background: rgba( 255, 255, 255, .6);
        display: flex;
        align-items: center;
        position: relative;

        &__logo {
            margin-left: 10px;

            & svg {
                height: 20px;
                fill: gray;
            }
        }

        &__search {
            box-sizing: border-box;
            height: 30px;
            width: 100px;
            background: white;
            border-radius: 15px;
            border: solid 1px #a2a2a2;
            margin-left: 30px;
            padding: 0 30px 0 12px;
            font-size: 16px;
            font-family: open sans;
            outline: none;
            transition: border .2s;
            transition: width .4s;

            background-image: url(/src/img/icons/magnifying-glass.svg);
            background-size: 14px;
            background-repeat: no-repeat;
            background-position: calc(100% - 8px) 50%;

            &:focus {
                border-width: 2px;
                width: 200px;
            }

            &::placeholder {
                /* Chrome, Firefox, Opera, Safari 10.1+ */
                color: #c4c4c4;
                opacity: 1;
                /* Firefox */
            }

            &:-ms-input-placeholder {
                /* Internet Explorer 10-11 */
                color: #c4c4c4;
            }

            &::-ms-input-placeholder {
                /* Microsoft Edge */
                color: #c4c4c4;
            }
        }

        &__desk-name {
            font-family: "Open Sans", sans-serif;
            font-size: 18px;
            font-weight: 600;
            display: flex;
            flex-grow: 1;
            justify-content: center;
            white-space: nowrap;

            &-abs {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                display: flex;
            }
        }

        &__star {
            & img {
                height: 20px;
            }
        }

        &__profile {
            // height: 22px;
            // width: 21px;
            // height: 100%;
            margin-right: 10px;
            & img {
                height: 25px;
            }
        }

        &__menu {
            width: 30px;
            height: 30px;
            display: flex;
            transition: background .2s;
            transition: transform .3s;
            margin-left: 10px;
            margin-right: 20px;
            border-radius: 7px;
            transition: background .3s;
            background: #0000000f;

            &:hover {
                background: rgba(255, 255, 255, .8);
            }

            & img {
                width: 18px;
                margin: auto;
            }

        }

        &__logout {
            font-family: 'Open Sans', sans-serif;
            border: solid 2px rgb(75, 75, 75);
            border-radius: 6px;
            padding: 1px 5px;
            margin-right: 10px;

        }

    }

    .delTable{ 
        margin-left: 5px;
        
        & svg {
            height: 10px;
            fill: gray;
        }
    }
</style>


