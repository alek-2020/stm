/*************************************\
  УПРАВЛЯЮЩИЕ Ф-ЦИИ ПОЛУЧЕНИЯ ЗАДАЧ
\*************************************/

export default {
  actions: {
    // ПЕРВИЧНОЕ ПОЛУЧЕНИЕ ДАННЫХ
    async firstFetchingData({ dispatch, commit, rootState }) {
      try {
        const userData = await dispatch("getUserData")
        await dispatch("writeSettings", userData.settings)

        if (userData.tables) {
          rootState.tasksAreLoadingNow = false;
          return
        };

        const tables = await dispatch("getUserTables")
        const taskLists = await dispatch("getTableTaskLists");
        const tasks = await dispatch("getTasks");

        const combinedData = await dispatch("groupData", {
          tables,
          taskLists,
          tasks
        });

        console.log('data', combinedData)

        rootState.allTasks = combinedData;

        rootState.tasksAreLoadingNow = false;

      } catch (error) {
        rootState.tasksAreLoadingNow = false;
        dispatch("showLoadingError");
        console.log(error);
      };
    }
  }
};
