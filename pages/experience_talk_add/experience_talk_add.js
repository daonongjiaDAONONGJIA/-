// pages/experience_talk_add/experience_talk_add.js
const util = require('../../utils/util.js')

//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var orderId = options.orderId
    var url = app.globalData.mainurl + 'api/order/getOrderDetail'
    var params = {
      oid: orderId,
      openid: app.globalData.openid,
      token: app.globalData.userInfo.token,
      content: this.data.content
    }
    this.setData({
      imgUrl: app.globalData.mainurlimg,
      orderId: orderId
    })
    util.wxRequest(url, params, data => {
      if (data.code == 200) {
        console.log(data)
        this.setData({
          orderDate: data.orderDate,
          order: data.result
        })
      } else {
        app.globalData.login = false
        wx.showToast({
          title: data.msg,
          icon: 'none'
        })
      }
    }, data => { }, data => { })
  },
  //监听输入内容
  valueChange:function(e){
    console.log(e)
    this.setData({
      content:e.detail.value
    })
  },
  //提交评论
  commentAdd:function(){
    var url = app.globalData.mainurl + 'api/order/getComment'
    var params = {
      order_id: this.data.orderId,
      openid: app.globalData.openid,
      token: app.globalData.userInfo.token,
      content: this.data.content
    }
    console.log(params);
    util.wxRequest(url, params, data => {
      if (data.code == 200) {
        console.log(data);
        wx.navigateTo({
          url: '/pages/skip/skip?page=comment&goods_id=' + this.data.order.goods_id,
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