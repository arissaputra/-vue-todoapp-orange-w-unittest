import Vue from 'vue'
import Vuex from 'vuex'
import * as api from '../api'
import { router } from '../routes';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        todos: [],
        months: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ],
        token: null,
        userId: null,
        userEmail: null
    },
    mutations: {
        SET_TODOS(state, todos) {
            state.todos = todos
        },
        SET_TOKEN(state, token) {
            state.token = token
        },
        SET_USER_ID(state, user_id) {
            state.userId = user_id
        },
        SET_USER_EMAIL(state, email) {
            state.userEmail = email
        }
    },
    actions: {
        async getTodos({ commit, dispatch }) {
            const res = await api.getTodos()
            const { success } = await dispatch('checkTokenExpired', res)
            if (success) {
                commit('SET_TODOS', res)
            }
        },
        async updateTodo({ dispatch }, { todo_id, form }) {
            const res = await api.updateTodo(todo_id, form)
            const response = await dispatch('checkTokenExpired', res)
            return response

        },
        async uploadSnapshot({ dispatch }, { todo_id, formData }) {
            const res = await api.uploadSnapshot(todo_id, formData)
            const response = await dispatch('checkTokenExpired', res)
            return response

        },
        async storeTodo({ dispatch }, { form }) {
            const res = await api.storeTodo(form)
            const response = await dispatch('checkTokenExpired', res)
            return response
        },
        async deleteTodo({ dispatch }, { todo_id }) {
            const res = await api.deleteTodo(todo_id)
            const response = await dispatch('checkTokenExpired', res)
            return response
        },
        checkTokenExpired(context, res) {
            if (!res.statusCode) {
                // Success
                return {
                    success: true,
                    msg: ''
                }
            } else {
                const { statusCode, message='Unauthorized' } = res
                Vue.toasted.error(`${statusCode} ${message}!`, {
                    theme: "toasted-primary",
                    icon: 'warning',
                    position: "top-center",
                    duration: 3000
                });
                router.push('login')
                return {
                    success: false,
                    msg: message
                }
            }
        },
        storeIdentity({ commit }, access_token) {
            // set on vuex
            commit('SET_TOKEN', access_token)
            // set on api so the header will automatically using jwt
            api.setToken(access_token)
            // store in local storage
            localStorage.setItem('token', access_token)

            const { username: userEmail, sub: userId } = api.parseJWT(access_token)
            commit('SET_USER_EMAIL', userEmail);
            commit('SET_USER_ID', userId);
            return userEmail
        },
        logout({ commit }) {
            // delete from vuex
            commit('SET_TOKEN', null)
            // delete from api
            api.setToken('')
            // remove from local storage
            localStorage.removeItem('token')
            
            return
        },
        async login(context, { credentials }) {
            const res = await api.login(credentials)
            return res

        },
        async signup(context, { credentials }) {
            const res = await api.signup(credentials)
            return res

        }
    }
})
