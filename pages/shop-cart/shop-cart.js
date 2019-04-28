import _ from '../../utils/common'
const app = getApp();
let thisPage = 1;
let startX;
Page({

    data: {
      isfull:true,
      list:[],
      sold:[],
      limit:10,
      delBtnWidth: 180, //删除按钮宽度单位（rpx）
      userData: '' ,
      productid:'',
      allSelect:false,
      amountMoney:0,
      allNum:0,
      isData:false
    },

    onLoad: function(options) {

      let vm = this;
      this.initEleWidth();
    },

    onShow(){
      let vm = this;

      vm.init();

    },

    init(){
      let vm = this;
      vm.setData({
          userData:wx.getStorageSync('userData') || '',
          allSelect:false,
          amountMoney:0,
          allNum:0,
          isData:false
      })

      thisPage = 1;
      vm.getData(1);
      
    },

    touchS: function(e) {

        if (e.touches.length == 1) {

            startX = e.touches[0].clientX;

        }

    },

    touchM: function(e) {

        let vm = this;
        let name = e.currentTarget.dataset.name;
        if (e.touches.length == 1) {

            //手指移动时水平方向位置

            var moveX = e.touches[0].clientX;

            //手指起始点位置与移动期间的差值

            var disX = startX - moveX;

            var delBtnWidth = vm.data.delBtnWidth;

            var txtStyle = "";

            if (disX == 0 || disX < 0) { //如果移动距离小于等于0，文本层位置不变

                txtStyle= "-webkit-transform:translateX(0px)";

            } else

            if (disX > 0) { //移动距离大于0，文本层left值等于手指移动距离

                txtStyle= "-webkit-transform:translateX(-" + disX + "px)";

                if (disX >= delBtnWidth) {

                    //控制手指移动距离最大值为删除按钮的宽度

                    txtStyle= "-webkit-transform:translateX(-" + delBtnWidth + "px)";

                }

            }

            //获取手指触摸的是哪一项

            var index = e.currentTarget.dataset.index;

            var list = vm.data[name];
            list[index].txtStyle = txtStyle;

            //更新列表的状态

            var ojb = {};
            ojb[name] = list;
            vm.setData(ojb);

        }

    },



    touchE: function(e) {
        let vm = this;
        let name = e.currentTarget.dataset.name;
        if (e.changedTouches.length == 1) {

            //手指移动结束后水平位置

            var endX = e.changedTouches[0].clientX;

            //触摸开始与结束，手指移动的距离

            var disX = startX - endX;

            var delBtnWidth = vm.data.delBtnWidth;

            //如果距离小于删除按钮的1/2，不显示删除按钮

            var txtStyle = disX > delBtnWidth / 2 ? "-webkit-transform:translateX(-" + delBtnWidth + "px)" : "-webkit-transform:translateX(0px)";

            //获取手指触摸的是哪一项

            var index = e.currentTarget.dataset.index;

            var list = vm.data[name];

            list[index].txtStyle = txtStyle;


            wx.createSelectorQuery().selectAll('.'+name+'-cell').boundingClientRect(function(res){

              for (let i = 0; i < res.length; i++) {

                if (index != i) {
                  list[i].txtStyle = '-webkit-transform:translateX(0px)';
                }
                
              }

              //更新列表的状态
              let obj = {};
              obj[name] = list;
              vm.setData(obj);
            }).exec()
            

            let otherName  = name == 'list' ? 'sold' : 'list';

            wx.createSelectorQuery().selectAll('.'+otherName+'-cell').boundingClientRect(function(res){
               console.log(otherName,1111)
              for (let i = 0; i < res.length; i++) {

                vm.data[otherName][i].txtStyle = '-webkit-transform:translateX(0px)';
                
              }

              let obj = {};
              obj[otherName] = vm.data[otherName];
              vm.setData(obj);

            }).exec()
         
           

        }

    },

    //获取元素自适应后的实际宽度

    getEleWidth: function(w) {

        var real = 0;

        try{

            var res = wx.getSystemInfoSync().windowWidth;

            var scale = (750 / 2) / (w / 2); //以宽度750px设计稿做宽度的自适应

            real = Math.floor(res / scale);

            return real;

        } catch(e) {

            return false;

           

        }

    },

    initEleWidth: function() {

        var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);

        this.setData({

            delBtnWidth: delBtnWidth

        });

    },

    //点击删除按钮事件

    delItem: function(e) {

        //获取列表中要删除项的下标

        var index = e.target.dataset.index;
        var name = e.target.dataset.name;

        var list = this.data.list;

        //移除列表中下标为index的项
        

        let vm = this;
        let urlParams = {};

        for (var key in _.urlParams) {
            urlParams[key] = _.urlParams[key];
        }
        urlParams.user_id = vm.data.userData.userId || '';
        urlParams.driver_id = vm.data.userData.unionId;

        if (e.target.dataset.productid == 0) {
          urlParams.shopcart_value_str = e.target.dataset.value;
        }else{
          urlParams.shopcart_value_str = e.target.dataset.productid;

        }
      
        wx.showModal({
            title: '提示',
            content: '删除商品后，商品将从您的购物车中清除哦~',
            success: function(res) {
                if (res.confirm) {
                  wx.request({
                        url: _.host.baseApi + '/api/shopcart/delete_from_selected_multi',
                        method: 'POST',
                        data: urlParams,
                        header: {
                            'content-type': 'application/json'
                        },
                        success: function(res) {
                            let data = res.data;
                            if (data.code == 1) {

                              vm.data[name].splice(index, 1);
                              wx.showToast({
                                  title: '删除成功',
                                  icon: 'success',
                                  duration: 1000
                              })

                              var obj = {};

                              obj[name] = vm.data[name];
                              vm.setData(obj);
                              
                            }
                        }
                  })
                }
            }
        })
       


      

    },

   // 下拉加载数据
    onReachBottom: function() {
      let vm = this;
      if (vm.data.isfull) {
          vm.getData();
      }
    },

     // 下拉加载数据
    // onLoadBottm: function() {
    //     let vm = this;
    //     if (vm.data.isfull) {
    //         vm.getData();
    //     }
    // },


    //获取购物车数据
    getData: function() {

      let vm = this;
      let urlParams = {};

      for (var key in _.urlParams) {
          urlParams[key] = _.urlParams[key];
      }
      urlParams.user_id = vm.data.userData.userId || '';
      urlParams.driver_id = vm.data.userData.unionId;
      urlParams.page = thisPage;
      urlParams.limit = vm.data.limit;

      if (vm.data.isData) return;
      vm.setData({
          isData: true
      })
      wx.request({
            url: _.host.baseApi + '/api/shopcart/get_shop_cart_list',
            method: 'get',
            data: urlParams,
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                let data = res.data;
                if (data.code == 1) {


                  if (thisPage == 1) {
                    vm.data.list = data.data.active;
                    vm.data.sold = data.data.disactive;
                  }else{
                    vm.data.list.push.apply(vm.data.list, data.data.active);
                    vm.data.sold.push.apply(vm.data.sold, data.data.disactive);
                  }
                  
                  thisPage++;

                  vm.setData({
                      list: vm.data.list,
                      sold: vm.data.sold,
                      isData:false
                  });

                  if (data.data.active.length + data.data.disactive.length < vm.data.limit) {
                      vm.setData({
                          isfull: false
                      })
                  }
                  
                }
            }
      })

    },

    // 选择购物车
    cartSelect(e){
      let vm = this;
      let index = e.currentTarget.dataset.index;

     
      let isselect = vm.data.list[index].isselect;

      // 判断是否选中
      if (isselect) {
        vm.data.list[index].isselect = false;
      }else{
        vm.data.list[index].isselect = true;
      }

      // 判断是否已全选完
      let isselectNum = 0;
      for (let i = 0; i < vm.data.list.length; i++) {

        if (vm.data.list[i].isselect) {
            isselectNum++;
        }
      }
      if (isselectNum != vm.data.list.length) {
          vm.data.allSelect = false;
      }else{
          vm.data.allSelect = true;
      }

      vm.setData({
          list: vm.data.list,
          allSelect:vm.data.allSelect
      });



      console.log(isselectNum)
      vm.calculation();
    },
    // 全选
    allSelect(){

      let vm = this;

      let isselect = vm.data.allSelect;
      let list = vm.data.list;
      if (isselect) {
        vm.data.allSelect = false;
        for (let i = 0; i < list.length; i++) {
          list[i].isselect = false;
        }
      }else{
        vm.data.allSelect = true;

        for (let i = 0; i < list.length; i++) {
          list[i].isselect = true;
        }
      }

      vm.setData({
        list: vm.data.list,
        allSelect: vm.data.allSelect
      });

      vm.calculation();
    },

    // 减少数量
    decrease(event){
        let vm = this;
        let index = event.currentTarget.dataset.index;
        if(this.data.list[index].shopcart_pro_num == 1) return;
        this.data.list[index].shopcart_pro_num -- ;
        this.setData({
            list: this.data.list
        })
        vm.calculation();
    },

    // 添加数量
    increase(event){
        let vm = this;
        let index = event.currentTarget.dataset.index;

        this.data.list[index].shopcart_pro_num ++ ;
        this.setData({
            list: this.data.list
        })
        vm.calculation();
       
    },

    calculation(){
        let vm = this;
        let list = vm.data.list;

        let money = 0;
        let num = 0;
        for (let i = 0; i < list.length; i++) {
          if (list[i].isselect) {
              money += Number(list[i].shopcart_price * list[i].shopcart_pro_num);
              money += Number(list[i].serve_total_amount);
              num += list[i].shopcart_pro_num;
          }
        }
        vm.data.amountMoney = money.toFixed(2) ;
        vm.data.allNum = num;
        vm.setData({
          list: vm.data.list,
          amountMoney: vm.data.amountMoney,
          allNum:vm.data.allNum
        });
    },

    cleanData(e){

        let vm = this;
        let urlParams = {};

        let sold =  vm.data.sold;

        for (var key in _.urlParams) {
            urlParams[key] = _.urlParams[key];
        }
        urlParams.user_id = vm.data.userData.userId || '';
        urlParams.driver_id = vm.data.userData.unionId;
        let arr = [];
        for (let i = 0; i < sold.length; i++) {
          arr.push(sold[i].product_id);
        }
        urlParams.shopcart_value_str = arr.join(',');



        wx.showModal({
            title: '提示',
            content: '删除商品后，商品将从您的购物车中清除哦~',
            success: function(res) {
                 console.log(res)
                if (res.confirm) {
                    wx.request({
                        url: _.host.baseApi + '/api/shopcart/delete_from_selected_multi',
                        method: 'POST',
                        data: urlParams,
                        header: {
                            'content-type': 'application/json'
                        },
                        success: function(res) {
                            let data = res.data;
                            if (data.code == 1) {

                              wx.showToast({
                                  title: '删除成功',
                                  icon: 'success',
                                  duration: 1000
                              })

                              vm.setData({
                                  sold: []
                              });
                              
                            }else{
                              wx.showToast({
                                  title: data.msg,
                                  icon: 'none',
                                  duration: 1000
                              })
                            }
                        }
                  })
                }
            }
        })
        
    },

    gotoindex(){
        wx.switchTab({
          url: '../index/index'
        })
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

    // 去商品详情
    gotoDetail(e){
      let vm = this;

      let productId = e.currentTarget.dataset.productid;
      let type = e.currentTarget.dataset.type;

      if (type == 1) {
        wx.navigateTo({
            url: '../commodity-detail/commodity-detail?productId='+productId
        })
      }else if (type == 2) {
        wx.navigateTo({
            url: '../parts-detail/parts-detail?productId='+productId+'&type='+type
        })
      }
      
    },

    gotosub(e){

      let vm = this;

      let isdisabled = e.currentTarget.dataset.isdisabled;
      let list = vm.data.list;
      let serviceStr = [];
      let partsStr = [];

      if (isdisabled) return;

      if (!vm.data.userData) {
        app.getWxUiNew(function(){
          vm.init();
        },e);
       
        return;
      }

      for (let i = 0; i < list.length; i++) {
        // 判断是否手机和配件
        if (list[i].shopcart_type == 1) {
          // 手机
          if (list[i].isselect) {
              serviceStr.push(list[i].product_id + ':' + list[i].shopcart_pro_num)
          }
        }else if (list[i].shopcart_type == 2) {
          // 配件
          if (list[i].isselect) {
              partsStr.push(list[i].shopcart_value + ':' + list[i].shopcart_pro_num)
          }
        } 
      }

      serviceStr = serviceStr.join(',');
      partsStr = partsStr.join(',');

      wx.navigateTo({
        url: '../user-order-confirm/user-order-confirm?peijian_str='+partsStr+'&shouji_str='+serviceStr+'&server_str=&from_where=2'
      })
    },

    // 取消默认
    cancelDefault(){

    }



})