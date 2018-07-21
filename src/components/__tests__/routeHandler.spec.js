import getData from '../../store/modules/routeHandlers'
import routeHandlers from '../../store/modules/routeHandlers';

describe('routeHandlers.js', () => {

    let dispatch
    let rootState
    let router

    beforeEach(() => {
        dispatch = jest.fn()
        router.push = jest.fn()
        rootState = {
            authorised: false,
        }
    })

    it('Переходим на непонятную страницу будучи авторизованными. Не должно что либо произойти.', () => {
        dispatch = jest.fn()
        router.push = jest.fn()
        rootState = {
            authorised: false,
        }
       
        rootState.authorised = true;

        routeHandlers.actions.linksHandler({
            dispatch,
            rootState
        }, {
                link: '/blabla/'
            })

        expect(router.push).toHaveBeenCalledTimes(0);
        expect(dispatch).toHaveBeenCalledTimes(0);
    })

    it('Имитируем адрес страницы login и registration при', () => {
        routeHandlers.actions.linksHandler({
            dispatch,
            rootState
        }, {
                link: 'bla'
            })

        expect(router.push).toHaveBeenCalledTimes(1);
    })


})

