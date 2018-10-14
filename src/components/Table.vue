<template>
    <div class="loading" v-if="!loadingCompleted"></div>
    <div v-else @mouseup="onMouseUp">

        <TableInfo v-if="info" vuexModel="Table" :shownRowsAmount="shownItems.length" />

        <table :class="{resizable: resizable}" class="table table-striped" ref="table">
            <colgroup>
                <col v-for="name in columnNames" :key="name + 'Col'" :name="name" :style="{width: columnSizes[name] + 'px'}" />
            </colgroup>
            <thead>
                <template v-for="name in columnNames">
                    <th :key="name" :name="name" @mousedown="onMouseDown" @mousemove="onMouseMove">
<!--
                        <template v-if="name == 'id'">
                            <input type="checkbox" name="selectAll" @change="selectAll" v-model="selectAllChecked"/>
                        </template>
-->
                        {{name}}
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
        <p v-show="!shownItems.length &amp;&amp; loadingCompleted">No data found </p>
        <b-pagination v-show="loadMode == 'pagination' &amp;&amp; totalPages &gt; 1" :total-rows="rows.length" v-model="page" :per-page="rowsPerPage"></b-pagination>
        <b-button v-show="loadMode == 'handle'" variant="info" @click="loadMoreCounter++" :disabled="rows.length == shownItems.length">Load more</b-button>
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
    import { createNamespacedHelpers } from 'vuex';

    const VuexModule = 'Table';
    const { mapMutations } = createNamespacedHelpers(VuexModule);

    export default {
        name: VuexModule,
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
                //default: () => []
            },
            fields: Array,
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
            }
        },
        created: function() {
            window.addEventListener('scroll', this.loadMoreCheck);
            //get data from loaal storage
            Api.localStorage.tableCellsWidth.get().then(resp => {
                this.setColumnsSizes(resp);
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
            rows() {
                //Component can use data from storage or directly from parent scope
                return this.tableData || this.$store.state[VuexModule].tableData;
            }, 
            loadMode() {
                return this.pagination 
                    ? 'pagination' 
                    : this.$store.state[VuexModule].loadMode;
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
            totalPages() {
                return Math.ceil(this.rows.length / this.rowsPerPage);
            },
            //selected helper
            //TODO select all checkbox
            selected() {
                let selected = {};
                this.selectedRows.forEach(id => {
                    selected[id] = true;
                })
                this.setSelected(this.selectedRows);
                return selected;
            },

            columnNames() {
                let fields = Object.keys(this.rows[0])
                return this.fields || fields;
            },
            //TODO props from component
            columnSizes() {
                let columns = { ...this.$store.state[VuexModule].columnsSizes };
                this.columnNames.forEach(val => {
                    if (!columns[val]) {
                        columns[val] = 100;
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
                this.currentTarget = e.target;
                this.targetName = e.target.getAttribute('name');
            },
            onMouseMove(e) {
                if (e.which) {
                    let newWidth = e.pageX - this.currentTarget.offsetLeft;
                    if (newWidth > 20) {
                        this.columnSizes[this.targetName] = newWidth;
                    }
                }
            },
            onMouseUp() {
                if(this.currentTarget.tagName){
                    this.currentTarget = {}
                    this.setColumnsSizes(this.columnSizes);
                    Api.localStorage.tableCellsWidth.set(this.columnSizes)
                }
            },
            loadMoreCheck() {
                if (this.loadMode !== 'lazyLoad') {
                    return;
                }
                let clientWindowHeight = document.documentElement.clientHeight;
                let scrollOffset = window.pageYOffset || document.documentElement.scrollTop;
                let [tableOffset, tableHeight] = [this.$refs.table.offsetTop, 
                                                  this.$refs.table.offsetHeight];
                if (scrollOffset >= tableOffset) {
                   // console.log('stickyheader');
                }
                if (windowHeight + scrollOffset > tableOffset + tableHeight) {
                    this.loadMoreCounter++;
                }
            },
            ...mapMutations([
                'setSelected',
                'setColumnsSizes',
            ]),
        },
    }

</script>

<style scoped lang="scss" rel="stylesheet/scss">
    th {
        position: relative;
        min-width: 10px;

        &:after {
            position: absolute;
            width: 3px;
            height: 100%;
            top: 0;
            right: 0px;
            content: '';
            z-index: 100;
            cursor: col-resize;
            background-color: lightgray;
            border-radius: 50%;
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

</style>
