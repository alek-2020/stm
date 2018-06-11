export default {
    visibleTables(state) {
        return state.tasks.filter(task => {
            return task.visible
        })
    },
  
    getNewColId({ dispatch, commit, state, getters }) {
        // let lastTableId = state.allTasks;
        // console.log('Последний id', this.lastTableId);
        // lastTableId = 1;
        // const newTableCol = state.allTasks[lastTableId].colId;
        // return newTableCol + 1;
        return 3;
    },
    // activeTableName(state) {
    //        //и запишем название нашего стола для хедера
    //        return state.allTables[state.activeTableIndex].name;
    //        console.log('активный стол тут', state.activeTableIndex);



    currentBgImg: state => state.currentBgImg

}