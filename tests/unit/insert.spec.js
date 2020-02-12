import { shallowMount } from '@vue/test-utils';
import CreateEdit from "@/components/CreateEdit.vue";
import registerFaIcons from '@/fa.js';
import flushPromises from "flush-promises"

registerFaIcons();

let wrapper;
let eraseButton;
let saveButton;

const factory = ({ propsData = {}, mocks = {}, stubs = {} }) => {
    return shallowMount(CreateEdit, {
        propsData,
        mocks,
        stubs,
    });
};

beforeEach(() => {
    wrapper = factory({});
    eraseButton = wrapper.find("[type='button']");
    saveButton = wrapper.find("[type='submit']");
});

let url = ''
let data = ''
const description = 'A random todo';
const now = new Date()

const mockHttp = {
    get: (_url, _data) => {
        return new Promise((resolve, reject) => {
            url = _url
            data = _data
            resolve()
        })
    }
}

describe('Insert Page', () => {
    it('Has description, deadline, erase button, save button', () => {
        expect(wrapper.text().includes("Description")).toBe(true);
        expect(wrapper.text().includes("Deadline")).toBe(true);
        expect(eraseButton.text()).toBe('Erase Form');
        expect(saveButton.text()).toBe('Save');

    }),
        it('Erase Button Works Properly', async () => {
            wrapper.setData({
                form: {
                    description,
                    deadline: now
                }
            })
            await wrapper.vm.$nextTick();

            // check current data
            expect(wrapper.vm.form).toStrictEqual({
                description,
                deadline: now
            })

            // check data after the form erased
            eraseButton.trigger('click');
            await wrapper.vm.$nextTick();
            expect(wrapper.vm.form).toStrictEqual({
                description: null,
                deadline: null
            })

        }),
        it('Save Button Works Properly', async () => {
            wrapper = factory({
                mocks: {
                    $http: mockHttp
                }
            });
            wrapper.setData({
                form: {
                    description,
                    deadline: now
                }
            })
            await wrapper.vm.$nextTick();

            // wrapper.find("form").trigger("submit.prevent")
            // await flushPromises()

            // expect(url).toBe("https://cdc-todo-be.herokuapp.com/tasks/")
            // expect(data).toEqual({
            //     description,
            //     deadline: now
            // })
        }),
        it('Validation Works Properly', () => {
            // Description validation
            // Deadline validation
            // Save Button disabled when validation fail
        })
})