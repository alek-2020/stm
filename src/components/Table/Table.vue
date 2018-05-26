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

    <TaskList
       v-for="(TList, index) in allTasks[activeTableIndex + 1].taskLists"
       :TList = 'TList'
       :taskListIndex = 'index'>
    </TaskList>    

    <hr>

    <span style="color: white; font-weigth: 500; background: black;">
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
        }
    },
    components: {
        TaskList
    }
  }

</script>

