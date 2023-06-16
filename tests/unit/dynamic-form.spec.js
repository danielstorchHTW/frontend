import { shallowMount} from '@vue/test-utils'
import DynamicForm from '@/views/StudentView.vue'

describe('dynamic form', () => {
    beforeEach(() => {
        fetch.resetMocks()
    })

    it('should render the title passed to it', () => {
        fetch.mockResponseOnce(JSON.stringify([
            {id: 1222, name: 'Erwin', matrikelnr: 44444},
            {id: 1333, name: 'Carla', matrikelnr: 33333}
        ]))

        const title = 'This is a title!'
        const wrapper = shallowMount(DynamicForm, {
            props: { title }
        })
        expect(wrapper.text()).toMatch(title)
    })


})