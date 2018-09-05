<template>
  <div class="one-task__box">

    <input type="text"
           placeholder="Enter your task"
           class="one-task__text"
           v-model="task.text"
           @focusout='changeText(task.text)'
           @keyup.13='changeText(task.text)'>

    <div class="check-box"
         @click="checkTask">
    </div>
  </div>

</template>

<script>
export default {
  props: ["task", "Index", "tableInd", "taskInd"],
  methods: {
    checkTask() {
      const task = this.task;
      const tableInd = this.tableInd;
      const taskListInd = this.taskInd;
      const taskId = this.task.id;

      this.$store.dispatch("checkTask", {
        task,
        tableInd,
        taskListInd,
        taskId
      });
    },
    changeText(text) {
      const task = this.task;
      const taskInd = this.Index;
      this.$store.dispatch("changeText", { text, task });
    }
  },
  computed: {
    testFunctionForJest(val) {
      return val / 2;
    }
  }
};
</script>

<style lang="scss">
.one-task {
  &__box {
    box-shadow: 0 0 7px #00000045;
    border-radius: 7px;
    height: 44px;
    width: auto;
    margin: auto 12px;
    box-sizing: border-box;
    position: relative;
    background: rgba(255, 255, 255, 0.7);
    transition: all 0.5s;
    margin-top: 10px;

    &:hover .check-box,
    &:focus .check-box,
    &:active .check-box {
      right: 8px;
      opacity: 1;
    }
  }

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
}

.check-box {
  height: 20px;
  width: 20px;
  border: solid 2px rgb(170, 169, 169);
  border-radius: 5px;
  position: absolute;
  top: 50%;
  right: 5px;
  opacity: 5px;
  opacity: 0;
  transform: translateY(-50%);
  transition: all cubic-bezier(0, 0, 0.2, 1) 0.3s;
  transition-delay: 0.2s;
}
</style>

