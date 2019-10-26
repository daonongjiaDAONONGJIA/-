// pages/score_order/index.js
var app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var version = app.getVersion();
    this.setData({
      version: version
    })
    if (!app.globalData.openid) {
      app.getToken().then((resArg) => {
        this.getMemberCardInfo();
        this.getOrder();
      })
    } else {
      this.getMemberCardInfo();
      this.getOrder();
    }
  },
  // 获取会员卡状态
  getMemberCardInfo: function () {
    var openid = app.globalData.openid;
    var mainurl = app.globalData.mainurl;
    var url = this.data.version + 'api/memberCard/getMemberCardInfo'
    var params = {
      openid: openid
    }
    util.wxRequest(url, params, data => {
      console.log(data);
      if (data.code == 200) {
        this.setData({
          cardInfo: data.data
        })
      } else {

      }
    }, data => { }, data => { })
  },
  // 获取积分会员
  getOrder: function () {
    var openid = app.globalData.openid;
    var url = this.data.version + 'api/task/scoreOrderList'
    var params = {
      openid: openid,
      page:this.data.page
    }
    util.wxRequest(url, params, data => {
      console.log(data);
      if (data.code == 200) {
        this.setData({
          orderList: data.data.data
        })
      } else {

      }
    }, data => { }, data => { })
  },
  getOrderDetail:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/score_order_detail/index?id=' + id
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