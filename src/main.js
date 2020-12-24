// Where you configure the initialization of the Vue instance
import './firebase'
import { auth } from './firebase';

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
import { faLink,  faTrash, faPencilAlt, faSave, faArrowRight, faArrowLeft, faDollarSign, faMoneyBill, faWindowMinimize } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'
library.add( faGithub, faLinkedin )
library.add(faLink, faTrash, faPencilAlt, faSave, faArrowRight, faArrowLeft, faDollarSign, faMoneyBill, faWindowMinimize);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false

new Vue({
    router,
    store,
    vuetify,
    Datepicker,
    created() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                this.$store.state.user = auth.currentUser.uid;
                this.$store.state.displayName = auth.currentUser.displayName;
                console.log("set user in created in main.js");
                this.$store.dispatch("fetchPurchases");
                this.$store.dispatch("fetchCategories");
                this.$store.dispatch("fetchBudgets");
                console.log("fetched categories");
            } else {
                this.$store.state.user = null;
            }
        })
    },
    render: h => h(App)
}).$mount('#app')