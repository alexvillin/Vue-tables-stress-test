import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        //count: 0,
        table: {},
        columns: {},
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
    mutations: {
        setTable(state, payload) {
            state.table = payload.data;
        },
        setColumnsDimentions(state, payload) {
            state.columns = payload;
        },
    },
    actions: {
        setTable(context, payload) {
            context.commit('setTable', payload);

        },
        setColumnsDimentions(context, payload) {
            context.commit('setColumnsDimentions', payload);
        },
    }
})
