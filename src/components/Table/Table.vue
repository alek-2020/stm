<template>
  <div class="table__main-box">
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
  <VuePerfectScrollbar class="table__taskList-box-rel">
  <div class="table__taskLists-box">
    
    
        <TaskList
          v-for="(TList, index) in thisTableTaskLists"
          :TList = 'TList'
          :taskListIndex = 'index'
          :key='TList.id'>
        </TaskList> 


      <div class="add-list__bg"
       @click="addList"
       v-if="allTasks.length > 0">
      <img src="../../../img/icons/add-plus-button.svg"
       class='add-list__img'
       >
       
     </div> 
       
  </div> 
  </VuePerfectScrollbar>
 



     <span style="color: white; font-weigth: 500; background: black;"
      >

     <!-- {{ allTasks }} -->
     </span>
      <!-- <router-link :to="'/table/fdGb'"><button>b</button></router-link> -->
     
  </div>
</template>

<script>
import TaskList from "./TaskList.vue";

import { mapGetters } from "vuex";

//скролл
import VuePerfectScrollbar from "vue-perfect-scrollbar";

export default {
  data() {
    return {
      Text: "Всякая чухня",
      VarThisTableTaskLists: []
    };
  },
  computed: {
    //три точки переводят значения в обьект или как то так, короче только так работает
    ...mapGetters({
      visibleTables: "visibleTables"
    }),
    allTasks() {
      return this.$store.state.allTasks;
    },
    activeTableIndex() {
      return this.$store.state.activeTableIndex;
    },
    allTasks() {
      return this.$store.state.allTasks;
    },
    thisTableTaskLists() {
      if (this.$store.state.allTasks.length > 0) {
        console.log("получили индекс ", this.$store.state.allTasks);
        console.log("получили индекс ", this.$store.state.allTasks[1]);
       //Проверяем загрузку нужного стола
       if(this.$store.state.allTasks[this.$store.state.activeTableIndex] != null) {
          return this.$store.state.allTasks[this.$store.state.activeTableIndex].taskLists;
       }
      }
    },

  },
  watch: {
    allTasks(val) {
      this.VarThisTableTaskLists = this.thisTableTaskLists;
      console.log("следим ", val);
    },

   //Отслеживаем url, что бы выводить нужный адрес
    '$route' (to, from) {
       console.log('Изменился адрес', to.params.link);
       
        if(this.$route.params.link != null) {
      console.log('Есть ссылка на стол');
            this.$store.dispatch('changeActiveTable', this.$route.params.link );

    } else {
      console.log('Нет ссылка на стол');
            this.$store.dispatch('pushActiveTableLink');

    }   
     }
  },
  //  beforeRouteUpdate (to, from, next) {
  //      console.log('Изменился адрес', to, from);
  //   // не забываем вызвать next()
  // },
  methods: {
    //Подтягиваем расчеты из хранилища
    //1 cпособ
    // showThing(Text) {
    //   this.$store.commit("register", Text);
    // },
    // //2 способ
    // showMeMore() {
    //   this.$store.commit({
    //     //название
    //     type: "register",
    //     //передаваемые парам
    //     table: "Всякая чухня"
    //   });
    // },
    // //так вызываем action, он дает что то вроде асинхронной загрузки для mutation
    callAction() {
      this.$store.dispatch("register", user.id);
    },
    addList() {
      this.$store.dispatch("addTaskList");
    }
  },

  mounted() {
//     console.log('Урл при загрузке ', this.$route.path, this.$route.params.link);
//     //При загрузке изменяем урл в зависимости от адреса, либо включаем урл последнего активного рс
    
//  if(this.$route.params.link != null) {
//       console.log('Есть ссылка на стол');
//     } else {
//       console.log('Нет ссылка на стол');
//     }   

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
    height: 160px;
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



</style>


