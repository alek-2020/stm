// FIXME: Сделать минимальную ширину инпута в хедере, когда он пустой, что бы было видно плейсхолдер

/**********************************\
  ПОЛУЧЕНИЕ СТОЛОВ И СПИСКОВ ЗАДАЧ 
\**********************************/

import * as firebase from "firebase";

export default {
  actions: {
    // ПОЛУЧЕНИЕ НАЧАЛЬНЫХ ДАННЫХ ЮЗЕРА
    getUserData({ rootState, dispatch }) {
      return new Promise((resolve, reject) => {
        const uId = rootState.userId;

        firebase
          .database()
          .ref("users/" + uId)
          .once("value")
          .then(data => {
            let userData = data.val();
            resolve(userData);
          })

          .catch(error => {
            console.log("getUserData - ошибка: ", error);
            reject("getUserData - ошибка: ", error);
          });
      });
    },

    // ПОЛУЧАЕМ СТОЛЫ
    getUserTables({ rootState }) {
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

            const userTablesObject = data.val();
            let userTablesArray = [];

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

            resolve(userTablesArray);
          })
          .catch(error => {
            console.log("Полный провал. Ошибка: ", error);
            reject("getUserTables - ошибка:", error);
          });
      });
    },

    // ПОЛУЧАЕМ СПИСКИ ЗАДАЧ
    getTableTaskLists({ commit, rootState }) {
      return new Promise((resolve, reject) => {
        const userId = rootState.userId;
        const tables = rootState.allTasks;

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
              userTaskLists.push(objLists[prop]);
            }

            resolve(userTaskLists);
          })
          .catch(error => {
            console.log("Полный провал. Ошибка: ", error);
            reject("getTableTaskLists - ошибка:", error);
          });

        rootState.appLog.push("Получили списки задач юзера");
      });
    },

    // ПОЛУЧАЕМ ЗАДАЧИ
    getTasks({ rootState }) {
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
              userTasksArray.push(userTasksObj[prop]);
            }
            console.log("Задачи отправляю", userTasksArray);

            resolve(userTasksArray);
          })
          .catch(error => {
            console.log("Полный провал. Ошибка получения задач: ", error);
            reject("getTasks - ошибка:", error);
          });
      });
    },

    // ЗАПИСЫВАЕМ НАСТРОЙКИ
    writeSettings({ rootState }, settings = {}) {
      return new Promise(resolve => {
        let localSettings = settings;

        // Присвоим фон
        let bgImg = settings.bg || rootState.imgForBg[0];
        rootState.currentBgImg = bgImg;

        // Активный стол
        rootState.activeTableIndex = settings.activeTable;

        // Запишем настройки (не помню нужны ли они кучей, поэтому выключу пока)
        // rootState.userData = {
        //   settings
        // };

        resolve();
      });
    },

    // ГРУПИРОВКА ПОЛУЧЕННЫХ ДАННЫЙ
    groupData({ rootState }, { tables = [], taskLists = [], tasks = [] }) {
      return new Promise((resolve, reject) => {
        // 1. Все списки разбирают свои задач
        taskLists.forEach((oneTaskList, index) => {
          // Выбираем задачи содержащие id списка
          let filtedTasks = tasks.filter(function(oneTask) {
            return oneTaskList.id === oneTask.taskListId;
          });
          // Пишем задачи в список
          taskLists[index].tasks = filtedTasks;
        });

        // 2. Все столы разбирают свои списки
        tables.forEach((oneTable, index) => {
          // Выбираем задачи содержащие id списка
          let filteredTaskLists = taskLists.filter(function(oneTaskList) {
            return oneTable.id === oneTaskList.tableId;
          });
          // Пишем списки к столу
          tables[index].taskLists = filteredTaskLists;
        });

        resolve(tables);
      });
    }
  }
};
