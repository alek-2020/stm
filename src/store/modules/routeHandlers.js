import router from './../../Router.js'

export default {

  actions: {

    /*
   Метод вызывается на сдедующих этапах:
   ---Если ссылка изменяется-оправляем текущий адрес для проверки. 
   Если юзер неавторизовар - редиректим его на логин
   ---При клике на кнопку стола - отправляем toLink с урлом текущего стола 
   ---В том случае, если в ссылке есть /table/ и какой -то урл после мы отправляем на этот урл
   ---Выдача ошибки при загрузке/отправке данных
   ---При создании нового стола пушим аго ссылку
   ---При удалении стола пушим новый активный(который перед ним, если он не первый)
   */
    linksHandler({
      dispatch,
      rootState
    }, {
      link,
      toLink,
      linkId
    }) {
      if (!link) {
        link = 'null'
      }
      if (!toLink) {
        toLink = 'null'
      }
      if (!linkId) {
        linkId = 'null'
      }
      // console.log('нажали управляющая функция жива', rootState.authorised, toLink.indexOf("/table/"), link, toLink);

      rootState.appRouteLog.push(`linksHandler - зашли с параметрами ${link + ' ' + toLink + ' ' + linkId + ' ' + (toLink == '/')}`)


      if (toLink == '/') {
        rootState.appRouteLog.push(`Пушим на ${toLink} из linksHandler`)
        router.push(toLink);
      } else if (!rootState.authorised && link != "/login/" && link != "/registration/") {
        //Если юзер не авторизован разрешаем ему только авторизацию и регистрацию
        router.push('/login/');
        dispatch('showBadNews', 'Сначала авторизуйтесь или зарегистрируйтесь 😡')
      } else if (toLink === "/table/" && rootState.authorised) {
        //При авторизации. поидее сейчас мы делаем не правильно и нам нужно поставить адрес активного стола
        router.push(toLink);
      } else if (rootState.authorised && (link == "/login/" || link == "/registration/")) {
        //Если мы на странице авторизации и узер авторизован-перекинем его на активный рс
        // console.log('Управляющая 43');
        rootState.appRouteLog.push('routeHandler - вызываем из linksHandler')
        dispatch('pushActiveTableLink');
      } else if (toLink.indexOf("/table/") >= 0 && !rootState.authorised) {
        //Если направили на столы и чувак не авторизован значит, что-то не так. оправим его на авторизацию
        dispatch('logOut');
        router.push('/login');
      } else if (toLink.indexOf("/table/") >= 0 && toLink.split('/')[2].length > 0 && rootState.authorised) {
        //При нажатии на кн стола, если есть /table/ и указан его адрес
        router.push(toLink);
      } else if (toLink === '/error/') {
        //Если пушим ошибку юзеру
        rootState.appRouteLog.push(`Пушим на ${toLink} из linksHandler`)
        router.push(toLink);
      }




      // if (link === '/registration/') {
      //     //Переключаем модалку в режим регистрации

      // }

      // дописать linksHadler
      // вывести ошибку при ошибку получения данных
      // Придумать условие для переадресации на рс
      // if(rootState.authorised)
    },

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
    }
  }
}
