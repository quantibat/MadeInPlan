import Vue from 'vue'

import VueRouter from 'vue-router'
Vue.use(VueRouter);

import Vuex from 'vuex'
Vue.use(Vuex);

import Axios from 'axios'
Vue.prototype.$http = Axios;

import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
Vue.prototype.$swal = Swal;

import VueLocalStorage from 'vue-localstorage'
Vue.use(VueLocalStorage);

import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/fr';
Vue.use(ElementUI, { locale });

import VueCarousel from 'vue-carousel';
Vue.use(VueCarousel);

import VueNumeric from 'vue-numeric';
Vue.use(VueNumeric);

import VueScrollTo from 'vue-scrollto';
Vue.use(VueScrollTo);

import Croppa from 'vue-croppa';
import 'vue-croppa/dist/vue-croppa.css';
Vue.use(Croppa);

import VueMasonry from 'vue-masonry-css'
Vue.use(VueMasonry);

import VTooltip from 'v-tooltip'
Vue.use(VTooltip)

import Meta from 'vue-meta'
Vue.use(Meta)

var env = {}
if (process.env.NODE_ENV === 'production') {
    env.URL = 'https://app.madeinplan.fr';
    env.MOBILE_URL = 'https://mobile.madeinplan.fr/todolist';
    env.CALC_ADDR = 'https://api.madeinplan.fr';
    env.MIP_URL = 'https://madeinplan.fr';
    env.ADMIN_URL = 'https://admin.madeinplan.fr';
} else if (process.env.NODE_ENV === 'preprod') {
    env.URL = 'https://app.myeconomiste.com';
    env.MOBILE_URL = 'https://mobile.myeconomiste.com/todolist';
    env.MIP_URL = 'https://myeconomiste.com';
    env.ADMIN_URL = 'https://admin.myeconomiste.com';
    env.CALC_ADDR = 'https://api.myeconomiste.com';
} else {
    env.URL = 'http://local.madeinplan.com:8080';
    env.MOBILE_URL = 'http://local.madeinplan.com:8081/todolist';
    env.ADMIN_URL = 'http://local.madeinplan.com:9000';
    env.CALC_ADDR = 'http://local.madeinplan.com:1729';
    env.MIP_URL = 'http://local.madeinplan.com:3000';
}

import App from './App.vue'
import Router from './Router.js';
import Store from './Store.js';

new Vue({
    el: '#app',
    router: Router,
    store: Store,
    data() {
        return {
            CONFIG_ADDR: 'https://mipbackend.ovh',
            URL: env.URL,
            MOBILE_URL: env.MOBILE_URL,
            MIP_URL: env.MIP_URL,
            CALC_ADDR: env.CALC_ADDR
        }
    },
    localStorage: {
        user: {
            type: Object
        }
    },
    render: h => h(App)
})
