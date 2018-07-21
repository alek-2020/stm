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
            dispatch('getUserData')
                .then(response => {
                    // 2. Пишем рабочие столы из tables в allTasks
                    const settings = response.settings;
                    // const obj = new Object();
                    dispatch('getSettings', settings);
                    //Продолжаем, если есть столы
                    if (response.tables != null) {
                        return dispatch('getDataSecondChain');
                    }
                })
                .catch(error => {
                    console.log(error);
                    //если есть ошибки на этапе загрузки, то выкидываем попап перезагрузки страницы
                    // router.push('/error/');
                    dispatch('linksHandler', { toLink: '/error/' });
                })

        },

        //Cледующая цепочка, которая выполняется тольк если у нас есть

        getDataSecondChain({ dispatch }) {
            dispatch('getUserTables')
                .then(allTables => {
                    // 3. Загружаем списки из taskLists в allTasks на каждой итерации вызываю получение задач
                    dispatch('getTaskLists');
                }).then(() => {
                    dispatch('checkUrl');
                })
                .catch(error => {
                    console.log(error);
                })

        },

        ///Инициализация получения списка задач для активного Рабочего Стола, если он был загружен, то выводим из локальной переменную
        /*
          Возможные варианты на входе:
          ---Ни одного стола не загружено
          ---Есть загруженные, но не загружен текущий
          ---Загружены все столы

          Поидее нужно сделать: 
          1. При смене стола отправляем запрос на загрузку
          2. Загрузчик смотрит id стола(индекс наверное нет) и грузит по ним задачи
          3. Если задача уже загружена, то ничего не делает
          4. Если у нас начинается запись задач привязанных не к тому списку или
          списков привязанных не к тому столу, то выдаем эрор и предлагаем перезагрузиться,
          либо насильно перезагружаем.
          5. Если у нас что-либо не догружается, то выдаем ошибку с предложением перезагрузиться, 
          либо нужно добавить систему проверки, что бы она догружала, что нужно.
        */
        startGetTasks({ dispatch, rootState }) {
            return new Promise((resolve, reject) => {
                //Если не загружено ни одного стола
                if (rootState.allTasks.length < 1) {
                    dispatch('firstGettingData');
                } else {
                    //Чистим побочные массивы, если уже загружили столы
                    rootState.tasksFB = [];
                    rootState.taskLists = [];

                    //Если есть загруженные, но текущий стол не загружег
                    if (rootState.allTasks[rootState.activeTableIndex].taskLists.length < 1) {
                        // тогда сразу инициализируем загрузки списков
                        dispatch('getTaskLists');
                    } else {
                        // если так то это значит, что мы кликнули на уже загруженные РС, поэтому ничего не делаем
                    }
                }
            })
        },






        //Получаем данные юзера по его id из БД (users)
        /*
          На входе важен только userId
          Возможные варианты: 
          --Юзер id есть
          ----Все проходит ок
          ----Вылетает ошибка полключение либа любая др
          --Юзер id нет
          ----Мы 100% получаем эрор.
         
         Действия:
            ====Если отсутствует userId то выполняем logOut и юзера автоматом кидает на авторизашку
            ====Если ошибка выполнения функции Предлагаем перезагрузиться, кидаем ошибку аутентификации(получения user id)
         */
        getUserData({ rootState }) {
            return new Promise((resolve, reject) => {
                const uId = rootState.userId;
                if (!uId) {
                    //Выход из лк и редирект на логин     
                }

                firebase
                    .database()
                    .ref("users/" + uId)
                    .once("value")
                    .then(data => {
                        //Преобразуем объекты столов в массивы
                        let arrayLists = [];
                        let objLists = {};
                        let obj = data.val();
                        //Если получили пустой массив-невыполняем часть операций
                        //И заменяем на пустой объет
                        if (data.val() != null) {
                            let objLists = data.val().tables;
                            for (var prop in objLists) {
                                arrayLists.push({ id: objLists[prop]});
                            };
                        } else {
                            obj = {}
                        }

                        rootState.userData = {
                            settings: obj.settings
                        };

                        //Пишел заготовки объектов с id для парсинга
                        rootState.allTasks = arrayLists;
                        // console.log("getdata. первый запрос на сервер. получили данные по userId ", rootState.userData);
                        // dispatch('altGetTables');
                        resolve(obj);
                        // dispatch('getSettings', data.val().settings);


                    })

                    .catch(error => {
                        console.log('Полный провал. Ошибка: ', error);
                        dispatch('showBigError', error);
                        reject();
                    })


            });

        },

        ///Получаем рабочие столы с БД
        getUserTables({ dispatch, commit, state, rootState }) {
            return new Promise((resolve, reject) => {

                rootState.allTasks.forEach((element, i) => {
                    const tableId = element.id
                    firebase
                        .database()
                        .ref("tables/" + tableId)
                        .once('value')
                        .then(data => {

                            //Получим адрес стола. Это будут последние 6 цифр от id
                            let tableUrl = tableId.slice(tableId.length - 6);
                            console.log('Вырезанный кусок id ', tableUrl, tableId);

                            //Преобразуем объекты в массивы
                            let objLists = data.val().taskLists;
                            let arrayLists = [];
                            for (var prop in objLists) {
                                arrayLists.push(objLists[prop]);
                            };

                            rootState.userTables.push({
                                taskLists: arrayLists
                            })
                            
                            //Дописываем получанные данные в массив
                            const table = rootState.allTasks[i]
                            table.name = data.val().name
                            table.colorId = data.val().colorId
                            table.colorOne = data.val().colorOne
                            table.colorTwo = data.val().colorTwo
                            table.taskLists = []
                            table.tableIndex = data.val().tableIndex
                            table.tableUrl = tableUrl

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
                                'listIndex': data.val().listIndex,
                                'emojiIndex': data.val().emojiIndex
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
                console.log('Получаем наши настройки ', settings);
                let localSettings = settings;
                //проверим входные данные на undefined, это на тот случай, когда у юзера первый вход в лк
                // if(typeof settings == 'undefined') {
                //     console.log('Настройки не пришли');
                //     localSettings = {};
                //     localSettings.bg = '/img/bg/stm-bg-2.jpg';
                //     localSettings.activeTable = -1;
                // }
                // console.log('getdata. Получили настройкли ', settings);
                if (typeof settings == 'undefined') {
                    localSettings = {}
                }

                let bgImg = localSettings.bg;
                if (typeof localSettings.bg == 'undefined') {
                    console.log('фона нема ', typeof localSettings.bg);
                    bgImg = '/img/bg/stm-bg-2.jpg';
                }

                rootState.currentBgImg = bgImg;
                rootState.activeTableIndex = localSettings.activeTable;
                console.log('getdata. Получили настройкии ', localSettings, settings);


            })
        }

    }
}
