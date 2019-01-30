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
    wx.showToast({
      icon: 'loading',
      title: '数据加载中~'
    })
    this.setData({
      imgUrl: app.globalData.mainurlimg
    })
    this.goodList();
  },
  // 获取浏览列表
  goodList: function () {
    var mainurl = app.globalData.mainurl;
    var openid = app.globalData.openid;
    var params = {
      openid: openid,
      page: this.data.page
    };
    var url = mainurl + 'api/user/getRecord';
    util.wxRequest(url, params, data => {
      console.log(data)
      wx.hideToast();
      this.setData({
        goodsList: data.data.data
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