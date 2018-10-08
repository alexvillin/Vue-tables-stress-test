import Vue from 'vue'
import "./plugins/axios.js"
import Notifications from 'vue-notification'
Vue.use(Notifications)

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
                        Vue.notify({
                            group: 'api',
                            type: 'error',
                            title: 'Important message',
                            text: 'Sorry! No Web Storage support..'
                        })
                        reject(new Error('Sorry! No Web Storage support..'));
                    }
                })
            },
            set(data) {
                Vue.notify({
                    group: 'api',
                    type: 'success',
                    title: 'Local Storage',
                    text: 'Table dimentions saved!'
                })
                localStorage.setItem(this.name, JSON.stringify(data));
                return data;
            },
        }
    },

}
