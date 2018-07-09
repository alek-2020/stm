import * as firebase from "firebase";

export default {
    actions: {


        ///////////////////////
        // УПРАВЛЯЮЩАЯ ФУНКЦИЯ
        ///////////////////////

        addNewTask({ dispatch }, { tableInd, taskListInd }) {
            // 1. Формируем параметры задачи и отправляем на сервер в tasks
            dispatch('addTask', { tableInd, taskListInd })
                .then(response => {
                    console.log('newTask. Сформировали параметры задачи и отправляем на сервер в tasks ', response);
                    const Key = response.Key;
                    const tableInd = response.tableInd;
                    const taskListId = response.taskListId;
                    const newTask = response.task;

                    dispatch('pushIdInTask', Key );
                    // 2. Получаем у листа id-шники задач
                //     return dispatch('addTaskInTasks', { Key, tableInd, taskListInd });
                // }).then(response => {
                //     console.log('newTask. Получили у листа id-шники задач', response);
                //     const taskId = response.taskId;
                //     const tasks = response.tasks;
                    // 3. Отправим обновленные ключи задач
                    return dispatch('addTaskInTasksNext', { Key, taskListId, tableInd, taskListInd, newTask });
                }).then(response => {
                    console.log(response);
                }).catch(error => {
                    console.log('newTask. Полный провал. Ошибка: ', error);
                })
        },

        //Форминуем параметры задачи и закидываем новую задачу на сервер
        addTask({ dispatch, commit, state, rootState }, { tableInd, taskListInd }) {
            return new Promise((resolve, reject) => {

                const tableId = rootState.allTasks[tableInd].id;
                const taskListId = rootState.allTasks[tableInd].taskLists[taskListInd].id;
                const taskColor = "gray";

                const task = {
                    text: 'Задача удача',
                    tableId,
                    taskListId,
                    taskColor,
                    isDone: false
                };

                // mas.push(task);

                firebase
                    .database()
                    .ref("tasks/")
                    .push(task)
                    .then(data => {

                        // console.log('Готовехонько', data.key);
                        const Key = data.key;
                        // dispatch('addTaskInTasks', { Key, tableInd, taskListInd });
                        resolve({Key, tableInd, taskListId, task});

                    })
                    .catch(error => {
                        console.log('Полный провал. Ошибка: ', error);
                    })

            })
        },

      

        pushIdInTask({ dispatch, commit, state, rootState }, Key ) {
            return new Promise((resolve, reject) => {

               

                firebase
                    .database()
                    .ref("tasks/" + Key + "/id")
                    .set(Key)
                    .then(data => {

                        console.log('.newTask. Запушили в задачу её id');
                        resolve();
                    })
                    .catch(error => {
                        console.log('Полный провал. Ошибка: ', error);
                    });

            })
        },

        addTaskInTasksNext({ dispatch, commit, state, rootState }, { Key, taskListId, tableInd, taskListInd, newTask} ) {
            return new Promise((resolve, reject) => {

                firebase
                    .database()
                    .ref("taskLists/" + taskListId + "/tasks/" + Key)
                    .set(Key)
                    .then(data => {

                        const mas = rootState.allTasks[tableInd].taskLists[taskListInd].tasks;
                        newTask.id = Key;
                        mas.push(newTask);

                        dispatch('showGoodNews', 'Задача добавлена');
                        dispstch('scrollListDown', taskListId);
                        // console.log('Привязали задачу к списку', data);
                       
                        resolve('newTask. Задача добавлена. Это успех!');
                    
                    })
                    .catch(error => {
                        console.log('newTask. Полный провал. Ошибка: ', error);
                        dispatch('showBadNews', 'Ошибка добаления задачи');

                    })

            })
        },
    }
}