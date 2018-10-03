<template>
     <TableBootstrapVue :tableData="tableData" resizable :loading-completed="loadingCompleted" />
</template>

<script>
    // @ is an alias to /src
    import Vue from 'vue'
    import Table from '@/components/TableBootstrapVue.vue'
    import Api from '@/api'

    function formatDate(dateString) {
        return Vue.moment(dateString).format("DD.MM.YYYY hh:mm:ss");
    }

    export default {
        name: 'DataA',
        components: {
            TableBootstrapVue: Table
        },

        data: function() {
            return {
                headersTable: [""],
                tableData: [],
                loadingCompleted: false,
            }
        },

        created: function() {
            let vm = this;
            Api.table.get('//localhost:8080/dataB.json')
                .then(response => {
                    vm.tableData = response.data;
                    vm.prepareData();
                    vm.loadingCompleted = true;
                    vm.$store.commit('setTable', {
                        data: vm.tableData
                    });

                })
                .catch(error => {
                    console.log('Error! Can`t get json data' + error.message);
                })

        },
        methods: {
            //create model instance
            prepareData() {
                this.tableData.forEach(row => {
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