import * as firebase from "firebase";

export default {
    actions: {

        ///////////////////////
        // УПРАВЛЯЮЩАЯ ФУНКЦИЯ
        ///////////////////////

        addNewTable({ dispatch }) {
            // 1.Проверка 'если плюс активен'
            dispatch('checkTableInput')
                .then(response => {
                    console.log(response);
                    // 2. Готовим параметры нового Раб. Ст.
                    return dispatch('AddTableBtn');
                })
                .then(newTable => {
                    console.log('Новый стол готов ', newTable);
                    // 3. Отправим стол на сервер в tables
                    return dispatch("pushNewTable", newTable);
                })
                .then(newTableId => {
                    console.log('Запушили стол в локальный массив в Tables на серв. ', newTableId);
                    // 4. Получим список столов из user/tables, что бы добавить туда новый id
                    return dispatch('getTablesList', newTableId);
                })
                .then(response => {
                    console.log('newTable. Получили из user/tables', response.allTables);
                    // 5. Апдейтим столы уже вместе с новым в user/tables
                    const allTables = response.allTables;
                    const userId = response.userId;
                    return dispatch('apdateTablesList', { allTables, userId });
                })
                .then(response => {
                    console.log('Залили новый список столов в user/tables');
                })
                .catch(error => {
                    console.log(error);
                })

        },


        ////////////////////////////
        // ФУНКЦИИ ДОБАВЛЕНИЯ СТОЛА
        ////////////////////////////

        checkTableInput({ dispatch, commit, state, rootState }) {
            return new Promise((resolve, reject) => {

                if (rootState.plusActive) {
                    resolve('newTable. Плюс активен');
                }

                rootState.plusActive = !rootState.plusActive;
                reject('newTable. Плюс не активен');
            })
        },


        // Формируем формируем параметры стола 
        AddTableBtn({ dispatch, commit, state, rootState, getters }) {
            return new Promise((resolve, reject) => {

                let lastColId = getters.getNewColId;

                const newTableBtn = {
                    name: "Новый стол",
                    colorOne: rootState.gradients[lastColId].colorOne,
                    colorTwo: rootState.gradients[lastColId].colorTwo,
                    colorId: lastColId + 1,
                    taskList: [""]
                };

                resolve(newTableBtn);

            });
        },

        // закидываем новый стол в tables

        pushNewTable({ dispatch, commit, state, rootState }, newTableBtn) {
            return new Promise((resolve, reject) => {

                const userId = rootState.userId;

                firebase
                    .database()
                    .ref("tables/")
                    .push(newTableBtn)
                    .then(data => {

                        const newTableId = data.key;

                        //Добавим id нового стола в его обьект
                        newTableBtn.id = newTableId;

                        rootState.allTasks.push(newTableBtn);

                        resolve(newTableId);

                    })
                    .catch(error => {
                        console.log('Полный провал. Ошибка: ', error);
                    })

            });
        },



        // 2. получим список столов из user/tables
        getTablesList({ dispatch, commit, state, rootState }, newTableId) {
            return new Promise((resolve, reject) => {

                const userId = rootState.userId;

                firebase
                    .database()
                    .ref("users/" + userId + "/tables")
                    .once('value')
                    .then(data => {

                        console.log('столы у нас такие!!! ', data.val());
                        let allTables = data.val();

                        //делаем проверку на undefined
                        if (allTables == null) {
                            console.log('Ещё нет столов', allTables);
                            allTables = [newTableId]
                        } else {
                            console.log('Уже есть столы', allTables);
                            allTables.push(newTableId);
                        }

                        resolve({ allTables, userId });

                    })
                    .catch(error => {
                        console.log('Полный провал. Ошибка: ', error);
                    })
            })
        },

        // 3. Апдейтим новый список
        apdateTablesList({ dispatch, commit, state, rootState }, { allTables, userId }) {
            return new Promise((resolve, reject) => {
                firebase
                    .database()
                    .ref("users/" + userId + "/tables")
                    .set(allTables)
                    .then(data => {
                        resolve();
                    })
                    .catch(error => {
                        console.log('Полный провал. Ошибка: ', error);
                    })

            })
        },
    }
}