import * as firebase from "firebase";


export default {



          //Закидываем новую задачу на сервер
          addTask({ dispatch, commit, state }, { tableInd, taskListInd, task }) {
              console.log('Получили всю байду', tableInd, taskListInd, task)
              // const mas = state.allTasks[0].taskLists[taskListInd].tasks;
              //user.set(first: "Miles", last: "Davis")
  
              firebase
                  .database()
                  .ref("tasks/")
                  .push(task)
                  .then(data => {
  
                      console.log('Готовехонько', data.key);
                      const Key = data.key;
                      dispatch('addTaskInTasks', { Key, tableInd, taskListInd });
  
  
                  })
                  .catch(error => {
                      console.log('Полный провал. Ошибка: ', error);
                  })
  
              //тестим массив
  
              //получаем все таски с уже записанной и переписываем массив
  
  
              // firebase
              // .database()
              // .ref("taskLists/asdfas/tasks2")
              // .once('value')
              // .then(data => {
  
              //   console.log('Тестовый массив', data.val());
              //   let m = data.val()
              //   m = ['s','d','df']
              //   m.push('гусь')
              //   firebase.database().ref("taskLists/asdfas/tasks2")
              //   .set(m)
  
              // })
              // .catch(error => {
              //     console.log('Полный провал. Ошибка: ', error);
              // })
  
          },
  
          addTaskInTasks({ dispatch, commit, state }, { Key, tableInd, taskListInd }) {
              let tasks;
              // = state.allTasks[tableInd].taskLists[taskListInd].tasks;
  
              const taskId = state.allTasks[tableInd].taskLists[taskListInd].id;
              console.log('Получили таки мы id списки ', taskId);
  
              firebase
                  .database()
                  .ref("taskLists/" + taskId + "/tasks")
                  .once('value')
                  .then(data => {
  
                      console.log('подучили наши задачи на серваке', data.val());
                      tasks = data.val();
  
                      //Еси это первой значение в массиве создаем его
                      if (tasks == null) {
                          tasks = [Key]
                      } else {
                          tasks.push(Key);
                      }
  
  
                      console.log('Задачи с запушенным ID ', tasks);
                      dispatch('addTaskInTasksNext', { taskId, tasks });
  
                  })
                  .catch(error => {
                      console.log('Полный провал. Ошибка: ', error);
                  });
  
  
          },
  
          addTaskInTasksNext({ dispatch, commit, state }, { taskId, tasks }) {
              console.log('До этого момента дажене доходим мать его');
              //отправим обновленные ключи задач
              firebase
                  .database()
                  .ref("taskLists/" + taskId + "/tasks")
                  .set(tasks)
                  .then(data => {
  
                      console.log('Привязали задачу к списку', data);
  
  
                  })
                  .catch(error => {
                      console.log('Полный провал. Ошибка: ', error);
                  })
          },
  
          //Отметить задачу как сделанную
          checkTask({ dispatch, commit, state }, { task, taskInd, tableInd, taskListInd }) {
              console.log('ДЛЯ ОТМЕТКИ ЗАДАЧИ ПОЛУЧАЕМ ', task, taskInd, tableInd, taskListInd);
              //    tableInd =+ 1
              const taskId = state.allTasks[tableInd].taskLists[taskListInd].tasks[taskInd].id;
  
  
              firebase
                  .database()
                  .ref("tasks/" + taskId + "/isDone")
                  .set(true)
                  .then(data => {
  
                      //Если успех внесем изменения в локальный массив
                      const taskId = state.allTasks[tableInd].taskLists[taskListInd].tasks[taskInd].isDone = true;
  
                      console.log('Задачка готова!');
  
  
                  })
                  .catch(error => {
                      console.log('Полный провал. Ошибка: ', error);
                  })
          },
  
        
  
          
  
          // Получение параметров стола
          // Определяем цвет последнего стола и возвращаем новый
          lastTableColor({ dispatch, commit, state }) {
              var i = state.allTasks.length - 1;
              console.log('длина, сам массив ', i, state.allTasks[i]);
              var id = state.allTasks[i].colorId;
              var color = state.gradients[id+1];
              var colOne = color.colorOne;
              var colTwo = color.colorTwo;
              // var colOne = state.allTasks[i].tables.colorOne;
              // var colTwo = state.tables[i].colorTwo;
              console.log("linear-gradient( to bottom, " + colOne + ", " + colTwo);
        
              return "linear-gradient( to bottom, " + colOne + ", " + colTwo;
            },
  
       
  
          ///Изменение поля в задаче
          changeText({ dispatch, commit, state }, { text, task }) {
              // TaskId = state.allTasks[tableInd].taskLists[taskListInd].tasks[taskInd]
              console.log('Вот наша задача ', task);
              const TaskId = task.id;
  
              firebase
                  .database()
                  .ref("tasks/" + TaskId + "/text")
                  .set(text)
                  .then(data => {
  
                      console.log('Поменяли текст в задаче');
  
  
                  })
                  .catch(error => {
                      console.log('Полный провал. Ошибка: ', error);
                  })
  
          },
  
          //Изменение заголовка списка
          changeListTitle({ dispatch, commit, state }, { NewName, ListId }) {
  
  
              firebase
                  .database()
                  .ref("taskLists/" + ListId + "/name")
                  .set(NewName)
                  .then(data => {
                      console.log('Поменяли заголовок в списке');
                  })
                  .catch(error => {
                      console.log('Полный провал. Ошибка: ', error);
                  })
  
  
          },
  
          //Меняем название стола
          changeTableTitle({ dispatch, commit, state }, { NewName, TableId }) {
              firebase
                  .database()
                  .ref("tables/" + TableId + "/name")
                  .set(NewName)
                  .then(data => {
                      console.log('Поменяли заголовок стола');
                  })
                  .catch(error => {
                      console.log('Полный провал. Ошибка: ', error);
                  })
          },
  
          ///УДАЛЕНИЕ АКТИВНОГО РАБОЧЕГО СТОЛА
          delActiveTable({ dispatch, commit, state }) {
  
              let ind = state.activeTableIndex;
              const userId = state.userId;
  
              firebase
                      .database()
                      .ref("users/" + userId + "/tables/" + ind)
                      .remove()
                      .then(data => {
  
                          //Если все ок - вырезаем из локального массива
                          let allTables = state.allTasks;
                          allTables.splice(ind, 1);
                          //Понижаем tableIndex на 1, если он больше 0
                      
                      if(ind > 0) {
                          state.activeTableIndex = ind - 1; 
                          console.log( state.activeTableIndex );
                      }
  
                  })
              .catch(error => {
                  console.log('Полный провал. Ошибка: ', error);
              })
  
  
          },

          saveBg({ dispatch, commit, state }) {

            console.log('Наш бг ', state.userId);

            const userId = state.userId;
            const bgImg = state.currentBgImg;

            firebase
            .database()
            .ref( "users/" + userId + "/settings/bg")
            .set(bgImg)
            .then(data => {
  
                console.log('Сменили фон ', data);
  
            })
            .catch(error => {
                console.log('Полный провал. Ошибка: ', error);
            })
          }
}