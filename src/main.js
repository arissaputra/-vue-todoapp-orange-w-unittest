import Vue from 'vue'
import App from './App.vue'
import { router } from "./routes";
import 'bootstrap/dist/css/bootstrap.min.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheck, faPencilAlt, faTrash, faSave, faEraser, faUser, faLock, faSpinner, faHome } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { dom } from '@fortawesome/fontawesome-svg-core'
import 'pretty-checkbox/dist/pretty-checkbox.min.css'
import { store } from './store/store'
import "regenerator-runtime/runtime";
import Toasted from 'vue-toasted';
import VModal from 'vue-js-modal'
    
Vue.use(Toasted, {
  iconPack: 'fontawesome'
})
Vue.use(VModal, { dialog: true })

dom.watch()

library.add(faCheck, faPencilAlt, faTrash, faSave, faEraser, faUser, faLock, faSpinner, faHome)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
