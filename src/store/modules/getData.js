/////////////////////////////////////////
// Получаем столы, списки и задачи из БД
/////////////////////////////////////////


import * as firebase from "firebase";

export default {

    actions: {

        /////////////////////////////////////////////////////
        // УПРАВЛЯЮЩАЯ ФУНКЦИЯ ПЕРВИЧНОГО ПОЛУЧЕНИЕ РАБ. СТ.
        /////////////////////////////////////////////////////

        firstGettingData(dispatch) {
            dispatch('altGetUserFB')
            .then( response => {
                const settings = response.settings;
                dispatch('getSettings', settings);
                return dispatch('altGetTables');
            })
            .then( response => {
              
                return dispatch('getTaskLists');
            })
            .then( response => {
              
                return dispatch('getTaskListsForGetTasksFB');
            })
            .then( index => {
              
                return dispatch('getTasksInOneListFB', index);
            })
            .then( response => {
              
        
            }).
            catch( error => {
                console.log(error);
            }) 
        
            // const first = await altGetUserFB();
            // console.log('getdata. первая прошла', first);
            // const jh = await altGetTables();
            // console.log('getdata. вторая прошла');

        },


        ///Инициализация получения списка задач для активного Рабочего Стола
        startGetTasks({ dispatch, state, rootState }) {
            return new Promise((resolve, reject) => {
                //Выполняем только если текущий стол незагружен
                if (rootState.allTasks.length < 1) {
                    //если не подгружали вообще ни одного стола
                    console.log('getdata. Инициализируем первичную загрузку столов. Массив ещё пуст.', rootState.allTables);
                    // dispatch('altGetUserFB');
                    dispatch('firstGettingData');
                } else {
                    console.log('раз. хотя бы одни стол есть в локальтом массиве', rootState.allTasks[rootState.activeTableIndex].taskLists);

                    rootState.tasksFB = [];


                    if (rootState.allTasks[rootState.activeTableIndex].taskLists.length < 1) {
                        //если есть загруженные , но текущий не загружен
                        console.log('раз. если есть загруженные , но текущий не загружен');

                        // тогда сразу инициализируем этам загрузки списков
                        dispatch('getTaskLists');
                    } else {
                        console.log('раз. если так то это значит, что мы кликнули на уже загруженные РС, поэт');

                        // если так то это значит, что мы кликнули на уже загруженные РС, поэтому ничего не делаем
                    }
                }
            })
        },






        ///Получаем данные по юзеру по его id с БД (users)
        altGetUserFB({ dispatch, commit, state, rootState }) {

            return new Promise((resolve, reject) => {


                firebase
                    .database()
                    .ref("users/" + rootState.userId)
                    .once("value")
                    .then(data => {

                        rootState.userData = data.val();
                        console.log("getdata. первый запрос на сервер. получили данные по userId ", rootState.userData);
                        // dispatch('altGetTables');
                        resolve(data.val());
                        // dispatch('getSettings', data.val().settings);
                    })

                    .catch(error => {
                        console.log('Полный провал. Ошибка: ', error);
                    })


            });

        },

        ///Получаем рабочие столы с БД
        altGetTables({ dispatch, commit, state, rootState }) {
            return new Promise((resolve, reject) => {

                rootState.userData.tables.forEach((element, i) => {
                    firebase
                        .database()
                        .ref("tables/" + element)
                        .once('value')
                        .then(data => {
                            console.log('getdata. ВТОРОЙ запрос. ПОЛУЧАЕМ СТОЛЫ ', data.val());

                            rootState.userTables.push(data.val())

                            rootState.allTasks.push({
                                id: element,
                                'name': data.val().name,
                                colorId: data.val().colorId,
                                colorOne: data.val().colorOne,
                                colorTwo: data.val().colorTwo,
                                taskLists: []
                            })

                            // console.log('На итерации пишем ', rootState.allTasks);

                            if ((i + 1) == rootState.userData.tables.length) {
                                console.log('getdata. записали столы', rootState.allTasks);
                                resolve();
                                // dispatch('getTaskLists');

                            }
                        })
                        .catch(error => {
                            console.log('Полный провал. Ошибка: ', error);
                        })

                });

            });
        },

        ///Подтягиваем списки задач
        getTaskLists({ dispatch, commit, state, rootState }) {
            return new Promise((resolve, reject) => {

                let i = 0;
                //подтягиваем списки активного раб. ст.
                rootState.userTables[rootState.activeTableIndex].taskLists.forEach(element => {
                    console.log('Массив ', i++);
                    firebase
                        .database()
                        .ref("taskLists/" + element)
                        .once('value')
                        .then(data => {


                            rootState.taskLists.push(data.val());

                            console.log('Получили список задач ', data.val());
                            //пишем списки в супер JSON
                            console.log('ЛОВИМ БАЗ С ИМЕНЕМ. СЕЙЧС ЭЛЕМ ', element);
                            rootState.allTasks[rootState.activeTableIndex].taskLists.push({
                                id: element,
                                'name': data.val().name,
                                'color': data.val().color,
                                tasks: []
                            });
                            console.log('getdata. запушили список в локальный массив, инициализируем получение задач для него ', rootState.allTasks[rootState.activeTableIndex].taskLists);
                            // dispatch('getTaskListsForGetTasksFB');
                            resolve();
                        })
                        .catch(error => {
                            console.log('Полный провал. Ошибка: ', error);
                        })
                })
            });
        },

        ///Прогоняем списки для вызова задач
        getTaskListsForGetTasksFB({ dispatch, commit, state, rootState }) {
            return new Promise((resolve, reject) => {

                console.log('крутим массив ', rootState.taskLists);

                rootState.taskLists.forEach((array, index) => {
                    console.log('КРУТИМ ВЕРТИМ. НОМЕР: ', array, index);

                    // dispatch('getTasksInOneListFB', index);
                    resolve(index);

                })
            })
        },

        ///Получаем задачи очередного списка
        getTasksInOneListFB({ dispatch, commit, state, rootState }, i) {
            return new Promise((resolve, reject) => {

                rootState.taskLists[i].tasks.forEach(element => {
                    firebase
                        .database()
                        .ref("tasks/" + element)
                        .once('values')
                        .then(data => {

                            rootState.tasksFB.push(data.val());
                            console.log('getdata. Пишем задачу ', data.val());

                            //Пишем нашу задачу в супер JSON
                            rootState.allTasks[rootState.activeTableIndex].taskLists[i].tasks.push({
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
            })
        },

        getSettings({ dispatch, commit, state, rootState }, settings) {
            return new Promise((resolve, reject) => {

                console.log('getdata. Получили настройки ', settings);
                rootState.currentBgImg = settings.bg;

            })
        }

    }
}
