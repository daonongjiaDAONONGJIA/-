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
    var version = app.getVersion();
    this.setData({
      'card_id':options.card_id,
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
      money: this.data.money
    };
    var url = mainurl + 'api/membercard/getCashOut';
    util.wxRequest(url, params, data => {
      if(data.code==200){
        wx.showToast({
          icon: 'none',
          title: data.msg
        })
        setTimeout(function(){
          app.getMemberCard();
          wx.navigateBack();
        },1000)  
      }else{
        wx.showToast({
          icon: 'none',
          title: data.msg
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