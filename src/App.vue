<template>
    <div id="app">
<!--        <notifications position="bottom right" />-->
        <notifications group="api"/>
        <b-navbar toggleable="md" v-cloak type="dark" variant="info">
            <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
            <b-navbar-brand>Tables stress test</b-navbar-brand>
            <b-collapse is-nav id="nav_collapse" class="justify-content-end">
                <b-navbar-nav>
                    <b-nav-item to="/" sm="auto">Task legend</b-nav-item>
                    <b-nav-item to="/dataA" sm="auto">Data A (native)</b-nav-item>
                    <b-nav-item to="/dataB" sm="auto">Data B (bootstrap-vue)</b-nav-item>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
        <b-container fluid>
            <router-view></router-view>
        </b-container>

    </div>
</template>

<script>

    export default {
        name: 'app'
    }

</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }

    [v-cloak] {
        display: none;
    }

    table {
        table-layout: fixed;
    }
    td, th {
        text-overflow: ellipsis;
        overflow: hidden;
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

</style>
