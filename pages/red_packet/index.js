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
      version: version
    })
    this.getVoucherList();
  },
  getVoucherList: function () {
    var mainurl = this.data.version;
    var openid = app.globalData.openid;
    var params = {
      openid: openid,
      page: this.data.page
    };
    var url = mainurl + 'api/ddj/getFscList';
    util.wxRequest(url, params, data => {
      console.log(data);
      this.setData({
        voucherList: data.data.data,
        voucherNum:data.data.data.length
      })
    }, data => { }, data => { });
  },
  getCardInfo:function(){
    if (this.data.voucherNum==0){
      wx.showToast({
        icon:'none',
        title: '您没有福寿长优惠券，不能进行此操作！'
      });
      setTimeout(function(){
        wx.navigateTo({
          url: '/pages/voucher_intro/index'
        })
      },1000)
      return false;
    }
    var mainurl = app.globalData.mainurl;
    var openid = app.globalData.openid;
    var params = {
      openid: openid,
      card_sn: this.data.card_sn
    };
    if (this.data.card_sn == "") {
      wx.showToast({
        icon: "none",
        title: '请填写对方手机号'
      })
      return false;
    }
    var url = mainurl + 'api/ddj/getCardInfo';
    util.wxRequest(url, params, data => {
      console.log(data);
      if(data.code==400){
        wx.showToast({
          icon: "none",
          title:data.msg
        })
      }
      if (data.code == 200) {
        wx.navigateTo({
          url: '/pages/transfer_fsc/index?card_sn=' + this.data.card_sn,
        })
      }
    }, data => { }, data => { });
  },
  card_sn: function (e) {
    console.log(e);
    this.setData({
      card_sn: e.detail.value
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