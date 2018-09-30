import { rejects } from "assert";

/*************************************\
  УПРАВЛЯЮЩИЕ Ф-ЦИИ ПОЛУЧЕНИЯ ЗАДАЧ
\*************************************/

export default {
  actions: {
    // ПЕРВИЧНОЕ ПОЛУЧЕНИЕ ДАННЫХ
    async firstFetchingData({ dispatch, commit, rootState }) {
      console.log('s')
      try {
        console.log('y2')
        const userData = await dispatch("getUserData")
        console.log('y1')
        await dispatch("writeSettings", userData.settings)

        if (userData.tables) {
          rootState.tasksAreLoadingNow = false;
          return;
        };

        console.log('yaz\'');

        const tables = await dispatch("getUserTables")
        const taskLists = await dispatch("getTableTaskLists");
        const tasks = await dispatch("getTasks");
      
        console.log(tables, taskLists, tasks);

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
