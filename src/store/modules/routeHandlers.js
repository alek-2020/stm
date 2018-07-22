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
        linksHandler({ dispatch, rootState }, { link, toLink, linkId }) {
            if (!link) { link = 'null' }
            if (!toLink) { toLink = 'null' }
            if (!linkId) { linkId = 'null' }
            console.log('нажали упарвляющая функция жива', rootState.authorised, toLink.indexOf("/table/"), link, toLink);
   
            //Если юзер не авторизован разрешаем ему только авторизацию и регистрацию
            if (!rootState.authorised && link != "/login/" && link != "/registration/") {
                router.push('/login/');
                dispatch('showBadNews', 'Сначала авторизуйтесь или зарегистрируйтесь 😡')
                // } else if(toLink === "/table/" && rootState.authorised) {
                //     //При авторизации. поидее сейчас мы делаем не правильно и нам нужно поставить адрес активного стола
                //     router.push(toLink);
            } else if(rootState.authorised && (link == "/login/" || link == "/registration/")) {
                //Если мы на странице авторизации и узер авторизован-перекинем его на активный рс
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
                router.push(toLink);
            }

            // дописать linksHadler
            // вывести ошибку при ошибку получения данных
            // Придумать условие для переадресации на рс
            // if(rootState.authorised)
        },

        //если в новой ссылке на стол есть значение
        changeActiveTable({ dispatch, commit, rootState }, url) {
            var obj = rootState.allTasks;
            var correctUrl = false;
            obj.forEach((element, index) => {
                console.log(index, element.tableUrl);
                if (element.tableUrl == url) {
                    console.log('Индексы сошлись', url);
                    rootState.activeTableIndex = index;
                    correctUrl = true;
                }
            });

            if (!correctUrl) {
                dispatch('pushActiveTableLink');
                console.log('Ссылка фигня пушим активный стол');
            }

            //  for (var prop in obj) {
            //     console.log("obj." + prop + " = " + obj[prop].tableUrl);
            //       if(obj[prop].tableUrl == url) {

            //       }
            // }
        },

        pushActiveTableLink({ dispatch, commit, rootState }) {
            // console.log(router.match(location));
            // console.log('Пушим ссылку, так как нет никакой', rootState.activeTableIndex, rootState.allTasks);
            let activeTable = rootState.allTasks[rootState.activeTableIndex];
            if(activeTable != null) {
                let url = activeTable.id.slice(activeTable.id.length - 6);
                // router.push({ path: `/table/${url}` });
                dispatch('linksHandler', { toLink: `/table/${url}` });
            }
        },

    }
}