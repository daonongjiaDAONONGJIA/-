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
    status: ['all', 'waitpay', 'waitsent', 'waitreceive', 'finish','pending'],
    stautsDefault: 'all',
    page: 1, //默认加载第1页
    orders: [],
    domain: app.globalData.domain,
    mainurlimg: app.globalData.mainurlimg,
    is_show: 0,
    unionid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    this.setData({
      tabClasss: ['text-select', 'text-normal', 'text-normal', 'text-normal', 'text-normal', 'text-normal']
    })
    var version = app.getVersion();
    this.setData({
      version: version
    })
    this.getOrderList(this.data.stautsDefault)
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
  tabClick: function(e){
    var index = e.currentTarget.dataset.index
    var status = this.data.status
    var classs = ['text-normal', 'text-normal', 'text-normal', 'text-normal', 'text-normal', 'text-normal']
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
  getOrderList: function(status) {
    var mainurl = app.globalData.mainurl;
    var url = this.data.version +'api/order/getOrderList'
    var params = {
      status: this.data.stautsDefault,
      page: this.data.page,
      openid: app.globalData.openid
    }
    util.wxRequest(url, params, data => {
      console.log(data)
      if (data.code == 200) {
        console.log(data)
        if (data.data.data.length==0) {
          wx.showToast({
            title: '暂无更多数据~',
            icon: 'none'
          })
          // 隐藏加载框
          wx.hideLoading();
        } else {
          var orders = this.data.orders;
          for (var i = 0; i < data.data.data.length; i++) {
            orders.push(data.data.data[i]);
          }
          // 设置数据
          this.setData({
            orders: orders
          })
          // 隐藏加载框
          wx.hideLoading();
        }
      } else {
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
          var url = that.data.version + 'api/order/orderCancel'
          var params = {
            id: oid,
            openid: app.globalData.openid
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
  //申请退款
  getRefund:function(e){
    var mainurl = app.globalData.mainurl;
    var oid = e.currentTarget.dataset.id
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定要申请退款吗？',
      success: function (res) {
        if (res.confirm) {
          var url = that.data.version + 'api/order/returnGoods'
          var params = {
            order_id: oid,
            openid: app.globalData.openid
          }
          util.wxRequest(url, params, data => {
            if (data.code == 200) {
              wx.showToast({
                title: '申请退款成功',
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
  getComplete:function(e){
    var that = this;
    var oid = e.currentTarget.dataset.id;
    var url = this.data.version + 'api/order/confirmOrder';
    var params = {
      id: oid,
      openid: app.globalData.openid
    }
    util.wxRequest(url, params, data => {
      if (data.code == 200) {
        wx.showToast({
          title: '定单已完成',
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
  },
  getOrder:function(e){
    var id = e.currentTarget.dataset.id
    var mainurl = app.globalData.mainurl;
    var openid = app.globalData.openid;
    var params = {
      openid: openid,
      orderId:id
    };
    var url = this.data.version + 'api/order/getWxpayData';
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
    var type = e.currentTarget.dataset.type
    //查看订单
    if (type == 1) {
      wx.navigateTo({
        url: '/pages/order/details/details?orderId=' + id + '&page=order_list',
      })
    }
    //套餐订单
    if (type == 2) {
      wx.navigateTo({
        url: '/pages/order/package_detail/index?orderId=' + id + '&page=order_list',
      })
    }
    //活动订单
    if (type == 3) {
      wx.navigateTo({
        url: '/pages/order/activity_detail/index?orderId=' + id + '&page=order_list',
      })
    }
    //活动订单
    if (type == 4) {
      wx.navigateTo({
        url: '/pages/order/goods_detail/index?orderId=' + id + '&page=order_list',
      })
    }
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
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    var page = this.data.page + 1;
    this.setData({
      page:page
    })
    this.getOrderList()
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