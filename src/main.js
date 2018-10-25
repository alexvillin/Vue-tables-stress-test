import Vue from 'vue'

import App from '@/App.vue'
import router from '@/router'
import store from '@/store/store'
import VueMoment from 'vue-moment'
import moment from 'moment-timezone'
import VueLodash from 'vue-lodash'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'

Vue.use(VueMoment, {
    moment
})
Vue.use(VueLodash, {
    name: 'lodash'
})
Vue.use(BootstrapVue);

Vue.config.productionTip = false

Vue.component('v-icon', Icon)

new Vue({
    router,
    render: h => h(App),
    store,
}).$mount('#app')
