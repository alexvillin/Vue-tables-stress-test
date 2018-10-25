<template>
    <div class="loading" v-if="!loadingCompleted"></div>
    <div v-else @mouseup="onMouseUp">
        <notifications group="table"/>

        <TableInfo v-if="info" vuexModel="Table" :shownRowsAmount="shownItems.length" />

        <table class="table table-striped" ref="table" name="table">
            <colgroup>
                <col v-for="name in columnNames" :key="name + 'Col'" :name="name" :style="{width: columnSizes[name] + 'px'}" />
            </colgroup>
            <thead @mousemove="onMouseMove">
                <template v-for="name in columnNames">
                    <th :key="name" :name="name">
                        <template v-if="name == 'id'">
                            <input type="checkbox" name="selectAll" @change="selectAllVisibleRows" @click.stop v-model="selectAllChecked[page]"/>
                        </template>
                        <span>{{name}}</span>
                        <v-icon name="sort-down" v-show="activeField == name"></v-icon>
                        <div v-if="resizable" class="divider" @mousedown="onMouseDown"></div>
                    </th>
                </template>
            </thead>
            <tbody v-show="shownItems.length">
                <tr v-for="item in shownItems" :class="{selected: selected[item.id]}" :key="'tr'+item.id">
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
        <p id="no-data-found" v-show="!shownItems.length &amp;&amp; loadingCompleted">No data found </p>
        <b-pagination-nav :link-gen="linkGen" :number-of-pages="totalPages" v-model="page" v-show="loadMode == 'pagination' &amp;&amp; totalPages &gt; 1" />
<!--        <b-pagination id="pagination" v-show="loadMode == 'pagination' &amp;&amp; totalPages &gt; 1" :total-rows="rows.length" v-model="page" :per-page="rowsPerPage"></b-pagination>-->
        <b-button id="load-more" v-show="loadMode == 'handle'" variant="info" @click="loadMoreCounter++" :disabled="rows.length == shownItems.length">Load more</b-button>
    </div>
</template>

<script>
    import Vue from 'vue'
    import TableInfo from '@/components/TableInfo.vue'
    import VueLodash from 'vue-lodash'
    Vue.use(VueLodash, {
        name: 'lodash'
    })

    import Api from '@/api'
    import Helper from '@/helper'
    import TableFields from '@/models/TableFields'
    import { createNamespacedHelpers } from 'vuex';

    const VuexModule = 'Table';
    const { mapMutations } = createNamespacedHelpers(VuexModule);

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
            fields: { 
                type: Array,
                default: TableFields
            },
            loadingCompleted: {
                type: Boolean,
                default: true,
            },
            pagination: Boolean,
            perPage: {
                type: Number,
                default: 3
            },
            info: {
                type: Boolean,
                default: true
            }
        },

        data: function() {
            return {
                page: 1,
                loadMoreCounter: 1,
                currentTarget: {},
                selectedRows: [],
                markers: this.$store.state.markers || [],
                statuses: this.$store.state.statuses || [],
                rowsPerPage: this.perPage,
                selectAllChecked: {},
                activeField: ''
            }
        },
        created: function() {
            window.addEventListener('scroll', this.loadMoreCheck);
            //get data from loaal storage
            Api.localStorage.tableCellsWidth.get().then(resp => {
                this.setColumnsSizes(resp);
            })
            this.$on('perPageChanged', (val) => {
                this.rowsPerPage = +val;
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
            window.removeEventListener('scroll');
        },

        computed: {
            loadMode() {
                return this.pagination 
                    ? 'pagination' 
                    : this.$store.state[VuexModule].loadMode;
            },
            defaultColumnWidth(){
                return Math.ceil(Helper.getWindowWidth() / this.columnNames.length);
            },
            //pagination processing
            shownItems() {
                if (this.loadMode == 'all') {
                    return [...this.rows];
                }
                if (this.loadMode == 'pagination') {
                    var from = this.rowsPerPage * (this.page - 1),
                        to = from + this.rowsPerPage;
                    return this.rows.slice(from, to);
                }
                return this.rows.slice(0, this.rowsPerPage * this.loadMoreCounter);
            },
            shownItemsIds() {
                return this.lodash.map(this.shownItems, 'id');
            },
            rows() {
                return this.$store.state[VuexModule].tableData;
            },
            totalPages() {
                return Math.ceil(this.rows.length / this.rowsPerPage);
            },
            //selected helper
            selected() {
                let selected = {};
                this.selectedRows.forEach(id => {
                    selected[id] = true;
                })
                this.setSelected(this.selectedRows);
                return selected;
            },
            columnNames() {
                let fields = this.lodash.keys(this.rows[0])
                return this.lodash.map(this.fields, 'key') || fields;
            },
            //TODO props from component
            columnSizes() {
                let columns = { ...this.$store.state[VuexModule].columnsSizes };
                //check for custom column nanes from props
                this.columnNames.forEach(val => {
                    if (!columns[val]) {
                        columns[val] = this.defaultColumnWidth;
                    }
                })
                this.setColumnsSizes(columns);
                return columns;
            },
        },
        methods: {
            resetProperties() {
                this.page = 1;
                this.loadMoreCounter = 1;
            },
            onMouseDown(e) {
                this.currentTarget = e.target.closest('th');
                this.targetName = e.target.closest('th').getAttribute('name');
            },
            onMouseMove(e) {
                if (e.which && this.resizable) {
                    let newWidth = e.pageX - this.currentTarget.offsetLeft;
                    if (newWidth > 20) {
                        this.columnSizes[this.targetName] = newWidth;
                    }
                }
            },
            onMouseUp() {
                if(this.currentTarget.tagName && this.resizable){
                    this.currentTarget = {}
                    this.setColumnsSizes(this.columnSizes);
                    Api.localStorage.tableCellsWidth.set(this.columnSizes)
                }
            },
            selectAllVisibleRows(){
                if(this.selectAllChecked[this.page]){
                    Helper.mergeArrays(this.selectedRows, this.shownItemsIds);
                } else {
                    Helper.diffArrays(this.selectedRows, this.shownItemsIds);
                }
                Vue.notify({group: 'table', text: 'Selected ' + this.selectedRows.length + 'items'})
            },
            loadMoreCheck() {
                if (this.loadMode !== 'lazyLoad') {
                    return;
                }
                let clientWindowHeight = Helper.getWindowHeight();
                let scrollOffset = Helper.getScrollOffset();
                let [tableOffset, tableHeight] = [this.$refs.table.offsetTop, 
                                                  this.$refs.table.offsetHeight];
                if (scrollOffset >= tableOffset) {
                    // console.log('stickyheader');
                }
                if (clientWindowHeight + scrollOffset > tableOffset + tableHeight) {
                    this.loadMoreCounter++;
                }
            },
            //uniq url for pages
            linkGen(page) {
                return {
                    query: { ...this.$route.query, page }
                }
            },
//            sortBy(fieldName) {
//                this.activeField = fieldName; 
//                let orderedTable = this.lodash.orderBy(this.rows, fieldName);
//                this.setTable(orderedTable);
//            },
            ...mapMutations([
                'setTable',
                'setSelected',
                'setColumnsSizes',
            ]),
        },
    }

</script>

<style scoped lang="scss" rel="stylesheet/scss">
    table {
        th {
            position: relative;
            min-width: 10px;

            span {
                cursor:pointer;
            }
        }
    }

    .circle_status {
        height: 10px;
        width: 10px;
        border-radius: 50%;
    }

    .selected {
        background-color: lightgreen !important;
    }
    .divider {
        position: absolute;
        width: 5px;
        height: 100%;
        top: 0;
        right: 0px;
        z-index: 100;
        cursor: col-resize;
        background-color: lightgray;
        border-radius: 50%;
    }

</style>
