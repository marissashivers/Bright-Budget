// Where you configure the initialization of the Vue instance
import './firebase'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// VueFire
import { firestorePlugin } from 'vuefire'
Vue.use(firestorePlugin)

// Moment.js
import moment from 'moment'
Vue.prototype.moment = moment

// Vuetify
import vuetify from './plugins/vuetify';

// Bootstrap Vue
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

// Install BootstrapVue
Vue.use(BootstrapVue)
    // Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

// Datepicker
import Datepicker from 'vuejs-datepicker';

// font-awesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUserSecret, faLink, faListUl, faRandom, faUndo, faStar, faEnvelope, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(faUserSecret, faLink, faListUl, faRandom, faUndo, faStar, faEnvelope, faTrash);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false

new Vue({
    router,
    store,
    vuetify,
    Datepicker,
    render: h => h(App)
}).$mount('#app')