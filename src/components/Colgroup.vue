<template>
    <colgroup>
        <col v-for="(val, index) in columns" :key="'Column' + index" />
    </colgroup>
</template>
<script>
    export default {
        name: 'Colgroup',
        components: {
        },
        props: {
            amount: {
                type: Number,
//                required: true
            }
        },
        computed: {
            columns(){
                return Array(this.amount).fill(null);
            }
        }
    }
</script>
