// pages/score_detail/index.js
var app = getApp();
const util = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');
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
        this.getMemberCardInfo();
        this.getGoods();
      })
    } else {
      this.getMemberCardInfo();
      this.getGoods();
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
  //获取积分商品
  getGoods: function () {
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
    var openid = app.globalData.openid;
    var url = this.data.version + 'api/task/goodsInfo'
    var params = {
      id: this.data.id,
      openid: openid
    }
    util.wxRequest(url, params, data => {
      console.log(data);
      if (data.code == 200) {
        this.setData({
          goodsInfo: data.data
        })
        var article = WxParse.wxParse('article', 'html', data.data.content, this, 5);
      } else {

      }
    }, data => { }, data => { })
  },
  exchangeGoods:function(){
    wx.navigateTo({
      url: '/pages/score_confirm/index?id='+this.data.id
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