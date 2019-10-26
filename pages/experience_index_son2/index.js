// pages/experience_index_son2/index.js
var app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var version = app.getVersion();
    this.setData({
      version: version
    })
    if (app.globalData.login == false) {
      app.userLogin().then((resArg) => {
        that.getRecList();
        that.getList();
      })
    } else {
      that.getRecList();
      that.getList();
    }
   
  },
  getList:function(){
    var mainurl = app.globalData.mainurl;
    var openid = app.globalData.openid;
    var params = {
      page: this.data.page,
      openid: openid
    };
    console.log(params)
    var url = this.data.version + 'api/activity/activityList';
    util.wxRequest(url, params, data => {
      console.log(data);
      if (data.data.data.length == 0) {
        wx.showToast({
          title: '暂无更多数据~',
          icon: 'none'
        })
        // 隐藏加载框
        wx.hideLoading();
      } else {
        var list = this.data.list;
        for (var i = 0; i < data.data.data.length; i++) {
          list.push(data.data.data[i]);
        }
        // 设置数据
        this.setData({
          list: list
        })
        // 隐藏加载框
        wx.hideLoading();
      }
    }, data => { }, data => { });
  },
  getRecList:function(){
    var mainurl = app.globalData.mainurl;
    var url = this.data.version + 'api/ad/adPosData';
    var openid = app.globalData.openid;
    var params = {
      openid: openid,
      type_id: 'RecentActivities'
    };
    util.wxRequest(url, params, data => {
      console.log(data);
      if (data.code == 200) {
        this.setData({
          recommentList: data.data
        })
      }
    }, data => { }, data => { });
    
  },
  //跳转商品详情页面
  showGoods: function (e) {
    var id = e.currentTarget.dataset.id;
    console.log(id);
    wx.navigateTo({
      url: '/pages/activity_detail/index?id=' + id,
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
    var page = this.data.page + 1;
    this.setData({
      page:page
    })
    this.getList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})