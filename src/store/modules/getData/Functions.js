// FIXME: Сделать минимальную ширину инпута в хедере, когда он пустой, что бы было видно плейсхолдер

/**********************************\
  ПОЛУЧЕНИЕ СТОЛОВ И СПИСКОВ ЗАДАЧ 
\**********************************/

import * as firebase from "firebase";

export default {
  actions: {
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
    getUserData({
      rootState,
      dispatch
    }) {
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
            rootState.appLog.push("Получили певичные данные по юзеру", data.val());
            //Преобразуем объекты столов в массивы
            let arrayLists = [];
            let objLists = {};
            let obj = data.val();
            //Если получили пустой массив-невыполняем часть операций
            //И заменяем на пустой объет
            if (data.val() != null) {
              let objLists = data.val().tables;
              for (var prop in objLists) {
                arrayLists.push({
                  id: objLists[prop]
                });
              }
            } else {
              obj = {};
            }

            rootState.userData = {
              settings: obj.settings
            };

            //Пишел заготовки объектов с id для парсинга
            rootState.masTables = arrayLists;
            resolve(obj);
          })

          .catch(error => {
            console.log("Полный провал. Ошибка: ", error);
            rootState.appLog.push(
              "Ошибка на этапе: Первичное получение данных по юзеру"
            );
            dispatch("showBigError", error);
            reject();
          });
      });
    },

    ///Получаем рабочие столы с БД
    getUserTables({
      dispatch,
      commit,
      rootState
    }) {
      return new Promise((resolve, reject) => {

        const userId = rootState.userId;
        const tables = rootState.allTasks;

        // Если нет столов
        if (rootState.masTables == null) {
          //Повтор проверки в вызывающей функции
          commit("stopTableLoader");
          rootState.appLog.push("Нет столов для загрузки");
          reject('getUserTables - нет столов для загрузки');
        }

        firebase
          .database()
          .ref("tables")
          .orderByChild("userId")
          .equalTo(userId)
          .once("value")
          .then(data => {

            // Пишем столы
            const userTables = data.val()

            for (var tableKey in userTables) {

              const table = userTables[tableKey];
              const tableUrl = table.id.slice(table.id.length - 6);

              let tablesInArray = tables.push(
                table
              );

              // Допишем свойства в этот стол
              let lastTable = tables[tablesInArray - 1];
              lastTable.tableUrl = tableUrl;
              lastTable.taskLists = [];
            }

            rootState.appLog.push("Записали столы", tables);

            dispatch("pushActiveTableLink");
            resolve();
          })
          .catch(error => {
            console.log("Полный провал. Ошибка: ", error);
            rootState.appLog.push(
              "Ошибка на этапе: Получили столы юзера " + error
            );
          });

      });
    },

    ///ПОДТЯГИВАЕМ СПИСКИ ЗАДАЧ И НА КАЖДОЙ ИТЕРАЦИИ ВЫПОЛНЯЕМ ЦИКЛ ЗАГРУЗКИ ЗАДАЧ
    getTableTaskLists({
      commit,
      rootState
    }) {
      return new Promise((resolve, reject) => {
        const userId = rootState.userId;
        const tables = rootState.allTasks;

        // Если столов нет - первываем
        if (!rootState.allTasks) {
          commit("stopTableLoader");
          rootState.appLog.push("Загрузка стола завершена. У стола нет списков.");
          reject()
        }

        // Получаем все списки юзера
        firebase
          .database()
          .ref("taskLists")
          .orderByChild("userId")
          .equalTo(userId)
          .once("value")
          .then(data => {
            console.log('Получили данные', data.val())

            //Преобразуем объект в массив
            let objLists = data.val();
            let userTaskLists = [];
            for (var prop in objLists) {
              userTaskLists.push(
                objLists[prop]
              );
            }

            resolve(userTaskLists)
            // Присвоем каждому столу свои списки
            // console.log('Преобразовали в массив', userTaskLists)
            // let allTasks = rootState.allTasks;

            // allTasks.forEach((table, index) => {
            //   // Выбираем списки содержащие id стола
            //   let fittedTaskLists = userTaskLists.filter(function (oneTaskList) {
            //     return table.id === oneTaskList.tableId
            //   })
            //   console.log('Нафильтровали списков', fittedTaskLists, table.id, userTaskLists);
            // })


            // for (let taskListId in userTaskLists) {
            //   let taskListTableId = userTaskLists[taskListId].tableId
            //   let taskList = userTaskLists[taskListId]
            //   let asd = allTasks.filter(table => table.id == taskListTableId)
            //   // console.log('язь', asd)
            //   allTasks.forEach(table => {
            //     // console.log('Итерация поиска подходящего стола', table.id, taskListTableId)

            //     if (table.id === taskListTableId) {
            //       table.taskLists.push(taskList);
            //       // console.log('Сошлось-запушили', allTasks)
            //     }
            //   })
            // }

            // list.push({
            //   id: listId,
            //   tableId: activeTableId,
            //   name: data.val().name,
            //   color: data.val().color,
            //   tasks: [],
            //   listIndex: data.val().listIndex,
            //   emojiIndex: data.val().emojiIndex
            // });

          })
          .catch(error => {
            console.log("Полный провал. Ошибка: ", error);
            rootState.appLog.push(
              "Ошибка на этапе получения списков задач юзера"
            );
          });

        rootState.appLog.push("Получили списки задач юзера");
      });

    },

    ///Получаем задачи очередного списка
    getListTasks({
      dispatch,
      commit,
      state,
      rootState
    }, {
      i,
      listId
    }) {
      // console.log('habra Сформировали id задач', rootState.masTasks, rootState.allTasks);
      const ind = rootState.activeTableIndex;
      const activeTableId = rootState.masTables[ind].id;
      let tasks = rootState.allTasks[ind].taskLists[i].tasks;
      let indexChecker;
      //Выполняем если есть привязанные к списку задачи
      if (tasks.length > 0) {
        rootState.masTasks[i].forEach((element, index) => {
          indexChecker = index;
          const taskId = element.id;
          firebase
            .database()
            .ref("tasks/" + taskId)
            .once("value")
            .then(data => {
              console.log(
                ".getdata. получили данные с БД по задаче",
                data.val()
              );

              // rootState.tasksFB.push(data.val());

              //Пишем нашу задачу в супер JSON

              tasks.push({
                id: taskId,
                taskListId: listId,
                tableId: activeTableId,
                text: data.val().text,
                isDone: data.val().isDone,
                taskListId: data.val().taskListId
              });
              // let bigJSON = rootState.allTasks[rootState.activeTableIndex].taskLists[i].tasks;

              //Если это первая задача - создадим под нее пустой массив
              if (tasks == null) {
                tasks = [];
              }

              // rootState.allTasks[rootState.activeTableIndex].taskLists[i].tasks.push(dbTask);
            })
            .catch(error => {
              console.log("Полный провал. Ошибка: ", error);
            });

          rootState.appLog.push(
            `Зашли в получение задачи с параметрами: Длина массива с задачами ${
              rootState.masTasks[i].length
            } Итерация получения задач ${index} Длинна массива со списками ${
              rootState.masTaskLists[ind].length
            } Итерация получения списков   ${i}`
          );
          //Если у нас последняя итерация-отправим массив allTasks на проверку корректности заполнения
          // console.log('habrabra', rootState.allTasks);
          /*Если последняя задача списка и последний список стола
            Вторым условием учтем то, что задач может не быть, а список так же последний, тогда первое условие будет работаь некорректно*/
          if (
            (rootState.masTasks[i].length - 1 === index &&
              rootState.masTaskLists[ind].length - 1 === i) ||
            (rootState.masTasks[i].length == 0 &&
              rootState.masTaskLists[ind].length - 1 == i)
          ) {
            //то проверим наш вывод на корректность
            commit("stopTableLoader");
            rootState.appLog.push("Загрузка стола завершена");

            dispatch("verifyTable");
          }
        });
      } else {
        //У списка нет задач
      }
    },

    //Записываем базовые настроки по юзеру
    getSettings({
      rootState
    }, settings) {
      return new Promise((resolve, reject) => {
        let localSettings = settings;

        if (typeof settings == "undefined") {
          localSettings = {};
        }

        let bgImg = localSettings.bg;
        if (typeof localSettings.bg == "undefined") {
          bgImg = "/img/bg/stm-bg-2.jpg";
        }

        rootState.currentBgImg = bgImg;
        rootState.activeTableIndex = localSettings.activeTable;

        rootState.appLog.push("getSettings - Получили настройки");
        resolve();
      });
    }
  }
};
