// pages/order/details/details.js
const util = require('../../../utils/util.js')

//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: [],
    domain: app.globalData.domain,
    mainurlimg: app.globalData.mainurlimg,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //订单ID
    var orderId = options.orderId
    var url = app.globalData.mainurl +'api/order/getOrderDetail'
    var params = {
      oid: orderId,
      openid: app.globalData.openid,
      token: app.globalData.userInfo.token
    }
    this.setData({
      imgUrl: app.globalData.mainurlimg
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
  //取消订单
  cancel: function (e) {
    var mainurl = app.globalData.mainurl;
    var oid = e.currentTarget.dataset.id
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定取消订单吗？',
      success: function (res) {
        if (res.confirm) {
          var url = mainurl + 'api/order/orderCancel'
          var params = {
            id: oid,
            openid: app.globalData.openid,
            token: app.globalData.userInfo.token
          }
          util.wxRequest(url, params, data => {
            if (data.code == 200) {
              wx.showToast({
                title: '订单成功取消',
                icon: 'success'
              })
              that.setData({ orders: [], page: 1 })
              that.getOrderList(that.data.stautsDefault, 1)
            } else {
              app.globalData.login = false
              wx.showToast({
                title: data.msg,
                icon: 'none'
              })
            }
          }, data => { }, data => { })
        }
      }
    })
  },
  getOrder: function (e) {
    var id = e.currentTarget.dataset.id
    var mainurl = app.globalData.mainurl;
    var openid = app.globalData.openid;
    var params = {
      openid: openid,
      token: app.globalData.userInfo.token,
      orderId: id
    };
    var url = mainurl + 'api/order/getWxpayData';
    util.wxRequest(url, params, data => {
      console.log(data);
      this.setData({
        wxdata: data.data.wxData
      })
      this.pay()
    }, data => { }, data => { });
  },
  // 发起微信支付
  pay: function () {
    var that = this
    var wxdata = this.data.wxdata
    var timeStamp = wxdata.timeStamp + ''
    var nonceStr = wxdata.nonceStr + ''
    var wxpackage = wxdata.package + ''
    var paySign = wxdata.sign + ''
    wx.requestPayment({
      'timeStamp': timeStamp,
      'nonceStr': nonceStr,
      'package': wxpackage,
      'signType': 'MD5',
      'paySign': paySign,
      'success': function (res) {
        console.log(res)
        that.setData({ orders: [], page: 1 })
        that.getOrderList(that.data.stautsDefault, 1)
      },
      'fail': function (res) {
        //如果取消支付，执行删除去付款订单
        console.log(res);
      },
      'complete': function (res) {
        console.log(res);
        that.setData({ orders: [], page: 1 })
        that.getOrderList(that.data.stautsDefault, 1)
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