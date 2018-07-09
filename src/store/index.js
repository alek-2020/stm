import Vue from 'vue'
import Vuex from 'vuex'

import actions from './actions'
import mutations from './mutations'
import getters from './getters'

import getData from './modules/getData'
import newTable from './modules/newTable'
import newTaskList from './modules/newTaskList'
import newTask from './modules/newTask'

import * as firebase from "firebase";

Vue.use(Vuex)

export const store = new Vuex.Store({
    state() {
        return {
            //меню добавить
            addMenuActive: false,
            //Авторизован
            authorised: false,
            //Активно ли поле ввода имени стола
            plusActive: false,
            //Для баз данных
            userId: '',
            allTasks: [],
            userData: [],
            userTables: [],
            taskLists: [],
            tasksFB: [],
            activeTableIndex: 0,
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
                    colorOne: "#d24242",
                    colorTwo: "#af4242"
                },
                {
                    colId: 1,
                    colorOne: "#f85725",
                    colorTwo: "#8a5e41"
                },
                {
                    colId: 2,
                    colorOne: "#e15656",
                    colorTwo: "#825a5a"
                },
                {
                    colId: 3,
                    colorOne: "#8fb554",
                    colorTwo: "#5b917d"
                },
                {
                    colId: 4,
                    colorOne: "#2a2a39",
                    colorTwo: "#535472"
                },
                {
                    colId: 5,
                    colorOne: "#535472",
                    colorTwo: "#2a2a39"
                },
                {
                    colId: 6,
                    colorOne: "#582121",
                    colorTwo: "#bf3737"
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
        newTask
    },

})