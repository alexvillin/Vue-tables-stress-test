<!--
    TableInfo component
    Params: 
        module: required
        commonRowsAmount: optional
        shownRowsAmount: optinal
        perPage: optional, default: 3
    Vuex: 
        tableData: Vuex source
        loadMode: Vuex source
        selectedRows: Vuex source
  -->

<template>
    <b-container class="mb-3">
        <div class="btn">Items <span class="badge badge-light mr-1">{{filteredData.length}}</span></div>
        <div class="btn" v-if="shownRowsAmount">Shown <span class="badge badge-light mr-1">{{shownRowsAmount}}</span></div>
<!--        <div v-show="loadMode !== 'all' && totalPages" class="btn">Pages <span class="badge badge-light mr-1">{{totalPages}} </span></div>-->
        <b-row>
            <b-col sm="3">
                <b-form-input v-model="search" placeholder="Search" size="sm"> </b-form-input>
            </b-col>
            <b-col sm="3">
                <b-form-select v-model="loadMode" size="sm">
                    <option value="pagination">Pagination</option>
                    <option value="lazyLoad">Lazyload</option>
                    <option value="handle">Handle load</option>
                    <option value="all">No limit</option>
                </b-form-select>
            </b-col>
            <b-col sm="3" v-show="loadMode !== 'all'">
<!--                <label for="rows">Rows per page:</label>-->
                <b-form-input v-model="rowsPerPage" id="rows" type="number" size="sm"></b-form-input>
            </b-col>

            <b-col sm="2" v-if="selectedRows.length">
                <b-button v-if="showOnlySelected" title="Show all" @click="toggleSelected" size="sm">
                    Show all data
                </b-button>
                <b-button v-else title="Show only selected items" @click="toggleSelected" size="sm">
                    Show {{selectedRows.length}} selected rows
                </b-button>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    import Vue from 'vue'
    import VueLodash from 'vue-lodash'
//    import { mapState, mapMutations } from 'vuex';
    Vue.use(VueLodash, {
        name: 'lodash'
    })

    export default {
        name: 'TableInfo',
        props: {
            shownRowsAmount: Number,
            perPage: {
                type: Number,
                default: 3,
                validator: val => {
                    return val > 2;
                }
            },
            data: {
                type: Array,
                default: () => []
            }
        },
        data: function() {
            return {
                loadMode: this.$store.state.loadMode,
                showOnlySelected: false,
                search: '',
                rowsPerPage: this.perPage,
            }
        },
        initialTableState: null,
        created() {
            //create local non reactive variable
            this.$options.initialTableState = this.lodash.cloneDeep(this.$store.state.tableData);
        },
        computed: {
            tableData(){
                return this.$store.state.tableData || this.data;
            },
            totalPages() {
                return this.shownRowsAmount
                    ? Math.ceil(this.shownRowsAmount / this.rowsPerPage)
                    : false
            },
            selectedRows() {
                return this.$store.state.selected || [];
            },
             //for search and select filters
            filteredData() {
                //create new array for dont touch reactive variable
                let items = [...this.$options.initialTableState];
                if (this.search) {
                    items = items.filter(row => {
                        return this.lodash.values(row).join().indexOf(this.search) !== -1;
                    })
                }
                if (this.showOnlySelected) {
                    items = items.filter(item => {
                        return this.selectedRows.indexOf(item.id) !== -1;
                    })
                }
                this.$store.commit('setTable', items);
//                this.setTable(items);
                return items;
            },
            //use vuex state helper
//            ...mapState(this.vuexModulePath, {
//                tableData: state => state.tableData,
//                selectedRows: state => state.selected
//            })
        },
        methods: {
            toggleSelected() {
                this.showOnlySelected = !this.showOnlySelected
            },
            //use vuex mutations helper
//            ...mapMutations(this.vuexModulePath, [
//                'setTable',
//                'setLoadMode',
            // mapMutations также поддерживает нагрузку:
//                'incrementBy' // `this.incrementBy(amount)` будет вызывать `this.$store.commit('incrementBy', amount)`
//            ])
        },
        watch: {
            loadMode(val) {
                this.$store.commit('setLoadMode', val);
//                this.setLoadMode(val)
            },
        }
    }

</script>
