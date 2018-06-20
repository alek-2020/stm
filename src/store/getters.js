export default {
    visibleTables(state) {
        return state.tasks.filter(task => {
            return task.visible
        })
    },
  
    getNewColId({ dispatch, commit, state, getters }) {
        console.log('getcol Последний id');

        let lastTableId = state.allTasks[state.allTasks.length-1].colId;
        console.log('getcol Последний id', lastTableId);
        const newTableCol = state.allTasks[lastTableId].colId + 1;
        console.log('getcol Возвращаем ', newTableCol)
        return newTableCol;
        // return 3;
    },
    // activeTableName(state) {
    //        //и запишем название нашего стола для хедера
    //        return state.allTables[state.activeTableIndex].name;
    //        console.log('активный стол тут', state.activeTableIndex);



    currentBgImg: state => state.currentBgImg

}