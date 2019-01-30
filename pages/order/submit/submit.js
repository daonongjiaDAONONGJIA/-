// pages/order/submit/submit.js
const util = require('../../../utils/util.js')

//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: [],
    cartList: [],
    cartIds: [],
    totalMoney: 0.00,
    order: [],
    wxdata: [],
    ordertype:'',
    date:'',
    showModal: false,
    cashList:'',
    j_money:0,
    yhjid:0,
    yhjnum:0,
    yhjid_temp:0,
    j_money_temp:0,
    yhjnum_temp:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    this.setData({
      cartIds: app.globalData.cartIds,
      totalMoney: app.globalData.totalMoney,
      ordertype: options.ordertype
    })
    var date = this.getNowFormatDate();
    this.setData({
      date: date
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getCarts()
    this.getCash()
  },

  //获取默认快递和购物车数据
  getCarts: function() {
    var url = app.globalData.mainurl + 'Api/Cart/getCarts'
    var params = {
      cartIds: this.data.cartIds,
      openid: app.globalData.openid,
      token: app.globalData.userInfo.token
    }
    util.wxRequest(url, params, data => {
      if (data.code == 200) {
        this.setData({
          address: data.data.address,
          cartList: data.data.cartList,
        })
      } else {
        app.globalData.login = false
        wx.showToast({
          title: data.msg,
          icon: 'none',
          duration: 2000
        })
      }
    }, data => {}, data => {})
  },
  getCash: function () {
    var url = app.globalData.mainurl + 'API/order/getYhj'
    var params = {
      openid: app.globalData.openid,
      token: app.globalData.userInfo.token,
      totalMoney: this.data.totalMoney
    }
    util.wxRequest(url, params, data => {
      if (data.code == 200) {
        this.setData({
          cashList: data.data,
          yhjnum: data.data.length+'张'
        })
      } else {
        wx.showToast({
          title: data.msg,
          icon: 'none',
          duration: 2000
        })
      }
    }, data => { }, data => { })
  },
  cashSel:function(e){
    var yhjid = e.currentTarget.dataset.id;
    var j_money = e.currentTarget.dataset.price;
    if (yhjid == this.data.yhjid_temp){
      var yhjnum = this.data.cashList.length;
      this.setData({
        j_money_temp: 0,
        yhjnum_temp: yhjnum + '张',
        yhjid_temp: 0
      });
    }else{
      this.setData({
        j_money_temp: j_money,
        yhjnum_temp: "-" + j_money,
        yhjid_temp: yhjid
      });
    }
    
  },
  comfirmCash:function(){
    var j_money = this.data.j_money_temp;
    var yhjid = this.data.yhjid_temp;
    var yhjnum = this.data.yhjnum_temp;
    var totalMoney = app.globalData.totalMoney - this.data.j_money_temp
    this.setData({
      j_money: j_money,
      yhjnum: yhjnum,
      yhjid: yhjid,
      totalMoney: totalMoney,
      showModal: false
    })
  },
  //重新设置收货地址
  addressSelect: function() {
    wx.navigateTo({
      url: '../../address/list/list',
    })
  },
  submit: function () {
    var sn = this.data.order.order_sn_submit
    console.log(sn);
    var url = app.globalData.mainurl + 'Api/Order/judgeOrder'
    var params = {
      sn: sn,
    }
    util.wxRequest(url, params, data => {
      console.log(data);
      if (data.code == 200) {
        this.submit2()
      } else {
        wx.showToast({
          title: data.msg,
          icon: 'none'
        });
        setTimeout(function () {
          //要延时执行的代码
        }, 2000)
      }
    }, data => { }, data => { })
  },
  //提交订单（微信需要两次验签）
  submit2: function () {
    var url = app.globalData.mainurl + 'Api/Order/submitOrder'
    var params = {
      cartIds: this.data.cartIds,
      address: this.data.address,
      totalMoney: this.data.totalMoney,
      openid: app.globalData.openid,
      token: app.globalData.userInfo.token,
      totime: this.data.date,
      yhjid: this.data.yhjid,
      ordertype:1
    }
    util.wxRequest(url, params, data => {
      if (data.code == 200) {
        app.globalData.wxdata = data.data.wxData
        app.globalData.order = data.order
        this.setData({
          order: app.globalData.order,
          wxdata: app.globalData.wxdata
        })
        this.pay()
      } else {
        app.globalData.login = false
        wx.showToast({
          title: data.msg,
          icon: 'none'
        })
      }
    }, data => { }, data => { })
  },
  // 发起微信支付
  pay: function() {
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
      'success': function(res) {
        console.log(res)
        wx.navigateTo({
           url: '../details/details?orderId=' + that.data.orderId
        })
      },
      'fail': function(res) {
        //如果取消支付，执行删除去付款订单
        console.log(res)
      },
      'complete': function(res) {
        //console.log(res);

      },
    })
  },
  //回调
  notify: function() {
    var url = app.globalData.mainurl + 'Api/notify/notify'
    var params = {}
    util.wxRequest(url, params, data => {
      console.log(data);
    }, data => {}, data => {})
  },
  //删除订单
  cancelPay: function() {
    var orderId = that.data.order.id;
    console.log(orderId);
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  getNowFormatDate:function() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
  },
  showCash: function () {
    this.setData({
      showModal: true
    })
  },
  hideCash: function () {
    this.setData({
      showModal: false,
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})