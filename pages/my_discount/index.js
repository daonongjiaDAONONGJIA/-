// pages/my_discount/index.js
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
    this.getMemberStatus();
  },
  getMemberStatus: function () {
    var mainurl = this.data.version;
    var openid = app.globalData.openid;
    var params = {
      openid: openid
    };
    var url = mainurl + 'api/memberCard/getMemberCardInfo';
    util.wxRequest(url, params, data => {
      console.log(data);
      this.setData({
        status: data
      })
      console.log(this.data.status);
    }, data => { }, data => { });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getVoucherIntro: function () {
    wx.navigateTo({
      url: '/pages/voucher_intro/index'
    })
  },
  getVoucherIntro1: function () {
    wx.navigateTo({
      url: '/pages/voucher_intro1/index'
    })
  },
  getVoucherIntro2: function () {
    wx.navigateTo({
      url: '/pages/voucher_intro2/index'
    })
  },
  getPay: function () {
    wx.showToast({
      icon: 'none',
      title: '该功能正在开发中，敬请期待'
    })
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
    return {
      title: '道农家',
      path: '/pages/guide/guide',
      // 设置转发的图片
      imageUrl: '',
      // 成功的回调
      success: (res) => { },
      // 失败的回调
      fail: (res) => { },
      // 无论成功与否的回调
      complete: (res) => { }
    }
  }
})