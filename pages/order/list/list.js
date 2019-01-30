// pages/order/list/list.js
const util = require('../../../utils/util.js')

//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabClasss: [],
    status: ['ALL', 'waitpay', 'waitsent', 'waitreceive','finish'],
    stautsDefault: 'ALL',
    page: 1, //默认加载第1页
    orders: [],
    domain: app.globalData.domain,
    mainurlimg: app.globalData.mainurlimg,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.setData({
      tabClasss: ['text-select', 'text-normal', 'text-normal', 'text-normal', 'text-normal']
    })
    this.getOrderList(this.data.stautsDefault,1)
  },

  tabClick: function(e){
    var index = e.currentTarget.dataset.index
    var status = this.data.status
    var classs = ['text-normal', 'text-normal', 'text-normal', 'text-normal', 'text-normal']
    classs[index] = 'text-select'
    this.setData({
      tabClasss: classs,
      stautsDefault: status[index],
      orders: [],
      page: 1
    })
    console.log(status[index]);
    this.getOrderList(status[index], 1)
  },
  //默认加载全部订单数据
  getOrderList: function(status, page) {
    var mainurl = app.globalData.mainurl;
    var url = mainurl +'api/order/getOrderList'
    var params = {
      status: status,
      page: page,
      openid: app.globalData.openid,
      token: app.globalData.userInfo.token
    }
    util.wxRequest(url, params, data => {
      console.log(data)
      if (data.code == 200) {
        console.log(data)
        wx.stopPullDownRefresh()
        this.setData({ orders: data.data.data })
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
  cancel: function(e) {
    var mainurl = app.globalData.mainurl;
    var oid = e.currentTarget.dataset.id
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定取消订单吗？',
      success: function (res) {
        if (res.confirm) {
          var url = mainurl+'api/order/orderCancel'
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
              that.setData({ orders:[], page:1 })
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
  getOrder:function(e){
    var id = e.currentTarget.dataset.id
    var mainurl = app.globalData.mainurl;
    var openid = app.globalData.openid;
    var params = {
      openid: openid,
      token: app.globalData.userInfo.token,
      orderId:id
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
  //查看订单
  details: function(e) {
    //订单ID
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/order/details/details?orderId=' + id
    })
  },
  //订单评论
  comment:function(e){
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/experience_talk_add/experience_talk_add?orderId=' + id
    })
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
   * 页面相关事件处理函数--监听用户下拉动作--刷新
   */
  onPullDownRefresh: function () {
    // this.setData({ orders:[], page:1})
    // this.getOrderList(this.data.stautsDefault, 1)
  },

  /**
   * 页面上拉触底事件的处理函数--上拉加载
   */
  onReachBottom: function () {
    // this.getOrderList(this.data.stautsDefault, ++this.data.page)
    // wx.showToast({
    //   title: '加载中',
    //   icon: 'loading'
    // })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})