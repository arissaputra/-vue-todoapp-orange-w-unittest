import { shallowMount } from '@vue/test-utils';
import CreateEdit from "@/components/CreateEdit.vue";
import registerFaIcons from '@/fa.js';
import { store } from '@/store/store'

registerFaIcons();

let wrapper;
let eraseButton;
let saveButton;
const description = 'A random todo';
const now = new Date().toISOString()

let url = ''
let body = {}
let mockError = false
let todo = { 
    "done": false, 
    "snapshot": null, 
    "userId": "241f4fa0-4e0b-11ea-a5e0-638ede6f6b9e", 
    "id": "2d5a97a0-4e0b-11ea-a5e0-638ede6f6b9e", 
    "description": "first note", 
    "deadline": "2020-02-21T02:47:00.000Z" 
}

jest.mock("axios", () => ({
    patch: (_url, _body) => {
        return new Promise((resolve, reject) => {
            if (mockError) {
                reject({
                    response: {
                        data: {
                            statusCode: 500
                        }

                    }
                })
            } else {
                url = _url
                body = _body
                resolve({
                    data: 'some data'
                })

            }

        })
    }
}))

const factory = ({ propsData = {} }) => {
    return shallowMount(CreateEdit, {
        propsData
    });
};

beforeEach(() => {
    wrapper = factory({ propsData: { todo } });
    eraseButton = wrapper.find("[type='button']");
    saveButton = wrapper.find("[type='submit']");
});

describe('Update Page', () => {
    it('Has description, deadline, snapshot erase button, save button', () => {
        expect(wrapper.text().includes("Description")).toBe(true);
        expect(wrapper.text().includes("Deadline")).toBe(true);
        expect(wrapper.text().includes("Snapshot")).toBe(true);
        expect(eraseButton.text()).toBe('Erase Form');
        expect(saveButton.text()).toBe('Save');

    })
    it('Erase Button Works Properly', async () => {
        wrapper.setData({
            form: {
                description,
                deadline: now
            }
        })

        // check current data        
        expect(wrapper.vm.form).toStrictEqual({
            description,
            deadline: now
        })

        // check data after the form erased
        eraseButton.trigger('click');
        expect(wrapper.vm.form).toStrictEqual({
            description: null,
            deadline: null
        })

    })
    it('Description attach correctly', async () => {
        expect(wrapper.find('textarea').element.value).toBe(todo.description)
    })
    it('Update Data Works Properly', async () => {
        const form = {
            description,
            deadline: now
        }

        const res = await store.dispatch('updateTodo', { todo_id: todo.id, form })
        expect(res.success).toBe(true)
        expect(url).toBe(`https://cdc-todo-be.herokuapp.com/tasks/${todo.id}`)
        expect(body).toEqual({
            description,
            deadline: now
        })
    })
    it("Catches if error", async () => {
        mockError = true
        const res = await store.dispatch('updateTodo', {})
        expect(res.success).toBe(false)

    })
    it('Validation Works Properly', async () => {
        const failDesc = 'desc'  // less than 5 letters
        wrapper.find('textarea').setValue(failDesc)
        await wrapper.vm.$nextTick()

        // Save Button disabled when validation fail
        expect(saveButton.html().includes('disabled')).toBe(true)
    })
})