import * as firebase from "firebase";

export default {
  actions: {

    /////////////////////////////////////////////////
    // УПРАВЛЯЮЩАЯ ФУНКЦИЯ ДОБАВЛЕНИЯ НОВОГО СПИСКА
    //////////////////////////////////////////////////

    addTaskList({
      dispatch
    }) {
      // 1. Формируем параметры нового листа задач и пушим в TaskLists
      dispatch('addList')
        .then(response => {
          console.log('newTaskList. Запушили список в локальный массив и в taskLists', response);
          const tableId = response.tableId;
          const newListId = response.newListId;

          // 2 Запушим в список его id
          dispatch('pushKeyToTaskList', newListId);
          // 3. Отправим обновленные списки на сервер
          return dispatch('addListIdToTable', {
            tableId,
            newListId
          });
        }).then(response => {
          // console.log();
        }).catch(error => {
          console.log('Полный провал. Ошибка: ', error);
        })
    },



    //добавляем лист задач
    addList({
      dispatch,
      commit,
      state,
      rootState
    }) {
      return new Promise((resolve, reject) => {

        let tableInd = rootState.activeTableIndex;
        console.log(rootState.allTasks[tableInd])
        let TableLists = rootState.allTasks[tableInd].taskLists;
        const tableId = rootState.allTasks[tableInd].id;
        const lastTaskInd = rootState.allTasks[rootState.activeTableIndex].taskLists.length - 1;
        const userId = rootState.userId;

        //Получим уникальный id списка
        let newListIndex = 0;
        //Получим id последнего cписка, если списков нет - оставим 0
        if (rootState.allTasks[rootState.activeTableIndex].taskLists.length > 0) {
          newListIndex = rootState.allTasks[rootState.activeTableIndex].taskLists[lastTaskInd].listIndex + 1
        }

        // console.log('.newTaskList. ', lastTaskInd, rootState.activeTableIndex, rootState.allTasks[rootState.activeTableIndex].taskLists.length, newListIndex);
        //Формируем параметры нового списка
        const newTaskList = {
          name: '',
          color: 1,
          tasks: [],
          listIndex: newListIndex,
          userId,
          tableId
        }

        //если мы ещё не создавали списков, то будет undefined
        //Так что делаем проверку
        if (typeof TableLists == 'undefined') {
          rootState.allTasks[tableInd].taskLists = [newTaskList]
          // console.log('добавили в массив ', rootState.allTasks[tableInd].taskLists);
        } else {
          rootState.allTasks[tableInd].taskLists.push(newTaskList);
        }

        firebase
          .database()
          .ref("taskLists/")
          .push(newTaskList)
          .then(data => {
            //теперь привяжем id списка к столу
            const newListId = data.key;
            console.log('.newTaskList. data.key ', newListId, data.key);
            // докинем наш ключ в  allTasks. Сначала нужно узнать его индекс
            const ind = rootState.allTasks[tableInd].taskLists.length - 1;
            rootState.allTasks[tableInd].taskLists[ind].id = newListId;
            // console.log('.newtasklist наш лист с id',  rootState.allTasks[tableInd].taskLists[ind].id)

            // dispatch('getTaskListInTable', { tableId, newListId });
            resolve({
              tableId,
              newListId
            });

          })
          .catch(error => {
            console.log('Полный провал. Ошибка: ', error);
          })
      })
    },

    pushKeyToTaskList({
      dispatch,
      commit,
      state,
      rootState
    }, listKey) {
      // console.log('k ',listKey);
      firebase
        .database()
        .ref("taskLists/" + listKey + "/id")
        .set(listKey)
        .then(data => {
          //    console.log('.newTaskList. запушили в список его id ', data);
        })
        .catch(error => {
          console.log('Полный провал. Ошибка: ', error);
        })
    },

    getTaskListInTable({
      dispatch,
      commit,
      state,
      rootState
    }, {
      tableId,
      newListId
    }) {
      return new Promise((resolve, reject) => {

        firebase
          .database()
          .ref("tables/" + tableId + "/taskLists")
          .once('value')
          .then(data => {

            const taskListsId = data.val();
            resolve({
              tableId,
              newListId,
              taskListsId
            });
          })
          .catch(error => {
            console.log('Полный провал. Ошибка: ', error);
          })

      })
    },

    addListIdToTable({
      dispatch,
      commit,
      state,
      rootState
    }, {
      tableId,
      newListId
    }) {
      return new Promise((resolve, reject) => {

        firebase
          .database()
          .ref("tables/" + tableId + "/taskLists/" + newListId)
          .set(newListId)
          .then(data => {

            resolve('newTaskList. Список запушен. Все ОК!');
          })
          .catch(error => {
            console.log('Полный провал. Ошибка: ', error);
          })
      })

    },
  }
}
