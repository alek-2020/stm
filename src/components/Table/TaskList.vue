<!-- СПИСОК ЗАДАЧ -->
  
<template id="task-list-temp" :themeColor="themeColor">
           
            <div class="task-list" id="list-%id%" 
             v-bind:style="{ borderColor: themeColor }"
             ref="taskBox">
            
            <!-- <listMenu></listMenu> -->
            
            <input class="task-list__name" type="text"  
              v-model="TList.name"
              @focusout='changeListTitle(TList.name)'
              @keyup.enter='changeListTitle(TList.name)'>

              <VuePerfectScrollbar class="task-list__scroll-box"
                v-once :settings="scrollSettings"
                :style="{height: taskBoxHeight}">
                  <div class="task-list__inputs-container"
                    ref="inputsContainer">
                      
                    <transition-group
                      name="tasks"
                      class="tasks-list__transition-box"
                      v-on:after-leave="afterLeave">
                      <OneTask
                        style="{display: flex; transition: all .5s;}"
                        v-for="(task, index) in currentTasks"
                        v-if="!onlyDoneTasks"
                        :key="task.id"
                        :task = 'task'
                        :Index = 'index'
                        :tableInd = 'activeTableIndex'
                        :taskInd = 'taskListIndex'> 
                      </OneTask> 

                      <OneDoneTask
                        v-for="(task, index) in doneTasks"
                        v-if="onlyDoneTasks"
                        :key="task.id"
                        :task = 'task'
                        :Index = 'index'
                        :tableInd = 'activeTableIndex'
                        :taskInd = 'taskListIndex'>
                      </OneDoneTask>
                    </transition-group>

                  </div>
              </VuePerfectScrollbar>
            
                <div class="btn btn_icon_delete task-list__del"
                  v-if="currentTasks.length < 1 && !onlyDoneTasks"
                  @click="removeList(TList.id, taskListIndex, activeTableIndex)">
                  Удалить список
                </div>

                <div class="btn task-list__del"
                  v-if="doneTasks.length < 1 && onlyDoneTasks">
                  Выполненных пока нет
                </div>

            <div class="task-list__bottom-box">
                <transition name="doneBtn"> 
                  <div class="task-list__add"
                  v-show="!onlyDoneTasks"
                  @click="AddEmptyInp(taskListIndex, (activeTableIndex))">
                      <div class="task-list__text"></div>
                  </div>
               </transition>

                <div class="task-list__checked"
                  @click="showDoneTasks">
                
                <transition name="doneBtn" 
                 mode="out-in">
                  <span :key="onlyDoneTasks">
                    {{ onlyDoneTasks ? 'Текущие' : 'Выполненные' }}
                  </span>
                </transition>

                </div>

            </div>
        </div>    
</template>

<script>
import listMenu from "./ListMenu.vue";
import OneTask from "./Task.vue";
import OneDoneTask from "./DoneTask.vue";
import VuePerfectScrollbar from "vue-perfect-scrollbar";

export default {
  data: function() {
    return {
      themeColor: "#528a52",
      taskBoxHeight: 0,
      maxBoxHeight: 0,
      onlyDoneTasks: false,
      scrollSettings: {
        suppressScrollY: true
      }
    };
  },
  methods: {
    afterLeave() {
       this.changeHeightOfList();
       console.log('Пересчет высоты при завершении анимации');
    },
    changeHeightOfList() {
       if(this.$refs.inputsContainer != null) {
          this.taskBoxHeight = this.$refs.inputsContainer.clientHeight + "px";
          console.log('Пересчет высоты', this.taskBoxHeight);
       }
   },
    showDoneTasks() {
       this.onlyDoneTasks = !this.onlyDoneTasks;
      //  this.changeHeightOfList();
       console.log('Пересчет высоты при переключении');
    },

    a: function() {
      console.log(this.themeColor);
    },

    //Добавляем новую задачу (пока что просто пустой инпут)
    AddEmptyInp(taskListInd, tableInd) {
      this.$store.dispatch("addNewTask", { tableInd, taskListInd });
    },

    changeListTitle(NewName) {
      const ListId = this.TList.id;

      this.$store.dispatch("changeListTitle", { NewName, ListId });
    },

    removeList(id, taskListIndex, activeTableIndex) {
      this.$store.dispatch("removeList", {
        id,
        taskListIndex,
        activeTableIndex
      });
    }
  },
  props: ["TList", "taskListIndex"],
  components: {
    listMenu,
    OneTask,
    OneDoneTask,
    VuePerfectScrollbar
  },

  computed: {
    maxBoxHeightFunc() {
      return this.$store.state.taskListBoxHeight - 92 + "px";
    },
    allTasks() {
      return this.$store.state.allTasks;
    },
    activeTableIndex() {
      return this.$store.state.activeTableIndex;
    },
    getListName() {
      const TLName = allTasks[activeTableIndex].taskLists[taskListIndex].name;
      console.log("можно и отсюда вывести ", TLName);
      if (TLName) {
        return TLName;
      } else {
        return Hello;
      }
    },

    //фильтруем список по сделанным задачам
    currentTasks() {
      const t = this.allTasks[this.activeTableIndex].taskLists[
        this.taskListIndex
      ].tasks;
      return t.filter(function(task) {
        return !task.isDone;
      });
      //  .filterBy(t.isDone);
    },

    doneTasks() {
      const t = this.allTasks[this.activeTableIndex].taskLists[
        this.taskListIndex
      ].tasks;
      return t.filter(function(task) {
        return task.isDone;
      });
      //  .filterBy(t.isDone);
    }


    //   taskBoxHeight() {
    //     if(this.$refs.inputsContainer != null) {
    //     console.log('Получили высоту элемента ', this.$refs);
    //     // console.log('Получили высоту элемента ', this.$refs.inputsContainer.clientHeight);
    //     return this.$refs.inputsContainer.clientHeight;
    //  }
    //  return '10px';
    //     }
  },

  updated: function() {
    this.$nextTick(function() {
      // Code that will run only after the
      // entire view has been re-rendered
      console.log("Элемент ", this.$refs);
      // this.taskBoxHeight = this.$refs.inputsContainer.clientHeight + "px";
      this.changeHeightOfList();
      console.log('Пересчет высоты при изменении древа');

      //  if(this.$store.state.taskListBoxHeight != null) {
      //    this.maxBoxHeight = this.$store.state.taskListBoxHeight -  92 + 'px';
      //  }
    });
  },

  mounted() {
    //  console.log('Элемент ', this.$refs);
    //При первичной загрузке считаем высоту
    this.changeHeightOfList();
  },
  filters: {}
};
</script>


<style  lang="scss">
.task-list {
  // min-width: 250px;
  // max-width: 400px;
  border: solid 3px #c6c6c6ad;
  margin-left: 15px;
  padding: 10px 1px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  background: rgba(255, 255, 255, 0.85);
  overflow: hidden;
  box-sizing: border-box;
  height: min-content;
  width: 350px;
  max-height: 100%;

  &__name {
    border: none;
    background: transparent;
    text-align: center;
    font-size: 18px;
    color: #1a1919;
    font-weight: 500;
    font-family: "Roboto", sans-serif;
    margin-bottom: 10px;
    width: 90%;
  }

  &__inputs-container {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    // padding-right: 15px;
  }

  &__scroll-box {
    width: 100%;
    height: 100px;
    position: relative;
    overflow: hidden;
    transition: height .3s;
  }

  &__add {
    height: 17px;
    width: 17px;
    // background: gray;
    background-image: url(../../../img/icons/add-task.svg);
    background-size: 100%;
    margin-top: 10px;
  }

  &__checked {
    position: absolute;
    right: 20px;
    bottom: 10px;
    text-decoration: underline;
    font-family: "Roboto", sans-serif;
    font-size: 13px;
  }

  &__del {
    height: 40px;
    width: 70%;
    background: #cacaca;
    font-family: Roboto;
  }

  &__bottom-box {
    height: 28px;
    min-height: 28px;
  }
}

.task-list {
  /////////////////////////
  // КАСТОМИЗАЦИЯ СКРОЛЛА
  /////////////////////////

  ////////СКРОЕМ СКРОЛЛ ПО ДРУГОЙ ОСИ
  ////////ОБЫЧНОЕ СОТОЯНИЕ

  //Область скролла
  & .ps.ps--active-y > .ps__scrollbar-y-rail {
    display: block;
    background-color: transparent;
    width: 6px;
    transition: height 0.3s;
    opacity: 1;
    border-radius: 0;
  }

  //скроллбар
  & .ps.ps--active-y > .ps__scrollbar-y-rail > .ps__scrollbar-y {
    background-color: #b7b7b7f8;
    width: 6px;
    transition: height 0.3s;
    opacity: 1;
    border-radius: 3;
    bottom: 0;
  }

  ////////HOVER

  //Область скролла
  & .ps.ps--active-y > .ps__scrollbar-y-rail:hover {
    width: 6px;
    transition: height 0.2s;
    background-color: transparent;
  }

  //скроллбар
  & .ps:hover > .ps__scrollbar-y-rail:hover > .ps__scrollbar-y {
    width: 6px;
    // padding: 0;
    background-color: #b7b7b7f8;
    opacity: 1;
    // border-radius: 0;
    bottom: 0;
  }

  //////АCTIVE

  & .ps__scrollbar-y-rail {
    right: 0px;
    background-color: #b7b7b7f8;
    width: 6px;
  }
  //область скролла
  & .ps:hover.ps--in-scrolling.ps--y > .ps__scrollbar-y-rail {
    background-color: transparent;
    opacity: 1;
    width: 6px;
  }

  //скроллбар

  &
    .ps:hover.ps--in-scrolling.ps--y
    > .ps__scrollbar-y-rail
    > .ps__scrollbar-y {
    background-color: #b7b7b7f8;
    opacity: 1;
    width: 6px;
  }

  //////АCTIVE NOT HOVER

  //область скролла
  & .ps.ps--in-scrolling.ps--y > .ps__scrollbar-y-rail {
    background-color: transparent;
    opacity: 1;
    width: 6px;
  }

  //скроллбар

  & .ps.ps--in-scrolling.ps--y > .ps__scrollbar-y-rail > .ps__scrollbar-y {
    width: 6px;
    opacity: 1;
    background-color: #b7b7b7f8;
  }

  //Сделано через родителя, потому что иначе перебиваются настройки плагина
  & .smoothScroll .desk-btns__rel-cont {
    scroll-behavior: smooth;
  }
}

// @media screen and (min-width: 300px) {
//   .task-list {
//     //( 100 - 3*3 )/2
//      width: 94%;
//   }
// }

// @media screen and (min-width: 550px) {
//   .task-list {

//     // min-width: 200px;
//     // max-width: 500px;
//     // flex-grow: 1;
//     //( 100 - 3*3 )/2
//      width: 45.5%;
//   }
// }

// @media screen and (min-width: 850px) {
//   .task-list {
//     //( 100 - 3*3 )/2
//      width: calc( 88% / 3 );
//   }
// }

// @media screen and (min-width: 1150px) {
//   .task-list {
//     //( 100 - 3*3 )/2
//      width: calc( 85% / 4 );
//   }
// }

//Анимация для списка задач
// .tasks-item {
//     transition: all 1s;
// }

// .tasks-enter-active, .tasks-leave-active {
//   opacity: 0;
// }

.tasks-list__transition-box {
  transition: all 1s;
}

.tasks-enter-active,
.tasks-leave-active {
  // opacity: 0;
  // transform: translateX(-130%);
  // transition: all .5s;
}

.tasks-leave-active {
  position: absolute;
}
//стартовая точка
.tasks-enter {
  transform: translateX(-130%);
  opacity: 0;
}

//Конечная точка
.tasks-leave-to {
  opacity: 0;
  transform: translateX(130%);
}


.tasks-move {
  transition: all 1s;
  background: red !important;
  border: solid !important;
}

// .list-complete-leave-active {
//   position: absolute;
// }



//Анимация кнопки на списке
.doneBtn-enter, 
.doneBtn-leave-to {
  opacity: 0;
  transition: opacity .5s;
}

.doneBtn-enter-to {
  transition: opacity .5s;
}

</style>