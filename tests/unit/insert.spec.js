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

jest.mock("axios", () => ({
    post: (_url, _body) => {
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

const factory = ({ propsData = {}, mocks = {}, stubs = {} }) => {
    return shallowMount(CreateEdit, {
        propsData,
        mocks,
        stubs
    });
};

beforeEach(() => {
    wrapper = factory({});
    eraseButton = wrapper.find("[type='button']");
    saveButton = wrapper.find("[type='submit']");
});

describe('Insert Page', () => {
    it('Has description, deadline, erase button, save button', () => {
        expect(wrapper.text().includes("Description")).toBe(true);
        expect(wrapper.text().includes("Deadline")).toBe(true);
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
    it('Insert Data Works Properly', async () => {
        const form = {
            description,
            deadline: now
        }

        const res = await store.dispatch('storeTodo', { form })
        expect(res.success).toBe(true)
        expect(url).toBe("https://cdc-todo-be.herokuapp.com/tasks/")
        expect(body).toEqual({
            description,
            deadline: now
        })
    })
    it("Catches if error", async () => {
        mockError = true
        const res = await store.dispatch('storeTodo', {})
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