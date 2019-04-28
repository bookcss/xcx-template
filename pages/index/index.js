//index.js

import _ from '../../utils/common'
import $ from '../../utils/request'

const app = getApp()
let [actividyPage, recommendPage, isSkip] = [,,true];
let [userData,deviceId] = [,wx.getStorageSync('deviceId')];

// 红包ID
let [gift_id,getRedPackType] = [,false];
// banner域名白名单
let whiteNames = ['panda.huodao.hk']

let pageObj = {

  data: {
    // 活动
    searchActivityData: '',

    isSkip: true,
    isScroll: true,
    allData: '',
    navWidth: 70,
    navIndex: 0,

    // 活动分页
    activityData: [],

    // 推荐分页
    recommendData: [],
    isfull: false,
    isData: false,

    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 200,
    circular: true,

    // 红包
    redpack: null,
    redpackcb: false,

    // 抽奖弹框
    lotteryBox: false,
    lotteryImg: null,
    lotteryUrl: null,
    lotteryType: null
  },

  onLoad: function(options) {

    let vm = this

    _.getDevice();

    vm.init();

    let redPack = wx.getStorageSync('alreadyGetRedPack')

    this.getLuckydrawInfo().then((data) => {
      if (!app.globalData.isShowLuckydraw) {

        this.isShowLuckydrawFun(data)

      }
    }).catch((data) => {
      console.log('error')
      // 没有广告弹出再弹出新人红包
      if (!redPack) {
        this.getRedPack(); // 弹层领取红包
      }
    })

 
    wx.showShareMenu({
      withShareTicket: true
    })

  },

  onShow: function() {

    userData = wx.getStorageSync('userData');

  },

  onHide: function() {

  },

  init() {

    let vm = this;

    actividyPage = 1;
    recommendPage = 1;

    vm.getALLData();

    isSkip = true;
    userData = wx.getStorageSync('userData');

  },

  // 上拉加载
  onPullDownRefresh() {

    let vm = this;
    vm.setData({
      isfull: false,
      recommendData: []
    })

    this.init();
    wx.stopPullDownRefresh();
  },
  // // 下拉加载数据
  // onLoadBottm: function() {
  //     if (!this.data.isfull) {
  //         this.getALLData();
  //     }
  // },

  onReachBottom: function() {
    let vm = this;
    if (!vm.data.isfull) {

      vm.getALLData();
    }
  },

  //获取广告接口数据
  getLuckydrawInfo() {


    return new Promise((resolve, reject) => {
      $.ajax({
        url: `${_.host.drawApi}/api/luckydraw/adlist`,
        method: 'POST',
        data: {
          ad_type: 2
        }
      }).then((res) => {
        if (res.data && res.data.content && res.data.content.length > 0) {
          resolve(res.data)
        } else {
          reject()
        }
      }).catch(() => {
        reject()
      })
    })
  },
  // 是否展示广告
  isShowLuckydrawFun(data) {

    if (!(data.content && data.content.length > 0)) {
      return false
    }
    // 记录当前进入已弹出广告
    app.globalData.isShowLuckydraw = true
    if (wx.getStorageSync('luckydrawTimes')) {
      
      let luckydrawTimes = wx.getStorageSync('luckydrawTimes')
      luckydrawTimes++
      // 大于弹层次数不再弹出
      if ((luckydrawTimes > data.times) && data.times != 0) {
        return false
      }
      wx.setStorage({
        key: 'luckydrawTimes',
        data: luckydrawTimes,
      })
    } else {
      wx.setStorage({
        key: 'luckydrawTimes',
        data: 1,
      })
    }
    // 弹出广告
    this.setData({
      lotteryBox: true,
      lotteryImg: data.content[0].img,
      lotteryUrl: data.content[0].url,
      lotteryType: data.content[0].type
    })
  },

  // 搜索 begin    
  openSearch() {
    wx.navigateTo({
      url: '../commodity/commodity?enterType=1'
    })
  },

  getALLData() {
    var vm = this;

    var urlParams = {};

    for (var key in _.urlParams) {
      urlParams[key] = _.urlParams[key];
    }
    urlParams.activity_page = actividyPage;
    urlParams.recommend_page = recommendPage;
    urlParams.device_id = deviceId;
    if (userData) {
      urlParams.user_id = userData.userId;
    }
    urlParams.v = '4.1.0';


    if (vm.data.isData) return;
    vm.setData({
      isData: true
    })
    wx.request({
      url: _.host.baseApi + '/api/home/app_home_v3',
      method: 'get',
      data: urlParams,
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        let data = res.data;
        if (data.code == 1) {

          // 判断如何刷新的话
          if (actividyPage == 1) {
            vm.data.activityData = data.data.activity_banber_list;
          } else {
            vm.data.activityData.push.apply(vm.data.activityData, data.data.activity_banber_list);
          }

          if (data.data.recommend_list) {

            if (vm.data.recommendPage == 1) {
              vm.data.recommendData = data.data.recommend_list;
            } else {
              vm.data.recommendData.push.apply(vm.data.recommendData, data.data.recommend_list);
            }
            recommendPage++;
            // 推荐产品

            // 推荐数量等于0时就结束
            if (data.data.recommend_list.length == 0) {
              vm.setData({
                isfull: true
              })
            }
          } else {
            actividyPage++;
          }

          if (data.data.red_envelope.length > 0) {
            let windowWidth = wx.getSystemInfoSync().windowWidth
            vm.setData({
              redpack: data.data.red_envelope[0].img_url
            })
          }

          if (actividyPage == 2) {

            let bannerList = vm.filterBannerList(data.data.bannerList)

            vm.setData({
              banner: bannerList,
              allData: data.data,
            })
          }
          vm.setData({
            activityData: vm.data.activityData,
            recommendData: vm.data.recommendData
          })

        }
      },
      complete: function() {
        vm.setData({
          isData: false
        })
      }
    })
  },
  // 过滤banner不支持的域名地址
  filterBannerList(bannerList) {
    return bannerList.filter((item) => {
      if (item.banner_link_url.indexOf('http') >= 0) {
        let httpName = item.banner_link_url.split('/')
        return whiteNames.includes(httpName[2])
      } else {
        return item
      } 
    })
  },
  // 关闭红包弹层
  closeRedPack() {
    this.setData({
      redpackcb: false
    })
    getRedPackType = false
  },
  // 初始化红包获取活动ID gift_id
  getRedPack(cb) {
    let vm = this
    let device_id = wx.getStorageSync('deviceId')
    userData = wx.getStorageSync('userData')
    wx.request({
      url: _.host.baseApi + '/api/home/new_home_push_new_coupon',
      method: 'get',
      data: {
        device_id: device_id,
        user_id: userData.userId
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        if (res.data.code == 1) {
          gift_id = res.data.data.bonus_list.gift_id
          vm.setData({
            redpackcb: res.data.data.bonus_list.bonus_box_img
          })
          wx.setStorage({
            key: 'alreadyGetRedPack',
            data: res.data.data.bonus_list.bonus_box_img,
          })
          wx.setStorage({
            key: 'gift_id',
            data: res.data.data.bonus_list.gift_id
          })
        }
      },
      complete: function() {
        cb && cb()
      }
    })
  },
  //领取红包接口
  getGiftBonus() {
    let vm = this;
    let device_id = wx.getStorageSync('deviceId')
    userData = wx.getStorageSync('userData')
    gift_id = wx.getStorageSync('gift_id')
    
    wx.request({
      url: _.host.baseApi + '/api/account/coupons/get_gift_bonus',
      method: 'post',
      data: {
        gift_id: gift_id,
        token: userData.token
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.code == '-400') {
          wx.navigateTo({
            url: '../auth/auth'
          })
          return
        }
        if (res.data.code) {
          vm.setData({
            redpackcb: res.data.data.url,
            redpack: false
          })
        } else {
          vm.setData({
            redpackcb: false
          })
        }
      },
      complete: function () {
        getRedPackType = false
      }
    })
  },
  //点击领取红包
  immdGetRedPack() {
    if(!userData){
      wx.navigateTo({
        url: '../auth/auth'
      })
      return
    }
    let vm = this;
    if (getRedPackType) {
      return
    }
    getRedPackType = true
    gift_id = wx.getStorageSync('gift_id')
    if (!gift_id) {
      vm.getRedPack(function(){
        vm.getGiftBonus()
      })
    } else {
      vm.getGiftBonus()
    }
  },
  // 获取未来时间
  addDate(date, days) {
    var d = new Date(date);
    d.setDate(d.getDate() + days);
    return d.getTime();
  },

  gotowap(e) {
    let url = e.currentTarget.dataset.url;
    let type = e.currentTarget.dataset.type;

    if (type == 1) {
      // 跳转小程序内部页面
      wx.navigateTo({
        url: url
      })
      return;
    }

    // 其他就是跳页面
    url += '&device_id=' + deviceId;
    if (userData.userId) {
      url += '&user_id=' + userData.userId;
    }
    wx.navigateTo({
      url: '../activity/activity?url=' + encodeURIComponent(url)
    })
  },


  // icon跳转
  // '1' => '今日上新',
  // '2' => '手机评测',
  // '3' => '领券',
  // '4' => '安卓精选',
  // '5' => '筛选分类',
  // '6' => '筛选价格',
  // '7' => 'H5页面',
  // '8' => '租赁',
  // '9' => '邀请好友',
  // '10' => '配件商城',
  // '11' => '活动' 
  // '14' => '秒杀' 
  // '19' => '砍价' 
  // '20' => '拼团' 
  // '21' => '一分钱抽奖' 
  gotolink(e) {

    let vm = this,
      currentTarget = e.currentTarget,
      type = currentTarget.dataset.type,
      url = currentTarget.dataset.url,
      typeId = currentTarget.dataset.typeid,
      brandId = currentTarget.dataset.brandid,
      modelId = currentTarget.dataset.modelid,
      name = currentTarget.dataset.name,
      minPrice = currentTarget.dataset.minprice,
      maxPrice = currentTarget.dataset.maxprice;

    if (type == 1) {
      wx.navigateTo({
        url: '../hot-product/hot-product'
      })
    } else if (type == 2) {
      wx.navigateTo({
        url: '../check-viedo/check-viedo'
      })
    } else if (type == 10) {
      wx.navigateTo({
        url: '../parts/parts'
      })
    } else if (type == 5) {
      wx.navigateTo({
        url: '../commodity/commodity?typeId=' + typeId + '&brandId=' + brandId + '&modelId=' + modelId + '&name=' + name
      })
    } else if (type == 6) {
      wx.navigateTo({
        url: '../commodity/commodity?price=' + minPrice + '-' + maxPrice
      })
    } else if (type == 7) {
      url = url.split('?');
      wx.navigateTo({
        url: '../activity/activity?url=' + encodeURIComponent(url[0])
      })
    } else if (type == 11) {
      wx.navigateTo({
        url: '../activity-list/activity-list?typeId=' + typeId
      })

    } else if (type == 14) {
      wx.navigateTo({

        url: '../spike-list/spike-list'

      })
    } else if (type == 19) {
      wx.navigateTo({
        url: '../bargain-list/bargain-list'
      })
    } else if (type == 20) {

      // wx.navigateTo({
      //   url: '../lottery-list/lottery-list'
      // })
      wx.navigateTo({
        url: '../pt/index/index'
      })
    
    } else if (type == 21) {
      wx.navigateTo({
        url: '../lottery-list/lottery-list'
      })

    }

  },

  gotoDetail(e) {
    let vm = this,
      currentTarget = e.currentTarget,
      pid = currentTarget.dataset.pid;

    wx.navigateTo({
      url: '../commodity-detail/commodity-detail?productId=' + pid
    })
  },


  // 跳到抽奖列表
  gotoLottery(e) {

    let url = e.currentTarget.dataset.url
    let type = e.currentTarget.dataset.type

    if (type == 1) {
      // 跳转小程序内部页面
      wx.navigateTo({
        url: url
      })
      // 关闭广告
      this.setData({
        lotteryBox: false
      })
    } else if (type == 2) {
      // 其他就是跳页面
      url += '&device_id=' + deviceId;
      if (userData.userId) {
        url += '&user_id=' + userData.userId;
      }
      // 关闭广告
      this.setData({
        lotteryBox: false
      })
      wx.navigateTo({
        url: '../activity/activity?url=' + encodeURIComponent(url)
      })
    }

  },

  // 隐藏弹框
  hideSendBox(e) {
    let vm = this,
        index = e.currentTarget.dataset.index,
        name = e.currentTarget.dataset.name;

    if (index == 0) {
        let obj = {};
        obj[name] = false;
        vm.setData(obj)
    }
  },

  // 获取FormId
  getFormId(e){
    app.collectionFormId(e.detail.formId);
  }



};

Page(pageObj);