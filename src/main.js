// Where you configure the initialization of the Vue instance
import './firebase'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// VueFire
import { firestorePlugin } from 'vuefire'

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'

// Moment.js
import moment from 'moment'
Vue.prototype.moment = moment

Vue.use(firestorePlugin)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
