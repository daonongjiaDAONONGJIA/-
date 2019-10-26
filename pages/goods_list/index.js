// pages/goods_list/index.js
var app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cate_id:0,
    cate_name:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var version = app.getVersion();
    this.setData({
      version: version
    })
    var cate_id = options.cate_id;
    var cate_name = options.name;
    this.setData({
      cate_id:cate_id,
      cate_name: cate_name
    })
    var that = this;
    if (!app.globalData.openid) {
      app.getToken().then((resArg) => {
        that.getCate();
        that.getGoodsList();
      })
    } else {
      that.getCate();
      that.getGoodsList();
    }
  },
  getCate: function () {
    var mainurl = app.globalData.mainurl;
    var url = this.data.version + 'api/shop/cateList';
    var openid = app.globalData.openid;
    var params = {
      openid: openid
    };
    util.wxRequest(url, params, data => {
      if (data.code == 200) {
        console.log(data)
        this.setData({
          cateList: data.data
        })
      }
    }, data => { }, data => { });
  },
  getCateOne:function(e){
    var id = e.currentTarget.dataset.id;
    var cate_name = e.currentTarget.dataset.name;
    if (id==0) { 
      wx.navigateBack();
      return false;
    }
    this.setData({
      cate_id:id,
      page:1,
      cate_name: cate_name
    });
    this.getGoodsList();
  },
  getGoodsList: function () {
    var mainurl = app.globalData.mainurl;
    var url = this.data.version + 'api/shop/goodsList';
    var openid = app.globalData.openid;
    var params = {
      openid: openid,
      page:this.data.page,
      cate_id:this.data.cate_id
    };
    util.wxRequest(url, params, data => {
      if (data.code == 200) {
        console.log(data)
        this.setData({
          goodsList: data.data.data
        })
      }
    }, data => { }, data => { });
  },
  getDetail:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goods_detail/index?id='+id
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