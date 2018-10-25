<!--    TODO resizable and lazyloading,sorting -->
<template>
    <div v-if="!loadingCompleted" class="loading"></div>
    <div v-else v-cloak keep-alive variant="dark">

        <TableInfo vuexModel="TableBootstrapVue" :shownRowsAmount="items.length" />

        <b-table striped hover :items="items" head-variant="light" :fields="fields">
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
        <b-pagination v-show="loadMode == 'pagination' &amp;&amp; totalPages &gt; 1" size="md" :total-rows="items.length" v-model="page" :per-page="rowsPerPage"></b-pagination>
        <b-button v-show="loadMode == 'handle'" variant="info" @click="loadMoreCounter++" :disabled="items.length == rows.length">Load more</b-button>
    </div>
</template>

<script>
    import TableInfo from '@/components/TableInfo.vue'
    import Api from '@/api'
    import { createNamespacedHelpers } from 'vuex';
    import TableFields from '@/models/TableFields'

    const VuexModule = 'TableBootstrapVue';
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
            fields: {
                type: Array,
                default: TableFields
            },
            loadingCompleted: {
                type: Boolean,
                default: false,
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
//            window.addEventListener('scroll', this.loadMoreCheck);
            //get data from loaal storage
            Api.localStorage.tableCellsWidth.get().then(resp => {
                this.setColumnsSizes(resp);
            })
        },

        updated: function() {
            this.$nextTick(() => {

            })
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
            items() {
                if (this.loadMode == 'all') {
                    return this.rows;
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
            selected() {
                let selected = {};
                this.selectedRows.forEach(id => {
                    selected[id] = true;
                })
                this.setSelected(this.selectedRows);
                return selected;
            },

        },
        methods: {
            resetProperties() {
                this.page = 1;
                this.loadMoreCounter = 1;
            },
            ...mapMutations([
                'setSelected',
                'setColumnsSizes',
            ]),
        },
    }

</script>

<style scoped lang="scss" rel="stylesheet/scss">
    table {
        table-layout: fixed;
    
        th {
            overflow: hidden;
            text-overflow: ellipsis;
            position: relative;
            min-width: 10px;
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
