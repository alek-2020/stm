/////////////////////////////////////////
// Получаем столы, списки и задачи из БД
/////////////////////////////////////////

import router from './../../Router.js'


import * as firebase from "firebase";

export default {

    actions: {

        /////////////////////////////////////////////////////
        // УПРАВЛЯЮЩАЯ ФУНКЦИЯ ПЕРВИЧНОГО ПОЛУЧЕНИЕ РАБ. СТ.
        /////////////////////////////////////////////////////

        firstGettingData({ dispatch }) {
            // 1. Получаем данные по id из users
            dispatch('altGetUserFB')
                .then(response => {
                    console.log('getData. Получили данные по id из users', response);
                    // 2. Пишем рабочие столы из tables в allTasks
                    const settings = response.settings;
                    dispatch('getSettings', settings);
                    //Продолжаем, если есть столы
                    console.log('.getdata. просто тест');
                    if (response.tables != null) {
                        console.log('.getdata. столы есть получаем задачи');
                        

                        return dispatch('getDataSecondChain');
                    }
                })
                .catch(error => {
                    console.log(error);
                })

        },

        //Cледующая цепочка, которая выполняется тольк если у нас есть

        getDataSecondChain({ dispatch }) {
            dispatch('altGetTables')
                .then(allTables => {
                    console.log('getData. Записали рабочие столы из tables в allTasks', allTables);
                    
                    //Запишем урл активного стола
                    // dispatch('pushActiveTableLink');
                    
                    // 3. Загружаем списки из taskLists в allTasks на каждой итерации вызываю получение задач
                    dispatch('getTaskLists');
                }).then(() => {
                    //Выполним побочные процессы, которым нужны загруженные данные
                   
                   
                    console.log('чекаем наш урл', router.match(location) );

                    dispatch('checkUrl');


                })
                .catch(error => {
                    console.log(error);
                })

        },

        ///Инициализация получения списка задач для активного Рабочего Стола, если он был загружен, то выводим из локальной переменную
        startGetTasks({ dispatch, state, rootState }) {
            return new Promise((resolve, reject) => {
                //Выполняем только если текущий стол незагружен
                if (rootState.allTasks.length < 1) {
                    //если не подгружали вообще ни одного стола
                    console.log('getdata. Инициализируем первичную загрузку столов. Массив ещё пуст.', rootState.allTables);
                    dispatch('firstGettingData');
                } else {
                    console.log('getdata. хотя бы одни стол есть в локальтом массиве', rootState.allTasks[rootState.activeTableIndex].taskLists);

                    //Чистим побочные массивы 
                    rootState.tasksFB = [];
                    rootState.taskLists = [];

                    if (rootState.allTasks[rootState.activeTableIndex].taskLists.length < 1) {
                        //если есть загруженные , но текущий не загружен
                        console.log('getdata. если есть загруженные , но текущий не загружен');

                        // тогда сразу инициализируем этам загрузки списков
                        dispatch('getTaskLists');
                    } else {
                        console.log('getdata. если так то это значит, что мы кликнули на уже загруженные РС, поэтому ничего не делаем');
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

                         //Преобразуем объекты столов в массивы
                         let objLists = data.val().tables;
                         let arrayLists = [];
                         for (var prop in objLists) { 
                           arrayLists.push(objLists[prop]);
                         };
                        
                        rootState.userData = {
                          tables: arrayLists,
                          settings:  data.val().settings
                        };

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

                            //Получим адрес стола. Это будут последние 6 цифр от id
                            let tableUrl = element.slice(element.length - 6);
                            console.log('Вырезанный кусок id ', tableUrl, element);

                            //Преобразуем объекты в массивы
                            let objLists = data.val().taskLists;
                            let arrayLists = [];
                            for (var prop in objLists) { 
                              arrayLists.push(objLists[prop]);
                            };
                            
                            rootState.userTables.push({
                                taskLists: arrayLists
                            })

                            rootState.allTasks.push({
                                id: element,
                                'name': data.val().name,
                                colorId: data.val().colorId,
                                colorOne: data.val().colorOne,
                                colorTwo: data.val().colorTwo,
                                taskLists: [],
                                tableIndex: data.val().tableIndex,
                                tableUrl: tableUrl
                            })

                            if ((i + 1) == rootState.userData.tables.length) {
                                resolve(rootState.allTasks);
                            }
                        })
                        .catch(error => {
                            console.log('Полный провал. Ошибка: ', error);
                        })

                });

            });
        },

        ///ПОДТЯГИВАЕМ СПИСКИ ЗАДАЧ И НА КАЖДОЙ ИТЕРАЦИИ ВЫПОЛНЯЕМ ЦИКЛ ЗАГРУЗКИ ЗАДАЧ
        getTaskLists({ dispatch, commit, state, rootState }) {
            const ind = rootState.activeTableIndex;

            //Выполняем только если у нас есть привязанные к столу списки
            if (rootState.userTables[ind].taskLists != null) {
                //подтягиваем списки активного раб. ст.
                rootState.userTables[ind].taskLists.forEach((element, index) => {
                    firebase
                        .database()
                        .ref("taskLists/" + element)
                        .once("value")
                        .then(data => {


                         //Преобразуем объекты задач в массивы
                         let objLists = data.val().tasks;
                         let arrayLists = [];
                         for (var prop in objLists) { 
                           arrayLists.push(objLists[prop]);
                         };

                            rootState.taskLists.push({
                                tasks: arrayLists
                            });

                            //пишем список в супер JSON
                            rootState.allTasks[rootState.activeTableIndex].taskLists.push({
                                id: element,
                                'name': data.val().name,
                                'color': data.val().color,
                                tasks: [],
                                'listIndex': data.val().listIndex
                            });

                            console.log('.getdata. отправляем id-шники для получения', rootState.taskLists[index].tasks);

                            // console.log('getdata. запушили список в локальный массив, инициализируем получение задач для него ', rootState.allTasks[rootState.activeTableIndex].taskLists);
                            dispatch('getTasksInOneListFB', index);

                        })
                        .catch(error => {
                            console.log('Полный провал. Ошибка: ', error);
                        })
                });
            }
        },


        ///Получаем задачи очередного списка
        getTasksInOneListFB({ dispatch, commit, state, rootState }, i) {

            //Выполняем если есть привязанные к списку задачи
            if (rootState.taskLists[i].tasks != null) {
                rootState.taskLists[i].tasks.forEach(element => {
                    firebase
                        .database()
                        .ref("tasks/" + element)
                        .once("value")
                        .then(data => {
                            console.log('.getdata. получили данные с БД по задаче', data.val());

                            // rootState.tasksFB.push(data.val());

                            //Пишем нашу задачу в супер JSON

                            let dbTask = {
                                'id': element,
                                'text': data.val().text,
                                'isDone': data.val().isDone,
                                'taskListId': data.val().taskListId,
                            }

                            let bigJSON = rootState.allTasks[rootState.activeTableIndex].taskLists[i].tasks;

                            console.log('.getdata. сформировали задачу для пуша ', dbTask, ' записали большой массив  ', bigJSON);

                            //Если это первая задача - создадим под нее пустой массив
                            if (bigJSON == null) { rootState.allTasks[rootState.activeTableIndex].taskLists[i].tasks = ['.,', 'jn'] }

                            console.log('.getdata. подготовили большой массив сделав там контейнер ', rootState.allTasks[rootState.activeTableIndex].taskLists[i].tasks);


                            console.log('.getdata. зашли в получение задач 4', rootState.allTasks[rootState.activeTableIndex].taskLists[i].tasks);
                            console.log('.getdata. зашли в получение задач 4', rootState.allTasks[rootState.activeTableIndex]);


                            rootState.allTasks[rootState.activeTableIndex].taskLists[i].tasks.push(dbTask);

                            console.log('.getdata. большой массив после пуша', bigJSON);
                            console.log('.getdata. большой массив  после пуша напрямую', rootState.allTasks[rootState.activeTableIndex].taskLists[i].tasks);

                        })
                        .catch(error => {
                            console.log('Полный провал. Ошибка: ', error);
                        })

                });
            }
        },

        //Записываем базовые настроки по юзеру
        getSettings({ dispatch, commit, state, rootState }, settings) {
            return new Promise((resolve, reject) => {

                console.log('getdata. Получили настройкли ', settings);
                rootState.currentBgImg = settings.bg;
                rootState.activeTableIndex = settings.activeTable;
                console.log('getdata. Получили настройкии ', settings);


            })
        }

    }
}
