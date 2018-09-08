<template>
  <div class="one-task">

    <input type="text"
           placeholder="Enter your task"
           class="one-task__text"
           v-model="task.text"
           @focusout='changeText(task.text)'
           @keyup.13='changeText(task.text)'>

    <OneTaskCheck class="one-task__check"
                  @click.native="checkTaskFunc" />
  </div>

</template>

<script>
import { mapActions } from "vuex";

import OneTaskCheck from "./OneTaskCheck.vue";

export default {
  props: ["task", "Index", "tableInd", "taskInd"],
  methods: {
    ...mapActions(["checkTask", "changeText"]),

    checkTaskFunc() {
      const task = this.task;
      const tableInd = this.tableInd;
      const taskListInd = this.taskInd;
      const taskId = this.task.id;

      this.checkTask({
        task,
        tableInd,
        taskListInd,
        taskId
      });
    },
    changeText(text) {
      const task = this.task;
      const taskInd = this.Index;
      this.changeText({ text, task });
    }
  },
  computed: {
    testFunctionForJest(val) {
      return val / 2;
    }
  },
  components: {
    OneTaskCheck
  }
};
</script>

<style lang="scss">
.one-task {
  box-shadow: 0px 2px 3px #00000045;
  border-radius: 7px;
  height: 44px;
  width: auto;
  margin: auto 12px;
  box-sizing: border-box;
  position: relative;
  background: rgba(255, 255, 255, 0.7);
  transition: all 0.5s;
  margin-top: 10px;

  &__text {
    height: 100%;
    width: 100%;
    border: none;
    box-sizing: border-box;
    padding: 0 35px 0 10px;
    background-color: transparent;
    font-size: 16px;
    font-family: "Open Sans", sans-serif;
  }

  &:hover .one-task__check,
  &:focus .one-task__check,
  &:active .one-task__check {
    opacity: 1;
  }
}
</style>

