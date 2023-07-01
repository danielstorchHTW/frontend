import {flushPromises, shallowMount} from '@vue/test-utils'
import DynamicForm from '@/views/CourseView.vue'

describe('dynamic form', () => {
    beforeEach(() => {
        fetch.resetMocks()
    })

    it('should render the title passed to it', async() => {
        fetch.mockResponseOnce(JSON.stringify([
            {id: 10, name: 'Math'},
            {id: 12, name: 'English'}
        ]))

        const title = 'SaveCourse IDName10Math12English'
        const wrapper = shallowMount(DynamicForm, {
            props: { title }
        })
        console.log(title)
        await flushPromises()
        expect(wrapper.text()).toMatch(title)
    })


})