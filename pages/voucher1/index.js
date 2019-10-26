// pages/reward/index.js
const util = require('../../utils/util.js')
//获取应用实例
const app = getApp()
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
  },
  getFsc: function (e) {
    console.log(e.detail.value);
    this.setData({
      pwd: e.detail.value
    })
  },
  exchangeFsc: function (e) {
    var mainurl = this.data.version;
    var openid = app.globalData.openid;
    var params = {
      openid: openid,
      pwd: this.data.pwd
    };
    var url = mainurl + 'api/ddj/getFsc';
    util.wxRequest(url, params, data => {
      console.log(data);
      if(data.code==200){
        wx.showToast({
          icon: 'none',
          title: "领取成功！",
          duration: 2000
        })
        setTimeout(function(){
          wx.navigateBack();
        },1000)
      }else if(data.code==400){
        wx.showToast({
          icon:'none',
          title: data.msg,
          duration: 5000
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