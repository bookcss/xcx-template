import _ from '../../utils/common'
const app = getApp();
Page({

    data: {
        navIndex: 0,
        wxInfo:{}
    },

    onLoad: function() {

        let vm = this;
        wx.showShareMenu({
            withShareTicket: true
        })

        
    },

    onShow() {
        let vm = this;

        vm.init();
    },

    init() {
        let vm = this;

        vm.setData({
            userData: wx.getStorageSync('userData') 
        })
        if (vm.data.userData) {

            // wx.getUserInfo({
            //     success(res) {
            //         console.log(1111)
            //         vm.data.wxInfo.user_name = res.userInfo.nickName;
            //         vm.data.wxInfo.avatar = res.userInfo.avatarUrl;
            //         vm.setData({
            //             wxInfo: vm.data.wxInfo
            //         })
            //     }
            // })
            vm.getList();
            vm.getDot();
        }
    },


    gotologin() {
        let vm = this;

        if (!vm.data.userData) {
            wx.navigateTo({
                url: '../auth/auth'
            })
            return;
        }
       
    },
    
    // 获取个人红点
    getDot() {
        let vm = this;
        let urlParams = {};

        for (let key in _.urlParams) {
            urlParams[key] = _.urlParams[key];
        }
        urlParams.token = vm.data.userData.token;
        wx.request({
            url: _.host + '/api/account/setting/get_remind_counts',
            method: 'get',
            data: urlParams,
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                let data = res.data;
                if (data.code == 1) {

                    vm.setData({
                        redDotCount: data.data.count
                    })
                }
            }
        })

    },
    // 获取订单条数
    getList() {
        let vm = this;
        let urlParams = {};

        for (let key in _.urlParams) {
            urlParams[key] = _.urlParams[key];
        }
        urlParams.token = vm.data.userData.token;
        wx.request({
            url: _.host + '/api/account/order/all_order_count',
            method: 'get',
            data: urlParams,
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                let data = res.data;
                if (data.code == 1) {

                    vm.setData({
                        orderNum: data.data
                    })
                }
            }
        })

    },

    linkRoute(event) {
        let vm = this;
        let name = event.currentTarget.dataset.name;
        let state = event.currentTarget.dataset.state;

        if (name == 'no') {
            wx.showModal({
                title: '提示',
                content: '请下载找靓机APP并使用微信登录哦',
                showCancel: false,
                confirmText: '知道了'
            })
            return;
        }
        if (!vm.data.userData) {

            wx.navigateTo({
                url: '../auth/auth'
            })
         
            return;

        } else {
            if (state) {
                wx.navigateTo({
                    url: '../' + name + '/' + name + '?state=' + state
                })
            } else {
              if(name == 'pt'){
                wx.navigateTo({
                  url: '../' + name + '/user-order/user-order'
                })
              }else{
                wx.navigateTo({
                  url: '../' + name + '/' + name
                })
              }
                
            }

        }
    },
    phoneCall(event) {

        let phone = event.currentTarget.dataset.phone;
        wx.makePhoneCall({
            phoneNumber: phone
        })
    },

    openSetting(){

        let vm = this;
        if (vm.data.userData) {
            wx.navigateTo({
                url: '../setting/setting'
            })
        }
       
    }

})