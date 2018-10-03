<template>

    <div v-if="!loadingCompleted" class="loading"></div>
    <div v-else v-cloak keep-alive>

        <TableInfo :commonRowsAmount="filteredData.length" :shownRowsAmount="items.length" :shared="shared" />

        <b-table striped hover :items="items">
            <template slot="id" slot-scope="data">
                <b-form-checkbox name="selectedRows" v-model="selectedRows" :value="data.item.id"></b-form-checkbox>
                <div :style="{'background-color': markers[data.item.status]}" class="circle_status"></div>
            </template>
            <template slot="status" slot-scope="data">
                <b-form-select v-model="data.item.status">
                    <option v-for="(status, index) in statuses" :value="index">{{status}}</option>
                </b-form-select>
            </template>
        </b-table>
        <b-pagination v-show="loadMode == 'pagination' &amp;&amp; totalPages &gt; 1" size="md" :total-rows="filteredData.length" v-model="page" :per-page="shared.rowsPerPage"></b-pagination>
        <b-button v-show="loadMode == 'handle'" variant="info" @click="loadMoreCounter++" :disabled="filteredData.length == items.length">Load more</b-button>
    </div>
</template>

<script>
    import TableInfo from '@/components/TableInfo.vue'
    import Api from '@/api'

    export default {
        name: 'TableBootstrapVue',
        components: {
            TableInfo
        },
        props: {
            resizable: {
                type: Boolean,
                default: false
            },
            tableData: {
                type: Array,
                required: true
            },
            tableColumns: Array,
            loadingCompleted: {
                type: Boolean,
                default: false,
            },
            pagination: Boolean,
            perPage: {
                type: Number,
                default: 3,
            }
        },
        data: function() {
            return {
                page: 1,
                selectedRows: [],
                markers: this.$store.state.markers,
                statuses: this.$store.state.statuses,
                shared: {
                    search: '',
                    showOnlySelected: false,
                    rowsPerPage: this.perPage
                }
            }
        },
        created: function() {
            Api.localStorage.tableCellsWidth.get().then(resp => {
                this.$store.dispatch('setColumnsDimentions', resp);
            })
        },

        updated: function() {
            this.$nextTick(function() {

            })
        },


        computed: {
            loadMode() {
                return this.pagination 
                    ? 'pagination' 
                    : this.$store.state.loadMode;
            },
            //pagination
            items() {
                let vm = this;
                if (vm.loadMode == 'all') {
                    return vm.filteredData;
                }
                if (vm.loadMode == 'pagination') {
                    var from = vm.shared.rowsPerPage * (vm.page - 1),
                        to = from + vm.shared.rowsPerPage;
                    return vm.filteredData.slice(from, to);
                }
                return vm.filteredData.slice(0, vm.shared.rowsPerPage * vm.loadMoreCounter);
            },
            totalPages() {
                return Math.ceil(this.filteredData.length / this.shared.rowsPerPage);
            },
            //selected helper
            selected() {
                let selected = {};
                this.selectedRows.forEach(id => {
                    selected[id] = true;
                })
                this.$store.commit('setSelected', this.selectedRows);
                return selected;
            },
            //for search and select filters
            filteredData() {
                let vm = this;
                //create new array for dont touch reactive variable
                let items = [...vm.tableData];
                if (vm.shared.search) {
                    items = items.filter(row => {
                        return vm.lodash.values(row).join().indexOf(vm.search) !== -1;
                    })
                }
                if (vm.shared.showOnlySelected) {
                    items = items.filter(item => {
                        return vm.selectedRows.indexOf(item.id) !== -1;
                    })
                }
                return items;
            },
            columnSizes() {
                let columns = { ...this.$store.state.columns };
                this.lodash.keys(this.tableData[0]).forEach(val => {
                    if (!columns[val]) {
                        columns[val] = 100;
                    }
                })
                this.$store.commit('setColumnsDimentions', columns);
                return columns;
            },

        },
        methods: {
            resetProperties() {
                this.page = 1;
            },
        },
    }

</script>

<style scoped>
    table {
        table-layout: fixed;
    }

    table td,
    table th {
        text-overflow: ellipsis;
        overflow: hidden;
    }

    th {
        position: relative;
        min-width: 10px;
    }


    .circle_status {
        height: 10px;
        width: 10px;
        border-radius: 50%;
    }

    .selected {
        background-color: lightgreen !important;
    }

</style>
