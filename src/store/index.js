import Vue from 'vue'
import Vuex from 'vuex'

import actions from './actions'
import mutations from './mutations'
import getters from './getters'

import getData from './modules/getData'
import newTable from './modules/newTable'
import newTaskList from './modules/newTaskList'
import newTask from './modules/newTask'
import routeHandlers from './modules/routeHandlers'
import tableVerification from './modules/tableVerification'

import * as firebase from "firebase";

Vue.use(Vuex)

export const store = new Vuex.Store({
    state() {
        return {
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
            authErrorMessage: '',
            //меню добавить
            addMenuActive: false,
            //Авторизован
            authorised: false,
            //Активно ли поле ввода имени стола
            plusActive: false,
            //Для баз данных
            userId: '',
            allTasks: [],

            //Временные массивы для загрузки задач 
            // userTables: [],
            // tableTaskLists: [],
            // listTasks: [],
            masTables: [],
            masTaskLists: [],
            masTasks: [],
            //Временный массив для записи настроек
            userData: [],

            activeTableIndex: -1,
            activeTableUrl: '',
            tableSettingsActive: false,
            tableSettingsVisible: false,
            lastColId: null,

            goodNewsMes: '',
            badNewsMes: '',

            //Высота бокса со списками для расчетов
            taskListBoxHeight: '0px',
            // activeTableName: 'Колбаса',        
            //Для баз данных//

            currentBgImg: '',
            tables: [],
            tasks: [
                // {
                //     text: 'Раз',
                //     visible: false
                // },
                // {
                //     text: 'Два',
                //     visible: true
                // },
                // {
                //     text: 'Три брат три уже',
                //     visible: true
                // }
            ],
            userIdBro: 'sdf',
            userParams: '',
            settings: '',
            //градиенты кнопок столов
            //добавление рс
            gradients: [
                {
                    colId: 0,
                    colorOne: "#D85053",
                    colorTwo: "#7C4143"
                }, {
                    colId: 1,
                    colorOne: "#E2CE45",
                    colorTwo: "#BCA35A"
                }, {
                    colId: 2,
                    colorOne: "#39516A",
                    colorTwo: "#5680A0"
                }, {
                    colId: 3,
                    colorOne: "#D85053",
                    colorTwo: "#7C4143"
                }, {
                    colId: 4,
                    colorOne: "#C160A1",
                    colorTwo: "#7F475F"
                }, {
                    colId: 5,
                    colorOne: "#69AA6E",
                    colorTwo: "#476949"
                }, {
                    colId: 6,
                    colorOne: "#8383D0",
                    colorTwo: "#57578C"
                }, {
                    colId: 7,
                    colorOne: "#E67D49",
                    colorTwo: "#D06B3F"
                },
            ],
        }
    },

    mutations,
    actions,
    getters,

    modules: {
        getData,
        newTable,
        newTaskList,
        newTask,
        routeHandlers,
        tableVerification
    },

})