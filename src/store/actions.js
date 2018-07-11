import * as firebase from "firebase";
import router from './../Router.js'


export default {



      
  
          //Отметить задачу как сделанную
          checkTask({ dispatch, commit, state }, { task, tableInd, taskListInd, taskId }) {
            // taskId = state.allTasks[tableInd].taskLists[taskListInd].tasks[taskInd].id;
  
            console.log('ДЛЯ ОТМЕТКИ ЗАДАЧИ ПОЛУЧАЕМ ', task, tableInd, taskListInd, taskId);

            /*
            т.к. список задач фильтрован по isDone индексы расходятся, поэтому нам нужно определить
            по id задачи её индекс, что бы удалить её из локального массива
            */
            let taskInd;
            const tasksInList = state.allTasks[tableInd].taskLists[taskListInd].tasks;
            tasksInList.forEach( (element, index) => {
               if(element.id == taskId) {
                   taskInd = index;
               }
            })            

              firebase
                  .database()
                  .ref("tasks/" + taskId + "/isDone")
                  .set(true)
                  .then(data => {
  
                      //Если успех внесем изменения в локальный массив
                      state.allTasks[tableInd].taskLists[taskListInd].tasks[taskInd].isDone = true;
                      console.log('Задачка готова!');
                      dispatch('showGoodNews', 'Задача выполнена!');
  
                  })
                  .catch(error => {
                      console.log('Полный провал. Ошибка: ', error);
                      dispatch('showBadNews', 'Ошибка. Задача не откорректированна(');

                  })
          },

// TODO: HI
// FIXME: HI

          //Удалить задачу
          delTask({ dispatch, commit, state }, { task, tableInd, taskListInd, taskId }) {
            // taskId = state.allTasks[tableInd].taskLists[taskListInd].tasks[taskInd].id;
  
            console.log('ДЛЯ УДАЛЕНИЯ ЗАДАЧИ ПОЛУЧАЕМ ', task, tableInd, taskListInd, taskId);
            const taskListId = task.taskListId;
            /*
            т.к. список задач фильтрован по isDone индексы расходятся, поэтому нам нужно определить
            по id задачи её индекс, что бы удалить её из локального массива
            */
            let taskInd;
            const tasksInList = state.allTasks[tableInd].taskLists[taskListInd].tasks;
            tasksInList.forEach( (element, index) => {
               if(element.id == taskId) {
                   taskInd = index;
               }
            })            

            console.log('Удаляем задачу ', "tasksLists/" + taskListId + "/tasks/" + taskId);
              firebase
                  .database()
                  .ref("taskLists/" + taskListId + "/tasks/" + taskId)
                  .remove()
                  .then(data => {
  
                      //Если успех внесем изменения в локальный массив
                      state.allTasks[tableInd].taskLists[taskListInd].tasks.splice(taskInd, 1);
                      

                      console.log('Задачка готова!');
                      dispatch('showGoodNews', 'Задача удалена!');
  
                  })
                  .catch(error => {
                      console.log('Полный провал. Ошибка: ', error);
                      dispatch('showBadNews', 'Ошибка. Ошибка удаления задачи(');

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
                      //покажем сообщение
                      dispatch('showGoodNews', 'Задача отредактирована');
  
                  })
                  .catch(error => {
                      console.log('Полный провал. Ошибка: ', error);
                      dispatch('showBadNews', 'Ошибка редактирования задачи');
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
  
              const activeTableId = state.allTasks[state.activeTableIndex].id;

              let ind = state.allTasks[state.activeTableIndex].tableIndex;
              const userId = state.userId;
  
              firebase
                      .database()
                      .ref("users/" + userId + "/tables/" + activeTableId)
                      .remove()
                      .then(data => {
                          
                          console.log('Удалили рабочий стол');
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

           ///УДАЛЕНИЕ СПИСКА ЗАДАЧ
        //    delTaskList({ dispatch, commit, state }, listIndex) {
  
        //     let activeTableInd = state.allTasks[state.activeTableIndex].tableIndex;
        //     const userId = state.userId;

        //     firebase
        //             .database()
        //             .ref("tables/" + activeTableInd + "/taskLists/" + ind)
        //             .remove()
        //             .then(data => {
                        
        //                 console.log('Удалили рабочий стол');
        //                 //Если все ок - вырезаем из локального массива
        //                 let allTables = state.allTasks;
        //                 allTables.splice(ind, 1);
        //                 //Понижаем tableIndex на 1, если он больше 0
                    
        //             if(ind > 0) {
        //                 state.activeTableIndex = ind - 1; 
        //                 console.log( state.activeTableIndex );
        //             }

        //         })
        //     .catch(error => {
        //         console.log('Полный провал. Ошибка: ', error);
        //     })
        // },


          saveBg({ dispatch, commit, state }) {

            console.log('Наш фон ', state.userId);

            const userId = state.userId;
            let bgImg = state.currentBgImg;

            // if(typeof bgImg == undefined) {
                // bgImg = '/img/bg/stm-bg-2.jpg';
                // console.log('Фон пустой, пишем стандартный');
            // }

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
          },

      //Делает посделний стол активным
      makeLastTableActive({ dispatch, commit, state }) {
        console.log('Переключаем последний стол на активный');
        const last =  state.allTasks.length - 1;
        state.activeTableIndex = last;
        dispatch('updateActiveTable', last);
        
      },

      //Апдейт активного стола
      updateActiveTable({ dispatch, commit, state }, index) {
        firebase
        .database()
        .ref("users/" + state.userId + "/settings/activeTable")
        .set(index)
        .then(data => {
            console.log("Записали активный рс ", data);
        })
        .catch(error => {
            console.log("Не получили ", error);
        });
      },

      removeList({ dispatch, commit, state }, {id, taskListIndex, activeTableIndex}) {

        let activeTableId = state.allTasks[activeTableIndex].id;
        console.log('del table ', "tables/" + activeTableId + "/taskLists" + taskListIndex);
        firebase
        .database()
        .ref("tables/" + activeTableId + "/taskLists/" + id)
        .remove()
        .then(data => {

            //уберем список из локального массива
            state.allTasks[activeTableIndex].taskLists.splice(taskListIndex, 1);

            console.log("Удалили лист. Все. Его больше нет и не будет. ", data);
            state.tableList = data;
        })
        .catch(error => {
            console.log("Не получили ", error);
        });
      },

      //Работа со ссылками на столы

      
      checkUrl({ dispatch, commit, state }) {
          
        let url = state.activeTableUrl;
        console.log('смо записался ', url);
        
        if(url != null) {


            console.log('Есть ссылка на стол(act)', url);

            dispatch('changeActiveTable', url)
           } else {
            dispatch('pushActiveTableLink')
            console.log('Нет ссылки на стол');
          }
      },

      pushActiveTableLink({ dispatch, commit, state }) {
        console.log(router.match(location));
        console.log('Пушим ссылку, так как нет никакой', state.activeTableIndex, state.allTasks);
        let id = state.allTasks[state.activeTableIndex].id;
        let url = id.slice(id.length - 6);
        router.push( {path: `/table/${url}` } );
      },

      //если в новой ссылке на стол есть значение
      changeActiveTable({ dispatch, commit, state }, url) {
         var obj = state.allTasks;
         var correctUrl = false;
         obj.forEach((element, index) => {
                         console.log(index, element.tableUrl );
                if(element.tableUrl == url) {
                    console.log('Индексы сошлись', url);
                    state.activeTableIndex = index;
                    correctUrl = true;
                }
         });

         if(!correctUrl) {
             dispatch('pushActiveTableLink');
             console.log('Ссылка фигня пушим активный стол');
         }

        //  for (var prop in obj) {
        //     console.log("obj." + prop + " = " + obj[prop].tableUrl);
        //       if(obj[prop].tableUrl == url) {

        //       }
        // }
      },

      showGoodNews({ dispatch, commit, state }, mes) {
          state.goodNewsMes = mes;
          console.log('Наш текст' , state.goodNewsMes);
          setTimeout(function() {
            state.goodNewsMes = [];
          }, 1500)
      },
      showBadNews({ dispatch, commit, state }, mes) {
          state.badNewsMes = mes;
          console.log('Наш текст' , state.badNewsMes);
          setTimeout(function() {
            state.badNewsMes = [];
          }, 1500)
      }
}