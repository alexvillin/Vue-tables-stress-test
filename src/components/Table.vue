<template lang="jade">
    <b-container fluid>
        <!--b-breadcrumbb-breadcrumb-item Data A
    -->
        <div class="btn">Items &nbsp;<span class="badge badge-light">{{filteredData.length}}</span></div>
        <div class="btn">Shown &nbsp;<span class="badge badge-light">{{items.length}}</span></div>
        <div v-show="loadMode !== 'all'" class="btn">Pages &nbsp; <span class="badge badge-light">{{totalPages}} </span></div>
        <b-row>
            <b-col sm="3">
                <b-form-input v-model="search" placeholder="Search"> </b-form-input>
            </b-col>
            <b-col sm="3">
                <b-form-select v-model="loadMode" @change="resetProperties">
                    <option value="pagination">Pagination</option>
                    <option value="lazyLoad">Lazyload</option>
                    <option value="handle">Handle load</option>
                    <option value="all">No limit</option>
                </b-form-select>
            </b-col>
            <b-col sm="3" v-if="selectedRows.length">
                <b-button v-if="showOnlySelected" title="Show all" @click="toggleSelected">

                    Show all data
                </b-button>
                <b-button v-else title="Show only selected items" @click="toggleSelected">

                    Show {{selectedRows.length}} selected rows
                </b-button>
            </b-col>
            <b-col sm="3" v-show="loadMode !== 'all'">Rows per page
                <b-form-input v-model="rowsPerPage" type="number"></b-form-input>
            </b-col>
        </b-row>
        <table :class="{resizable: resizable}" class="table table-striped">
            <colgroup>
                <col v-for="name in columnNames" :key="name + 'Col'" :name="name" :style="{width: columnSizes[name] + 'px'}" />
            </colgroup>
            <thead>
                <template v-for="name in columnNames">
                    <th :key="name" :name="name">{{name}}</th>
                </template>
            </thead>
            <tbody v-show="items.length">
                <tr v-for="item in items" :class="{selected: selected[item.id]}" :key="'tr'+item.id">
                    <td v-for="(value, key) in item" :key="item.id + key">
                        <template v-if="key == 'id'">
                            <input type="checkbox" name="selectedRows" v-model="selectedRows" :value="value" />
                            <div :style="{'background-color': markers[item.status]}" class="circle_status"></div>
                        </template>
                        <template v-else-if="key == 'status'">
                            <select v-model="item.status" class="custom-select">
                                <option v-for="(status, index) in statuses" :key="index + 'option'" :value="index">{{status}}</option>
                            </select>
                        </template>
                        <template v-else>{{value}} </template>
                    </td>
                </tr>
            </tbody>
        </table>
        <p v-show="!items.length &amp;&amp; loadingCompleted">No data found </p>
        <b-pagination v-show="loadMode == 'pagination' &amp;&amp; totalPages &gt; 1" :total-rows="filteredData.length" v-model="page" :per-page="rowsPerPage"></b-pagination>
        <b-button v-show="loadMode == 'handle'" variant="info" @click="loadMoreCounter++" :disabled="filteredData.length == items.length">Load more</b-button>
    </b-container>
</template>

<script>
    import Vue from 'vue'
    import VueLodash from 'vue-lodash'
    import api from '../api.js'

    Vue.use(VueLodash, {
        name: 'lodash'
    })


    export default {
        name: 'Table',
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

        },
        data: function() {
            return {
                search: '',
                page: 1,
                loadMoreCounter: 1,
                rowsPerPage: 3,
                loadMode: 'all',
                currentTarget: {},
                showOnlySelected: false,
                selectedRows: [],
                markers: this.$store.state.markers,
                statuses: this.$store.state.statuses,
            }
        },
        created: function() {
            window.addEventListener('scroll', this.loadMoreCheck);

            this.$store.dispatch('setColumnsDimentions',
                api.localStorage.tableCellsWidth.get().then(r => {
                    return r
                })
            );
        },

        updated: function() {
            this.$nextTick(function() {
                if (this.loadMode == 'lazyLoad') {
                    this.loadMoreCheck();
                }
            })
        },
        destroyed: function() {
            window.removeEventListener('scroll', this.loadMoreCheck);
        },

        computed: {
            //pagination
            items: function() {
                var vm = this;
                if (vm.loadMode == 'all') {
                    return vm.filteredData;
                }
                if (vm.loadMode == 'pagination') {
                    var from = vm.rowsPerPage * (vm.page - 1),
                        to = from + vm.rowsPerPage;
                    return vm.filteredData.slice(from, to);
                }
                return vm.filteredData.slice(0, vm.rowsPerPage * vm.loadMoreCounter);
            },
            totalPages: function() {
                return Math.ceil(this.filteredData.length / this.rowsPerPage);
            },
            //selected helper
            selected: function() {
                var selected = {};
                this.selectedRows.forEach(function(id) {
                    selected[id] = true;
                })
                return selected;
            },
            //for search and select filters
            filteredData: function() {
                var vm = this;
                //create new array for dont touch reactive variable
                let items = [...vm.tableData];
                if (vm.search) {
                    items = items.filter(function(row) {
                        return this.lodash.values(row).join().indexOf(vm.search) !== -1;
                    })
                }
                if (vm.showOnlySelected) {
                    items = items.filter(function(item) {
                        return vm.selectedRows.indexOf(item.id) !== -1;
                    })
                }
                return items;
            },
            columnNames: function() {
                var vm = this;
                var fields = this.lodash.keys(vm.tableData[0]);
                return this.tableColumns || fields;
            },
            columnSizes: function() {
                let columns = {...this.$store.state.columns};
                this.columnNames.forEach(function(val) {
                    if (!columns[val]) {
                        columns[val] = 100;
                    }
                })
                this.$store.commit('setColumnsDimentions', columns);
//                    console.log(this.$store.state.columns.id);
                return this.$store.state.columns;
            },


        },
        methods: {
            resetProperties: function() {
                this.page = 1;
                this.loadMoreCounter = 1;
            },

            //            onMouseDown: function(e) {
            //                this.currentTarget = e.target;
            //                this.targetName = $(e.target).attr('name');
            //            },
            //            onMouseMove: function(e) {
            //                if (e.which) {
            //                    var newWidth = e.pageX - this.currentTarget.offsetLeft;
            //                    if (newWidth > 20) {
            //                        $('col[name="' + this.targetName + '"]').css('width', newWidth + 'px')
            //                        //_.debounce(function(){
            //                        //    console.log(123);
            //                        shared.dimentions[this.targetName] = newWidth;
            //
            //                        //}, 1000)
            //                    }
            //                }
            //            },
            //            onMouseUp: function() {
            //                this.currentTarget = {}
            //                api.localStorage.tableCellsWidth.set(shared.dimentions);
            //            },
            toggleSelected: function() {
                this.showOnlySelected = !this.showOnlySelected
            },
            loadMoreCheck: function() {
                if (this.loadMode !== 'lazyLoad') {
                    return;
                }
                //                var clientWindowHeight = document.documentElement.clientHeight;
                //                var pageOffset = window.pageYOffset || document.documentElement.scrollTop;
                //                var tableOffset = $('table').offset().top + $('table').height();
                //                if (pageOffset == tableOffset) {
                //                    console.log('stickyheader');
                //                }
                //                if (clientWindowHeight + pageOffset > tableOffset) {
                //                    console.log(clientWindowHeight + pageOffset, tableOffset);
                //                    this.loadMoreCounter++;
                //                }
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

    th:after {
        position: absolute;
        width: 10px;
        height: 100%;
        top: 0;
        right: 0px;
        content: '';
        z-index: 100;
        cursor: col-resize;
        background-color: lightgray;
        border-radius: 50%;

    }

    .loading {
        border: 10px solid #f3f3f3;
        border-radius: 50%;
        border-top: 10px solid #3498db;
        width: 35px;
        height: 35px;
        -webkit-animation: spin 2s linear infinite;
        animation: spin 2s linear infinite;
        margin: 0 auto;
    }

    @-webkit-keyframes spin {
        0% {
            -webkit-transform: rotate(0deg);
        }

        100% {
            -webkit-transform: rotate(360deg);
        }
    }

    @keyframes spin {
        0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
        }

        100% {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }

    .circle_status {
        height: 10px;
        width: 10px;
        border-radius: 50%;
    }



    [v-cloak] {
        display: none;
    }

    .selected {
        background-color: lightgreen !important;
    }

</style>
