// pages/reward/index.js
const util = require('../../utils/util.js')
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reward:0,
    isOther:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var version = app.getVersion();
    this.setData({
      version: version
    })
    wx.hideShareMenu();
  },
  getReward:function(e){
    console.log(e)
    var reward = e.currentTarget.dataset.reward;
    this.setData({
      reward: reward
    })
  },
  getOther:function(){
    this.setData({
      isOther: 1,
      reward:0
    })
  },
  getOtherReward:function(e){
    console.log(e.detail.value);
    this.setData({
      reward: e.detail.value
    })
  },
  rewardBuy: function (e) {
    var mainurl = this.data.version;
    var openid = app.globalData.openid;
    var params = {
      openid: openid,
      code_number: this.data.reward,
      money: this.data.reward/100
    };
    var url = mainurl + 'api/memberCard/moneyCode';
    util.wxRequest(url, params, data => {
      console.log(data);
      this.setData({
        wxdata: data.data.wxData
      })
      this.pay()
    }, data => { }, data => { });
  },
  // 发起微信支付
  pay: function () {
    var that = this
    var wxdata = this.data.wxdata
    var timeStamp = wxdata.timeStamp + ''
    var nonceStr = wxdata.nonceStr + ''
    var wxpackage = wxdata.package + ''
    var paySign = wxdata.sign + ''
    wx.requestPayment({
      'timeStamp': timeStamp,
      'nonceStr': nonceStr,
      'package': wxpackage,
      'signType': 'MD5',
      'paySign': paySign,
      'success': function (res) {
        console.log(res)
        var pages = getCurrentPages(); // 当前页面
        var beforePage = pages[pages.length - 2]; // 前一个页面
        wx.navigateBack({
          success: function () {
            beforePage.onLoad(); // 执行前一个页面的onLoad方法
          }
        });
      },
      'fail': function (res) {
        //如果取消支付，执行删除去付款订单
        console.log(res);
      },
      'complete': function (res) {
        console.log(res);
        // var pages = getCurrentPages(); // 当前页面
        // var beforePage = pages[pages.length - 3]; // 前一个页面
        // wx.navigateBack({
        //   success: function () {
        //     beforePage.onLoad(); // 执行前一个页面的onLoad方法
        //   }
        // });
      }
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