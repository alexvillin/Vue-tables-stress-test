<template>
     <TableBootstrapVue resizable :loading-completed="loadingCompleted" />
</template>

<script>
    // @ is an alias to /src
    import Table from '@/components/TableBootstrapVue.vue'
    import TableModel from '@/models/Table'
    import Api from '@/api'

    export default {
        name: 'DataA',
        components: {
            TableBootstrapVue: Table
        },

        data: function() {
            return {
                loadingCompleted: false,
            }
        },
        created: function() {
            Api.table.get('//localhost:8080/dataB.json')
                .then(response => {
                    let table = response.data.map(val => {
                        return new TableModel(val)
                    })
                    this.loadingCompleted = true;
                    this.$store.commit('TableBootstrapVue/setTable', table);
                })
                .catch(error => {
                    console.log('Error! Can`t get json data' + error.message);
                })
        },
       
    }

</script>