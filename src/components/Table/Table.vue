<template>
  <div>
      <!-- {{ $route.params.name }} -->
      <!-- Получаем через mapGetters -->
      <!-- {{ visibleTables }} -->
       <!-- <hr> -->
      <!-- получаем параметры напрямую -->
      <!-- {{ this.$store.getters.visibleTables }} -->
       <!-- <hr>
      {{ showMeMore }} -->
      <!-- <hr>
      {{ showThing }}
      lljlkj -->
    <!-- <router-view></router-view> -->
  <div class="table__taskLists-box">
     <TaskList
       v-for="(TList, index) in thisTableTaskLists"
       :TList = 'TList'
       :taskListIndex = 'index'
       :key='TList.name'>
    </TaskList>    
  </div> 
 
     <div class="add-list__bg"
      @click="addList">
       <img src="../../../img/icons/add-plus-button.svg"
         class='add-list__img'
         >
     </div> 


     <span style="color: white; font-weigth: 500; background: black;"
      >
     {{ allTasks }}
     </span>

  </div>
</template>

<script>
import TaskList from "./TaskList.vue";


import {mapGetters} from 'vuex'

export default {
    data() {
        return {
            Text: 'Всякая чухня'
        }
    },
    computed: {
        //три точки переводят значения в обьект или как то так, короче только так работает
        ...mapGetters({
                visibleTables: 'visibleTables'
        }),
        allTasks() {
            return this.$store.state.allTasks;
        },
        activeTableIndex() {
           return this.$store.state.activeTableIndex;
        },
        thisTableTaskLists() {
            if(this.$store.state.allTasks.lenhth > 0) {
                           console.log('получили индекс ', this.$store.state.allTasks[0]);
            console.log('получили индекс ', this.$store.state.allTasks);

               return this.$store.state.allTasks[this.activeTableIndex].taskLists;
            }
        } 
    },
    methods: {
        //Подтягиваем расчеты из хранилища
        //1 cпособ
        showThing(Text) {
           this.$store.commit('register', Text);
        },
        //2 способ
        showMeMore() {
            this.$store.commit({
                //название
                type: 'register',
                //передаваемые парам
                table: 'Всякая чухня'
            })
        },
        //так вызываем action, он дает что то вроде асинхронной загрузки для mutation
        callAction() {
             this.$store.dispatch('register', user.id)
        },
        addList() {
          this.$store.dispatch('addList');
        }
    },

    components: {
        TaskList
    }
  }

</script>


<style lang="scss">
  .add-list {
      &__bg {
          height: 46px;
          width: 46px;
          border-radius: 50%;
          background: rgba(255, 255, 255, .1);
          display: flex;
          margin-left: 140px;
      }

      &__img {
          height: 30px;
          width: 30px;
          margin: auto;
      }
  }

  .table {
    &__taskLists-box {
       display: flex;
       flex-wrap: wrap;
    //    margin-right: 3%;
    }
  }
</style>


