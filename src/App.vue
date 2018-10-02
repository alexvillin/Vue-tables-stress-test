<template>
    <div id="app">
        <img alt="Vue logo" src="./assets/logo.png">
        <HelloWorld msg="Welcome to Your Vue.js App" />
        <Table :tableData="tableData" resizable :loading-completed="loadingCompleted" />
    </div>
</template>

<script>
    import Vue from 'vue'
    import api from './api.js'

    import HelloWorld from './components/HelloWorld.vue'
    import Table from './components/Table.vue'
    
    import VueMoment from 'vue-moment'
    import moment from 'moment-timezone'

    Vue.use(VueMoment, {
        moment,
    })



import store from './store.js'

    function formatDate(dateString) {
        return moment(dateString).format("DD.MM.YYYY hh:mm:ss");
    }


    export default {
        name: 'app',
        components: {
            HelloWorld,
            Table
        },
        store,
        data: function() {
            return {
                headersTable: [""],
                tableData: [],
                loadingCompleted: false,
            }
        },
        //    router: router,
        //    components: {
        //        'table-component': TableComponent,
        //    },
        created: function() {
            var vm = this;
            console.log(store.state)
            console.log(api)
            api.table.get('http://localhost:8080/dataA.json')
                .then(function(response) {
                    vm.tableData = response.data;
                    vm.prepareData();
                    vm.loadingCompleted = true;
                    store.commit('setTable', {
                        data: vm.tableData
                    });
                    console.log(store.state)

                })
                .catch(function(error) {
                    console.log('Error! Can`t get json data' + error.message);
                })

        },
        methods: {
            //create model instance
            prepareData: function() {
                this.tableData.forEach(function(row) {
                    row.start = formatDate(row.start);
                    if (row.start !== row.finish) {
                        row.start += "-" + formatDate(row.finish);
                    }
                    row.createdon = formatDate(row.createdon);
                    delete row.finish;
                })
            },
        },
    }

</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }

</style>
