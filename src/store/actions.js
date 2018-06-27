import * as firebase from "firebase";
import router from './../Router.js'


export default {



      
  
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
  
              let ind = state.allTasks[state.activeTableIndex].tableIndex;
              const userId = state.userId;
  
              firebase
                      .database()
                      .ref("users/" + userId + "/tables/" + ind)
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

      
    //   checkUrl({ dispatch, commit, state }) {
    //     //   console.log('router', router);
    //     //   if(route.params.link != null) {
    //     //     console.log('Есть ссылка на стол');
    //     //     // dispatch('checkLink');
    //     //   } else {
    //         dispatch('pushActiveTableLink')
    //     //     console.log('Нет ссылки на стол');
    //     //   }
    //   },

      pushActiveTableLink({ dispatch, commit, state }) {
        console.log('Пушим ссылку, так как нет никакой', state.activeTableIndex, state.allTasks);
        let url = state.allTasks[state.activeTableIndex].tableUrl;
        router.push( {path: `/table/${url}` } );
      },

      //если в новой ссылке на стол есть значение
      changeActiveTable({ dispatch, commit, state }, url) {
         var obj = state.allTasks;
         var correctUrl = false;
         obj.forEach((element, index) => {
                         console.log(index, element.tableUrl );
                if(element.tableUrl == url) {
                    console.log('Индексы сошлись');
                    state.activeTableIndex = index;
                    correctUrl = true;
                }
         });

         if(!correctUrl) {
             dispatch('pushActiveTableLink');
         }

        //  for (var prop in obj) {
        //     console.log("obj." + prop + " = " + obj[prop].tableUrl);
        //       if(obj[prop].tableUrl == url) {

        //       }
        // }
      }
}