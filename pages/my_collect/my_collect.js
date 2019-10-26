// pages/my_collect/my_collect.js
var app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList:[]
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
    wx.showToast({
      icon: 'loading',
      title: '数据加载中~'
    })
    this.goodList();
  },
  // 获取收藏列表
  goodList: function () {
    var mainurl = this.data.version;
    var openid = app.globalData.openid;
    var params = {
      openid:openid,
      page: this.data.page
    };
    var url = mainurl + 'api/goods/getCollectGoods';
    util.wxRequest(url, params, data => {
      console.log(data);
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
    var type = e.currentTarget.dataset.type;
    if (type == 1) {
      wx.navigateTo({
        url: '/pages/experience_detail/experience_detail?id=' + id,
      })
    }
    if (type == 2) {
      wx.navigateTo({
        url: '/pages/package_detail/index?id=' + id,
      })
    }
    if (type == 3) {
      wx.navigateTo({
        url: '/pages/activity_detail/index?id=' + id,
      })
    }
    if (type == 4) {
      wx.navigateTo({
        url: '/pages/goods_detail/index?id=' + id,
      })
    }
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
    var page = this.data.page+1;
    this.setData({
      page: page
    })
    this.goodList();
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