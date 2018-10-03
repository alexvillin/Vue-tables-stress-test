import Vue from 'vue'
import "./plugins/axios.js"

export default {
    table: {
        get: function (url) {
            return Vue.axios.get(url);
        }
    },
    localStorage: {
        tableCellsWidth: {
            name: 'tableCellsWidth',
            get: function () {
                return new Promise(function (resolve, reject) {
                    if (typeof (Storage) !== "undefined") {
                        console.log('"this" in api::'+ this );
                        resolve(JSON.parse(localStorage.getItem('dimentions') || "{}"));
                    } else {
                        reject(new Error('Sorry! No Web Storage support..'));
                    }
                })
            },
            set: function (data) {
                //app.$toastr.success('Changed');
                localStorage.setItem('dimentions', JSON.stringify(data));
                return data;
            },
        }
    },

}
