// pages/experience/experience.js
var app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList:"",
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
    this.goodList();
  },
  goodList:function(){
    var mainurl = app.globalData.mainurl;
    var params = {
      page:this.data.page
    };
    var url = mainurl + 'api/goods/getGoodsAll/';
    util.wxRequest(url, params, data => {
      console.log(data)
      wx.hideToast();
      this.setData({
        goodsList: data.goods.data
      })
    }, data => { }, data => { });
  },
  //跳转商品详情页面
  showGoods: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/experience_detail/experience_detail?id=' + id,
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
      page:1
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
    var that = this;
    // 显示加载图标
    wx.showLoading({
      title: '数据加载中',
    })
    // 页数+1
    var page = this.data.page + 1;
    var mainurl = app.globalData.mainurl;
    var params = {
      page: page
    };
    var url = mainurl + 'api/goods/getGoodsAll/';
    util.wxRequest(url, params, data => {
      console.log(data);
      if (data.goods.data.length==0){
        wx.showToast({
          title: '暂无更多数据~',
          icon:'none'
        })
      }else{
        var goodsList = this.data.goodsList;
        for (var i = 0; i < data.goods.data.length; i++) {
          goodsList.push(data.goods.data[i]);
        }
        // 设置数据
        this.setData({
          goodsList: goodsList
        })
      }
      
      // 隐藏加载框
      wx.hideLoading();
    }, data => { }, data => { });

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})