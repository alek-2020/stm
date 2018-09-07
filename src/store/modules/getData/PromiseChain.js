/*************************************\
  УПРАВЛЯЮЩИЕ Ф-ЦИИ ПОЛУЧЕНИЯ ЗАДАЧ
\*************************************/

export default {
  actions: {
    // ПЕРВИЧНОЕ ПОЛУЧЕНИЕ ДАННЫХ
    firstFetchingData({ dispatch, commit, rootState }) {
      let userData;
      // 1. Основные данные юзера
      dispatch("getUserData")
        .then(uData => {
          userData = uData;
          const settings = uData.settings;
          return dispatch("writeSettings", settings);
        })
        .then(() => {
          //Продолжаем, если есть столы
          if (userData.tables != null) {
            rootState.appLog.push("firstFetchingData - Есть столы ");
            return dispatch("getDataSecondChain");
          } else {
            // Состояние загрузки
            rootState.tasksAreLoadingNow = false;
            rootState.appLog.push("firstFetchngData - Нет столов для загрузки");
          }
        })
        .catch(error => {
          console.log("Ошибка получения данных юзера", error);
          // Состояние загрузки
          rootState.tasksAreLoadingNow = false;
          // если есть ошибки на этапе загрузки, то выкидываем попап перезагрузки страницы
          dispatch("linksHandler", {
            toLink: "/error/"
          });
          rootState.appLog.push("Ошибка загрузки стола в firstFetchngData");
        });
    },

    // ЦЕПОЧКА, КОТОРАЯ ВЫПОЛНЯЕТСЯ, ЕСЛИ ЕСТЬ СТОЛЫ
    getDataSecondChain({ dispatch, commit, rootState }) {
      let tables, taskLists, tasks;

      dispatch("getUserTables")
        .then(userTables => {
          tables = userTables;
          // 2. Получаем списки
          return dispatch("getTableTaskLists");
        })
        .then(userTaskLists => {
          taskLists = userTaskLists;
          // 3. Получаем задачи
          return dispatch("getTasks");
        })
        .then(userTasks => {
          tasks = userTasks;
          // 4. Группируем все в один массив
          return dispatch("groupData", { tables, taskLists, tasks });
        })
        .then(userTables => {
          // Вывод задач
          rootState.allTasks = userTables;
          // Состояние загрузки
          rootState.tasksAreLoadingNow = false;
        })
        .catch(error => {
          // Состояние загрузки
          rootState.tasksAreLoadingNow = false;

          console.log(error);
        });
    }
  }
};
