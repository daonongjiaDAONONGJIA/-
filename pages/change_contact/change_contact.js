var app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contactLists: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var goods_id = options.goods_id;
    this.setData({
      goods_id: goods_id
    })
    wx.showToast({
      icon: 'loading',
      title: '数据加载中~'
    })
    this.contactList();
  },
  // 获取收藏列表
  contactList: function () {
    var mainurl = app.globalData.mainurl;
    var openid = app.globalData.openid;
    var params = {
      openid: openid,
      token: app.globalData.userInfo.token,
      page: this.data.page
    };
    var url = mainurl + 'api/user/getContact';
    util.wxRequest(url, params, data => {
      console.log(data)
      wx.hideToast();
      this.setData({
        contactLists: data.data
      })
    }, data => { }, data => { });
  },
  changeContact:function(e){
    console.log(e)
    app.globalData.orderData.name = e.currentTarget.dataset.name
    app.globalData.orderData.phone = e.currentTarget.dataset.phone
    app.globalData.orderData.idcard = e.currentTarget.dataset.idcard
    wx.navigateTo({
      url: '/pages/confirm_order/confirm_order?goods_id=' + this.data.goods_id,
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