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
                    colorOne: "#C44499",
                    colorTwo: "#5E1C45"
                },                {
                    colId: 1,
                    colorOne: "#D687D9",
                    colorTwo: "#63375D"
                },                {
                    colId: 2,
                    colorOne: "#8787D9",
                    colorTwo: "#43365D"
                },                {
                    colId: 3,
                    colorOne: "#467599",
                    colorTwo: "#282F43"
                },                {
                    colId: 4,
                    colorOne: "#83C9DE",
                    colorTwo: "#41515F"
                },                {
                    colId: 5,
                    colorOne: "#83DEC2",
                    colorTwo: "#415A54"
                },                {
                    colId: 6,
                    colorOne: "#46994C",
                    colorTwo: "#283E24"
                },                {
                    colId: 7,
                    colorOne: "#90B458",
                    colorTwo: "#464828"
                },                {
                    colId: 8,
                    colorOne: "#DCC73F",
                    colorTwo: "#66511F"
                },                {
                    colId: 9,
                    colorOne: "#EC7F49",
                    colorTwo: "#6D3423"
                },                {
                    colId: 10,
                    colorOne: "#C44446",
                    colorTwo: "#5D1C22"
                }
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