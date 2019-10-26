// pages/voucher_list.js
var app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    vid:0
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
    this.setData({
      vid: options.vid
    })
    var that = this;
    if (!app.globalData.openid) {
      app.getToken().then((resArg) => {
        that.getVoucher();
      })
    } else {
      that.getVoucher();
    }
  },
  getVoucher: function () {
    var mainurl = this.data.version;
    var openid = app.globalData.openid;
    var params = {
      openid: openid,
      page: 1
    };
    var url = mainurl + 'api/Vouchers/getVoucherList';
    util.wxRequest(url, params, data => {
      this.setData({
        voucherList: data.data.data
      })
      console.log(this.data.voucherList);
    }, data => { }, data => { });
  },
  selVoucher:function(e){
    var vid = e.currentTarget.dataset.vid;
    var price = e.currentTarget.dataset.price;
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    if(vid==this.data.vid){
      this.setData({
        vid:0
      })
      //直接调用上一个页面对象的setData()方法，把数据存到上一个页面中去
      prevPage.setData({
        hsfAmount: price,
        use_hsf:0
      });
    }else{
      this.setData({
        vid: vid
      })
      //直接调用上一个页面对象的setData()方法，把数据存到上一个页面中去
      prevPage.setData({
        vid: vid,
        hsfAmount:price,
        use_hsf: 1
      });
    }
    wx.navigateBack({
      success: function () {
        prevPage.getHsf();
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

  }
})