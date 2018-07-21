import getData from '../../store/modules/getData.js'


describe('getData.js', () => {

  let dispatch
  let rootState

  beforeEach(() => {
    dispatch = jest.fn()
    rootState = {
      allTasks: [],
      activeTableIndex: 0
    }
  })

  it('startGetTasks если не загружено ни одного стола', () => {
    getData.actions.startGetTasks({
      dispatch,
      rootState
    })

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith('firstGettingData');
  })

  it('startGetTasks если есть загруженные и текущий не загружен ', () => {
    rootState.allTasks = [{
      taskLists: []
    }]
    
    getData.actions.startGetTasks({
      dispatch,
      rootState
    })

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith('getTaskLists');
  })

  it('startGetTasks если текущий был загружен ', () => {
    rootState.allTasks = [{
      taskLists: [1, 2, 3]
    }]
    
    getData.actions.startGetTasks({
      dispatch,
      rootState
    })

    expect(dispatch).toHaveBeenCalledTimes(0);
  })
})
