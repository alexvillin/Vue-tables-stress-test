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
            get() {
                return new Promise((resolve, reject) => {
                    if (typeof (Storage) !== "undefined") {
                        resolve(JSON.parse(localStorage.getItem(this.name) || "{}"));
                    } else {
                        reject(new Error('Sorry! No Web Storage support..'));
                    }
                })
            },
            set(data) {
                //TODO app.$toastr.success('Changed');
                localStorage.setItem(this.name, JSON.stringify(data));
                return data;
            },
        }
    },

}
