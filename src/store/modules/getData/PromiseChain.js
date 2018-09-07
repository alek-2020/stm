/*************************************\
  УПРАВЛЯЮЩИЕ Ф-ЦИИ ПОЛУЧЕНИЯ ЗАДАЧ
\*************************************/

export default {
  actions: {
    // Управляющая функция для первичного получения данных
    firstFetchingData({ dispatch, commit, rootState }) {
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
              "firstFetchngData - Нет столов для загрузки",
              response
            );
          }
        })
        .catch(error => {
          console.log(error);
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
