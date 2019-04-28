import _ from '../../utils/common'
const app = getApp();

let fTime,timeTemp,timeTemp1;
let thisPage = 1;

// 晒单类型
let evaluation_type ;
Page({

    data: {

        navIndex:0,

        // 分类切换
        thisTypeData:{
            brand_type:0,
            title:'全部'
        },
        selectSatus:false,
        selectMenu:[],

        // 浮动数据
        floatData:'',
        floatStatus:false,
        floatIndex:0,
        floatTime:'',

        sunburnlistData: [],
       
        listData: [],
        listImgData: {},
        isfull: true,
        isData: false
    },

    onLoad: function(options) {
        let vm = this;
        wx.showShareMenu({
            productId:options.productId,
            withShareTicket: true
        })
        evaluation_type = 0;
        vm.init();
        vm.getFloatData();
        vm.isSunburn();
    },

    onShow() {
        let vm = this;
        vm.setData({
            userData: wx.getStorageSync('userData') || ''
        })
    },

    // 清除定时器
    onHide(){
        fTime = null;
        timeTemp = null;
        timeTemp1 = null;
    },

    onPullDownRefresh(){
        this.init();
        wx.stopPullDownRefresh();
    },

    init(){
       
        let vm = this;

        vm.setData({
            userData: wx.getStorageSync('userData') || '',
            isfull:true
        })

        thisPage = 1;
        
        vm.getData();
        
    },

    onReachBottom() {
        let vm = this;
        if (vm.data.isfull) {
           
            vm.getData();
        }
    },

    // 切换晒单类型
    changeNav(e){
        let vm = this,
            index = e.currentTarget.dataset.index,
            type = e.currentTarget.dataset.type;

        vm.setData({
            isfull:true,
            navIndex:index
        })
        evaluation_type = type;
        thisPage = 1;
        vm.getData();
    },

    // 获取数据
    getData() {
        let vm = this;
        let urlParams = {};
        for (var key in _.urlParams) {
            urlParams[key] = _.urlParams[key];
        }

        urlParams.page = thisPage;
        urlParams.token = vm.data.userData.token;
        urlParams.brand_type = vm.data.thisTypeData.brand_type;
        urlParams.evaluation_type = evaluation_type;

        if (vm.data.productId) {
            urlParams.product_id = vm.data.productId; 
        }
        
        if (vm.data.isData) return;
        vm.setData({
            isData: true
        })
        wx.request({
            url: _.host + '/api/account/shaidan/new_review_list',
            method: 'get',
            data: urlParams,
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                wx.hideLoading()
                let data = res.data;

                if (data.code == 1) {
                    
                    // 图片压缩100x100
                    for (let i = 0; i < data.data.review_list.length; i++) {
                        if (data.data.review_list[i].avatar.indexOf('image.huodao.hk') > 0) {
                            data.data.review_list[i].avatar = data.data.review_list[i].avatar + '-100x100';
                        }
                    }

                    // 判断是否刷新
                    if (thisPage == 1) {
                        vm.data.listData = data.data.review_list;

                    }else{
                        vm.data.listData.push.apply(vm.data.listData,data.data.review_list);
                    }


                    if (thisPage < 2) {
                        vm.data.selectMenu = data.data.brand_type;
                    }

                    thisPage++;
                    if (data.has_more_page != '1') {
                        vm.data.isfull = false;
                    }

                    vm.setData({
                        listType:data.data.evaluation_type,
                        listData: vm.data.listData,
                        selectMenu:vm.data.selectMenu,
                        isfull: vm.data.isfull,
                        isData:false
                    })
                  
                }else{
                    wx.showToast({
                        title: data.msg,
                        icon: "none",
                        duration: 2000
                    })
                }


            },
            fail: function(res) {
                 vm.setData({
                    isData:false
                })
            }
        })

    },
    hideSelectBox(){
        let vm = this;
        vm.setData({
            selectSatus:false
        })
    },
    // 打开分类切换
    openSelect(){

        let vm = this;
        vm.setData({
            selectSatus: !vm.data.selectSatus
        })
    },

    // 选择分类
    selectType(e){
        let vm = this,
            index = e.currentTarget.dataset.index;
        vm.setData({
            navIndex:0,
            isfull:true,
            thisTypeData: vm.data.selectMenu[index],
            selectSatus:false
        })

        evaluation_type = 0 ;
        thisPage = 1;
        vm.getData();
    },

    //获取浮层数据
    getFloatData(){
        let vm = this;
        let urlParams = {};

        for (var key in _.urlParams) {
            urlParams[key] = _.urlParams[key];
        }
        if (vm.data.floatTime) {
            urlParams.current_time = vm.data.floatTime;
        }

        wx.request({
            url: _.host + '/api/account/shaidan/get_float_data',
            method: 'get',
            data: urlParams,
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                let data = res.data;
                if (data.code == 1) {
                
                    if (data.data.length == 0) return;
                    vm.setData({
                        floatData: data.data[vm.data.floatIndex],
                        floatStatus: true
                    })
                    fTime = setInterval(function(){
                        vm.data.floatIndex ++ ;
                        if (vm.data.floatIndex <= data.data.length) {
                            vm.setData({
                                floatData: data.data[vm.data.floatIndex],
                                floatStatus: true
                            })
                            timeTemp = setTimeout(function(){
                                vm.setData({
                                    floatStatus: false
                                })
                                timeTemp = null;
                            }, 1500)
                        }else{

                            vm.data.floatIndex = 0;
                            vm.data.floatTime = data.data[vm.data.floatIndex].buy_time;
                            vm.setData({
                                floatIndex: vm.data.floatIndex,
                                floatTime: vm.data.floatTime
                            })
                            vm.getFloatData();
                            clearInterval(fTime);
                        }
                    }, 1000 * 60)

                    timeTemp1 = setTimeout(function(){
                        vm.setData({
                            floatStatus: false
                        })

                        timeTemp1 = null;
                    }, 1500)

                }

            }
        })
       
    },
  
    //检测是否可晒单
    isSunburn() {
        let vm = this;
        let urlParams = {};
        let url = '';
        //没登陆，去登陆获取数据
        if (!vm.data.userData) {
            return;
        }
        for (var key in _.urlParams) {
            urlParams[key] = _.urlParams[key];
        }

        urlParams.token = vm.data.userData.token;
        wx.request({
            url: _.host + '/api/account/shaidan/get_shaidan_list',
            method: 'get',
            data: urlParams,
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                let data = res.data;

                if (data.code == 1) {
                    vm.setData({
                        sunburnlistData: data.data
                    })
                } else {
                    wx.showToast({
                        title: data.msg,
                        icon: "none",
                        duration: 2000
                    })
                }
            }
        })

    },

    //晒单跳转 vm.data.sunburnlistData.length ==1 跳发布晒单界面，>1跳可晒单列表
    sunburnJump(event) {
        let vm = this,
            orderNo = event.currentTarget.dataset.orderno,
            img = event.currentTarget.dataset.img,
            name = event.currentTarget.dataset.name;
        if (vm.data.sunburnlistData.length == 1) {
            wx.navigateTo({
                url: '../list-sunburn/list-sunburn?order_no=' + orderNo + '&main_pic=' + img + '&product_name=' + name
            })
        } else {
            wx.navigateTo({
                url: '../user-order/user-order?state=4'
            })
        }
    },

    //点赞
    thumbsUp(e) {
        let vm = this,
            index = e.currentTarget.dataset.index,
            reviewid = e.currentTarget.dataset.reviewid,
            thumbstype = e.currentTarget.dataset.thumbstype;
        let urlParams = {};

        //没登陆，去登陆获取数据
        
        if (!vm.data.userData) {
            wx.navigateTo({
               url: '../auth/auth'
            })
            return;
        }
       
        for (var key in _.urlParams) {
            urlParams[key] = _.urlParams[key];
        }
        urlParams.token = vm.data.userData.token;
        urlParams.review_id = reviewid;
        urlParams.type = thumbstype;
        wx.request({
            url: _.host + '/api/account/shaidan/add_userful',
            method: 'post',
            data: urlParams,
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                let data = res.data;
                if (data.code == 1) {

                    if (thumbstype == 1) {
                        vm.data.listData[index].is_add_usefull = 1;
                    }
                    if (thumbstype == 2) {
                        vm.data.listData[index].is_add_usefull = 0;
                    }
                    vm.data.listData[index].useful_num = data.data.count;
                    vm.setData({
                        listData: vm.data.listData
                    })

                } else {
                    wx.showToast({
                        title: data.msg,
                        icon: "none",
                        duration: 2000
                    })
                }



            }
        })


    },
   
    //评论跳转
    gotowap(e) {
        let url = e.currentTarget.dataset.url;

        // 用这种方式是因为地址的参数太长显示不全
        url += '&device_id=' + this.data.deviceId;
        if (this.data.userId) {
            url += '&user_id=' + this.data.userId;
        }
        wx.setStorageSync('wapUrl', url);
        wx.navigateTo({
            url: '../activity/activity'
        })
    },

    // 打开预览
    openImgView(event) {
        let vm = this;
        let index = event.currentTarget.dataset.index;
        let sourcelist = event.currentTarget.dataset.sourcelist;
        let newArr = [];
        for (var i = 0; i < sourcelist.length; i++) {
            newArr.push(sourcelist[i].url);
        }
        wx.previewImage({
            current: newArr[index],
            urls: newArr // 需要预览的图片http链接列表
        })
    },
    
    // 跳转详情
    openDetail(e){
        let vm = this;
        let reviewid = e.currentTarget.dataset.reviewid;
        wx.navigateTo({
            url: '../list-detail/list-detail?reviewid='+reviewid
        })
    },
    
    goRelated(e) {
        let vm = this;
        let url = e.currentTarget.dataset.url;
        wx.navigateTo({
            url: url
        })
    }
})