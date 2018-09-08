export default {

  visibleTables(state) {

    if (!state.tasks) return [];
    return state.tasks.filter(task => {
      return task.visible
    })
  },

  GetAllTasks(state) {
    return state.allTasks;
  },

  activeTableName(state) {
    //и запишем название нашего стола для хедера
    if (state.allTasks != null && state.allTasks[state.activeTableIndex] != null) {
      console.log('get table name ', state.allTasks, state.activeTableIndex);
      return state.allTasks[state.activeTableIndex].name;
    } else {
      return 'Название рабочего стола'
    }
    //    console.log('активный стол тут', state.activeTableIndex);
  },


  currentBgImg: state => state.currentBgImg,

}
