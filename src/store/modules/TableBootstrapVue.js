const TableBootstrapVue = {
    namespaced: true,
    state: {
        tableData: [],
        loadMode: 'pagination',
        selected: [],
        columnsSizes: {},
        fields: {},
    },
    mutations: {
        setTable(state, payload) {
            state.tableData = payload;
        },
        setColumnsSizes(state, payload) {
            state.columnsSizes = payload;
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
        setColumnsSizes(context, payload) {
            context.commit('setColumnsSizes', payload);
        },
        setLoadMode(context, payload) {
            context.commit('setLoadMode', payload);
        },
    },
}
export default TableBootstrapVue;