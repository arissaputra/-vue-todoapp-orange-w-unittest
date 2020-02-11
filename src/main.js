import Vue from 'vue'
import App from './App.vue'
import { router } from "./routes";
import 'bootstrap/dist/css/bootstrap.min.css'

import 'pretty-checkbox/dist/pretty-checkbox.min.css'
import { store } from './store/store'
import "regenerator-runtime/runtime";
import Toasted from 'vue-toasted';
import VModal from 'vue-js-modal'
import registerFaIcons from './fa';

registerFaIcons();
    
Vue.use(Toasted, {
  iconPack: 'fontawesome'
})
Vue.use(VModal, { dialog: true })

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
