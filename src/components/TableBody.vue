// TODO: Сделать проверку на undefined у адреса запроса к firebase, что бы не появлялось элементов с названием undefined 
// FIXME: Сделать грубый перенос с разрывом строки
// FIXME: СДЕЛАТЬ СООБЩЕНИЕ НЕ ПОВЕРХ А ВЫЛЕЗАЮЩИМИ ПОДНИМАЮЩИМ КОНТЕНТ ОКНА, ЧТО БЫ НЕ МЕШАТЬ
<template>
  <transition name="fade"
              mode="out-in">
    <div class="table__main-box"
         ref="tableBox"
         @click="deactivateSettings">

      <VuePerfectScrollbar ref="ps"
                           class="table__taskList-box-rel">
        <div class="table__taskLists-box"
             ref="taskListBox">
          <!-- <div v-if="thisTableTaskLists.length > 0"> -->
            <TaskList v-for="(TList, index) in thisTableTaskLists"
                      :TList='TList'                   
                      :taskListIndex='index'
                      :key='TList.id'
                      ref="list">
            </TaskList>
          <!-- </div> -->
          <div class="add-list__bg"
               v-if="GetAllTasks.length"
               @click="addList">
            <img src="../../img/icons/add-plus-button.svg"
                 class='add-list__img'>
          </div>

        </div>
      </VuePerfectScrollbar>

      <span style="color: white; font-weigth: 500; background: black;">
      </span>

    </div>
  </transition>
</template>

<script>
import TaskList from "./TaskList.vue";

import { mapGetters, mapState } from "vuex";

//скролл
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import { functions } from "firebase";

export default {
  data() {
    return {
      Text: "Всякая чухня",
      VarThisTableTaskLists: []
    };
  },
  computed: {
    ...mapGetters(["visibleTables", "GetAllTasks"]),
    ...mapState([
      "allTasks",
      "activeTableIndex",
      "activeTableIndex",
      "userData"
    ]),

    activeTable() {
      return this.allTasks[this.activeTableIndex];
    },

    thisTableTaskLists() {
      return this.allTasks && this.activeTable && this.activeTable.taskLists
        ? this.activeTable.taskLists
        : [];
    }
  },
  watch: {
    allTasks(val) {
      console.log("изменение главного массива", val);
    },
    GetAllTasks(val) {
      this.VarThisTableTaskLists = this.thisTableTaskLists;
    }
  },
  methods: {
    //Функция выполняется событием тача, когда убираем палец
    listPositionCalc() {
      /*Найти выдимие части элементов и сфокусировать на той, которая больше видна*/
      //селектор списков
      let lists = this.$refs.list;
      //Ширина экрана клиента
      let clientWidth = this.$refs.ps.$el.clientWidth;
      //Значение скрола на данный момент
      let scrolled = this.$refs.ps.$el.scrollLeft;

      let elLeft;
      let elWidth;

      let firstVisible;
      let secondVisible;

      let nextList;
      let nextListLeft;

      let space;
      //Если есть хотя бы один список
      if (lists) {
        lists.forEach((list, i) => {
          elLeft = list.$el.offsetLeft;
          elWidth = list.$el.clientWidth;
          //Если условие выполняется элемент пересекает экран слева, значит следующий элемент, если он есть справа
          if (elLeft < scrolled && elLeft + elWidth > scrolled) {
            //Запишим ширину видимой части и сравним с шириной видимой части следующего
            firstVisible = elLeft + elWidth - scrolled;

            //Расстояние от элемента до экрана в сфокусированном сотоянии
            space = (clientWidth - elWidth) / 2;

            //Если сдедующий существует
            if (this.$refs.list[i + 1]) {
              nextList = this.$refs.list[i + 1].$el;
              nextListLeft = nextList.offsetLeft;
              secondVisible = scrolled + clientWidth - nextListLeft;

              if (firstVisible > secondVisible) {
                scrollTo = elLeft - space;
              } else {
                scrollTo = nextListLeft - space;
              }
              this.scrollTo(this.$refs.ps.$el, scrollTo, scrolled);

              //Если правая часть первого видимого элемента больше
            } else if (elLeft + elWidth - scrolled > elWidth / 2) {
              scrollTo = elLeft - space;
              this.scrollTo(this.$refs.ps.$el, scrollTo, scrolled);
            }
          }
        });
      }
    },
    scrollTo(element, sclollTo, scrolled) {
      let direction = "right";
      let distance = scrollTo - scrolled;
      if (distance < 0) {
        distance = Math.abs(distance);
        direction = "left";
      }
      let step = 10;
      let speed = 1;

      distance = Math.abs(distance);
      let scrollAmount = 0;

      var slideTimer = setInterval(function() {
        if (direction == "left") {
          element.scrollLeft -= step;
        } else {
          element.scrollLeft += step;
        }
        scrollAmount += step;
        if (scrollAmount >= distance) {
          window.clearInterval(slideTimer);
        }
      }, speed);
    },
    deactivateSettings() {
      this.$store.state.tableSettingsActive = false;
      this.$store.state.addMenuActive = false;
    },

    callAction() {
      this.$store.dispatch("register", user.id);
    },
    addList() {
      this.$store.dispatch("addTaskList");
    }
  },

  mounted() {
    /*Отслеживание убранного от экрана пальца для автофокуса.
    Пока что на доработке
   
    let t = this
    if(this.$refs.ps.$el.clientWidth <= 400) {
        // TODO: сделать возможность отключения автофокуса в настройках. Но это не точно.
        this.$refs.taskListBox.addEventListener('touchend', function(e){
            t.listPositionCalc()
      }, false)
    }
    */

    // this.$store.dispatch('updateActiveTable', 1);
    //     console.log('Урл при загрузке ', this.$route.path, this.$route.params.link);
    //     //При загрузке изменяем урл в зависимости от адреса, либо включаем урл последнего активного рс

    //    var t = this;
    //    //при изменении арзмера окна пишем высота бокса в стор для адаптивных списков
    //    window.addEventListener("resize", function() {
    //     console.log("Resource conscious resize callback!", t.listBoxH);
    //     t.$store.state.taskListBoxHeight = t.$refs.taskListBox.clientHeight;
    // // this.ttest;
    //    console.log('ресайз', t.goodNewsMess);
    // });

    //Отслеживаем изменение высоты блоки, для адаптивных списков задач
    //watch задан императивным путем https://ru.vuejs.org/v2/api/#vm-watch
    // this.$watch(
    //     () => {
    //       return this.$refs.taskListBox.clientHeight;
    //     },
    //     (val) => {
    //       console.log("высота поменялась watch2", val);
    //     }
    // );

    // this.$watch(this.listBoxH, function() {
    //       console.log("высота поменялась blabla ", val);
    //     });

    //  this.$watch(
    //     	() => {
    //     		return this.$refs.counter.i
    //     	},
    //       (val) => {
    //         alert('App $watch $refs.counter.i: ' + val)
    //       }
    //     )

    //Запишем в хранилице высоту блока для расчетов
    // this.$store.state.taskListBoxHeight = this.$refs.taskListBox.clientHeight;
  },
  components: {
    TaskList,
    VuePerfectScrollbar
  }
};
</script>


<style lang="scss">
.add-list {
  &__bg {
    display: flex;
    margin-left: 15px;

    width: 220px;
    height: 151px;
    margin-left: 15px;
    background: #ffffff29;
    border-radius: 4px;
    position: relative;
  }

  &__img {
    height: 30px;
    width: 30px;
    margin: auto;
  }
}

.table {
  &__main-box {
    position: relative;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
  &__taskLists-box {
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    padding-right: 15px;
    padding-top: 15px;
    max-height: 100%;
    overflow: hidden;
    height: 100%;
    box-sizing: border-box;
    padding-bottom: 25px;
  }

  &__taskList-box-rel {
    position: relative;
    overflow: hidden;
    display: flex;
    flex-grow: 1;
    flex-direction: column;
  }
}

.table__main-box {
  /////////////////////////
  // КАСТОМИЗАЦИЯ СКРОЛЛА
  /////////////////////////

  ////////ОБЫЧНОЕ СОТОЯНИЕ

  //Область скролла
  & .ps.ps--active-x > .ps__scrollbar-x-rail {
    display: block;
    background-color: #ffffff31;
    height: 10px;
    transition: height 0.3s;
    opacity: 1;
    border-radius: 0;
  }

  //скроллбар
  & .ps.ps--active-x > .ps__scrollbar-x-rail > .ps__scrollbar-x {
    background-color: #ffffff4b;
    height: 10px;
    transition: height 0.3s;
    // opacity: 1;
    border-radius: 0;
    bottom: 0;
  }

  ////////HOVER

  //Область скролла
  & .ps.ps--active-x > .ps__scrollbar-x-rail:hover {
    height: 10px;
    transition: height 0.2s;
    background-color: #ffffff31;
  }

  //скроллбар
  & .ps:hover > .ps__scrollbar-x-rail:hover > .ps__scrollbar-x {
    height: 10px;
    // padding: 0;
    background-color: rgba(255, 255, 255, 0.6);
    opacity: 1;
    border-radius: 0;
    bottom: 0;
  }

  //////АCTIVE

  & .ps__scrollbar-x-rail {
    bottom: 0px;
  }
  //область скролла
  & .ps:hover.ps--in-scrolling.ps--x > .ps__scrollbar-x-rail {
    background-color: #ffffff31;
    opacity: 1;
  }

  //скроллбар

  &
    .ps:hover.ps--in-scrolling.ps--x
    > .ps__scrollbar-x-rail
    > .ps__scrollbar-x {
    background-color: rgba(255, 255, 255, 0.6);
    opacity: 1;
  }

  //////АCTIVE NOT HOVER

  //область скролла
  & .ps.ps--in-scrolling.ps--x > .ps__scrollbar-x-rail {
    background-color: #ffffff31;
    opacity: 1;
    height: 10px;
  }

  //скроллбар

  & .ps.ps--in-scrolling.ps--x > .ps__scrollbar-x-rail > .ps__scrollbar-x {
    background-color: rgba(255, 255, 255, 0.6);
    opacity: 1;
  }

  //Сделано через родителя, потому что иначе перебиваются настройки плагина
  & .smoothScroll .desk-btns__rel-cont {
    scroll-behavior: smooth;
  }
}

//анимация
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
  opacity: 0;
}
</style>

