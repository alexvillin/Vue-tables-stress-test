import Vue from 'vue'
import "./plugins/axios.js"
import Notifications from 'vue-notification'
Vue.use(Notifications)

export default {
    table: {
        get(url) {
            return Vue.axios.get(url)
                .catch((e) => {
                    Vue.notify({
                        group: 'api',
                        type: 'error',
                        title: 'Error',
                        text: e.message
                    })
                });
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
                try {
                    localStorage.setItem(this.name, JSON.stringify(data));
                    Vue.notify({
                        group: 'api',
                        type: 'success',
                        title: 'Local Storage',
                        text: 'Table dimentions saved!'
                    })
                    return data;
                } catch (error) {
                    console.error(error);
                    return false;
                }
            },
            //TODO add remove item
        }
    },

}
