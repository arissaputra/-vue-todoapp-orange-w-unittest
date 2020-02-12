import { createLocalVue, shallowMount } from '@vue/test-utils';
import CreateEdit from "@/components/CreateEdit.vue";
import registerFaIcons from '@/fa.js';
import flushPromises from "flush-promises"
import Vuex from "vuex"
import { store } from '@/store/store'
import axios from 'axios'

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
        return new Promise((resolve) => {
            if (mockError) {
                throw Error()
            }

            url = _url
            body = _body
            resolve({
                data: 'some data'
            })
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

    }),
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

        }),
        it('Save Button Works Properly', async () => {
            const form = {
                description,
                deadline: now
            }
            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFyaUBnYXRvdS5jb20iLCJzdWIiOiI5NzBhZDlmMC00ZDczLTExZWEtOTMxMi03ZjQyNWQxYjlkNmQiLCJpYXQiOjE1ODE0OTY5NDgsImV4cCI6MTU4MTUwMDU0OH0.pM4NGHKMnzb5VJ18cfFO2QFPcYW4IrvLlxf_HmAR8PA'
            
            // await store.dispatch('storeIdentity', token)
            await store.dispatch('storeTodo', { form })

            // expect(url).toBe("/api/authenticate")
            // expect(body).toEqual({ username, password })
            // expect(commit).toHaveBeenCalledWith(
            // "SET_AUTHENTICATED", true)
        }),
        it("Catches if error", async () => {
            // mockError = true
          
            // await expect(await store.dispatch('storeTodo', {}))
            //   .rejects.toThrow("API Error occurred.")
            // const form = {
            //     description,
            //     deadline: now
            // }
            // console.log(form);
            // const data = await axios.post('https://cdc-web-frontend.herokuapp.com/todos', form)
            // console.log(data);
            
            // expect(data).toBeDefined()
            // expect(data.entity.name).toEqual('Koen van Gilst')
          })
        it('Validation Works Properly', () => {
            // Description validation
            // Deadline validation
            // Save Button disabled when validation fail
        })
})