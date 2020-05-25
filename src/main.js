// Where you configure the initialization of the Vue instance
import './firebase'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// VueFire
import { firestorePlugin } from 'vuefire'
Vue.use(firestorePlugin)

// Bootstrap
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

// Moment.js
import moment from 'moment'
Vue.prototype.moment = moment

// Vuetify
import vuetify from './plugins/vuetify';

// Datepicker
import Datepicker from 'vuejs-datepicker';

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  Datepicker,
  render: h => h(App)
}).$mount('#app')
