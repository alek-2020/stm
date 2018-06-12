<!-- СПИСОК ЗАДАЧ -->
  
<template id="task-list-temp" :themeColor="themeColor">
           
            <div class="task-list" id="list-%id%" 
             v-bind:style="{ borderColor: themeColor }">
            
            <!-- <listMenu></listMenu> -->
            
            <input class="task-list__name" type="text"  
              v-model="TList.name"
              @focusout='changeListTitle(TList.name)'
              @keyup.enter='changeListTitle(TList.name)'>

            <div class="task-list__inputs-container">
              
              <OneTask
                v-for="(task, index) in doneTasks"
                :key="task.text"
                :task = 'task'
                :Index = 'index'
                :tableInd = 'activeTableIndex'
                :taskInd = 'taskListIndex'> 
              </OneTask> 



            </div>
            
            <div class="task-list__add"
             @click="AddEmptyInp(taskListIndex, (activeTableIndex))">
                <div class="task-list__text"></div>
            </div>

            <div class="task-list__checked">
              Выполненные
            </div>
            
        </div>    
</template>

<script>
import listMenu from "./ListMenu.vue";
import OneTask from "./Task.vue";


export default {
  data: function() {
    return {
      themeColor: "#528a52"
    };
  },
  methods: {
    a: function() {
      console.log(this.themeColor);
    },

    //Добавляем новую задачу (пока что просто пустой инпут)
    AddEmptyInp(taskListInd, tableInd) {
       console.log('Добавляем пустой инп', taskListInd, tableInd); 
       const mas = this.allTasks[tableInd].taskLists[taskListInd].tasks;
       const tableId = this.allTasks[tableInd].id;
       const taskListId = this.allTasks[tableInd].taskLists[taskListInd].id;
       const taskColor = "gray";
       console.log('Задачи', mas);
       const task = {
         text: 'Задача удача',
         tableId,
         taskListId,
         taskColor,
         isDone: false
       };
       mas.push(task);

       this.$store.dispatch( 'addTask', {tableInd, taskListInd, task})
  

    },

    changeListTitle(NewName) {
      
      const ListId = this.TList.id

      this.$store.dispatch('changeListTitle', { NewName, ListId });
    }

  },
  props: ['TList', 'taskListIndex'],
  components: {
    listMenu,
    OneTask
  },

  computed: {
        allTasks() {
            return this.$store.state.allTasks;
        },
        activeTableIndex() {
          return this.$store.state.activeTableIndex;
        },
        getListName() {
          const TLName = allTasks[activeTableIndex ].taskLists[taskListIndex].name
          console.log('можно и отсюда вывести ', TLName)
         if (TLName) {
            return TLName
          } else {
            return Hello
          }
        },

        //фильтруем список по сделанным задачам
        doneTasks() {
           const t = this.allTasks[this.activeTableIndex ].taskLists[this.taskListIndex].tasks;
           return t.filter(function(task){
             return !task.isDone
           });
          //  .filterBy(t.isDone);
        }

  },

  filters: {

  }
};
</script>


<style  lang="scss">
.task-list {
  // min-width: 250px;
  // max-width: 400px;
  border: solid 3px #c6c6c6ad;
  margin: 3% 0 0 3%;
  padding: 10px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  background: rgba(255, 255, 255, 0.85);
  overflow: hidden;
  box-sizing: border-box;

  &__name {
    border: none;
    background: transparent;
    text-align: center;
    font-size: 18px;
    color: #1a1919;
    font-weight: 500;
    font-family: 'Roboto', sans-serif;
    margin-bottom: 10px;
  }

  &__inputs-container {
    width: 100%;
  }

  &__add {
    height: 17px;
    width: 17px;
    // background: gray;
    background-image: url( ../../../img/icons/add-task.svg );
    background-size: 100%;
    margin-top: 10px;
  }

  &__checked {
    position: absolute;
    right: 20px;
    bottom: 10px;
    text-decoration: underline;
    font-family: 'Roboto', sans-serif;
    font-size: 13px;

  }
}

@media screen and (min-width: 300px) {
  .task-list {
    //( 100 - 3*3 )/2
     width: 94%;
  }
}

@media screen and (min-width: 550px) {
  .task-list {


    
    // min-width: 200px;
    // max-width: 500px;
    // flex-grow: 1;
    //( 100 - 3*3 )/2
     width: 45.5%;
  }
}

@media screen and (min-width: 850px) {
  .task-list {
    //( 100 - 3*3 )/2
     width: calc( 88% / 3 );
  }
}

@media screen and (min-width: 1150px) {
  .task-list {
    //( 100 - 3*3 )/2
     width: calc( 85% / 4 );
  }
}
</style>