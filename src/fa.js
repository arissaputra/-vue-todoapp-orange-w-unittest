import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheck, faPencilAlt, faTrash, faSave, faEraser, faUser, faLock, faSpinner, faHome } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { dom } from '@fortawesome/fontawesome-svg-core'

Vue.component('font-awesome-icon', FontAwesomeIcon)
dom.watch()

export default function registerIcons() {
    library.add(faCheck, faPencilAlt, faTrash, faSave, faEraser, faUser, faLock, faSpinner, faHome)
}