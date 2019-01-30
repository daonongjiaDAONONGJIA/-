// pages/confirm_order/confirm_order.js
var app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    people_num:1,
    totalPrice:0,
    order_sn_submit:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var goods_id = options.goods_id;
    this.setData({
      goods_id: goods_id,
      date: app.globalData.orderData.date.sort()
    });
    if (app.globalData.orderData.people_num){
      this.setData({
        people_num: app.globalData.orderData.people_num,
      })
    }else{
      app.globalData.orderData.people_num = this.data.people_num
    }
    this.getDate();
    this.getDetail();
    this.getContact();
  },  
  // 获取日期
  getDate:function(){
    var mainurl = app.globalData.mainurl;
    var openid = app.globalData.openid;
    var url = mainurl + 'api/goods/getDate';
    var params = {
      id: this.data.goods_id
    };
    util.wxRequest(url, params, data => {
      //console.log(data);
      wx.hideToast();
      let dateIds = "";
      for(var i in data.data){
        if (this.data.date.indexOf(data.data[i].date)!=-1){
          dateIds += data.data[i].id+','
        }
      }
      this.setData({
        selectDate: dateIds
      })
      console.log(this.data.selectDate);
    }, data => { }, data => { });
  },
  // 获取体验详细
  getDetail: function () {
    var mainurl = app.globalData.mainurl;
    var openid = app.globalData.openid;
    var url = mainurl + 'api/goods/getGoodsInfo';
    var params = {
      id: this.data.goods_id,
      openid: openid
    };
    util.wxRequest(url, params, data => {
      this.setData({
        goodsInfo: data.goodsInfo
      })
      console.log(this.data.date.length)
      var totalPrice = parseFloat(this.data.goodsInfo.shop_price) * this.data.date.length*this.data.people_num
      this.setData({
        totalPrice: totalPrice
      })
    }, data => { }, data => { });
  },
  //获取常用联系人
  getContact:function(){
    console.log(app.globalData.orderData.name);
    if (app.globalData.orderData.name){
      var contact = {
       'name': app.globalData.orderData.name,
       'phone': app.globalData.orderData.phone,
       'idcard': app.globalData.orderData.idcard
      }
      this.setData({
        contact: contact
      })
    }else{
      var mainurl = app.globalData.mainurl;
      var openid = app.globalData.openid;
      var url = mainurl + 'api/user/getContactDefault';
      var params = {
        token: app.globalData.userInfo.token,
        openid: openid
      };
      util.wxRequest(url, params, data => {
        console.log(data);
        this.setData({
          contact: data.data
        });
        app.globalData.orderData.name = data.data.name;
        app.globalData.orderData.phone = data.data.phone;
        app.globalData.orderData.idcard = data.data.idcard;
      }, data => { }, data => { });
    }
  },
  // 修改人数
  changeNum:function(e){
    //console.log(e);
    var cz = e.currentTarget.dataset.cz;
    var num = this.data.people_num;
    if(cz=='add'){
      num = num+1
    }else{
      if(num>1){
        num = num - 1
      }else{
        wx.showToast({
          title: '最少人数是一位！',
          icon:'none'
        })
      }
    }
    var totalPrice = parseFloat(this.data.goodsInfo.shop_price) *this.data.date.length*num;
    this.setData({
      totalPrice: totalPrice,
      people_num:num
    })
    app.globalData.orderData.people_num = num;
    app.globalData.orderData.totalPrice = totalPrice;
  },
  //修改日期
  changeDate:function(){
    wx.navigateTo({
      url: '/pages/change_date/change_date?goods_id='+this.data.goods_id,
    })
  },
  //修改常用联系人
  changeContact:function(){
    wx.navigateTo({
      url: '/pages/change_contact/change_contact?goods_id='+this.data.goods_id,
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
    console.log('测试下重新进页面');
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
    
  },
  confirmOrder: function (){
    if (this.data.order_sn_submit!=''){
      var url = app.globalData.mainurl + 'api/order/judgeOrder'
      var params = {
        order_sn_submit: this.data.order_sn_submit
      }
      util.wxRequest(url, params, data => {
        if (data.code == 400) {
          console.log(data);
          wx.showToast({
            title: data.msg,
            icon: 'none'
          })
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
      }, data => { }, data => { })
    }
    var mainurl = app.globalData.mainurl;
    var openid = app.globalData.openid;
    var user = { "name": this.data.contact.name, "phone": this.data.contact.phone, "idcard": this.data.contact.idcard}
    var params = {
      openid: openid,
      goodsId: this.data.goods_id,
      token: app.globalData.userInfo.token,
      totalMoney:this.data.totalPrice,
      orderNum: this.data.people_num,
      dateId: this.data.selectDate,
      user: user
    };
    console.log(params);
    var url = mainurl + 'api/order/submitOrder';
    util.wxRequest(url, params, data => {
      console.log(data)
      this.setData({
        wxdata: data.data.wxData,
        order:data.order,
        order_sn_submit: data.order.order_sn_submit
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
        app.globalData.orderData = [];
        wx.navigateTo({
          url: '/pages/skip/skip?page=order&order_id=' + that.data.order.id + '&totalPrice=' + that.data.order.total_money + '&goods_id=' + that.data.order.goods_id,
        })
      },
      'fail': function (res) {
        //如果取消支付，执行删除去付款订单
        console.log(res);
      },
      'complete': function (res) {
        console.log(res);
        wx.navigateTo({
          url: '/pages/skip/skip?page=order&order_id=' + that.data.order.id + '&totalPrice=' + that.data.order.total_money + '&goods_id=' + that.data.order.goods_id,
        })
      }
    })
  }
})