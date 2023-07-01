import { shallowMount } from '@vue/test-utils';
import StudentView from '@/views/StudentView.vue';

describe('StudentView', () => {
    it('deletes a student when the delete button is clicked', async () => {
        const wrapper = shallowMount(StudentView);

        // Simulate loading students
        await wrapper.setData({
            students: [
                { id: 1, name: 'John Doe', matrikelnr: '12345' },
                { id: 2, name: 'Jane Smith', matrikelnr: '54321' },
            ],
        });

        // Verify that both students are rendered in the table
        const students = wrapper.findAll('tbody tr');
        expect(students.length).toBe(3);

        // Mock the fetch function
        const mockFetch = jest.fn().mockResolvedValue({});
        global.fetch = mockFetch;

        // Call the deleteStudent method with the ID of the first student
        await wrapper.vm.deleteStudent(1);

        // Verify that the fetch function is called with the correct URL
        expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/students/delete/1'), {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    });
});
