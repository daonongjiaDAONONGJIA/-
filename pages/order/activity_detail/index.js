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
    var version = app.getVersion();
    this.setData({
      version: version
    })
    wx.hideShareMenu();
    this.setData({
      orderId: options.orderId,
      page: options.page
    })
    this.getOrderInfo()
  },
  // 获取订单详情
  getOrderInfo: function () {
    var orderId = this.data.orderId
    var url = this.data.version + 'api/order/getOrderDetail'
    var params = {
      order_id: orderId,
      openid: app.globalData.openid
    }
    this.setData({
      imgUrl: app.globalData.mainurlimg
    })
    util.wxRequest(url, params, data => {
      if (data.code == 200) {
        console.log(data)
        this.setData({
          order: data.data.order,
          order_activity: data.data.order_activity,
          thumb: data.data.thumb
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
      content: '确定取消定单吗？',
      success: function (res) {
        if (res.confirm) {
          var url = this.data.version + 'api/order/orderCancel'
          var params = {
            id: oid,
            openid: app.globalData.openid
          }
          util.wxRequest(url, params, data => {
            if (data.code == 200) {
              wx.showToast({
                title: '定单成功取消',
                icon: 'success'
              })
              that.getOrderInfo()
            } else {
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
  getRefund: function (e) {
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
              that.getOrderInfo();
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
  getComplete: function (e) {
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
        that.getOrderInfo();
      } else {
        wx.showToast({
          title: data.msg,
          icon: 'none'
        })
      }
    }, data => { }, data => { })
  },
  getOrder: function (e) {
    var id = e.currentTarget.dataset.id
    var mainurl = app.globalData.mainurl;
    var openid = app.globalData.openid;
    var params = {
      openid: openid,
      orderId: id
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
        that.getOrderInfo();
      },
      'fail': function (res) {
        //如果取消支付，执行删除去付款订单
        console.log(res);
      },
      'complete': function (res) {
        console.log(res);
        that.getOrderInfo();
      }
    })
  },
  onUnload: function () {
    if (this.data.page == 'confirm_order') {
      var pages = getCurrentPages()
      console.log(pages);
      for (var i = 0; i < pages.length; i++) {
        if (pages[i].route == "pages/activity_detail/index") {
          var delta = pages.length - i - 2;
          console.log(delta)
          wx.navigateBack({
            delta: delta
          })
        }
      }
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
    if (this.data.page == 'confirm_order') {
      var pages = getCurrentPages()
      console.log(pages);
      for (var i = 0; i < pages.length; i++) {
        if (pages[i].route == "pages/experience_detail/experience_detail") {
          var delta = pages.length - i - 2;
          console.log(delta)
          wx.navigateBack({
            delta: delta
          })
        }
      }
    }
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
  showModal: function () {

    var that = this;

    that.setData({

      value: true

    })

    var animation = wx.createAnimation({

      duration: 600,//动画的持续时间 默认400ms 数值越大，动画越慢 数值越小，动画越快

      timingFunction: 'ease',//动画的效果 默认值是linear

    })

    this.animation = animation

    setTimeout(function () {

      that.fadeIn();//调用显示动画

    }, 200)

  },



  // 隐藏遮罩层

  hideModal: function () {

    var that = this;

    var animation = wx.createAnimation({

      duration: 800,//动画的持续时间 默认400ms 数值越大，动画越慢 数值越小，动画越快

      timingFunction: 'ease',//动画的效果 默认值是linear

    })

    this.animation = animation

    that.fadeDown();//调用隐藏动画

    setTimeout(function () {

      that.setData({

        value: false

      })

    },

      720)//先执行下滑动画，再隐藏模块



  },



  //动画集

  fadeIn: function () {

    this.animation.translateY(0).step()

    this.setData({

      animationData: this.animation.export()//动画实例的export方法导出动画数据传递给组件的animation属性

    })

  },

  fadeDown: function () {

    this.animation.translateY(300).step()

    this.setData({

      animationData: this.animation.export(),

    })

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