import Helper from '@/helper'

const lazyLoad = {

    bind: function(el, binding, vnode) {
        window.addEventListener('scroll', loadMoreCheck);
        
        function loadMoreCheck(){
            if (Helper.isElementBottomVisible(el)) {
                console.log(1);
                vnode.context.$emit('uploadMoreData');
            }
        } 
    },
    unbind: function(){
//        window.removeEventListener('scroll');
    }
};

export default lazyLoad;
