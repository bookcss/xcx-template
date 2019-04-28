import _ from '../../utils/common'
const app = getApp();

let actividyPage =1;

let userData,
    deviceId;

Page({

    data: {
        // 活动分页
        activityData:[],
        isfull:false,
        isData:false

    },

    onLoad: function(options) {

        var vm = this;
        
        wx.showShareMenu({
          withShareTicket: true
        })

        vm.setData({
            typeId:options.typeId
        })

        actividyPage = 1;
        vm.getALLData();

    },

    onShow: function() {
        let vm = this;


        userData = wx.getStorageSync('userData');
        deviceId = wx.getStorageSync('deviceId');
      
    },
 

    // 下拉加载数据
    onReachBottom: function() {
        let vm = this;
        if (!this.data.isfull) {
           
            vm.getALLData();
        }
    },

    getALLData(){
        var vm = this;

        var urlParams = {};

        for (var key in _.urlParams) {
            urlParams[key] = _.urlParams[key];
        }
        urlParams.page = actividyPage;
        urlParams.cate = vm.data.typeId;

        if (vm.data.isData) return;
        vm.setData({
            isData: true
        })
        wx.request({
            url: _.host + '/api/get_cate_activity_list', 
            method: 'get',
            data: urlParams,
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                let data = res.data;
                if (data.code == 1) {

                    vm.data.activityData.push.apply(vm.data.activityData, data.data.list);

                    // 判断总页数是否相等
                    if ((actividyPage-1) * 8 + data.data.list.length == data.data.list_count) {
                        vm.setData({
                            isfull:true
                        })
                    }
                    actividyPage++;
                    vm.setData({
                        activityData:vm.data.activityData,
                        isData:false
                    })
                }

            }
        })
    },

    gotowap(e){
        let url = e.currentTarget.dataset.url;
        
        // 用这种方式是因为地址的参数太长显示不全
        url += '&device_id='+deviceId;
        if (userData.userId) {
            url += '&user_id=' + userData.userId;
        }
        wx.setStorageSync('wapUrl', url);
        wx.navigateTo({
          url: '../activity/activity?url=' + encodeURIComponent(url) 
        })
    }
  
})