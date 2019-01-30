// pages/skip/skip.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:'',
    desc:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var page = options.page;
    console.log(page);
    if(page=='comment'){
      this.setData({
        page: options.page,
        goods_id: options.goods_id,
        info:'评论成功',
        desc:'非常感谢您对我们宝贵的评价！'
      })
    }else{
      this.setData({
        page: options.page,
        order_id: options.order_id,
        goods_id: options.goods_id,
        info: '支付成功',
        desc: '实付'+options.totalPrice
      })
      console.log(options.order_id);
    }
  },
  //返回首页
  backIndex:function(){
    console.log('首页');
    wx.switchTab({
      url: '../experience/experience',
    })
  },
  //查看评论
  commentView: function () {
    wx.navigateTo({
      url: '/pages/experience_talk/experience_talk?goods_id='+this.data.goods_id,
    })
  },
  //查看订单
  orderView: function () {
    wx.navigateTo({
      url: '/pages/order/details/details?orderId=' + this.data.order_id,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('/pages/experience_detail/experience_detail?id=' + this.data.goods_id)
    var pages = getCurrentPages()
    console.log(pages);
    for (var i = 0; i < pages.length; i++) {
      if (pages[i].route == "pages/experience_detail/experience_detail") {
        var delta = pages.length - i - 2;
        console.log(delta)
        wx.navigateBack({
          delta: delta
        })
      }
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})