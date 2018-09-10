import * as firebase from "firebase";

export default {
  actions: {

    // Управляющая ф-ция
    addNewTable({
      dispatch,
      commit
    }) {
      // 1. Получаем параметры стола
      dispatch('getTableParams')
        .then(params => {
          console.log('Параметры нового стола', params)
          // 2. Формируем объет со всеми параметрами
          return dispatch('createObjectWidthParams', params);
        })
        .then(newTable => {
          // 3. Отправим стол на сервер в tables и в локальный массив
          return dispatch("pushNewTable", newTable);
        })
        .then(newTableId => {

          // Делаем последния стол активным и пушие его ссылку в урл
          rootState.activeTableIndex = numberOfTables - 1;
          dispatch('pushActiveTableLink');

          // Пушим ключ стола в него же 
          dispatch('pushKeyToTable', newTableId);

          // Скролим столы, что бы последний был виден
          commit('scrollButtonsToEnd');

          // Пушим стол в список столов юзера
          dispatch('apdateTablesList', newTableId);
        })
        .catch(error => {
          console.log(error);
        })

    },

    // Получаем параметры стола
    getTableParams({
      rootState
    }) {
      return new Promise((resolve, reject) => {
        let lastTableId, newTableCol;

        //Получим индекс для нового стола
        let newTableIndex = (rootState.allTasks.length > 0) ? rootState.allTasks[rootState.allTasks.length - 1].tableIndex + 1 : 0

        // Получим новый индекс темы оформления
        let newThemeIndex = rootState.allTasks[rootState.allTasks.length - 1] ? rootState.allTasks[rootState.allTasks.length - 1].themeIndex + 1 : 0;
        // Если такого индекс больше чем количество изображений
        if (newThemeIndex > rootState.themes.length - 1 || !newThemeIndex) newThemeIndex = 0

        resolve({
          newTableIndex,
          newThemeIndex
        });
      })
    },

    // Создание объекта с параметрами
    createObjectWidthParams({
      rootState
    }, params) {
      return new Promise((resolve, reject) => {
        let userId = rootState.userId;

        const newTableBtn = {
          name: "Новый стол",
          taskLists: [],
          tableIndex: params.newTableIndex,
          themeIndex: params.newThemeIndex,
          userId
        };

        resolve(newTableBtn);
      });
    },

    // Пушим на сервер и пишем в массив
    pushNewTable({
      rootState
    }, newTableBtn) {
      return new Promise((resolve, reject) => {

        firebase
          .database()
          .ref("tables/")
          .push(newTableBtn)
          .then(data => {

            // Добавим id нового стола в его обьект
            const newTableId = data.key;
            newTableBtn.id = newTableId;

            // Пушим в массив столов
            let numberOfTables = rootState.allTasks.push(newTableBtn);

            resolve(newTableId);
          })
          .catch(error => {
            console.log('Полный провал. Ошибка: ', error);
          })
      });
    },

    // Допушиваем в стол его же id
    pushKeyToTable({}, TableKey) {
      firebase
        .database()
        .ref("tables/" + TableKey + "/id")
        .set(TableKey)
        .then(data => {
        })
        .catch(error => {
          console.log('Полный провал. Ошибка: ', error);
        })
    },

    // Пушим новый стол в список столов юзера
    apdateTablesList({
      rootState
    }, tableId) {
      return new Promise((resolve, reject) => {

        const userId = rootState.userId;

        firebase
          .database()
          .ref("users/" + userId + "/tables/" + tableId)
          .set(tableId)
          .then(data => {
            resolve(data);
          })
          .catch(error => {
            console.log('Полный провал. Ошибка: ', error);
          })
      })
    },


  },
}
