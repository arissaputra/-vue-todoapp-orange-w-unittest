import { shallowMount, createLocalVue  } from '@vue/test-utils';
import Todos from "@/components/Todos.vue";
import registerFaIcons from '@/fa.js';
import { store } from '@/store/store'
import Vuex from "vuex"

registerFaIcons();
const localVue = createLocalVue()
localVue.use(Vuex)

let wrapper;
let url = ''
let body = {}
let mockError = false
let updateButton;

jest.mock("axios", () => ({
    patch: (_url, _body) => {
        return new Promise((resolve, reject) => {
            if (mockError) {
                reject({
                    response: {
                        data: {
                            error: 'some error'
                        }

                    }
                })
            } else {
                url = _url
                body = _body
                resolve({
                    data: ' some data '
                })

            }

        })
    }
}))

describe('Marktodo Page', () => {
    it('Has update button', () => {
        let todos = [
            { "done": false, "snapshot": null, "userId": "241f4fa0-4e0b-11ea-a5e0-638ede6f6b9e", "id": "2d5a97a0-4e0b-11ea-a5e0-638ede6f6b9e", "description": "first note", "deadline": "2020-02-21T02:47:00.000Z" },
            { "done": false, "snapshot": null, "userId": "241f4fa0-4e0b-11ea-a5e0-638ede6f6b9e", "id": "335d9800-4e0b-11ea-a5e0-638ede6f6b9e", "description": "second note", "deadline": "2020-02-22T02:47:00.000Z" }
        ]
        // wrapper = shallowMount(Todos, {
        //     store, 
        //     localVue,
        //     computed: {
        //         todos() {
        //             return todos
        //         }
        //     },
        //     methods: {
        //         async del(selectedTodo) {
        //             await this.deleteTodo(selectedTodo.id)
                    
        //         }
        //     }
        // });

        // // updateButton = wrapper.find(".btn-info");
        // // updateButton.trigger('click')
        // // expect(url).toBe(`https://cdc-todo-be.herokuapp.com/tasks/`)

    })
})