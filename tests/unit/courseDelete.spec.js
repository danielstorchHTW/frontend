import { shallowMount } from '@vue/test-utils';
import CourseView from '@/views/CourseView.vue';

describe('CourseView', () => {
    it('deletes a course when the delete button is clicked', async () => {
        const wrapper = shallowMount(CourseView);

        await wrapper.setData({
            courses: [
                { id: 1, name: 'Math'},
                { id: 2, name: 'English'},
            ],
        });

        const mockFetch = jest.fn().mockResolvedValue({});
        global.fetch = mockFetch;

        await wrapper.vm.deleteCourse(1);

        expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/course/delete/1'), {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    });
});
