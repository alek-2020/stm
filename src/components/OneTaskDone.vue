<template>
    <div class="one-task__box">

        <input type="text"
               class="one-task__text"
               v-model="task.text"
               @focusout='changeText(task.text)'
               @keyup.13='changeText(task.text)'
               disabled>

        <div class="del-icon"
             @click="delTask">
        </div>

    </div>
</template>

<script>
export default {
  props: ["task", "Index", "tableInd", "taskInd"],
  methods: {
    delTask() {
      const task = this.task;
      const tableInd = this.tableInd;
      const taskListInd = this.taskInd;
      const taskId = this.task.id;
      this.$store.dispatch("delTask", { task, tableInd, taskListInd, taskId });
    },
    changeText(text) {
      const task = this.task;
      const taskInd = this.Index;
      this.$store.dispatch("changeText", { text, task });
    }
  },
  computed: {}
};
</script>

<style lang="scss">
.del-icon {
  height: 21px;
  width: 21px;
  background-image: url(../../img/icons/delete-can.svg);
  background-size: 100%;
  opacity: 0.6;
  position: absolute;
  top: 50%;
  right: 8px;
  transform: translateY(-50%);
}
</style>

