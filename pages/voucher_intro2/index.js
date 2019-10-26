// pages/voucher_intro1/index.js
const util = require('../../utils/util.js')
var WxParse = require('../../wxParse/wxParse.js');
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
    this.getVoucherNum();
    this.getVoucherInfo();
  },
  //获取福寿长信息
  getVoucherInfo: function (e) {
    WxParse.emojisInit('[]', "/wxParse/emojis/", {
      "00": "00.gif",
      "01": "01.gif",
      "02": "02.gif",
      "03": "03.gif",
      "04": "04.gif",
      "05": "05.gif",
      "06": "06.gif",
      "07": "07.gif",
      "08": "08.gif",
      "09": "09.gif",
      "09": "09.gif",
      "10": "10.gif",
      "11": "11.gif",
      "12": "12.gif",
      "13": "13.gif",
      "14": "14.gif",
      "15": "15.gif",
      "16": "16.gif",
      "17": "17.gif",
      "18": "18.gif",
      "19": "19.gif",
    });
    var mainurl = this.data.version;
    var openid = app.globalData.openid;
    var params = {
      openid: openid
    };
    var url = mainurl + 'api/membercard/rollInfo';
    util.wxRequest(url, params, data => {
      console.log(data);
      this.setData({
        voucherInfo: data.data
      })
      var article = WxParse.wxParse('article', 'html', data.data.content, this, 5);
    }, data => { }, data => { });
  },
  getVoucherNum: function (e) {
    var mainurl = this.data.version;
    var openid = app.globalData.openid;
    var params = {
      openid: openid
    };
    var url = mainurl + 'api/memberCard/getMemberCardInfo';
    util.wxRequest(url, params, data => {
      console.log(data)
      this.setData({
        number: data.data.roll
      })
    }, data => { }, data => { });
  },
  getVoucher: function () {
    wx.navigateTo({
      url: '/pages/my_voucher2/index'
    })
  },
  getVoucher1:function(){
    wx.navigateTo({
      url: '/pages/recharge1/index'
    })
  },
  getVoucher2: function () {
    wx.navigateTo({
      url: '/pages/voucher2/index'
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
    this.getVoucherNum();
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