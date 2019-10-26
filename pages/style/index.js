// pages/style/index.js
var app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    styleList:[],
    page:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showToast({
      icon: 'loading',
      title: '数据加载中~'
    })
    var id = options.id;
    var type = options.type;
    var version = app.getVersion();
    this.setData({
      version: version,
      id: id,
      type: type
    })
    this.getStyle();
  },
  getStyle:function(){
    var mainurl = app.globalData.mainurl;
    var openid = app.globalData.openid;
    console.log(this.data.type);
    if(this.data.type == 'detail'){
      var url = this.data.version + 'api/goods/getGoodsMerchants';
      var params = {
        id: this.data.id,
        openid: openid,
        page: this.data.page
      };
    }else if(this.data.type == 'type'){
      var url = this.data.version + 'api/goods/getMerchants';
      var params = {
        pid: this.data.id,
        openid: openid,
        page: this.data.page
      };
    }else if (this.data.type == 'activity'){
      var url = this.data.version + 'api/activity/getMerchants';
      var params = {
        id: this.data.id,
        openid: openid,
        page: this.data.page
      };
    }
    util.wxRequest(url, params, data => {
      console.log(data)
      var styleList = this.data.styleList;
      if (data.data.data.length == 0) {
        wx.showToast({
          title: '暂无更多数据~',
          icon: 'none'
        })
        // 隐藏加载框
        wx.hideLoading();
      } else {
        for (var i = 0; i < data.data.data.length; i++) {
          styleList.push(data.data.data[i]);
        }
        // 设置数据
        this.setData({
          styleList: styleList
        })
        // 隐藏加载框
        wx.hideLoading();
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
    var page = this.data.page + 1;
    this.setData({
      page: page
    })
    wx.showToast({
      icon: 'loading',
      title: '数据加载中~'
    })
    this.getStyle();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})