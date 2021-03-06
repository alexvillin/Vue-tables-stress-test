<!--
    TableInfo component 

    Params: 
        vuexModel: String, required
        perPage: Number, optional, default: 3
        shownRowsAmount: Number, optional

    Vuex state props required: 
        tableData: []
        loadMode: ''
        selected: []

    Vuex mutations required:
        setTable,
        setLoadMode,
  -->

<template>
    <b-container class="mb-3">
        <div class="btn">Items <span class="badge badge-light mr-1">{{filteredData.length}}</span></div>
        <div class="btn" v-if="shownRowsAmount">Shown <span class="badge badge-light mr-1">{{shownRowsAmount}}</span></div>
<!--        <div v-show="loadMode !== 'all' && totalPages" class="btn">Pages <span class="badge badge-light mr-1">{{totalPages}} </span></div>-->
        <b-row>
            <b-col sm="3">
                <b-form-input v-model.lazy="search" placeholder="Search" size="sm"> </b-form-input>
            </b-col>
            <b-col sm="3">
                <b-form-select :value="loadMode" size="sm" @input="setLoadMode">
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

            <b-col sm="2" >
<!--
                <b-button v-if="showOnlySelected" title="Delete items" @click="deleteSelected" size="sm">
                    Del
                </b-button>
-->
                <b-button v-if="showOnlySelected" title="Show all" @click="toggleSelected" size="sm">
                    Show all data
                </b-button>
                <b-button v-if="selectedRows.length && !showOnlySelected" title="Show only selected items" @click="toggleSelected" size="sm">
                    Show {{selectedRows.length}} selected rows
                </b-button>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    import Vue from 'vue'
    import VueLodash from 'vue-lodash'
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
            vuexModel: {
                type: String,
                required: true,
                //TODO: check for model exists
                //validator: val => this.$store.state[val] 
            },
        },
        data: function() {
            return {
                showOnlySelected: false,
                search: '',
                rowsPerPage: this.perPage,
            }
        },
        initialTableState: null,
        created() {
            //create local non reactive variable
            this.$options.initialTableState = this.lodash.cloneDeep(this.tableData);
        },
        computed: {
            totalPages() {
                return this.shownRowsAmount
                    ? Math.ceil(this.shownRowsAmount / this.rowsPerPage)
                    : false
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
                this.setTable(items);
                return items;
            },
            tableData() {
                return this.$store.state[this.vuexModel].tableData || []
            },
            selectedRows(){
                return this.$store.state[this.vuexModel].selected || []
            },
            loadMode() {
                return this.$store.state[this.vuexModel].loadMode || 'all'
            }

        },
        methods: {
            toggleSelected() {
                this.showOnlySelected = !this.showOnlySelected
            },
            deleteSelected(){
                //TODO only with API in real project
            },
            setTable(val) {
                this.$store.commit(`${this.vuexModel}/setTable`, val);
            },
            setLoadMode(val) {
                this.$store.commit(`${this.vuexModel}/setLoadMode`, val);
            },
        },
        watch: {
            rowsPerPage(val) {
                this.$parent.$emit('perPageChanged', val);
            }
        }
    }

</script>
