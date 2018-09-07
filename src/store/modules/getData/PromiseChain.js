/*************************************\
  УПРАВЛЯЮЩИЕ Ф-ЦИИ ПОЛУЧЕНИЯ ЗАДАЧ
\*************************************/

/*
    Возможные варианты на входе:
    ---Ни одного стола не загружено
    ---Есть загруженные, но не загружен текущий
    ---Загружены все столы

    Нужно сделать: 
    1. При смене стола отправляем запрос на загрузку
    2. Загрузчик смотрит id стола(индекс наверное нет) и грузит по ним задачи
    3. Если задача уже загружена, то ничего не делает
    4. Если у нас начинается запись задач привязанных не к тому списку или
    списков привязанных не к тому столу, то выдаем эрор и предлагаем перезагрузиться,
    либо насильно перезагружаем.
    5. Если у нас что-либо не догружается, то выдаем ошибку с предложением перезагрузиться, 
    либо нужно добавить систему проверки, что бы она догружала, что нужно.
*/

import * as firebase from "firebase";

export default {
  actions: {
    // Проверка состояния загрузки задач
    startGetTasks({
      dispatch,
      rootState,
      commit
    }) {
      return new Promise((resolve, reject) => {
        // 1. Если не загружено ни одного стола
        if (rootState.allTasks.length < 1) {
          rootState.appLog.push("Ниодного загруженного стола");
          dispatch("firstGettingData");
        } else {
          // Чистим побочные массивы
          rootState.masTasks = [];

          // 2. Если есть загруженные, но текущий стол не загружег
          if (
            rootState.allTasks[rootState.activeTableIndex].taskLists.length < 1
          ) {
            // тогда сразу инициализируем загрузки списков
            rootState.appLog.push(
              "Есть загруженные столы, нет загруженных списков на текущем"
            );
            commit("startTableLoader");
            dispatch("getTableTaskLists");
          } else {
            // Этот стол уже загружен
            rootState.appLog.push("startGetTasks. Этот стол уже загружен");
            commit("stopTableLoader");
          }
        }
      });
    },

    // Управляющая функция для первичного получения данных
    firstGettingData({
      dispatch,
      commit,
      rootState
    }) {
      firebase
        .database()
        .ref("tables")
        .orderByChild("bgIndex")
        .equalTo(0)
        .once("value")
        .then(data => {
          console.log("Получай", data.val());
        });

      firebase
        .database()
        .ref("tables")
        .orderByKey()
        .equalTo("-LLjSWGpyS-QKEOsKZYO")
        .once("value")
        .then(data => {
          console.log("Получай2s", data.val());
        });

      // Основные данные юзера
      dispatch("getUserData")
        .then(response => {
          // 2. Пишем рабочие столы из tables в allTasks
          const settings = response.settings;
          dispatch("getSettings", settings);
          //Продолжаем, если есть столы
          if (response.tables != null) {
            rootState.appLog.push("Есть столы ");
            return dispatch("getDataSecondChain");
          } else {
            rootState.appLog.push(
              "firstGettingData - Нет столов для загрузки",
              response
            );
            commit("stopTableLoader");
          }
        })
        .catch(error => {
          console.log(error);
          // если есть ошибки на этапе загрузки, то выкидываем попап перезагрузки страницы
          dispatch("linksHandler", {
            toLink: "/error/"
          });
          commit("stopTableLoader");
          rootState.appLog.push("Ошибка загрузки стола в firstGettingData");
        });
    },

    //Cледующая цепочка, которая выполняется только если у нас есть списки

    getDataSecondChain({
      dispatch,
      commit
    }) {
      // console.log('Вторая цепочка пошла');
      let tables, taskLists, tasks;

      dispatch("getUserTables")
        .then((userTables) => {
          tables = userTables
          console.log('столы поидее пришли', tables)
          // 3. Загружаем списки из taskLists в allTasks на каждой итерации вызываю получение задач
          return dispatch("getTableTaskLists");
        })
        .then((userTaskLists) => {
          taskLists = userTaskLists
          // return dispatch("checkUrl");
          console.log("списки пришли, получаем задачи", userTaskLists)
          return dispatch('getTasks')
        })
        .then((userTasks) => {
          tasks = userTasks
          console.log("Задачи пришли", userTasks)
          return dispatch('writeData', {tables, taskLists, tasks});
        })
        .then(() => {
          console.log('Получение данных и запись завершены');
        })
        .catch(error => {
          console.log(error);
          commit("stopTableLoader");
        });
    }
  }
};
