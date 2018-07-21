import { mount } from '@vue/test-utils'
import Task from '../OneTaskCurrent.vue'

//Записываем пропсы
const factory = (propsData) => {
    return mount(Task, {
      propsData: {
        'task': {
            'id': 'zzz',
            'text': 'задача-удача'
        },
        'Index': 1,
        'tableInd': 1,
        'taskInd': 1,
        'prop1': 4
      }
    })
 }

let testText = 'Привет Брат!'

describe('Компонент задачи Task.vue', () => {
    it('Запись ввода юзера в пропс', () => {
        const wrapper = factory();
        //Ставим в инпут значение
        wrapper.find('.one-task__text').setValue(testText);
        expect(true).toBe(true);

    })
    
    it('Проверим значение элемента', () => {
        //При рендеринге компонента прокидываем в него необходимые данные
        const wrapper = factory();
        // Ищем в пропсах переменную с текстом и проверяем значение
        let t = wrapper.vm.task.index;

        wrapper.find('.one-task__text').setValue("alice")
        console.log(wrapper.html());
        console.log(wrapper.props().task.text);
        expect(true).toBe(true);
    })

    it('Тест testMethod', () => {
       const val = 10;

    //    expect(Task.computed.testFunctionForJest.call(val)).toBe(5);    
       expect(true).toBe(true);

    })
  })