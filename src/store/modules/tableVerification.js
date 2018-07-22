
export default {

    actions: {

        verifyTable({rootData}) {
           const ind = rootState.activeTableIndex
           let tableTasks = rootData.allTasks[ind].taskLists
           const tableId = rootData.allTasks[ind].id
           let errors 

           tableTasks.array.forEach((element, index) => {
              //сравним id списка задач с id стола
              if(element.tableId != tableId) {
                  errors.push({
                      message: 'Некорректный список задач',
                      taskListTabkeInd: element.tableId,
                      tableId: tableId,
                      taskListIndex: index,
                      tableIndex: ind,
                  })
              }

              element.tasks.forEach((el, taskInd) => {
                  if(el.tableId != tableId || el.taskListId != element.id) {
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

           //Если есть хотя бы одна ошибка, то выводим массим в собщение в консоль и показываем фатал 
           if(errors.length > 0) {
              console.log('ERROR! УЖАСНАЯ ОШИБКА У НАС ПРОИЗОШЛА. ВЫВОД НЕКОРРЕКТЕН УВАЖАЕМЫЙ!', errors);
           }
        }

    }
}