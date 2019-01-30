// pages/experience_talk/experience_talk.js
var app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var goods_id = options.goods_id;
    this.setData({
      goods_id: goods_id
    })
    this.getComment();
  },
  getComment:function(){
    var url = app.globalData.mainurl + 'api/goods/getCommentList'
    var params = {
      id: this.data.goods_id,
      page: this.data.page
    }
    util.wxRequest(url, params, data => {
      if (data.code == 200) {
        console.log(data);
        this.setData({
          comments:data.data.data
        })
      } else {
        wx.showToast({
          title: data.msg,
          icon: 'none'
        })
      }
    }, data => { }, data => { })
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