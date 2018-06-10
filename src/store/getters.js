export default {
    visibleTables(state) {
        return state.tasks.filter(task => {
            return task.visible
        })
    },
    // activeTableName(state) {
    //        //и запишем название нашего стола для хедера
    //        return state.allTables[state.activeTableIndex].name;
    //        console.log('активный стол тут', state.activeTableIndex);

    // },
    currentBgImg: state => state.currentBgImg

}