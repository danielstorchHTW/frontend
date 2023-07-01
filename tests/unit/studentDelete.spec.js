import { shallowMount } from '@vue/test-utils';
import StudentView from '@/views/StudentView.vue';

describe('StudentView', () => {
    it('deletes a student when the delete button is clicked', async () => {
        const wrapper = shallowMount(StudentView);

        await wrapper.setData({
            students: [
                { id: 1, name: 'John Doe', matrikelnr: '12345' },
                { id: 2, name: 'Jane Smith', matrikelnr: '54321' },
            ],
        });

        const mockFetch = jest.fn().mockResolvedValue({});
        global.fetch = mockFetch;

        await wrapper.vm.deleteStudent(1);

        expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/students/delete/1'), {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    });
});
