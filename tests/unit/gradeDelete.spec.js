import { shallowMount } from '@vue/test-utils';
import GradeView from '@/views/GradeView.vue';

describe('GradeView', () => {
    it('deletes a course when the delete button is clicked', async () => {
        const wrapper = shallowMount(GradeView);

        // Simulate loading students
        await wrapper.setData({
            studentGrades: [
                { student_id: 1, course_id: 1, grade: 1.0},
                { student_id: 1, course_id: 2, grade: 2.0},
            ],
        });

        // Mock the fetch function
        const mockFetch = jest.fn().mockResolvedValue({});
        global.fetch = mockFetch;

        // Call the deleteStudent method with the ID of the first student
        await wrapper.vm.deleteGrade(1,1);

        // Verify that the fetch function is called with the correct URL
        expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/grades/delete/1/1'), {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    });
});
