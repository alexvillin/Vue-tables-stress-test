import Helper from '@/helper'

const lazyLoad = {

    bind: function(el, binding, vnode) {
        window.addEventListener('scroll', loadMoreCheck);
        
        function loadMoreCheck(){
            if (Helper.isElementBottomVisible(el)) {
                vnode.context.$emit('uploadMoreData');
            }
        } 
    },
};

export default lazyLoad;
