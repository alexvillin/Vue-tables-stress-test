<template>
    <div class="loading" v-if="!loadingCompleted"></div>
    <div v-else>

        <TableInfo :commonRowsAmount="filteredData.length" :shownRowsAmount="items.length" :shared="shared" />

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
        <b-pagination v-show="loadMode == 'pagination' &amp;&amp; totalPages &gt; 1" :total-rows="filteredData.length" v-model="page" :per-page="shared.rowsPerPage"></b-pagination>
        <b-button v-show="loadMode == 'handle'" variant="info" @click="loadMoreCounter++" :disabled="filteredData.length == items.length">Load more</b-button>
    </div>
</template>

<script>
    import TableInfo from '@/components/TableInfo.vue'
    import Api from '@/api'

    export default {
        name: 'Table',
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
                default: 3
            },
            info: Boolean,
        },

        data: function() {
            return {
                page: 1,
                loadMoreCounter: 1,
                //                rowsPerPage: this.perPage,
                currentTarget: {},
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
            window.addEventListener('scroll', this.loadMoreCheck);
            //get data from loaal storage
            Api.localStorage.tableCellsWidth.get().then(resp => {
                this.$store.commit('setColumnsDimentions', resp);
            })
        },

        updated: function() {
            this.$nextTick(() => {
                if (this.loadMode == 'lazyLoad') {
                    this.loadMoreCheck();
                }
            })
        },
        destroyed: function() {
            window.removeEventListener('scroll', this.loadMoreCheck);
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
                        return vm.lodash.values(row).join().indexOf(vm.shared.search) !== -1;
                    })
                }
                if (vm.shared.showOnlySelected) {
                    items = items.filter(item => {
                        return vm.selectedRows.indexOf(item.id) !== -1;
                    })
                }
                return items;
            },
            columnNames() {
                let vm = this;
                let fields = this.lodash.keys(vm.tableData[0]);
                return this.tableColumns || fields;
            },
            columnSizes() {
                let columns = { ...this.$store.state.columns
                };
                this.columnNames.forEach(val => {
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
            resetProperties() {
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

    .circle_status {
        height: 10px;
        width: 10px;
        border-radius: 50%;
    }

    .selected {
        background-color: lightgreen !important;
    }

</style>
