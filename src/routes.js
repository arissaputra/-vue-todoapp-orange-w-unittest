import Vue from "vue";
import VueRouter from "vue-router";
import Todos from './components/Todos.vue'
import CreateEdit from './components/CreateEdit.vue'
import Login from './components/Login.vue'
import SignUp from './components/SignUp.vue'
import PageNotFound from './components/PageNotFound.vue'

Vue.use(VueRouter)

const routes = [
    { path: '/', component: Todos}, // todos
    { path: '/create', component: CreateEdit}, // create
    { path: '/edit', component: CreateEdit, name: 'edit', props: true}, // edit
    { path: '/login', component: Login}, // login
    { path: '/signup', component: SignUp}, // sign up
    { path: "*", component: PageNotFound }

]

export const router = new VueRouter({
    routes,
    mode: 'history'
  });