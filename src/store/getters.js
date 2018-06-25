export default {
    visibleTables(state) {
        return state.tasks.filter(task => {
            return task.visible
        })
    },
  

    activeTableName(state) {
           //и запишем название нашего стола для хедера
           if(state.allTasks != null) {
                console.log('get table name ', state.allTasks, state.activeTableIndex);
                return state.allTasks[state.activeTableIndex].name;
           } else {
               return 'Название рабочего стола'
           }
           //    console.log('активный стол тут', state.activeTableIndex);
    },


    currentBgImg: state => state.currentBgImg

}