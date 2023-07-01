import {flushPromises, shallowMount} from '@vue/test-utils'
import DynamicForm from '@/views/GradeView.vue'

describe('dynamic form', () => {
    beforeEach(() => {
        fetch.resetMocks()
    })

    it('should render the title passed to it', async () => {
        fetch.mockResponseOnce(JSON.stringify([{ student_id: { id: 1 }, course_id: { id: 1 }, grade: '2.0' }]))
        fetch.mockResponseOnce(JSON.stringify([{ id: 1, name: 'John', matrikelnr: 12345 }]))
        fetch.mockResponseOnce(JSON.stringify([{ id: 1, name: 'Math' }]))

        const title = 'SaveStudent IDKurs IDNote112.0112.0Course IDName1MathStudent IDNameMatrikelnummer1John12345'
        const wrapper = shallowMount(DynamicForm, {
            props: { title }
        })

        await flushPromises()

        wrapper.vm.student_idField = '1'
        wrapper.vm.course_idField = '1'
        wrapper.vm.gradeField = '2.0'
        await wrapper.find('.styled-button').trigger('click')

        await flushPromises()

        await new Promise(resolve => setTimeout(resolve, 100))

        const gradeTableText = wrapper.find('.showGrades').text()
        expect(gradeTableText).toContain('1')
        expect(gradeTableText).toContain('2.0')

        const courseTableText = wrapper.find('.showCourses').text()
        expect(courseTableText).toContain('1')
        expect(courseTableText).toContain('Math')

        const studentTableText = wrapper.find('.showStudents').text()
        expect(studentTableText).toContain('1')
        expect(studentTableText).toContain('John')

        expect(wrapper.text()).toMatch(title)
    })

})