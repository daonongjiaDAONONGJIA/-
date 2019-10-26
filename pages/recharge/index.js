// pages/recharge/index.js
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
    this.setData({
      'card_id':options.card_id
    })
    var version = app.getVersion();
    this.setData({
      version: version
    })
    console.log(options.card_id)
  },
  money:function(e){
    console.log(e);
    this.setData({
      money:e.detail.value
    })
  },
  getMoney:function(){
    if(this.data.money==""){
      wx.showToast({
        icon:"none",
        title: '请填写充值金额'
      })
      return false;
    }
    var mainurl = this.data.version;
    var openid = app.globalData.openid;
    var params = {
      openid: openid,
      card_id:this.data.card_id,
      money: this.data.money
    };
    var url = mainurl + 'api/membercard/recharge';
    util.wxRequest(url, params, data => {
      console.log(data);
      this.setData({
        wxdata: data.data.wxData
      })
      this.pay();
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
        wx.showToast({
          title: '充值成功！'
        })
        wx.navigateBack();
      },
      'fail': function (res) {
        //如果取消支付，执行删除去付款订单
        console.log(res);
      },
      'complete': function (res) {
        console.log(res);
        //that.getMemberStatus();
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