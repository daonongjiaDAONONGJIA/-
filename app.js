//app.js
const util = require('./utils/util.js');
var app = getApp();
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          var that = this;
          //发起网络请求
          wx.request({
           url: that.globalData.mainurl + 'api/user/getopenid',
            data: {
              js_code:res.code,
              grant_type:'authorization_code',
            },
            success:function(response){
              //判断openid是否获取成功
              console.log(response);
              if (response.data.openid != null && response.data.openid != undefined ) {
                //openid赋值
                that.globalData.openid = response.data.openid
                //执行登录方法
                that.getUser();
              } else if (response.data == false){
                console.log('获取openid失败');
              }
            },
            fail:function(){
              console.log('获取openid失败');
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  //登录
  getUser:function(){
    wx.login({
      success: res => {
        if (res.code) {
          var that = this
          var url = that.globalData.mainurl+'api/user/getuser'
          var params = { code: res.code, openid: that.globalData.openid }
          util.wxRequest(url, params, data => {
            if (data.status == 200) {
              console.log(data);
              that.globalData.userInfo = data.data;
              that.globalData.userToken = data.data.token;
              if (that.globalData.userInfo.nickname){
                that.globalData.login = true;
              }
            } else if (data.status == 400) {
              //无此用户
              that.register()
            } else {
              //错误，需用户重新授权登录
              that.globalData.login = false
              wx.showToast({
                title: data.msg,
                icon: 'none',
                duration: 2000
              })
            }
          }, data => { }, data => { })
        }else{
          console.log('登录失败！');
        }
      }
    })
  },
  // 用户注册
  register: function () {
    var that = this
    var url = that.globalData.mainurl + 'api/user/register'
    var params = {
      openid: this.globalData.openid,
      // nickname: this.globalData.userInfo.nickName,
      // head: this.globalData.userInfo.avatarUrl
    }
    util.wxRequest(url, params, data => {
      if (data.status == 200) {
        this.globalData.userInfo = data.data
        this.globalData.login = true
      } else {
        this.globalData.login = false
      }
    }, data => { }, data => { })
  },
  //通用设置
  globalData: {
    mainurl: 'https://m.shanxijsd.com/', //正式使用是https
    mainurlimg:'https://m.shanxijsd.com/uploads/',
    userInfo: [],
    openid: '',
    login: false, //登录状态，token过期为false
    userToken:'',
    cartIds:'',//鲜花订单商品ID
    totalMoney:0.0,//鲜花订单总金额
    wxdata: [], //微信返回信息
    order: [], //订单信息
    orderData:[]
  },
  
})