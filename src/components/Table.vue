<template>
    <div class="loading" v-if="!loadingCompleted"></div>
    <div v-else>
        <notifications group="table"/>

        <TableInfo v-if="info" vuexModel="Table" :shownRowsAmount="shownItems.length" />

        <table class="table table-striped" v-lazy-load v-resizable ref="table" name="table">
            <colgroup>
                <col v-for="name in columnNames" :key="name + 'Col'" />
            </colgroup>
            <thead>
                <template v-for="name in columnNames">
                    <th :key="name">
                        <template v-if="name == 'id'">
                            <input type="checkbox" name="selectAll" @change="selectAllVisibleRows" @click.stop v-model="selectAllChecked[page]"/>
                        </template>
                        <span>{{name}}</span>
                        <v-icon name="sort-down" v-show="activeField == name"></v-icon>
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
        <b-pagination-nav :link-gen="linkGen" :number-of-pages="totalPages" v-model="page" v-show="isPagination &amp;&amp; totalPages &gt; 1" />
<!--        <b-pagination id="pagination" v-show="loadMode == 'pagination' &amp;&amp; totalPages &gt; 1" :total-rows="rows.length" v-model="page" :per-page="rowsPerPage"></b-pagination>-->
        <b-button id="load-more-button" v-show="isHandle" variant="info" @click="loadMore()" :disabled="rows.length == shownItems.length">Load more</b-button>
    </div>
</template>

<script>
    import Vue from 'vue'
    import TableInfo from '@/components/TableInfo.vue'
    import VueLodash from 'vue-lodash'
    Vue.use(VueLodash, {
        name: 'lodash'
    })

    import Helper from '@/helper'
    import TableFieldsModel from '@/models/TableFields'
    import lazyLoad from '@/directives/lazyLoad'
    import resizable from '@/directives/resizable'
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
                default: TableFieldsModel
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
                loadMoreCounter: 2,
                selectedRows: [],
                markers: this.$store.state.markers || [],
                statuses: this.$store.state.statuses || [],
                rowsPerPage: this.perPage,
                selectAllChecked: {},
                activeField: ''
            }
        },
        directives: {
            lazyLoad,
            resizable
        },
        created: function() {
            this.$on('perPageChanged', (val) => {
                this.rowsPerPage = +val;
            })
            this.$on('uploadMoreData', function() {
                if(this.isLazyLoad) this.loadMore();
            });
        },
        destroyed: function() {
            this.$off('perPageChanged');
            this.$off('uploadMoreData');
        },
        computed: {
            loadMode() {
                return this.pagination 
                    ? 'pagination' 
                    : this.$store.state[VuexModule].loadMode;
            },
            //pagination processing
            shownItems() {
                if (this.isPagination) {
                    var from = this.rowsPerPage * (this.page - 1),
                        to = from + this.rowsPerPage;
                    return this.rows.slice(from, to);
                }
                if(this.isHandle || this.isLazyLoad){
                    return this.rows.slice(0, this.rowsPerPage * this.loadMoreCounter);
                }
                return [...this.rows];
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
            isLazyLoad() {
                return this.loadMode == 'lazyLoad';
            },
            isPagination() {
                return this.loadMode == 'pagination';
            },
            isHandle() {
                return this.loadMode == 'handle';
            },
        },
        methods: {
            resetProperties() {
                this.page = 1;
                this.loadMoreCounter = 1;
            },
            selectAllVisibleRows(){
                if(this.selectAllChecked[this.page]){
                    Helper.mergeArrays(this.selectedRows, this.shownItemsIds);
                } else {
                    Helper.diffArrays(this.selectedRows, this.shownItemsIds);
                }
                Vue.notify({group: 'table', text: 'Selected ' + this.selectedRows.length + 'items'})
            },

//            },
            //uniq url for pages
            linkGen(page) {
                return {
                    query: { ...this.$route.query, page }
                }
            },
            loadMore(){
                this.loadMoreCounter++;
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
