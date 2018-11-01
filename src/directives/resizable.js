import Vue from 'vue'
import Helper from '@/helper'
import Api from '@/api'
import Colgroup from '@/components/Colgroup.vue'

const ColgroupComponent = Vue.extend(Colgroup);
const DividerComponent = Vue.extend({
    //    template: '<div @mousedown="onMouseDown" class="divider">',
    render(h) {
        return h('div', {
            //TODO class resolving
            style: {
                position: 'absolute',
                width: '5px',
                height: '100%',
                top: 0,
                right: '0px',
                'z-index': 100,
                cursor: 'col-resize',
                'background-color': 'lightgray',
                'border-radius': '50%'
            },
            attrs: {
                class: 'divider',
            },
            on: {
                mousedown: this.onMouseDown
            }
        })
    },
    methods: {
        onMouseDown(e) {
            this.$emit('setMouseDownTarget', e.target.closest('th'));
        },
    }
})

const resizable = {

    bind: function (el, binding) {
        if(binding.value !== undefined && !binding.value){
            return;
        }
        let ths = el.querySelectorAll('th');
        let columnsNodes = createColumnNodes(el);
        let currentTarget;
        let targetIndex;
        let divider;
        let defaultColumnWidth = Math.ceil(Helper.getWindowWidth() / ths.length);
        let columnsSizes = {};

        document.addEventListener('mouseup', onMouseUp);
        document.addEventListener('mousemove', onMouseMove);

        //init 
        Api.localStorage.tableCellsWidth.get().then((response) => {
            [...ths].forEach((th, index) => {
                //mount dividers
                divider = new DividerComponent().$mount();
                th.appendChild(divider.$el);
                //listen to click
                divider.$on('setMouseDownTarget', function (target) {
                    currentTarget = target;
                    targetIndex = index;
                })
                //set default sizes
                if(!response[index]){
                    response[index] = defaultColumnWidth;
                }
                setElementWidth(index, response[index]);
            })
        })

        function createColumnNodes(el){
            el = el.tagName == 'TABLE'
                ? el
                : el.querySelector('table')

            let columns = el.querySelectorAll('col');
            let colgroup;

            if(!columns.length){
                colgroup = new ColgroupComponent({
                    propsData: {
                        amount: ths.length
                    }
                });
                colgroup.$mount();
                el.insertBefore(colgroup.$el, el.childNodes[0]);
                columns = colgroup.$el.childNodes;
            }
            return columns;
        }

        function setElementWidth(index, val) {
            columnsNodes[index].style.width = val + 'px';
            columnsSizes[index] = val;
        }

        function onMouseMove(e) {
            if (e.which && currentTarget) {
                let newWidth = e.pageX - currentTarget.offsetLeft;
                if (newWidth > 20) {
                    setElementWidth(targetIndex, newWidth);
                }
            }
        }

        function onMouseUp() {
            if (currentTarget) {
                //reset target
                currentTarget = false;
                commit();
            }
        }

        function commit() {
            Api.localStorage.tableCellsWidth.set(columnsSizes);
        }
    },
    unbind: function () {
    }
};

export default resizable;
