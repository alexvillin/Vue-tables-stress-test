<template>
    <b-container class="mb-3">
        <div class="btn" v-if="commonRowsAmount">Items <span class="badge badge-light mr-1">{{commonRowsAmount}}</span></div>
        <div class="btn" v-if="shownRowsAmount">Shown <span class="badge badge-light mr-1">{{shownRowsAmount}}</span></div>
        <div v-show="loadMode !== 'all' && totalPages" class="btn">Pages <span class="badge badge-light mr-1">{{totalPages}} </span></div>
        <b-row>
            <b-col sm="3">
                <b-form-input v-model="shared.search" placeholder="Search" size="sm"> </b-form-input>
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
                <b-form-input v-model="shared.rowsPerPage" id="rows" type="number" size="sm"></b-form-input>
            </b-col>

            <b-col sm="2" v-if="selectedRows.length">
                <b-button v-if="shared.showOnlySelected" title="Show all" @click="toggleSelected" size="sm">
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

    export default {
        name: 'TableInfo',
        props: {
            pagination: Boolean,
            commonRowsAmount: Number,
            shownRowsAmount: Number,
            perPage: {
                type: Number,
                default: 3,
                validator: val => {
                    return val > 2;
                }
            },
            shared: Object,

        },
        data: function() {
            return {
                loadMode: this.$store.state.loadMode,
            }
        },
        computed: {
            totalPages() {
                return Math.ceil(this.commonRowsAmount / this.perPage);
            },
            selectedRows() {
                return this.$store.state.selected;
            }
        },
        methods: {
            toggleSelected() {
                this.shared.showOnlySelected = !this.shared.showOnlySelected
            },
        },
        watch: {
            loadMode(val) {
                this.$store.dispatch('setLoadMode', val)
            }
        }
    }

</script>
