<template>
    <!-- <div class="one-task__box">  -->
        <div class="one-task__box">

            <input type="text"
            class="one-task__text"
            v-model="task.text"
            @focusout='changeText(task.text)'
            @keyup.13='changeText(task.text)'
            disabled
        >

            <div class="del-icon"
                @click="delTask">
            </div>

       </div>

    <!-- </div> -->
    <!-- <div> 
        <input type="text"
        v-model="task.text">
    </div> -->
</template>

<script>
export default {
    props: ['task', 'Index', 'tableInd', 'taskInd'],
    methods: {
    //   saveTask() {
    //     console.log('фокус ушел((((((')
    //   },
       delTask () {
        const task = this.task
        // const taskInd = this.Index
        const tableInd = this.tableInd
        const taskListInd = this.taskInd
        const taskId = this.task.id
         
        // console.log('ДЛЯ ОТМЕТКИ ОТПРАВЛЯЕМ ПАРАМЕТРЫ ', task, taskInd, tableInd, taskListInd, taskId);
        this.$store.dispatch('delTask', { task, tableInd, taskListInd, taskId})
      },
      changeText(text) {
        const task = this.task
        const taskInd = this.Index
        // const tableInd = this.tableInd
        // const taskListInd = this.taskInd

         console.log('Клавиша нажата, отправляем ', text);
         this.$store.dispatch('changeText', { text, task });
      }
    },
    computed: {

    }
}
</script>

<style lang="scss">
//   .one-task {
    
    // &__box {
    //     border: solid 2px rgb(170, 169, 169);
    //     border-radius: 7px;
    //     height: 44px;
    //     width: 85%;
    //     margin: auto;
    //     box-sizing: border-box;
    //     position: relative;
    //     background: rgba(255, 255, 255, .7);

    //     &:not(:first-child) {
    //         margin-top: 10px;
    //     }
    // }

//     &__text {
//         height: 100%;
//         width: 100%;
//         border: none;
//         box-sizing: border-box;
//         padding: 0 35px 0 10px;
//         background-color: transparent;
//         font-size: 16px;
//         font-family: 'Open Sans', sans-serif;
//     }
//   }

    .del-icon {
        height: 21px;
        width: 21px;
        background-image: url(../../img/icons/delete-can.svg);
        background-size: 100%;
        opacity: .6;
        position: absolute;
        top: 50%;
        right: 8px;
        transform: translateY(-50%);
    }

</style>

