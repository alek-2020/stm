<!-- МЕНЮ В СПИСКЕ -->

 <template id="list-dots-menu">
       <div class="">
        <div class="pers" v-on:mouseout="persTimer" v-on:mouseover="persStopTimer">

            <div class="pers__hidden-container" v-bind:class="{widthZero: !isActive}">
                <div class="pers__hidden">

                    <div class="pers__emoji" v-html="emojiSVG"></div>

            
                   
                    <div id="persColor" class="pers__color" v-on="{ click: switchDotsCol }"
                    n-on>

                    </div>
                </div>
            </div>

          
            <div class="pers__dots" v-on="{click: activeDots}">
                <img src="/img/icons/more-dots.svg" alt="" v-bind:class="{rotate: isActive}">
            </div>

  

        </div>
        
<!--выпадающая цветовая палитра в меню списка-->
              <div class="col-palette" v-bind:class="{widthZero: !persHide.activeDotsCol}">
               <div class="col-palette__item"
               v-for="color in paletteColors"
               :key="color"
               v-bind:style="{ background: color.color }"
               ></div>
                
            </div>
     </div>
    </template>
      
      

<script>
    
    export default {
        template: '#list-dots-menu',
        props: ['themeColor'],
        data: function() {
            return {
                emojiSVG: '',
                taskList: '',
                isActive: true,
                persTimerId: -1,

                colDots: {
                    activeDotsCol: true
                },
                paletteColors: [{
                    color: '#a02a2a',
                    name: 'beuty'
                }, {
                    color: '#1b60ce',
                    name: 'beuty'
                }, {
                    color: '#0e8432',
                    name: 'beuty'
                }, {
                    color: '#db1edb',
                    name: 'beuty'
                }]
            }
        },

        methods: {

            /*переключакт состояние кнопки*/
            activeDots: function() {
                this.isActive = !this.isActive;
                console.log(this.themeColor);
            },

            /*запускает таймер*/
            persTimer: function() {
                if (this.isActive && this.persTimerId < 0) {
                    this.persTimerId = setTimeout(this.persHide, 2000);
                }
            },

            /*сбрасывает таймер*/
            persStopTimer: function() {
                if (this.isActive && this.persTimerId >= 0) {
                    clearTimeout(this.persTimerId);
                    this.persTimerId = -1;
                }
            },

            /*отключает кнопку*/
            persHide: function() {
                this.isActive = false;
            },

            /*активно меню выбора цвета на списке задач*/
            switchDotsCol: function() {
                this.persHide.activeDotsCol = !this.persHide.activeDotsCol;
                console.log(this.persHide.activeDotsCol);
            }
        }
    }
    
</script>


<style lang="scss">

    .pers {
        display: flex;
        flex-wrap: nowrap;
        position: absolute;
        right: 5px;
        top: 5px;
        align-items: center;
        height: 20px;

        &__dots {
            height: 20px;
            width: 20px;
            margin-left: 5px;
            background-size: 100%;
            background-position: center;
            border-radius: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: background .2s;
            transition: transform .3s;
            

            &:hover {
                background: #dedede;
            }

            & img {
                height: 13px;
                width: 13px;
                transition: transform .3s;
            }

        }

        &__hidden-container {
            position: relative;
            overflow: hidden;
            transition: all .3s;
            width: 43px;
            height: 20px;
            background: #e8e8e8;
        }

        &__hidden {
            display: flex;
            align-items: center;
            position: absolute;
            top: 0;
            right: 0;

            &>*:not(:last-child) {
                margin-right: 5px;
            }
        }

        &__emoji {
            position: relative;
            height: 20px;
            width: 20px;
            background-size: 100%;
            transition: all .2s;
            display: flex;

            & svg {
                height: 18px;
                width: 18px;
                margin: auto;
            }

            &:hover svg {
                transform: scale(1.05);

            }
        }

        &__color {
            position: relative;
            height: 17px;
            width: 17px;
            background: linear-gradient(320deg, #47d0ad, #cf47d0, #a52222);
            background-size: 300% 300%;
            border-radius: 4px;
            transition: all .2s;
            animation: colorIconAnimate 10s ease infinite;
            animation-play-state: paused;


            &:hover {
                transform: scale(1.05);
                animation-play-state: running;
            }
        }
    }


    /*анимация при наведении на cмайл*/

    .pers__emoji {

        & stop {
            animation: emojiAnimate 10s infinite;
            animation-play-state: paused;
        }

        &:hover stop {
            animation-play-state: running;
        }
    }


    .stop-2 {
        animation-delay: 5s;
    }


    @keyframes emojiAnimate {
        15% {
            stop-color: crimson;
        }
        30% {
            stop-color: #d3b930;
        }
        45% {
            stop-color: teal;
        }
        60% {
            stop-color: yellowgreen;
        }
        75% {
            stop-color: orangered;
        }
        90% {
            stop-color: purple;
        }
    }

    /*анимация при наведении на 'выбор цвета'*/

    @keyframes colorIconAnimate {
        0% {
            background-position: 13% 0%
        }
        50% {
            background-position: 88% 100%
        }
        100% {
            background-position: 13% 0%
        }
    }


    .col-palette {
        width: 150px;
        height: 10px;
        background: gray;
        z-index: 1000;
        right: 0;
        position: relative;
        right: 20px;
        transition: all .4s;

        &__item {
            height: 100%;
            width: 20px;
            background: yellow;
        }
    }
</style>