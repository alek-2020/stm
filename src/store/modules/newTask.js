import * as firebase from "firebase";

export default {
  actions: {
    // УПРАВЛЯЮЩАЯ Ф-ЦИЯ
    async addNewTask({ dispatch }, { tableInd, taskListInd, endEddingTask }) {
      // return new Promise((resolve, reject) => {
        try {
          const newTask = await dispatch("addTask", { tableInd, taskListInd })
          const Key = newTask.Key;
          const tableInd = newTask.tableInd;

          dispatch("pushKeyInThisTask", Key);

          endEddingTask();

        } catch (error) {
          console.log("newTask. Полный провал. Ошибка: ", error);
          reject("Ошибка добавления задачи");
        }
      // });
    },

    //Формируем параметры задачи и закидываем новую задачу на сервер
    addTask({ dispatch, commit, state, rootState }, { tableInd, taskListInd }) {
      return new Promise((resolve, reject) => {
        const tableId = rootState.allTasks[tableInd].id;
        const taskListId =
          rootState.allTasks[tableInd].taskLists[taskListInd].id;
        const taskColor = "gray";
        const userId = rootState.userId;

        const task = {
          tableId,
          taskListId,
          taskColor,
          isDone: false,
          userId
        };

        firebase
          .database()
          .ref("tasks/")
          .push(task)
          .then(data => {
            const Key = data.key;
            resolve({ Key, tableInd, taskListId, task });
          })
          .catch(error => {
            console.log("Полный провал. Ошибка: ", error);
          });
      });
    },

    pushIdInTask({ dispatch, commit, state, rootState }, Key) {
      return new Promise((resolve, reject) => {
        firebase
          .database()
          .ref("tasks/" + Key + "/id")
          .set(Key)
          .then(data => {
            // console.log('.newTask. Запушили в задачу её id');
            resolve();
          })
          .catch(error => {
            console.log("Полный провал. Ошибка: ", error);
          });
      });
    },

  }
};
