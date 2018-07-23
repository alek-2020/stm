
export default {

    actions: {

        verifyTable({ rootState, dispatch }) {
            const ind = rootState.activeTableIndex
            let tableTasks = rootState.allTasks[ind].taskLists
            const tableId = rootState.allTasks[ind].id
            let errors = []

            tableTasks.forEach((element, index) => {
                //сравним id списка задач с id стола
                if (element.tableId != tableId) {
                    errors.push({
                        message: 'Некорректный список задач',
                        taskListTabkeInd: element.tableId,
                        tableId: tableId,
                        taskListIndex: index,
                        tableIndex: ind,
                    })
                }

                element.tasks.forEach((el, taskInd) => {
                    if (el.tableId != tableId || el.taskListId != element.id) {
                        errors.push({
                            message: 'Некорректная задача',
                            taskTaskListId: el.taskListId,
                            taskListId: element.id,
                            taskTableId: el.tableId,
                            tableId: tableId,
                            taskListIndex: index,
                            tableIndex: ind,
                            taskIndex: taskInd
                        })
                    }
                })
            });

            let allTableTaks = []

            tableTasks.forEach((element, index) => {
                element.tasks.forEach((el, taskInd) => {
                    allTableTaks.push(el.id)
                })
            })

            // allTableTasks.forEach()

            
            // var arr = ['s', 's', 'sdfsdf', '2', 'sdfsdf'], 
            let temp = {};
            temp = allTableTaks.filter(function (a) {
                return temp[a] || !(temp[a] = !0)
            })
            // console.log('дубликаты ' , temp)

            if(temp.length) {
                errors.push({
                    message: 'Дубликаты',
                    mas: temp
                })
            }
            // FIXME: беспонечная загрузка после авторизации
            // TODO: На авторизации слайдер как на todoist с анимахами. можно что нибудь вроде стрелочки чекающей дурацкие задачи, либо что то дельное

            //Если есть хотя бы одна ошибка, то выводим массим в собщение в консоль и показываем фатал 
            if (errors.length > 0) {
                console.log('ERROR! УЖАСНАЯ ОШИБКА У НАС ПРОИЗОШЛА. ВЫВОД НЕКОРРЕКТЕН УВАЖАЕМЫЙ!', errors);
                dispatch('showBadNews', 'Некорректный вывод задач! Перезагрузите страницу!');
            }

            //Дальше проверем все или задачи выведены
            //ПРОВЕРКА НА ДУБЛИ
        }

    }
}