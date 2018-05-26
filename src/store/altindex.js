import Vue from 'vue'
import Vuex from 'vuex'

import * as firebase from "firebase";

Vue.use(Vuex)

export const store = new Vuex.Store({

    state() {
        return {
        //Для баз данных
        userId: '2WYp1c7czxXAwSLSCwwatUzABhf1',
        allTasks: [],
        userData: [],
        userTables: [],
        taskLists: [],
        tasksFB: [],
        activeTableIndex: 0,
        //Для баз данных//

        currentBgImg: '/img/bg/stm-bg-1.jpg',
        tables: [],
        tasks: [
            {
                text: 'Раз',
                visible: false
            },
            {
                text: 'Два',
                visible: true
            },
            {
                text: 'Три брат три уже',
                visible: true
            }
        ],
        userIdBro: 'sdf',
        userParams: '',
        settings: '',
        userTables: ''
      }
    },
    
    actions: {
    altGetUserFB({ dispatch,  commit , state}) {
           
        console.log('НУ ДА Я РАБОТАЮ!');
         firebase
         .database()
         .ref("users/" + state.userId)
         .once("value")
         .then(data => {
         
          state.userData = data.val();
          dispatch('altGetTables')
         })

         .catch(error => {
             console.log('Полный провал. Ошибка: ', error);
         })
       },

             //Получаем рабочие столы с БД
             altGetTables({ dispatch, commit, state }) {

                state.userData.tables.forEach((element, i) => {
                    firebase
                        .database()
                        .ref("tables/" + element)
                        .once('value')
                        .then(data => {
    
                            state.userTables.push(data.val());
    
                            state.allTasks.push({
                                id: element,
                                'name': data.val().name,
                                taskLists: []
                            })
    
                            console.log('На итерации пишем ', state.allTasks);
    
                            if ((i + 1) == state.userData.tables.length) {
                                dispatch('getTaskLists');
                            }
                        })
                        .catch(error => {
                            console.log('Полный провал. Ошибка: ', error);
                        })
    
                });
    
    
            },
    
    }
 })