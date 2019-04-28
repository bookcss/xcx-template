
const _ = require('../../utils/common.js').default;

let userData;

Component({
  /**
   * 组件的属性列表
   */
  properties: {
      isOpen:{
        type:Boolean,
        value:false
      }
  },

  /**
   * 组件的初始数据
   */
  data: {
    pid: 0,
    province: {},
    city: {},
    area: {},
    areaLevel: 0,
    areaSelectObj: {
        province: {},
        city: {},
        area: {}
    },
    areaSelectObjTemp: {
        province: {},
        city: {},
        area: {}
    }
  },
 
  ready(){

    userData = wx.getStorageSync('userData');
    this.getArea(0,0)
    
  },


  /**
   * 组件的方法列表
   */
  methods: {

    // 获取地区数据
    getArea(type, pid) {

        let vm = this,
            urlParams = {};

        for (var key in _.urlParams) {
            urlParams[key] = _.urlParams[key];
        }


        urlParams.token = userData.token;
        urlParams.pid = pid;

        wx.request({
            url: _.host + '/api/account/address/get_address_list', //仅为示例，并非真实的接口地址
            method: 'get',
            data: urlParams,
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                let data = res.data;
                if (data.code == 1) {

                    let areaData = data.data;

                    for (let i = 0; i < areaData.length; i++) {
                        if (type == 0) {
                            vm.data.province = areaData;
                        } else if (type == 1) {
                            vm.data.city = areaData;
                        } else if (type == 2) {
                            vm.data.area = areaData;
                        }
                    }

                    vm.setData({
                        areaLevel: type,
                        province: vm.data.province,
                        city: vm.data.city,
                        area: vm.data.area
                    })

                }
            }
        })

    },

    // 地区选择
    areaChange(event) {
        let vm = this,
            level = event.currentTarget.dataset.level;

        if (level == 0) {

            // 选择省份
            vm.data.areaSelectObj.city = {};
            vm.data.areaSelectObj.area = {};

        } else if (level == 1) {
            // 选择城市
            vm.data.areaSelectObj.area = {};
        }

        vm.setData({
            areaLevel: level,
            areaSelectObj:vm.data.areaSelectObj
        })
    },

    // 选中地区
    selectArea(event) {

        let vm = this,
            type = event.currentTarget.dataset.type,
            pid = event.currentTarget.dataset.pid,
            name = event.currentTarget.dataset.name;

        if (type == 1) {
            // 选择省份
            vm.data.areaSelectObj.province.name = name;
            vm.data.areaSelectObj.province.code = pid;

        } else if (type == 2) {
            // 选择城市
            vm.data.areaSelectObj.city.name = name;
            vm.data.areaSelectObj.city.code = pid;

        } else if (type == 3) {

            // 选择地区
            vm.data.areaSelectObj.area.name = name;
            vm.data.areaSelectObj.area.code = pid;

            vm.data.areaSelectObjTemp = JSON.parse(JSON.stringify(vm.data.areaSelectObj));

            // 触发父组件方法
            vm.triggerEvent('customevent', vm.data.areaSelectObjTemp) 
        }

        if (type != 3) {
            vm.getArea(type, pid);
        }

        vm.setData({
            pid: pid,
            areaSelectObj:vm.data.areaSelectObj,
            areaSelectObjTemp:vm.data.areaSelectObjTemp
        })

    },

    // 隐藏地址选择
    closeSelectArea(e) {

        let vm = this,
            _currentTarget = e.currentTarget,
            index = _currentTarget.dataset.index;

        if (index == 0) {
            vm.setData({
                isOpen: false
            })
        }
    }

  }
})
