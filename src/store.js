import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

//Use component names for Vuex modules
const Table = {
    namespaced: true,
    state: {
        tableData: [],
        loadMode: 'pagination',
        selected: [],
        dimentions: {},
        fields: {},
    },
    mutations: {
        setTable(state, payload) {
//            state.tableDataBefore = state.tableData;
//            Vue.set(state, 'tableDataBefore', state.tableData)
            state.tableData = payload;
        },
        setColumnsDimentions(state, payload) {
            state.dimentions = payload;
        },
        setLoadMode(state, payload) {
            state.loadMode = payload;
        },
        setSelected(state, payload) {
            state.selected = [...payload];
        },
    },
    actions: {
        setTable(context, payload) {
            context.commit('setTable', payload);
        },
        setColumnsDimentions(context, payload) {
            context.commit('setColumnsDimentions', payload);
        },
        setLoadMode(context, payload) {
            context.commit('setLoadMode', payload);
        },
    },

}
//TODO: create files for modules
const TableBootstrapVue = {

}

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
