// component/fixed-icon/fixed-icon.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    home: {
      type: Boolean,
      value: false
    },
    top: {
      type: Boolean,
      value: false
    },
    service: {
      type: Boolean,
      value: false
    },
    isTab: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
  },
  /**
   * 组件的方法列表
   */
  methods: {
    backToTop() {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300
      })
    },
    goHome() {
      wx.switchTab({
        url: '../index/index'
      })
    }
  }
})
