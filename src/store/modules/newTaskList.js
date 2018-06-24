import * as firebase from "firebase";

export default {
    actions: {

        /////////////////////////////////////////////////
        // УПРАВЛЯЮЩАЯ ФУНКЦИЯ ДОБАВЛЕНИЯ НОВОГО СПИСКА
        //////////////////////////////////////////////////

        addTaskList({ dispatch }) {
            // 1. Формируем параметры нового листа задач и пушим в TaskLists
            dispatch('addList')
                .then(response => {
                    console.log('newTaskList. Запушили список в локальный массив и в taskLists', response);
                    const tableId = response.tableId;
                    const newListId = response.newListId;
                    // 2. Получим списки стола из table/taskLists
                    return dispatch('getTaskListInTable', { tableId, newListId });
                }).then(response => {
                    console.log('newTaskList. Получили списки стола из table/taskLists ', response);
                    const tableId = response.tableId;
                    const newListId = response.newListId;
                    const taskListsId = response.taskListsId;
                    // 3. Отправим обновленные списки на сервер
                    return dispatch('addListIdToTable', { tableId, newListId, taskListsId });
                }).then(response => {
                    console.log();
                }).catch(error => {
                    console.log('Полный провал. Ошибка: ', error);
                })
        },



        //добавляем лист задач
        addList({ dispatch, commit, state, rootState }) {
            return new Promise((resolve, reject) => {

                let tableInd = rootState.activeTableIndex;
                let TableLists = rootState.allTasks[tableInd].taskLists;
                const tableId = rootState.allTasks[tableInd].id;
                const lastTaskInd = rootState.allTasks[rootState.activeTableIndex].taskLists.length - 1;

                //Получим уникальный id списка
                let newListIndex = 0;
                //Получим id последнего cписка, если списков нет - оставим 0
                if(rootState.allTasks[rootState.activeTableIndex].taskLists.length > 0) {
                    newListIndex = rootState.allTasks[rootState.activeTableIndex].taskLists[lastTaskInd].listIndex + 1
                }

                // console.log('.newTaskList. ', lastTaskInd, rootState.activeTableIndex, rootState.allTasks[rootState.activeTableIndex].taskLists.length, newListIndex);
                //Формируем параметры нового списка
                const newTaskList = {
                    'name': 'Введите название списка',
                    'color': 'black',
                    'tasks': [],
                    'listIndex': newListIndex
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
                        // докинем наш ключ в  allTasks. Сначала нужно узнать его индекс
                        const ind = rootState.allTasks[tableInd].taskLists.length - 1;
                        rootState.allTasks[tableInd].taskLists[ind].id = newListId;
                        // console.log('.newtasklist наш лист с id',  rootState.allTasks[tableInd].taskLists[ind].id)

                        // dispatch('getTaskListInTable', { tableId, newListId });
                        resolve({ tableId, newListId });

                    })
                    .catch(error => {
                        console.log('Полный провал. Ошибка: ', error);
                    })
            })
        },

        getTaskListInTable({ dispatch, commit, state, rootState }, { tableId, newListId }) {
            return new Promise((resolve, reject) => {

                firebase
                    .database()
                    .ref("tables/" + tableId + "/taskLists")
                    .once('value')
                    .then(data => {

                        const taskListsId = data.val();
                        resolve({ tableId, newListId, taskListsId });
                    })
                    .catch(error => {
                        console.log('Полный провал. Ошибка: ', error);
                    })

            })
        },

        addListIdToTable({ dispatch, commit, state, rootState }, { tableId, newListId, taskListsId }) {
            return new Promise((resolve, reject) => {

                if (taskListsId == null) {
                    // console.log('лист. переменная не попределена задач нема', taskListsId)

                    taskListsId = [newListId]
                } else {
                    taskListsId.push(newListId);
                    // console.log('Запушили лист');
                }

                firebase
                    .database()
                    .ref("tables/" + tableId + "/taskLists")
                    .set(taskListsId)
                    .then(data => {

                        resolve('newTaskList. Стол запушен. Все ОК!');
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