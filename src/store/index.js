import Vue from 'vue'
import Vuex from 'vuex'

import * as firebase from "firebase";

Vue.use(Vuex)

export const store = new Vuex.Store({
    state() {
        return {
            //Активно ли поле ввода имени стола
            plusActive: false,
            //Для баз данных
            userId: '2WYp1c7czxXAwSLSCwwatUzABhf1',
            allTasks: [],
            userData: [],
            userTables: [],
            taskLists: [],
            tasksFB: [],
            activeTableIndex: 0,
            // activeTableName: 'Колбаса',        
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
            //градиенты кнопок столов
            //добавление рс
            gradients: [
                {
                    colId: 1,
                    colorOne: "#d24242",
                    colorTwo: "#af4242"
                },
                {
                    colId: 2,
                    colorOne: "#f85725",
                    colorTwo: "#8a5e41"
                },
                {
                    colId: 3,
                    colorOne: "#e15656",
                    colorTwo: "#825a5a"
                },
                {
                    colId: 4,
                    colorOne: "#8fb554",
                    colorTwo: "#5b917d"
                },
                {
                    colId: 5,
                    colorOne: "#2a2a39",
                    colorTwo: "#535472"
                },
                {
                    colId: 6,
                    colorOne: "#535472",
                    colorTwo: "#2a2a39"
                },
                {
                    colId: 7,
                    colorOne: "#582121",
                    colorTwo: "#bf3737"
                }
            ],
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

        startGetTasks({ dispatch, commit, state }) {

            // console.log('Если зашли в startGetTasks уже хорошо', state.allTasks);

            //Выполняем только если текущий стол незагружен
            if (state.allTasks.length < 1) {
                //если не подгружали вообще ни одного стола
                console.log('раз. если не подгружали вообще ни одного стола', state.allTables);
                dispatch('altGetUserFB');
            } else {

                console.log('раз. хотя бы одни стол есть в локальтом массиве', state.allTasks[state.activeTableIndex].taskLists);


                //тут нужно очистить временые переменные? что бы не пушить в них другие столы

                //  state.userData = [];
                //  state.userTables = [];
                //  state.taskLists = [];
                state.tasksFB = [];


                if (state.allTasks[state.activeTableIndex].taskLists.length < 1) {
                    //если есть загруженные , но текущий не загружен
                    console.log('раз. если есть загруженные , но текущий не загружен');

                    // тогда сразу инициализируем этам загрузки списков
                    dispatch('getTaskLists');
                } else {
                    console.log('раз. если так то это значит, что мы кликнули на уже загруженные РС, поэт');

                    // если так то это значит, что мы кликнули на уже загруженные РС, поэтому ничего не делаем
                }
            }
        },

        //Первичное получение данных с БД (users)
        altGetUserFB({ dispatch, commit, state }) {


            firebase
                .database()
                .ref("users/" + state.userId)
                .once("value")
                .then(data => {

                    state.userData = data.val();
                    console.log("ПЕРВЫЙ ЗАПРОС НА СЕРВ ", state.userData);
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

                        state.userTables.push(data.val())

                        state.allTasks.push({
                            id: element,
                            'name': data.val().name,
                            colorId: data.val().colorId,
                            colorOne: data.val().colorOne,
                            colorTwo: data.val().colorTwo,
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
                        state.allTasks[state.activeTableIndex].taskLists.push({
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
            console.log('крутим массив ', state.taskLists);

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
                        state.allTasks[state.activeTableIndex].taskLists[i].tasks.push({
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
        addTask({ dispatch, commit, state }, { tableInd, taskListInd, task }) {
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
                    dispatch('addTaskInTasks', { Key, tableInd, taskListInd });


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

        addTaskInTasks({ dispatch, commit, state }, { Key, tableInd, taskListInd }) {
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

                    //Еси это первой значение в массиве создаем его
                    if (tasks == null) {
                        tasks = [Key]
                    } else {
                        tasks.push(Key);
                    }


                    console.log('Задачи с запушенным ID ', tasks);
                    dispatch('addTaskInTasksNext', { taskId, tasks });

                })
                .catch(error => {
                    console.log('Полный провал. Ошибка: ', error);
                });


        },

        addTaskInTasksNext({ dispatch, commit, state }, { taskId, tasks }) {
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
        checkTask({ dispatch, commit, state }, { task, taskInd, tableInd, taskListInd }) {
            console.log('ДЛЯ ОТМЕТКИ ЗАДАЧИ ПОЛУЧАЕМ ', task, taskInd, tableInd, taskListInd);
            //    tableInd =+ 1
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
            let TableLists = state.allTasks[tableInd].taskLists;
            const tableId = state.allTasks[tableInd].id;

            console.log('Получили списки и id', TableLists, tableId);

            //Формеруем параметры нового списка
            const newTaskList = {
                'name': 'Введите название списка',
                'color': 'black',
                'tasks': []
            }

            //если мы ещё не создавали списков, то будет undefined
            //Так что делаем проверку
            if (typeof TableLists == 'undefined') {
                state.allTasks[tableInd].taskLists = [newTaskList]
                console.log('добавили в массив ', state.allTasks[tableInd].taskLists);
                let ind = state.activeTableIndex;
                // ind--;
                // ind++;
            } else {
                console.log('массив не пустой', TableLists);
                
                state.allTasks[tableInd].taskLists.push(newTaskList);
                // TableLists.push(newTaskList);
            }

            console.log('Новый массив со списком',  state.allTasks[tableInd].taskLists);

            console.log('супермассив',  state.allTasks);



            firebase
                .database()
                .ref("taskLists/")
                .push(newTaskList)
                .then(data => {


                    console.log('список в СПИСКАХ!', data.id);
                    //теперь привяжем id списка к столу
                    const newListId = data.key;
                    console.log('список в СПИСКАХ!!!!!!!', newListId);

                    dispatch('getTaskListInTable', { tableId, newListId });


                })
                .catch(error => {
                    console.log('Полный провал. Ошибка: ', error);
                })
        },

        /////////
        getTaskListInTable({ dispatch, commit, state }, { tableId, newListId }) {

            firebase
                .database()
                .ref("tables/" + tableId + "/taskLists")
                .once('value')
                .then(data => {


                    console.log('ПОЛУЧИЛИ СТОЛЫ С СЕРВАКА', data.val());
                    const taskListsId = data.val();
                    dispatch('addListIdToTable', { tableId, newListId, taskListsId });

                })
                .catch(error => {
                    console.log('Полный провал. Ошибка: ', error);
                })


        },

        addListIdToTable({ dispatch, commit, state }, { tableId, newListId, taskListsId }) {

            //   let taskListsId = state.userTables.taskLists;


            if (taskListsId == null) {
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

        // Получение параметров стола
        // Определяем цвет последнего стола и возвращаем новый
        lastTableColor({ dispatch, commit, state }) {
            var i = state.allTasks.length - 1;
            console.log('длина, сам массив ', i, state.allTasks[i]);
            var id = state.allTasks[i].colorId;
            var color = state.gradients[id+1];
            var colOne = color.colorOne;
            var colTwo = color.colorTwo;
            // var colOne = state.allTasks[i].tables.colorOne;
            // var colTwo = state.tables[i].colorTwo;
            console.log("linear-gradient( to bottom, " + colOne + ", " + colTwo);
      
            return "linear-gradient( to bottom, " + colOne + ", " + colTwo;
          },

        // 0. Подготавливаем стол для добавления
        // 0.1 Если поле активно добавляем, если нет-активируем
        checkTableInput({ dispatch, commit, state }) {
            if (state.plusActive) {
                dispatch('AddTableBtn');
            }

            state.plusActive = !state.plusActive;
        },

        // 0.2 Формируем стол 
        AddTableBtn({ dispatch, commit, state }) {

            // let lastColId = this.getColId();
            const lastColId = 3;

            // const newTableBtn = {
            //   name: this.newTableName,
            //   colorOne: this.gradients[lastColId].colorOne,
            //   colorTwo: this.gradients[lastColId].colorTwo,
            //   colorId: lastColId + 1
            // };

            const newTableBtn = {
                name: "Это стол Брат",
                colorOne: state.gradients[lastColId].colorOne,
                colorTwo: state.gradients[lastColId].colorTwo,
                colorId: lastColId + 1
            };

            //Запускаем последовательный процесс добавления стола
            this.dispatch("pushNewTable", newTableBtn);
            // console.log(this.newTableName);


        },

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
                    newTableBtn.id = data.key;

                    console.log('Закинули стол (тут он уже с добавленным id для локального пуша) ', newTableBtn);



                    state.allTasks.push(newTableBtn);


                    dispatch('getTablesList', newTableId);



                })
                .catch(error => {
                    console.log('Полный провал. Ошибка: ', error);
                })
        },

        // 2. получим список столов с сервера
        getTablesList({ dispatch, commit, state }, newTableId) {

            const userId = state.userId;

            firebase
                .database()
                .ref("users/" + userId + "/tables")
                .once('value')
                .then(data => {

                    //   console.log('адрес такой users/ ', userId , '/tables');
                    console.log('столы у нас такие!!! ', data.val());
                    let allTables = data.val();

                    //делаем проверку на undefined
                    //if(typeof allTables == 'undefined') {
                    if (allTables == null) {
                        console.log('Ещё нет столов', allTables);
                        allTables = [newTableId]
                    } else {
                        console.log('Уже есть столы', allTables);
                        allTables.push(newTableId);
                    }

                    dispatch('apdateTablesList', { allTables, userId })


                })
                .catch(error => {
                    console.log('Полный провал. Ошибка: ', error);
                })
        },

        // 3. Апдейтим новый список

        apdateTablesList({ dispatch, commit, state }, { allTables, userId }) {


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
        },

        ///Изменение поля в задаче
        changeText({ dispatch, commit, state }, { text, task }) {
            // TaskId = state.allTasks[tableInd].taskLists[taskListInd].tasks[taskInd]
            console.log('Вот наша задача ', task);
            const TaskId = task.id;

            firebase
                .database()
                .ref("tasks/" + TaskId + "/text")
                .set(text)
                .then(data => {

                    console.log('Поменяли текст в задаче');


                })
                .catch(error => {
                    console.log('Полный провал. Ошибка: ', error);
                })

        },

        //Изменение заголовка списка
        changeListTitle({ dispatch, commit, state }, { NewName, ListId }) {


            firebase
                .database()
                .ref("taskLists/" + ListId + "/name")
                .set(NewName)
                .then(data => {
                    console.log('Поменяли заголовок в списке');
                })
                .catch(error => {
                    console.log('Полный провал. Ошибка: ', error);
                })


        },

        //Меняем название стола
        changeTableTitle({ dispatch, commit, state }, { NewName, TableId }) {
            firebase
                .database()
                .ref("tables/" + TableId + "/name")
                .set(NewName)
                .then(data => {
                    console.log('Поменяли заголовок стола');
                })
                .catch(error => {
                    console.log('Полный провал. Ошибка: ', error);
                })
        },

        ///УДАЛЕНИЕ АКТИВНОГО РАБОЧЕГО СТОЛА
        delActiveTable({ dispatch, commit, state }) {

            let ind = state.activeTableIndex;
            const userId = state.userId;

            firebase
                    .database()
                    .ref("users/" + userId + "/tables/" + ind)
                    .remove()
                    .then(data => {

                        //Если все ок - вырезаем из локального массива
                        let allTables = state.allTasks;
                        allTables.splice(ind, 1);
                        //Понижаем tableIndex на 1, если он больше 0
                    
                    if(ind > 0) {
                        state.activeTableIndex = ind - 1; 
                        console.log( state.activeTableIndex );
                    }

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
        // activeTableName(state) {
        //        //и запишем название нашего стола для хедера
        //        return state.allTables[state.activeTableIndex].name;
        //        console.log('активный стол тут', state.activeTableIndex);

        // },
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