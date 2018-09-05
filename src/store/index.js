import Vue from "vue";
import Vuex from "vuex";

import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";

import getData from "./modules/getData/getData";
import startGetTasks from "./modules/getData/startGetTasks";
import newTable from "./modules/newTable";
import newTaskList from "./modules/newTaskList";
import newTask from "./modules/newTask";
import routeHandlers from "./modules/routeHandlers";
import tableVerification from "./modules/tableVerification";

import * as firebase from "firebase";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state() {
    return {
      // Идет загрузка зачач
      tasksAreLoadingNow: true,
      //Лог событий приложения
      /*
      appLog: [
          router: [],
          getPutData: [],
          errors: []
      ]
      */
      appLog: [],
      appRouteLog: [],
      //Лоадер загрузки списков стола
      tableLoaderActive: true,
      authErrorMessage: "",
      //меню добавить
      addMenuActive: false,
      //Авторизован
      authorised: false,
      //Активно ли поле ввода имени стола
      plusActive: false,
      //Для баз данных
      userId: "",
      allTasks: [],

      //Временные массивы для загрузки задач
      masTables: [],
      masTaskLists: [],
      masTasks: [],
      //Временный массив для записи настроек
      userData: [],

      activeTableIndex: -1,
      activeTableUrl: "",
      tableSettingsActive: false,
      tableSettingsVisible: false,
      lastColId: null,

      goodNewsMes: "",
      badNewsMes: "",

      //Высота бокса со списками для расчетов
      taskListBoxHeight: "0px",
      // activeTableName: 'Колбаса',
      //Для баз данных//

      currentBgImg: "",
      tables: [],
      userIdBro: "sdf",
      userParams: "",
      settings: "",
      //градиенты кнопок столов
      //добавление рс
      gradients: [
        {
          colId: 0,
          colorOne: "#D85053",
          colorTwo: "#7C4143"
        },
        {
          colId: 1,
          colorOne: "#E2CE45",
          colorTwo: "#BCA35A"
        },
        {
          colId: 2,
          colorOne: "#39516A",
          colorTwo: "#5680A0"
        },
        {
          colId: 3,
          colorOne: "#D85053",
          colorTwo: "#7C4143"
        },
        {
          colId: 4,
          colorOne: "#C160A1",
          colorTwo: "#7F475F"
        },
        {
          colId: 5,
          colorOne: "#69AA6E",
          colorTwo: "#476949"
        },
        {
          colId: 6,
          colorOne: "#8383D0",
          colorTwo: "#57578C"
        },
        {
          colId: 7,
          colorOne: "#E67D49",
          colorTwo: "#D06B3F"
        }
      ],
      // Ссылки на фоновые изображения
      imgForBg: [
        "/img/bg/stm-bg-1.jpg",
        "/img/bg/stm-bg-2.jpg",
        "/img/bg/stm-bg-3.jpg",
        "/img/bg/stm-bg-4.jpg",
        "/img/bg/stm-bg-5.jpg",
        "/img/bg/stm-bg-6.jpg",
        "/img/bg/stm-bg-7.jpg",
        "/img/bg/stm-bg-8.jpg",
        "/img/bg/stm-bg-9.jpg",
        "/img/bg/stm-bg-10.jpg",
        "/img/bg/stm-bg-11.jpg",
        "/img/bg/stm-bg-12.jpg",
        "/img/bg/stm-bg-13.jpg",
        "/img/bg/stm-bg-14.jpg",
        "/img/bg/stm-bg-15.jpg",
        "/img/bg/stm-bg-16.jpg",
        "/img/bg/stm-bg-17.png",
        "/img/bg/stm-bg-18.png",
        "/img/bg/stm-bg-19.png",
        "/img/bg/stm-bg-20.jpg",
        "/img/bg/stm-bg-21.jpg",
        "/img/bg/stm-bg-22.jpg",
        "/img/bg/stm-bg-23.jpg",
        "/img/bg/stm-bg-24.jpg",
        "/img/bg/stm-bg-25.jpg",
        "/img/bg/stm-bg-26.jpg",
        "/img/bg/stm-bg-27.jpg",
        "/img/bg/stm-bg-28.jpg",
        "/img/bg/stm-bg-29.jpg",
        "/img/bg/stm-bg-30.jpg"
      ]
    };
  },

  mutations,
  actions,
  getters,

  modules: {
    getData,
    startGetTasks,
    newTable,
    newTaskList,
    newTask,
    routeHandlers,
    tableVerification
  }
});
