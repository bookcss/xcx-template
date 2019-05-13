import _ from '../../utils/common'
const app = getApp()

Page({

    data: {
        addressList:[],
        isData:false
    },

    onLoad: function(option) {
        this.setData({
            productId: option.productId || ''
        })

    },

    onShow(){
        let vm = this;
        vm.setData({
            userData:wx.getStorageSync('userData'),
            addressData:wx.getStorageSync('addressData')
        })
        if (vm.data.userData) {
            vm.setData({
                token:vm.data.userData.token
            })
        }
        vm.getAddress()
       
    },

    getAddress(){

        let vm = this;
        let urlParams = {};
        for (var key in _.urlParams) {
            urlParams[key] = _.urlParams[key];
        }
           
        urlParams.token = vm.data.token;
        
        wx.request({
            url: _.host.baseApi + '/api/account/address/get_reciver_address_list',
            method: 'post',
            data: urlParams,
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                let data = res.data;
                if (data.code == 1) {
                        
                    vm.setData({
                        addressList: data.data,
                        isData:true
                    })
                    
                }
            }
        })
     
    },


    // 设置默认地址
    changeDefaultAddress(event){
        
        let vm = this;
        let urlParams = {};
        let addressId = event.currentTarget.dataset.id;
        let index = event.currentTarget.dataset.index;

        let isActive = vm.data.addressList[index].is_default;
        for (var key in _.urlParams) {
            urlParams[key] = _.urlParams[key];
        }
      
        urlParams.token = vm.data.token;
        urlParams.address_book_id = addressId;
        
        if (isActive == 1) return;

        wx.request({
            url: _.host.baseApi + '/api/account/address/set_address_default',
            method: 'post',
            data: urlParams,
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                let data = res.data;
                if (data.code == 1) {

                    for (var i = 0; i < vm.data.addressList.length; i++) {
                        vm.data.addressList[i].is_default = 0;
                    }
                    vm.data.addressList[index].is_default = 1;
                    vm.setData({
                        addressList:vm.data.addressList
                    })
                    if (vm.data.productId) {
                        let page = app.gotoPage('user-order-confirm');
                        wx.navigateBack({
                            delta: page
                        })
                       
                    }

                }
            }
        })

        
    },

    // 详情选择地址
    changeAddress(event){
        let vm = this;
        let index = event.currentTarget.dataset.index;
        
        wx.setStorageSync('addressData',vm.data.addressList[index]);
        if (vm.data.productId) {
            let page = app.gotoPage('user-order-confirm');
            wx.navigateBack({
                delta: page
            })
        }
    },

    // 删除地址
    del(event){
        let vm = this;
        let urlParams = {};
        let addressId = event.currentTarget.dataset.id;
        let index = event.currentTarget.dataset.index;

        for (var key in _.urlParams) {
            urlParams[key] = _.urlParams[key];
        }
           
        urlParams.token = vm.data.token;
        urlParams.address_book_id = addressId;
        
        wx.showModal({
          title: '提示',
          content: '确定要删除吗?',
          success: function(res) {
            if (res.confirm) {
                wx.request({
                    url: _.host.baseApi + '/api/account/address/disable_address',
                    method: 'post',
                    data: urlParams,
                    header: {
                        'content-type': 'application/json'
                    },
                    success: function(res) {
                        let data = res.data;
                        if (data.code == 1) {

                            vm.data.addressList.splice(index,1);
                            vm.setData({
                                addressList:vm.data.addressList
                            })

                            //防止地址已经删除后数据还在
                            if (vm.data.addressData) {
                                if (vm.data.addressData.address_book_id == addressId) {
                                    wx.removeStorageSync('addressData');
                                }
                            }
                            wx.showToast({
                              title: '删除成功',
                              icon: 'none',
                              duration: 1000
                            })
                        }else{
                            wx.showToast({
                              title: data.msg,
                              icon: 'none',
                              duration: 1000
                            }) 
                        }
                    }
                })

            } else if (res.cancel) {
            }
          }
        })
       
    }

   
 
})