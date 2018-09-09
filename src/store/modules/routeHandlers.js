import router from './../../Router.js'

export default {

  actions: {
    // ПРОВЕРЯЕТ ЗНАЧЕНИЕ ССЫЛКИ НА СТОЛ В УРЛЕ
    changeActiveTable({
      dispatch,
      rootState
    }, url) {
      const allTasks = rootState.allTasks;

      // Поиск подходящего стола
      const newTable = allTasks.filter((element) => {
        return element.id.slice(element.id.length - 6) == url
      });

      // Если нашли
      if (newTable.length === 1) {
        router.push({
          path: `/table/${url}`
        });
        rootState.activeTableIndex = allTasks.indexOf(newTable[0]);
      } else {
        dispatch('pushActiveTableLink')
      }
    },

    // ПЕРЕКЛЮЧАЕТ НА АВТОРИЗАЦИЮ
    goToLogin({
      rootState
    }) {
      router.push({
        path: `/login`
      });
    },

    // ПУШ ССЫЛКИ АКТИВНОГО СТОЛА
    pushActiveTableLink({
      rootState
    }) {
      const table = rootState.allTasks[rootState.activeTableIndex];
      const activeTableId = table ? table.id : '';
      const activeTableUrl = activeTableId.slice(activeTableId.length - 6);

      router.push({
        path: `/table/${activeTableUrl}`
      });
    },

    // Ошибка загрузки данных
    showLoadingError() {
      router.push({
        path: `/error/`
      });
    }
  }
}
