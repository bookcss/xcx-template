
import _ from 'utils/common'
import md5 from 'utils/md5'
import $ from './utils/request'
App({

    // 全局变量
    globalData: {
        isIphoneX: false,
        isShowLuckydraw: false
    },

    onShow: function(ops) {
        let vm = this;
        // 获取群分享信息
        if (ops.scene == 1036 || ops.scene == 1044) {
            this.globalData.shareTickets = ops.shareTicket;
        } else {
            delete this.globalData.shareTickets;
        }

        // 判断是否是iPhone X系列
        wx.getSystemInfo({
            success(res) {

                let model = res.model;
                if (model.indexOf('iPhone X') >= 0) {
                    vm.globalData.isIphoneX = true;
                }

            }
        })

    },

    // 登录授权
    getWxUiNew(callback, e) {
        let vm = this;
        if (!e.detail.userInfo) return;
        wx.login({
            success: function(res) {
                if (res.code) {

                    let params = {};
                    params.auth_code = res.code;
                    params.type = 1;
                    wx.getUserInfo({
                        success: function(gres) {
                            params.encryptedData = gres.encryptedData;
                            params.iv = gres.iv;
                            wx.request({
                                url: _.host + '/api/wx_auth_register',
                                method: 'post',
                                data: params,
                                header: {
                                    'content-type': 'application/json'
                                },
                                success: function(mainRes) {
                                    console.log(mainRes, '登录')
                                    let data = mainRes.data;
                                    if (data.code == 1) {
                                        wx.setStorageSync('userData', data.data);


                                        wx.showToast({
                                            title: "授权成功",
                                            icon: 'none',
                                            duration: 1500
                                        })

                                        setTimeout(function() {
                                            callback ? callback() : '';
                                        }, 1000)

                                    } else if (data.code == -4) {
                                        wx.showToast({
                                            title: "网络繁忙，请重新登陆",
                                            icon: 'none',
                                            duration: 1500
                                        })

                                    }

                                },
                                fail: function(res) {
                                    wx.showToast({
                                        title: res.data.msg,
                                        icon: 'none',
                                        duration: 1500
                                    })

                                }
                            })

                        }
                    })

                } else {
                    wx.showToast({
                        title: res.errMsg,
                        icon: 'none',
                        duration: 1000
                    })
                }
            }
        })

    }
    
})