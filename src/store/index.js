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
      }
    },
    mutations: {

        //Получим параметры аккаунта
        getUser(state) {
            firebase
                .database()
                .ref("users/" + state.userIdBro)
                .once("value")
                .then(data => {
                    console.log("Получили ", data);
                    state.tableList = data;
                })
                .catch(error => {
                    console.log("Не получили ", error);
                });
        },
    },
    actions: {

        ///////////////////
        /// Для баз данных
        ///////////////////

        //Первичное получение данных с БД (users)
        altGetUserFB({ dispatch,  commit , state}) {
           
            firebase
            .database()
            .ref("users/" + state.userId)
            .once("value")
            .then(data => {
            
             state.userData = data.val();
             console.log("ПЕРВЫЙ ЗАПРОС НА СЕРВ ", state.userData );
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
                        console.log('ВТОРОЙ ПОДХОД. ПОЛУЧАЕМ СТОЛЫ ', data.val());

                        state.userTables.push( data.val() )

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
        //Подтягиваем списки задач
        getTaskLists({ dispatch, commit, state }) {
            let i = 0;
            //подтягиваем списки активного раб. ст.
            state.userTables[state.activeTableIndex].taskLists.forEach(element => {
                console.log('Массив ', i++);
                firebase
                    .database()
                    .ref("taskLists/" + element)
                    .once('value')
                    .then(data => {


                        state.taskLists.push(data.val());
                        
                        console.log('Получили список задач ', data.val());
                        //пишем списки в супер JSON
                        console.log('ЛОВИМ БАЗ С ИМЕНЕМ. СЕЙЧС ЭЛЕМ ', element);
                        state.allTasks[state.activeTableIndex + 1].taskLists.push({
                            id: element,
                            'name': data.val().name,
                            'color': data.val().color,
                            tasks: []
                        });
                        dispatch('getTaskListsForGetTasksFB');
                    })
                    .catch(error => {
                        console.log('Полный провал. Ошибка: ', error);
                    })

            });
        },

        //Прогоняем списки для вызова задач
        getTaskListsForGetTasksFB({ dispatch, commit, state }) {

            state.taskLists.forEach((array, index) => {
                console.log('КРУТИМ ВЕРТИМ. НОМЕР: ', array, index);

                dispatch('getTasksInOneListFB', index);

            })
        },

        //Получаем задачи списка

        getTasksInOneListFB({ dispatch, commit, state }, i) {

            state.taskLists[i].tasks.forEach(element => {
                firebase
                    .database()
                    .ref("tasks/" + element)
                    .once('value')
                    .then(data => {

                        state.tasksFB.push(data.val());
                        console.log('Пишем задачу ', data.val());

                        //Пишем нашу задачу в супер JSON
                        state.allTasks[state.activeTableIndex + 1].taskLists[i].tasks.push({
                            id: element,
                            'text': data.val().text,
                            'color': data.val().color,
                            'isDone': data.val().isDone
                        })

                    })
                    .catch(error => {
                        console.log('Полный провал. Ошибка: ', error);
                    })

            });
        },
        ///Для баз данных///

        //Закидываем новую задачу на сервер
        addTask({ dispatch, commit, state }, {tableInd, taskListInd, task}) {
            console.log('Получили всю байду', tableInd, taskListInd, task)
            // const mas = state.allTasks[0].taskLists[taskListInd].tasks;
            //user.set(first: "Miles", last: "Davis")
        
            firebase
            .database()
            .ref("tasks/")
            .push(task)
            .then(data => {

              console.log('Готовехонько', data.key);
              const Key = data.key;
              dispatch('addTaskInTasks', { Key, tableInd, taskListInd } );


            })
            .catch(error => {
                console.log('Полный провал. Ошибка: ', error);
            })

            //тестим массив

              //получаем все таски с уже записанной и переписываем массив
    
  
            // firebase
            // .database()
            // .ref("taskLists/asdfas/tasks2")
            // .once('value')
            // .then(data => {

            //   console.log('Тестовый массив', data.val());
            //   let m = data.val()
            //   m = ['s','d','df']
            //   m.push('гусь')
            //   firebase.database().ref("taskLists/asdfas/tasks2")
            //   .set(m)

            // })
            // .catch(error => {
            //     console.log('Полный провал. Ошибка: ', error);
            // })
        
        },

        addTaskInTasks({ dispatch, commit, state }, {Key, tableInd, taskListInd}) {
            let tasks;
            // = state.allTasks[tableInd].taskLists[taskListInd].tasks;
         
            const taskId = state.allTasks[tableInd].taskLists[taskListInd].id;
            console.log('Получили таки мы id списки ', taskId);
            
            firebase
            .database()
            .ref("taskLists/" + taskId + "/tasks")
            .once('value')
            .then(data => {

              console.log('подучили наши задачи на серваке', data.val());
              tasks = data.val();
              tasks.push(Key);
              console.log('Задачи с запушенным ID ', tasks);
              dispatch('addTaskInTasksNext', {taskId, tasks});

            })
            .catch(error => {
                console.log('Полный провал. Ошибка: ', error);
            });

    
        },

        addTaskInTasksNext({ dispatch, commit, state }, {taskId, tasks}) {
            console.log('До этого момента дажене доходим мать его');
            //отправим обновленные ключи задач
            firebase
            .database()
            .ref("taskLists/" + taskId + "/tasks")
            .set(tasks)
            .then(data => {

              console.log('Привязали задачу к списку', data);
              

            })
            .catch(error => {
                console.log('Полный провал. Ошибка: ', error);
            })
        },

        //Отметить задачу как сделанную
        checkTask({ dispatch, commit, state }, {task, taskInd, tableInd, taskListInd}) {
           console.log('ДЛЯ ОТМЕТКИ ЗАДАЧИ ПОЛУЧАЕМ ', task, taskInd, tableInd, taskListInd);
           tableInd =+ 1
           const taskId = state.allTasks[tableInd].taskLists[taskListInd].tasks[taskInd].id;


            firebase
            .database()
            .ref("tasks/" + taskId + "/isDone")
            .set(true)
            .then(data => {

              //Если успех внесем изменения в локальный массив
              const taskId = state.allTasks[tableInd].taskLists[taskListInd].tasks[taskInd].isDone = true;

              console.log('Задачка готова!');
              

            })
            .catch(error => {
                console.log('Полный провал. Ошибка: ', error);
            })
        },

        //добавляем лист задач
        addList({ dispatch, commit, state }) {
          let tableInd = state.activeTableIndex;
          tableInd += 1;
          const TableLists =  state.allTasks[tableInd].taskLists;
          const tableId = state.allTasks[tableInd].id;

          console.log('Получили списки и id', TableLists, tableId);

          
     
          const newTaskList = {
            'name': 'Введите название списка',
            'color': 'black',
            'tasks': []
         }

         TableLists.push(newTaskList);
         console.log('Новый массив со списком', TableLists);




          firebase
          .database()
          .ref("taskLists/")
          .push(newTaskList)
          .then(data => {


            console.log('список в СПИСКАХ!', data.id);
            //теперь привяжем id списка к столу
            const newListId = data.key;
            console.log('список в СПИСКАХ!!!!!!!', newListId);

            dispatch('getTaskListInTable', {tableId, newListId}) ;


          })
          .catch(error => {
              console.log('Полный провал. Ошибка: ', error);
          })
        },

/////////
        getTaskListInTable({ dispatch, commit, state }, {tableId, newListId} ) {
           
            firebase
            .database()
            .ref("tables/" + tableId + "/taskLists")
            .once('value')
            .then(data => {
  
  
              console.log('ПОЛУЧИЛИ СТОЛЫ С СЕРВАКА', data.val());
              const taskListsId = data.val();
               dispatch('addListIdToTable', {tableId, newListId, taskListsId}) ;

            })
            .catch(error => {
                console.log('Полный провал. Ошибка: ', error);
            })

            
        },

        addListIdToTable({ dispatch, commit, state }, {tableId, newListId, taskListsId}) {
         
        //   let taskListsId = state.userTables.taskLists;
          

          if(typeof taskListsId == "undefined"){
            console.log('переменная не попределена задач нема', taskListsId)

            taskListsId = [newListId]
          } else {
            taskListsId.push(newListId);
          }

        // taskListsId = newListId;

          console.log('А СПИСКИ У НАС ТАКИЕ ', taskListsId);

          firebase
          .database()
          .ref("tables/" + tableId + "/taskLists")
          .set(taskListsId)
          .then(data => {


            console.log('АЙДИШНИКИ В СТОЛЕ БРАТУХА!!!');
            //нужно получим заново наши столы
            // dispatch('GetTablesOnly');

          })
          .catch(error => {
              console.log('Полный провал. Ошибка: ', error);
          })


        },
        
        //ДОБАВЛЕНИЕ РАБОЧЕГО СТОЛА

        // 1. закидываем новый стол в tables

        pushNewTable({ dispatch, commit, state }, newTableBtn) {
            const userId = state.userId;

            firebase
            .database()
            .ref("tables/")
            .push(newTableBtn)
            .then(data => {
            
             console.log('Закинули стол ', newTableBtn);
             console.log('Запушили столешек', data);
             const newTableId = data.key;

             //Зальем стол в наш локальный объект
            state.allTasks.push(newTableBtn);


             dispatch('getTablesList', newTableId);


  
            })
            .catch(error => {
                console.log('Полный провал. Ошибка: ', error);
            })
        },

        // 2. получим список столов с сервера
        getTablesList({ dispatch, commit, state }, newTableId ) {

            const userId = state.userId;

            firebase
            .database()
            .ref("users/" + userId + "/tables")
            .once('value')
            .then(data => {
  
            //   console.log('адрес такой users/ ', userId , '/tables');
              console.log('столы у нас такие!!! ', data.val());
              let allTables = data.val();

              allTables.push(newTableId);
              dispatch('apdateTablesList', {allTables, userId})
            
  
            })
            .catch(error => {
                console.log('Полный провал. Ошибка: ', error);
            })
        },

        // 3. Апдейтим новый список

        apdateTablesList({ dispatch, commit, state },  {allTables, userId}) {


            firebase
            .database()
            .ref("users/" + userId + "/tables")
            .set(allTables)
            .then(data => {
  
               console.log('Залили списки столов в юзера');
            
  
            })
            .catch(error => {
                console.log('Полный провал. Ошибка: ', error);
            })
        }
    },
    //сюда сбросим простые расчеты
    getters: {
        visibleTables(state) {
            return state.tasks.filter(task => {
                return task.visible
            })
        },
        currentBgImg: state => state.currentBgImg
    },
    //Аналог methods
    // mutations: {
    //     //Вторым параметром передаем входные данные, если нужно
    //     register(state, Text) {
    //         return Text
    //     }
    // },
    // actions: {
    //     register(context, userId) {
    //         context.commit('register', userId);
    //     }
    // }

})