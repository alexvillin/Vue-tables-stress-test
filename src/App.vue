<template>
    <div id="app">
        <img alt="Vue logo" src="./assets/logo.png">
        <HelloWorld msg="Welcome to Your Vue.js App" />
        <table></table>
    </div>
</template>

<script>
    import HelloWorld from './components/HelloWorld.vue'
    import Table from './components/Table.vue'

    function formatDate(dateString) {
        return moment(dateString).format("DD.MM.YYYY hh:mm:ss");
    }
    const api = {
        table: {
            get: function(url) {
                return axios.get(url);
            }
        },
        localStorage: {
            tableCellsWidth: {
                name: 'tableCellsWidth',
                get: function() {
                    return new Promise(function(resolve, reject) {
                        if (typeof(Storage) !== "undefined") {
                            resolve(JSON.parse(localStorage.getItem(this.name) || "{}"));
                        } else {
                            reject(new Error('Sorry! No Web Storage support..'));
                        }
                    })
                },
                set: function(data) {
                    //app.$toastr.success('Changed');
                    localStorage.setItem(this.name, JSON.stringify(data));
                    return data;
                },
            }
        },
    }


    export default {
        name: 'app',
        components: {
            HelloWorld,
            Table
        },

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

            api.table.get('dataA.json')
                .then(function(response) {
                    vm.tableData = response.data;
                    vm.prepareData();
                    vm.loadingCompleted = true;
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
