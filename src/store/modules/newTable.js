import * as firebase from "firebase";

export default {
    actions: {

        ///////////////////////
        // УПРАВЛЯЮЩАЯ ФУНКЦИЯ
        ///////////////////////

        addNewTable({ dispatch, commit }) {
            // 1.Проверка 'если плюс активен'
            dispatch('checkTableInput')
                .then(response => {
                    console.log('Плюс активен ', response);
                    //1.5 Получим цвет нового стола 
                    return dispatch('getNewColId');
                })
                .then(newColor => {
                    // 2. Готовим параметры нового Раб. Ст.
                    return dispatch('AddTableBtn', newColor);
                })
                .then(newTable => {
                    console.log('Новый стол готов ', newTable);
                    // 3. Отправим стол на сервер в tables
                    return dispatch("pushNewTable", newTable);
                })
                .then(newTableId => {
                    console.log('Запушили стол в локальный массив в Tables на серв. ', newTableId);
                    //Пушим ключ стола в него же 
                    dispatch('pushKeyToTable', newTableId);
                    //Послу пушв в локальный массив проскролим столы, что бы новый было видно
                    commit('scrollButtonsToEnd');
                    //Делаем новосозданный стол активным
                    dispatch('makeLastTableActive');
               
                // 4. Получим список столов из user/tables, что бы добавить туда новый id
                //     return dispatch('getTablesList', newTableId);
                // })
                // .then(response => {
                //     console.log('newTable. Получили из user/tables', response.allTables);
                   
                // 5. Пушим новый стол в список столовs
                    // const allTables = response.allTables;
                    // const userId = response.userId;

                    return dispatch('apdateTablesList', newTableId);
                })
                .then(response => {
                    console.log('Залили новый список столов в user/tables', response);
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

                // if (rootState.plusActive) {
                //     resolve('newTable. Плюс активен');
                // }

                // rootState.plusActive = !rootState.plusActive;
                // reject('newTable. Плюс не активен');

                resolve('newTable. Плюс активен');

            })
        },


        // Узнаем цвет нового стола
        getNewColId({ dispatch, commit, state, rootState, getters }) {
            return new Promise((resolve, reject) => {
                let lastTableId, newTableCol;
                console.log('getcol Последний idd', rootState.allTasks.length);
                
                //Если ещё нет столов или сайчас у стола последний цвет, то присваиваем цвет с индексом ноль
                          
                if(rootState.allTasks.length < 1 ) {
            
                    newTableCol = 0;
                } else {
                    lastTableId = rootState.allTasks[rootState.allTasks.length - 1].colorId;
                    console.log('id последнего стола ', lastTableId, rootState.allTasks.length, rootState.allTasks[0].colorId);
                    newTableCol = rootState.allTasks[lastTableId].colorId + 1;
        
                    if( newTableCol > (rootState.gradients.length - 1)) {
                        newTableCol = 0;
                    }
                }
        
                console.log('getcol Последний id', lastTableId);
                console.log('getcol Возвращаем ', newTableCol)
                resolve(newTableCol);
                // return 3;
            })
        },

        // Формируем формируем параметры стола 
        AddTableBtn({ dispatch, commit, state, rootState, getters }, colId) {
            return new Promise((resolve, reject) => {

                let newTableIndex = 0;
                //Получим id последнего рабочего стола массиве, если столов нет - оставим 0
                if(rootState.allTasks.length > 0) {
                    newTableIndex = rootState.allTasks[rootState.allTasks.length - 1].tableIndex + 1
                }

                console.log('getcol ', colId);
                const newTableBtn = {
                    name: "Новый стол",
                    colorOne: rootState.gradients[colId].colorOne,
                    colorTwo: rootState.gradients[colId].colorTwo,
                    colorId:  colId,
                    taskLists: [],
                    tableIndex: newTableIndex
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
                        
                        //Пушим урл
                        //Нужно запушить урл нового стола в адресную стр.
                        console.log('Пушим в роутер');
                        let fouCharId = 'kjl';
                        this.$router.push('/table/' + fouCharId);
                        resolve(newTableId);

                    })
                    .catch(error => {
                        console.log('Полный провал. Ошибка: ', error);
                    })

            });
        },


        // 1.5 Допушиваем в стол его же id
        pushKeyToTable({ dispatch, commit, state, rootState }, TableKey) {
            console.log('kk ',TableKey);
            firebase
            .database()
            .ref("tables/" + TableKey + "/id")
            .set(TableKey)
            .then(data => { 
               console.log('.newTable. запушили в стол его id ', data);
            })
            .catch(error => {
                console.log('Полный провал. Ошибка: ', error);
            })
        },

        // 2. получим список столов из user/tables
        // getTablesList({ dispatch, commit, state, rootState }, newTableId) {
        //     return new Promise((resolve, reject) => {

        //         const userId = rootState.userId;

        //         firebase
        //             .database()
        //             .ref("users/" + userId + "/tables")
        //             .once('value')
        //             .then(data => {

        //                 console.log('столы у нас такие!!! ', data.val());
        //                 let allTables = data.val();

        //                 //делаем проверку на undefined
        //                 if (allTables == null) {
        //                     console.log('Ещё нет столов', allTables);
        //                     allTables = [newTableId]
        //                 } else {
        //                     console.log('Уже есть столы', allTables);
        //                     allTables.push(newTableId);
        //                 }

        //                 resolve({ allTables, userId });

        //             })
        //             .catch(error => {
        //                 console.log('Полный провал. Ошибка: ', error);
        //             })
        //     })
        // },

        // 3. Пушим новый стол в список столов
        apdateTablesList({ dispatch, commit, state, rootState }, tableId) {
            return new Promise((resolve, reject) => {

                const userId = rootState.userId;
                
                firebase
                    .database()
                    .ref("users/" + userId + "/tables/" + tableId)
                    .set(tableId)
                    .then(data => {
                        console.log('.newTable. Закинули стол в user');
                        resolve(data);
                        
                    })
                    .catch(error => {
                        console.log('Полный провал. Ошибка: ', error);
                    })

            })
        },
    }
}