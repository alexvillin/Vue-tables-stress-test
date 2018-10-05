import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

//Use component names for Vuex modules
const Table = {
    state: {
        tableData: {},
        loadMode: 'pagination',
        selected: [],
        dimentions: {},
    }
}

const TableBootstrapVue = {
    state: {
        tableData: {},
        loadMode: 'pagination',
        selected: [],
        dimentions: {},

    }
}
export default new Vuex.Store({
    modules: {
        Table,
        TableBootstrapVue
    },
    state: {
        tableData: [],
        loadMode: 'pagination',
        selected: [],
        dimentions: {},
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

})
