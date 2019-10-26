// pages/experience/experience.js
var app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [],
    page: 1
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var version = app.getVersion();
    this.setData({
      version: version
    })
    var that = this;
    wx.showToast({
      icon: 'loading',
      title: '数据加载中~'
    })
    if (app.globalData.login == false) {
      app.userLogin().then((resArg) => {
        that.goodList();
      })
    } else {
      that.goodList();
    }
  },
  goodList: function () {
    var mainurl = this.data.version;
    var openid = app.globalData.openid;
    var params = {
      page: this.data.page,
      openid: openid,
      is_act: 0
    };
    var url = mainurl + 'api/package/getPackageList';
    util.wxRequest(url, params, data => {
      console.log(data)
      wx.hideToast();
      var goodsList = this.data.goodsList;
      if (data.data.data.length == 0) {
        wx.showToast({
          title: '暂无更多数据~',
          icon: 'none'
        })
        // 隐藏加载框
        wx.hideLoading();
      } else {
        for (var i = 0; i < data.data.data.length; i++) {
          goodsList.push(data.data.data[i]);
        }
        // 设置数据
        this.setData({
          goodsList: goodsList
        })
        // 隐藏加载框
        wx.hideLoading();
      }
    }, data => { }, data => { });
  },
  //跳转商品详情页面
  showGoods: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/package_detail/index?id=' + id,
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
    this.setData({
      page: 1
    });
    wx.showLoading({
      title: '数据加载中',
    })
    this.goodList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var page = this.data.page + 1;
    this.setData({
      page: page
    })
    this.goodList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})