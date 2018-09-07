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

    // ПОЛУЧАЕМ СТОЛЫ
    getUserTables({
      rootState
    }) {
      return new Promise((resolve, reject) => {
        rootState.appLog.push("столыaa");

        const userId = rootState.userId;

        firebase
          .database()
          .ref("tables")
          .orderByChild("userId")
          .equalTo(userId)
          .once("value")
          .then(data => {
            rootState.appLog.push("столы");


            const userTablesObject = data.val()
            let userTablesArray = []


            // for (var prop in objLists) {
            //   userTaskLists.push(
            //     objLists[prop]
            //   );
            // }

            // Преобразуем в массив столы
            for (var tableKey in userTablesObject) {
              let tablesInArray = userTablesArray.push(
                userTablesObject[tableKey]
              );

              // Допишем свойства в этот стол
              let lastTable = userTablesArray[tablesInArray - 1];
              const tableUrl = lastTable.id.slice(lastTable.id.length - 6);

              lastTable.tableUrl = tableUrl;
            }

            rootState.appLog.push("Записали столы", userTablesArray);

            // dispatch("pushActiveTableLink");
            resolve(userTablesArray);

          })
          .catch(error => {
            console.log("Полный провал. Ошибка: ", error);
            rootState.appLog.push(
              "Ошибка на этапе: Получили столы юзера " + error
            );
          });

      });
    },

    // ПОЛУЧАЕМ СПИСКИ ЗАДАЧ
    getTableTaskLists({
      commit,
      rootState
    }) {
      return new Promise((resolve, reject) => {
        const userId = rootState.userId;
        const tables = rootState.allTasks;

        // Если столов нет - первываем
        // if (!rootState.allTasks) {
        //   commit("stopTableLoader");
        //   rootState.appLog.push("Загрузка стола завершена. У стола нет списков.");
        //   reject()
        // }

        // Получаем все списки юзера
        firebase
          .database()
          .ref("taskLists")
          .orderByChild("userId")
          .equalTo(userId)
          .once("value")
          .then(data => {
            let objLists = data.val();

            // Если ничего не получили, то прерываем
            if (!objLists) reject();

            //Преобразуем объект в массив
            let userTaskLists = [];
            for (var prop in objLists) {
              userTaskLists.push(
                objLists[prop]
              );
            }

            resolve(userTaskLists)
            // Присвоим каждому столу свои списки
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

    // ПОЛУЧАЕМ ЗАДАЧИ
    getTasks({
      rootState
    }) {
      return new Promise((resolve, reject) => {
        const userId = rootState.userId;

        firebase
          .database()
          .ref("tasks")
          .orderByChild("userId")
          .equalTo(userId)
          .once("value")
          .then(data => {
            let userTasksObj = data.val();

            //Преобразуем объект в массив
            let userTasksArray = [];
            for (var prop in userTasksObj) {
              userTasksArray.push(
                userTasksObj[prop]
              );
            }
            console.log("Задачи отправляю", userTasksArray)

            resolve(userTasksArray)

          })
          .catch(error => {
            console.log("Полный провал. Ошибка получения задач: ", error);
          });
      });

    },

    // ЗАПИСЫВАЕМ НАСТРОЙКИ
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
    },

    // ЗАПИСЬ ПОЛУЧЕННЫХ ДАННЫХ В ГЛОБАЛЬНЫЙ МАССИВ
    writeData({
      rootState
    }, {
      tables,
      taskLists,
      tasks
    }) {
      console.log('Данные дошли до обработки', tables, taskLists, tasks)
    }
  }
};
