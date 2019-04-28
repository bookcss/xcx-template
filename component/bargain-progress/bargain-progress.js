
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      

      isChop:{
        type:Number,
        value:0
      },

      status:{
        type:Number,
        value:''
      },

      type:{
        type:Number,
        value:''
      },
      thisPrice:{
        type:Number,
        value:''
      },
      totalPrice:{
        type:Number,
        value:''
      },
      firstPrice:{
        type:Number,
        value:''
      },
      secondPrice:{
        type:Number,
        value:''
      }
  },

  /**
   * 组件的初始数据
   */
  data: {
    style:''
  },
 
  ready(){

    if (this.data.status == 1) {
      this.getTipBoxWidth();
    }
    
  },


  /**
   * 组件的方法列表
   */
  methods: {

    // 获取当前价格占比
    getThisPricePercent(thisWidth){
      let style = "";

      this.data.thisPercent = 100 * this.data.thisPrice / this.data.totalPrice;

      
      if (this.data.thisPercent <= 80) {
        style= `margin-left:-${thisWidth/2}px;left:${this.data.thisPercent}%`;

        if (this.data.thisPercent < 5) {
          style= `margin-left:-5px;left:${this.data.thisPercent}%`;
        }
      }else {
        style= `margin-right:-5px;right:${100-this.data.thisPercent}%`;
      }


      // 如何砍价封顶值
      if (this.data.thisPrice >= this.data.totalPrice) {
        style= `right:${100-this.data.thisPercent}%`;
      }
      this.setData({
          style:style,
          thisPercent:this.data.thisPercent
      })
    },

    // 获取提示框宽度
    getTipBoxWidth(){
      const vm = this;
      const query = wx.createSelectorQuery().in(this);
      query.select('#tip-inner').boundingClientRect(function(res){
         vm.getThisPricePercent(res.width);
      }).exec()
    }

  }
})
