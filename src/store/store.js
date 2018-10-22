import Vue from 'vue';
import Vuex from 'vuex';
import Table from '@/store/modules/Table';
import TableBootstrapVue from '@/store/modules/TableBootstrapVue';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        Table,
        TableBootstrapVue
    },
    state: {
        markers: [
                'green', 'green', 'yellow', 'red',
                'grey', 'blue', 'orange',
                'black', 'darkred', 'lightgrey',
            ],
        statuses: [
                'not interesting',
                'interesting',
                'very interesting',
                'valuable',
                'unique',
            ],
    },

})
