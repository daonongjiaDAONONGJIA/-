// pages/bind_card/index.js
const util = require('../../utils/util.js')
//获取应用实例
const app = getApp();
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
  },
  //添加联系人
  addContact: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    var mainurl = app.globalData.mainurl;
    var openid = app.globalData.openid;
    var params = {
      openid: openid,
      cardholder: e.detail.value.cardholder,
      bank: e.detail.value.bank,
      bank_card: e.detail.value.bank_card
    };
    var url = mainurl + 'api/user/getBand';
    util.wxRequest(url, params, data => {
      console.log(data);
      if (data.code == 200) {
        wx.showToast({
          title: data.msg,
        })
        wx.navigateBack()
      } else {
        wx.showToast({
          title: data.msg,
        })
      }
    }, data => { }, data => { });
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