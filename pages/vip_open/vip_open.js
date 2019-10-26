// pages/vip_open/vip_open.js
var app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:1
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
    this.getMemberCardInfo();
    console.log(this.data.cardInfo)
  },
  // 获取会员卡状态
  getMemberCardInfo: function () {
    var openid = app.globalData.openid;
    var url = this.data.version + 'api/memberCard/getMemberCardInfo'
    var params = {
      openid: openid
    }
    util.wxRequest(url, params, data => {
      console.log(data);
      this.setData({
        cardInfo: data.data,
        fsc_money: parseFloat(data.data.fsc_money),
        roll: parseFloat(data.data.roll)
      })
    }, data => { }, data => { })
  },
  getVip: function () {
    if(this.data.type==1){
      this.wechatPay();
    } else if (this.data.type == 2){
      this.fscPay();
    }else{
      this.rollPay();
    }
  },
  getPayType:function(e){
    var type = e.currentTarget.dataset.type;
    this.setData({
      type:type
    })
  },
  fscPay: function () {
    var mainurl = app.globalData.mainurl;
    var openid = app.globalData.openid;
    var params = {
      openid: openid
    };
    var url = mainurl + 'api/memberCard/fscOrder';
    util.wxRequest(url, params, data => {
      console.log(data);
      if(data.code==200){
        wx.showToast({
          icon:'none',
          title: data.msg
        })
        setTimeout(function(){
          wx.switchTab({
            url: '/pages/my_center/my_center',
            success: function (e) {
              var page = getCurrentPages().pop();
              if (page == undefined || page == null) return;
              page.onLoad();
            }
          })
        },2000)
      }else{
        wx.showToast({
          icon: 'none',
          title: data.msg
        })
      }
    }, data => { }, data => { });
  },
  rollPay: function () {
    var mainurl = app.globalData.mainurl;
    var openid = app.globalData.openid;
    var params = {
      openid: openid
    };
    var url = mainurl + 'api/membercard/rollOrder';
    util.wxRequest(url, params, data => {
      console.log(data);
      if (data.code == 200) {
        wx.showToast({
          icon: 'none',
          title: data.msg
        })
        setTimeout(function () {
          wx.switchTab({
            url: '/pages/my_center/my_center',
            success: function (e) {
              var page = getCurrentPages().pop();
              if (page == undefined || page == null) return;
              page.onLoad();
            }
          })
        }, 2000)
      } else {
        wx.showToast({
          icon: 'none',
          title: data.msg
        })
      }
    }, data => { }, data => { });
  },
  wechatPay:function(){
    var mainurl = app.globalData.mainurl;
    var openid = app.globalData.openid;
    var params = {
      openid: openid
    };
    var url = mainurl + 'api/memberCard/submitOrder';
    util.wxRequest(url, params, data => {
      console.log(data);
      this.setData({
        wxdata: data.data.wxData
      })
      this.pay();
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
        wx.showToast({
          icon: 'none',
          title: data.msg
        })
        wx.switchTab({
          url: '/pages/my_center/my_center',
          success: function (e) {
            var page = getCurrentPages().pop();
            if (page == undefined || page == null) return;
            page.onLoad();
          }
        })
      },
      'fail': function (res) {
        //如果取消支付，执行删除去付款订单
        console.log(res);
      },
      'complete': function (res) {
        console.log(res);
        //that.getMemberStatus();
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

    }, 720)
    //先执行下滑动画，再隐藏模块
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