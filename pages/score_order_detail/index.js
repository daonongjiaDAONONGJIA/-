// pages/score_order_detail/index.js
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
    var id = options.id;
    var version = app.getVersion();
    this.setData({
      version: version,
      id: id
    })
    if (!app.globalData.openid) {
      app.getToken().then((resArg) => {
        this.getOrder();
      })
    } else {
      this.getOrder();
    }
  },
  getOrder: function () {
    var openid = app.globalData.openid;
    var url = this.data.version + 'api/task/scoreOrderInfo'
    var params = {
      openid: openid,
      order_id: this.data.id
    }
    util.wxRequest(url, params, data => {
      console.log(data);
      if (data.code == 200) {
        this.setData({
          orderInfo: data.data
        })
      } else {

      }
    }, data => { }, data => { })
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