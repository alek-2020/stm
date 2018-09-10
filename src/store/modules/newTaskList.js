import * as firebase from "firebase";

export default {
  actions: {

    // УПРАВЛЯЮЩАЯ ФУНКЦИЯ
    addTaskList({
      dispatch
    }) {
      // 1. Формируем параметры нового листа
      dispatch('makeListObj')
        .then(newTaskList => {
          // 2. Пушим параметры
          return dispatch('pushListObj', newTaskList)
        })
        .then(newListId => {
          // 3. Пушим id списка в него же
          dispatch('pushKeyToTaskList', newListId);
        })
        .catch(error => {
          console.log('Полный провал. Ошибка: ', error);
        })
    },

    //добавляем лист задач
    makeListObj({
      rootState
    }) {
      return new Promise((resolve, reject) => {

        let tableInd = rootState.activeTableIndex;
        let TableLists = rootState.allTasks[tableInd].taskLists;
        const tableId = rootState.allTasks[tableInd].id;
        const lastTaskInd = rootState.allTasks[rootState.activeTableIndex].taskLists.length - 1;
        const userId = rootState.userId;

        //Получим уникальный id списка
        let newListIndex = TableLists.length > 0 ? TableLists[lastTaskInd].listIndex + 1 : 0

        //Формируем параметры нового списка
        const newTaskList = {
          name: '',
          tasks: [],
          listIndex: newListIndex,
          color: 0,
          userId,
          tableId
        }

        resolve(newTaskList)
      })
    },

    // ПУШИМ ОБЪЕКТ НА СЕРВЕР
    pushListObj({
      rootState
    }, newTaskList) {
      return new Promise((resolve, reject) => {
        let TableLists = rootState.allTasks[rootState.activeTableIndex].taskLists;

        firebase
          .database()
          .ref("taskLists/")
          .push(newTaskList)
          .then(data => {
            const newListId = data.key
            // докинем наш ключ в  allTasks
            newTaskList.id = newListId;

            // Пушим в старый массив(если есть) или создаем новый
            !TableLists ? TableLists = [newTaskList] : TableLists.push(newTaskList);

            resolve(newListId);

          })
          .catch(error => {
            console.log('Полный провал. Ошибка: ', error);
            reject('Ошибка добавления задачи', error)
          })
      })
    },

    // ДОПУШИВАЕМ ID СПИСКА В НЕГО ЖЕ
    pushKeyToTaskList({}, listKey) {
      firebase
        .database()
        .ref("taskLists/" + listKey + "/id")
        .set(listKey)
        .catch(error => {
          console.log('Полный провал. Ошибка: ', error);
        })
    },

  }
}
