import * as firebase from "firebase";

export default {
    actions: {

        /////////////////////////////////////////////////
        // УПРАВЛЯЮЩАЯ ФУНКЦИЯ ДОБАВЛЕНИЯ НОВОГО СПИСКА
        //////////////////////////////////////////////////

        addTaskList({ dispatch }) {
            // 1. Формируем параметры нового листа задач
            dispatch('addList')
                .then(response => {
                    console.log('Запушили список в локальный массив и в taskLists', response);
                })
        },



        //добавляем лист задач
        addList({ dispatch, commit, state, rootState }) {
            return new Promise((resolve, reject) => {

                let tableInd = rootState.activeTableIndex;
                let TableLists = rootState.allTasks[tableInd].taskLists;
                const tableId = rootState.allTasks[tableInd].id;

                // console.log('Получили списки и id', TableLists, tableId);

                //Формируем параметры нового списка
                const newTaskList = {
                    'name': 'Введите название списка',
                    'color': 'black',
                    'tasks': []
                }

                //если мы ещё не создавали списков, то будет undefined
                //Так что делаем проверку
                if (typeof TableLists == 'undefined') {
                    rootState.allTasks[tableInd].taskLists = [newTaskList]
                    // console.log('добавили в массив ', rootState.allTasks[tableInd].taskLists);
                } else {
                    // console.log('список до пуша ', rootState.allTasks[tableInd].taskLists);
                    rootState.allTasks[tableInd].taskLists.push(newTaskList);
                    // TableLists.push(newTaskList);
                    // console.log('список после пуша ', rootState.allTasks[tableInd].taskLists);

                }

                firebase
                    .database()
                    .ref("taskLists/")
                    .push(newTaskList)
                    .then(data => {


                        //теперь привяжем id списка к столу
                        const newListId = data.key;


                        // dispatch('getTaskListInTable', { tableId, newListId });
                        resolve({ tableId, newListId });

                    })
                    .catch(error => {
                        console.log('Полный провал. Ошибка: ', error);
                    })
            })
        },

        /////////
        getTaskListInTable({ dispatch, commit, state, rootState }, { tableId, newListId }) {
            return new Promise((resolve, reject) => {

                firebase
                    .database()
                    .ref("tables/" + tableId + "/taskLists")
                    .once('value')
                    .then(data => {


                        console.log('ПОЛУЧИЛИ СТОЛЫ С СЕРВАКА', data.val());
                        const taskListsId = data.val();
                        dispatch('addListIdToTable', { tableId, newListId, taskListsId });

                    })
                    .catch(error => {
                        console.log('Полный провал. Ошибка: ', error);
                    })

            })
        },

        addListIdToTable({ dispatch, commit, state, rootState }, { tableId, newListId, taskListsId }) {
            return new Promise((resolve, reject) => {

                //   let taskListsId = rootState.userTables.taskLists;


                if (taskListsId == null) {
                    console.log('лист. переменная не попределена задач нема', taskListsId)

                    taskListsId = [newListId]
                } else {
                    taskListsId.push(newListId);
                    console.log('Запушили лист');
                }

                // taskListsId = newListId;

                console.log('А СПИСКИ У НАС ТАКИЕ ', taskListsId);

                firebase
                    .database()
                    .ref("tables/" + tableId + "/taskLists")
                    .set(taskListsId)
                    .then(data => {


                        console.log('АЙДИШНИКИ В СТОЛЕ БРАТУХА!!!');
                        //нужно получим заново наши столы
                        // dispatch('GetTablesOnly');

                    })
                    .catch(error => {
                        console.log('Полный провал. Ошибка: ', error);
                    })
            })

        },
    }
}