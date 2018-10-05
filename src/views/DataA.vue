<template>
    <Table resizable :loading-completed="loadingCompleted" />
</template>

<script>
    // @ is an alias to /src
    import Table from '@/components/Table.vue'
    import TableModel from '@/models/Table'
    import Api from '@/api'

    export default {
        name: 'DataA',
        components: {
            Table
        },

        data: function() {
            return {
                headersTable: [""],
                loadingCompleted: false,
            }
        },

        created: function() {
            Api.table.get('//localhost:8080/dataA.json')
                .then(response => {
                    let table = response.data.map(val => {
                        return new TableModel(val)
                    })
                    this.loadingCompleted = true;
                    this.$store.commit('Table/setTable', table);
                })
                .catch(error => {
                    console.log('Error! Can`t get json data' + error.message);
                })

        },

    }

</script>
