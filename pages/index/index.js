

import _ from '../../utils/common'
import $ from '../../utils/request'

let pageObj = {

  data: {
     defaultSize: 'default',
      primarySize: 'default',
      warnSize: 'default',
      disabled: false,
      plain: false,
      loading: false
  },

  // 打开页面第一次触发
  onLoad: function(options) {

  },

  // 每次打开页面触发
  onShow: function() {


  },

  // 页面关闭时触发
  onHide: function() {

  },

  // 初始化
  init() {


  },

  // 上拉加载
  onPullDownRefresh() {

  },

  gotoLink() {
    wx.navigateTo({
        url: '../address/address'
    })
  }

};

Page(pageObj);