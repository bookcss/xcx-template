
import _ from '../../utils/common'
const app = getApp()

let pageObj = {

    data: {
        // 活动
        searchActivityData:'',

        navIndex: 0,
        scrollTop:0,
        isScroll:true
    },
    
    onLoad: function() {

        let vm = this;

        vm.init();

        wx.showShareMenu({
          withShareTicket: true
        })
   
        
    },
   
    init() {
        let vm = this;

        let urlParams = {};

        for (var key in _.urlParams) {
            urlParams[key] = _.urlParams[key];
        }

        urlParams.v = '6.0.0';
        
        wx.request({
            url: _.host.baseApi + '/api/product/new_get_product_cate_v1',
            method: 'get',
            data: urlParams,
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                let data = res.data;
                if (data.code == 1) {
                    vm.setData({
                        productData: data.data,
                        productInfo: data.data[vm.data.navIndex]
                    
                    })
                }
            }
        })

    },

    changeNav(event){
        let vm = this;
        let index = event.currentTarget.dataset.index;


        vm.setData({
            productInfo:''
        })
        vm.setData({
            productInfo: vm.data.productData[index],
            navIndex: index,
            scrollTop:0
        })
        
       
    },

    // 搜索 begin    
    openSearch(){
        wx.navigateTo({
            url: '../commodity/commodity?enterType=1'
        })
    },

    // 跳转活动
    gotoActivity(event){

        let vm = this,
            url = event.currentTarget.dataset.url;

        if (!url) return;
        
        wx.navigateTo({
            url: '../activity/activity?url=' + encodeURIComponent(url) 
        })
    }

}

Page(pageObj);