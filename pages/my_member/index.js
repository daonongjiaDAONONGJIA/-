// pages/my_member/index.js
var app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    var version = app.getVersion();
    this.setData({
      version: version
    })
    var card_id = options.card_id;
    this.setData({
      card_id: card_id
    })
    this.getMemberCardInfo();
  },
  // 获取会员卡状态
  getMemberCardInfo: function () {
    var openid = app.globalData.openid;
    var mainurl = this.data.version;
    var url = mainurl + 'api/memberCard/getMemberCardInfo'
    var params = {
      openid: openid
    }
    util.wxRequest(url, params, data => {
      console.log(data);
      var cardInfo = data.data;
      this.setData({
        cardInfo: cardInfo
      })
    }, data => { }, data => { })
  },
  getMoney:function(){
    wx.navigateTo({
      url: '/pages/recharge/index?card_id=' + this.data.card_id,
    })
  },
  getCash: function () {
    wx.navigateTo({
      url: '/pages/withdraw/index?card_id=' + this.data.card_id,
    })
  },
  getRecord: function () {
    wx.navigateTo({
      url: '/pages/withdraw_list/index'
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
    this.getMemberCardInfo();
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