import {flushPromises, shallowMount} from '@vue/test-utils'
import DynamicForm from '@/views/GradeView.vue'

describe('dynamic form', () => {
    beforeEach(() => {
        fetch.resetMocks()
    })

    it('should render the title passed to it', async() => {
        fetch.mockResponseOnce(JSON.stringify([
            {student_id: 10, course_id: 11, grade: 2.0},
            {student_id: 16, course_id: 12, grade: 1.0}
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