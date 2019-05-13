import _ from '../../utils/common'
let userData;
Page({

    data: {
        name: '',
        phone: '',
        state: true,

        provincial: '',
        areaSelectObjTemp: {
            province: {},
            city: {},
            area: {}
        }
    },

    onLoad: function(option) {

        this.setData({
            addressId: option.addressId || '',
            productId: option.productId || ''
        })

    },

    onShow() {
        let vm = this;


        userData = wx.getStorageSync('userData');
        vm.setData({
            addressData: wx.getStorageSync('addressData')
        })

        if (vm.data.addressId) {
            wx.setNavigationBarTitle({
                title: '编辑地址',

            })
            wx.showLoading({
                title: '加载中',
            })

            vm.getEditData();
        }


    },

    getInputVal(event) {

        let vm = this,
            name = event.currentTarget.dataset.name,
            obj = {};
        obj[name] = event.detail.value;

        vm.setData(obj);
    },

    // 获取编辑信息
    getEditData() {
        let vm = this;
        let urlParams = {};

        for (var key in _.urlParams) {
            urlParams[key] = _.urlParams[key];
        }


        urlParams.token = userData.token;
        urlParams.address_id = vm.data.addressId;

        wx.request({
            url: _.host.baseApi + '/api/account/address/get_address_detail', //仅为示例，并非真实的接口地址
            method: 'get',
            data: urlParams,
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                let data = res.data;
                if (data.code == 1) {

                    vm.data.areaSelectObjTemp = {
                        province:{
                            name: data.data[0].address_state,
                            code: data.data[0].address_state_id
                        },
                        city:{
                            name: data.data[0].address_city,
                            code: data.data[0].address_city_id
                        },
                        area:{
                            name: data.data[0].address_county,
                            code: data.data[0].address_county_id
                        }
                    }
                    vm.setData({
                        addressData: data.data[0],
                        name: data.data[0].address_name,
                        phone: data.data[0].address_mobile_phone,
                        provincial: data.data[0].address_state + ',' + data.data[0].address_city + ',' + data.data[0].address_county,
                        addressDetail: data.data[0].address_street,
                        areaSelectObjTemp:vm.data.areaSelectObjTemp
                    })

                }

                wx.hideLoading()
            }
        })

    },

    // 表单验证
    formCheck() {
        let vm = this;
        let phoneReg = /^((13[0-9])|(14[0-9])|(15[0-9])|(16[0-9])|(17[0-9])|(18[0-9])|(19[0-9]))\d{8}$/;
        let requireReg = /\S/;


        if (!requireReg.test(vm.data.name)) {
            wx.showToast({
                title: '请输入收件人',
                icon: 'none',
                duration: 1000
            })
            return;

        }
        if (!phoneReg.test(vm.data.phone)) {
            wx.showToast({
                title: '请输入正确的手机',
                icon: 'none',
                duration: 1000
            })
            return;
        }

        if (!requireReg.test(vm.data.provincial)) {
            wx.showToast({
                title: '请输入所在地区',
                icon: 'none',
                duration: 1000
            })
            return;
        }

        if (!requireReg.test(vm.data.addressDetail)) {
            wx.showToast({
                title: '请输入详情地址',
                icon: 'none',
                duration: 1000
            })
            return;
        }
           
        vm.submitData();

    },

    // 打开地址选择
    openSelectArea: function() {
        this.setData({
            showAreaSelect: true
        })
    },

    submitData() {
        let vm = this;
        let urlParams = {};
        let url = '';
        let msg = '';

        for (var key in _.urlParams) {
            urlParams[key] = _.urlParams[key];
        }
        urlParams.token = userData.token;
        urlParams.address_name = vm.data.name;
        urlParams.address_mobile_phone = vm.data.phone;

        urlParams.address_state_id = vm.data.areaSelectObjTemp.province.code;
        urlParams.address_city_id = vm.data.areaSelectObjTemp.city.code;
        urlParams.address_county_id = vm.data.areaSelectObjTemp.area.code;

        urlParams.address_street = vm.data.addressDetail;

        if (vm.data.addressId) {
            urlParams.address_book_id = vm.data.addressId;
            url = '/api/account/address/change_address';
            msg = '修改成功';
        } else {
            url = '/api/account/address/add_address';
            msg = '新增成功';
        }

        if (!vm.data.state) return;
        vm.setData({
            state: false
        })
        wx.request({
            url: _.host.baseApi + url, //仅为示例，并非真实的接口地址
            method: 'post',
            data: urlParams,
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                let data = res.data;
                if (data.code == 1) {

                    wx.showToast({
                        title: msg,
                        icon: 'none',
                        duration: 1000
                    })

                    if (vm.data.productId) {
                        setTimeout(function() {
                            wx.setStorageSync('addressData', data.data);
                            wx.navigateBack({
                                delta: 1
                            })

                        }, 1000)
                    } else {
                        setTimeout(function() {
                            wx.redirectTo({
                                url: '../address/address'
                            })
                        }, 1000)
                    }


                }
                
            },
            complete: function(res) {

                setTimeout(function() {
                    vm.setData({
                        state: true
                    })
                }, 1000)
                
            }
        })


    },

    // 触发获取选择完的地址信息
    getSelectData(event){

        let vm = this,
            provincial = '',
            areaSelectObj = event.detail;

        provincial = areaSelectObj.province.name + ',' + areaSelectObj.city.name + ',' + areaSelectObj.area.name;

        vm.setData({
            provincial:provincial,
            areaSelectObjTemp: event.detail,
            showAreaSelect:false
        })
    }

})