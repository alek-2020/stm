<!-- СПИСОК ЗАДАЧ -->
// TODO: что бы каждый раз при смене фокуса из инпута не появлялось окно "отредактировано " и не оправлялся запрос на сервер нужно сравнить инпут при фокусе и при его уходе с инпута, если они разные то постим изменения, если нет то ничего не делаем
// TODO: вместо цветов на отдельных задачах сделать возможность выделать приоритетные. Приоритетные будут цвета общец палитры списка, подниматься вверх и на них возможно будет огонек или другая пометка, которая будет располагаться на месте чекбокса и будет пропадать при ховере, что бы освободить для чекбокса место
// TODO: сделать адаптацию ширины списка под маленькие экраны и перелистывание на них как на слайдере с доводкой(фокусировкой)
// TODO: сделать галочку в чекбоксе при наведении серую и при нажатии более темную
// TODO: сделать чек бокс не выезжающим а вырастающим из точки
// TODO: ОШИБКИ СОЕДИНЕНИЯ С СЕТЬСЯ ОТРАБОТАТЬ. ВЫПЛЕВЫВАТЬ ОКОШКО 'ПЕРЕЗАГРУЗИТЬ' + ДЕЛАТЬ АВТОМАТИЧЕСКУЮ ПЕРЕЗАГРУЗКУ ИЛИ ПЕРЕЗАПРОС
// TODO: Добавить комментарий к задаче и ограничение по символам
// TODO: Сделать окно задачи многострочным
// TODO: Поделить задачи на важные для презентации в портфолио и важные для конечного потребителя
// TODO: Убрать v-for и v-if с одного тега

<template>

  <div class="task-list"
       ref="taskBox">

    <TaskListHeader 
       :name="TList.name" 
       :taskListIndex="taskListIndex" />

    <VuePerfectScrollbar class="task-list__scroll-box"
                         ref="ps"
                         :style="{height: taskBoxHeight}">
      <div class="task-list__inputs-container"
           ref="inputsContainer">

        <transition-group name="tasks"
                          class="tasks-list__transition-box"
                          v-on:after-leave="afterLeave"
                          >

          <OneTask style="{display: flex; transition: all .5s;}"
                   v-for="(task, index) in currentTasks"
                   v-if="!onlyDoneTasks"
                   :key="task.id"
                   :task='task'
                   :Index='index'
                   :tableInd='activeTableIndex'
                   :taskInd='taskListIndex'>
          </OneTask>

          <OneDoneTask v-for="(task, index) in doneTasks"
                       v-if="onlyDoneTasks"
                       :key="task.id"
                       :task='task'
                       :Index='index'
                       :tableInd='activeTableIndex'
                       :taskInd='taskListIndex'>
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
             :style="{backgroundImage: !addingTask ? addIcon : loadingIcon }"
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

    <ConfirmationWindow :askConfirm="askConfirm"
                        @confirmResponse="confirmedRemove">
      <div slot="message">
        Confirm removing list
      </div>
      <span slot="action">
        Delete
      </span>
    </ConfirmationWindow>
  </div>
</template>

<script>
import listMenu from "../TaskListMenu.vue";
import OneTask from "../OneTaskCurrent.vue";
import OneDoneTask from "../OneTaskDone.vue";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import ConfirmationWindow from "../PopupConfirmation.vue";
import TaskListHeader from "./TaskLIstHeader.vue";

import { mapState } from "vuex";

export default {
  data: function() {
    return {
      taskBoxHeight: 0,
      maxBoxHeight: 0,
      onlyDoneTasks: false,
      scrollSettings: {
        suppressScrollY: false
      },
      emojiState: false,
      menuState: false,
      askConfirm: false,
      // Задача добавляется
      addingTask: false
    };
  },

  methods: {


   
    //Принимает новый цвет из палитры и меняем
    changeMainColor(index) {
      this.$store.state.allTasks[this.activeTableIndex].taskLists[
        this.taskListIndex
      ].color = index;
      //Push color id to firebase
      let allData = new Object();
      allData.colIndex = index;
      allData.actTableInd = this.activeTableIndex;
      allData.taskListInd = this.taskListIndex;
      this.$store.dispatch("pushListColor", allData);
    },
    afterLeave() {
      this.changeHeightOfList();
    },
    changeHeightOfList() {
      if (this.$refs.inputsContainer != null) {
        this.taskBoxHeight = this.$refs.inputsContainer.clientHeight + "px";
        this.$refs.ps.update();
      }
    },
    showDoneTasks() {
      this.onlyDoneTasks = !this.onlyDoneTasks;
    },

    //Добавляем новую задачу (пока что просто пустой инпут)
    AddEmptyInp(taskListInd, tableInd) {
      this.addingTask = true;

      this.$store
        .dispatch("addNewTask", {
          tableInd,
          taskListInd
        })
        .then(() => {
          this.addingTask = false;
        });
    },


    removeList(id, taskListIndex, activeTableIndex) {
      this.dataForRemoving = {
        id,
        taskListIndex,
        activeTableIndex
      };

      this.askConfirm = true;
    },
    confirmedRemove(responce) {
      if (responce) {
        const id = this.dataForRemoving.id;
        const taskListIndex = this.dataForRemoving.taskListIndex;
        const activeTableIndex = this.dataForRemoving.activeTableIndex;

        this.$store.dispatch("removeList", {
          id,
          taskListIndex,
          activeTableIndex
        });
      }
      this.askConfirm = false;
      this.dataForRemoving = {};
    }
  },
  props: ["TList", "taskListIndex"],
  components: {
    listMenu,
    OneTask,
    OneDoneTask,
    VuePerfectScrollbar,
    ConfirmationWindow,
    TaskListHeader
  },

  computed: {
    ...mapState([
      "allTasks",
      "activeTableIndex",
      "gradients",
      "taskListBoxHeight"
    ]),
    addIcon() {
      return "url(../../img/icons/add-task.svg)";
    },
    loadingIcon() {
      return "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDBweCIgaGVpZ2h0PSIyMDBweCIgY2xhc3M9Imxkcy1yb2xsaW5nIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCIgc3R5bGU9ImJhY2tncm91bmQ6bm9uZSIgdmlld0JveD0iMCAwIDEwMCAxMDAiPg0KICAgIDxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjM1IiBmaWxsPSJub25lIiBzdHJva2U9ImdyYXkiIHN0cm9rZS1kYXNoYXJyYXk9IjE2NC45MzM2MTQzMTM0NjQxNSA1Ni45Nzc4NzE0Mzc4MjEzOCIgc3Ryb2tlLXdpZHRoPSIxMCIgbmctYXR0ci1yPSJ7e2NvbmZpZy5yYWRpdXN9fSIgbmctYXR0ci1zdHJva2U9Int7Y29uZmlnLmNvbG9yfX0iIG5nLWF0dHItc3Ryb2tlLWRhc2hhcnJheT0ie3tjb25maWcuZGFzaGFycmF5fX0iIG5nLWF0dHItc3Ryb2tlLXdpZHRoPSJ7e2NvbmZpZy53aWR0aH19IiB0cmFuc2Zvcm09InJvdGF0ZSgxMzcuOTA4IDUwIDUwKSI+DQogICAgICAgIDxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIgYmVnaW49IjBzIiBjYWxjTW9kZT0ibGluZWFyIiBkdXI9IjFzIiBrZXlUaW1lcz0iMDsxIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgdHlwZT0icm90YXRlIiB2YWx1ZXM9IjAgNTAgNTA7MzYwIDUwIDUwIi8+DQogICAgPC9jaXJjbGU+DQo8L3N2Zz4NCg==')";
    },
    //Цветовая схема списка
    MainListColor() {
      return this.gradients[this.themeColorId];
    },
    // Цвет списка
    themeColorId() {
      return this.activeTaskList ? this.activeTaskList.color : 0;
    },
    // Текущий список
    activeTaskList() {
      return this.allTasks[this.activeTableIndex].taskLists[this.taskListIndex];
    },
    // Таски списка
    tasks() {
      return this.activeTaskList.tasks;
    },
    // Активные задачи
    currentTasks() {
      return this.tasks ? this.tasks.filter(task => !task.isDone) : [];
    },
    // Сделанные задачи
    doneTasks() {
      return this.tasks ? this.tasks.filter(task => task.isDone) : [];
    }
  },

  //Изменение dom
  updated() {
    this.$nextTick(() => {
      this.changeHeightOfList();
    });
  },

  mounted() {
    //При первичной загрузке считаем высоту
    this.changeHeightOfList();
  },
  watch: {
    TList(val) {
      console.log("Изменился tList", val);
    },
    allTasks(val) {
      console.log("Изменился массив задач", val);
    }
  }
};
</script>


<style  lang="scss">
// Скролл
@import "../../scss/scrollSettings/_taskList.scss";

.task-list {
  border: none;
  margin-left: 15px;
  padding: 0 1px 10px 1px;
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
  box-shadow: 0 0 13px rgba(0, 0, 0, 0.25);
  min-height: 150px;

  &__inputs-container {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    // что бы не обрезался кусок последнего инпута
    padding-bottom: 2px;
  }

  &__scroll-box {
    width: 100%;
    height: 100px;
    position: relative;
    overflow: hidden;
    transition: height 0.3s;
  }

  &__add {
    height: 17px;
    width: 17px;
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
    font-family: Roboto;
    border: solid 1px #a1a1a1;
  }

  &__bottom-box {
    height: 28px;
    min-height: 28px;
  }
}

//Header box
.task-list {
  &__menu {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
  }
}

.tasks-list__transition-box {
  transition: all 1s;
}

// Подгоняем ширину списка на мобильных
@media screen and (max-width: 400px) {
  .task-list,
  .add-list__bg {
    width: 94vw;
    min-width: 250px;
  }
}
</style>