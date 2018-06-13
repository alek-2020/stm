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
                    const taskListInd = response.taskListInd;
                    // 2. Получаем у листа id-шники задач
                    return dispatch('addTaskInTasks', { Key, tableInd, taskListInd });
                }).then(response => {
                    console.log('newTask. Получили у листа id-шники задач', response);
                    const taskId = response.taskId;
                    const tasks = response.tasks;
                    // 3. Отправим обновленные ключи задач
                    return dispatch('addTaskInTasksNext', { taskId, tasks });
                }).then(response => {
                    console.log(response);
                }).catch(error => {
                    console.log('newTask. Полный провал. Ошибка: ', error);
                })
        },

        //Форминуем параметры задачи и закидываем новую задачу на сервер
        addTask({ dispatch, commit, state, rootState }, { tableInd, taskListInd }) {
            return new Promise((resolve, reject) => {

                const mas = rootState.allTasks[tableInd].taskLists[taskListInd].tasks;
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

                mas.push(task);

                firebase
                    .database()
                    .ref("tasks/")
                    .push(task)
                    .then(data => {

                        // console.log('Готовехонько', data.key);
                        const Key = data.key;
                        // dispatch('addTaskInTasks', { Key, tableInd, taskListInd });
                        resolve({Key, tableInd, taskListInd});

                    })
                    .catch(error => {
                        console.log('Полный провал. Ошибка: ', error);
                    })

            })
        },

        addTaskInTasks({ dispatch, commit, state, rootState }, { Key, tableInd, taskListInd }) {
            return new Promise((resolve, reject) => {

                // let tasks;
                //получим id списка задач
                const taskId = rootState.allTasks[tableInd].taskLists[taskListInd].id;

                firebase
                    .database()
                    .ref("taskLists/" + taskId + "/tasks")
                    .once('value')
                    .then(data => {

                        let tasks = data.val();
                        //Еси это первой значение в массиве создаем его
                        if (tasks == null) {
                            tasks = [Key]
                        } else {
                            tasks.push(Key);
                        }


                        // console.log('Задачи с запушенным ID ', tasks);
                        // dispatch('addTaskInTasksNext', { taskId, tasks });
                        resolve({ taskId, tasks });
                    })
                    .catch(error => {
                        console.log('Полный провал. Ошибка: ', error);
                    });

            })
        },

        addTaskInTasksNext({ dispatch, commit, state, rootState }, { taskId, tasks }) {
            return new Promise((resolve, reject) => {

                //отправим обновленные ключи задач
                firebase
                    .database()
                    .ref("taskLists/" + taskId + "/tasks")
                    .set(tasks)
                    .then(data => {

                        // console.log('Привязали задачу к списку', data);
                        resolve('newTask. Задача добавлена. Это успех!');
                    })
                    .catch(error => {
                        console.log('newTask. Полный провал. Ошибка: ', error);
                    })

            })
        },
    }
}