//app.js
const util = require('./utils/util.js');
var app = getApp();
App({
  onLaunch: function () {
    //判断是否有新版本
    if (wx.canIUse('getUpdateManager')) { // 基础库 1.9.90 开始支持，低版本需做兼容处理
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(function (result) {
        if (result.hasUpdate) { // 有新版本
          updateManager.onUpdateReady(function () { // 新的版本已经下载好
            wx.showModal({
              title: '更新提示',
              content: '新版本已经下载好，请重启应用。',
              showCancel:false,
              success: function (result) {
                updateManager.applyUpdate();
              }
            });
          });
          updateManager.onUpdateFailed(function () { // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
            });
          });
        }
      });
    }else { // 有更新肯定要用户使用新版本，对不支持的低版本客户端提示
      wx.showModal({
        title: '温馨提示',
        content: '当前微信版本过低，无法使用该应用，请升级到最新微信版本后重试。'
      });
    }
    var version = this.getVersion();
    this.userLogin();
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
  userLogin:function(){
    this.getToken()
      .then(jj => {
        return this.getUser();
      })
      .then(hh => {
        if(hh==0){
          return this.register();
        }
      })
  },
  //登录
  getUser:function(){
    var version = this.getVersion();
    var p = new Promise((resolve, reject) => {
      wx.login({
        success: res => {
          if (res.code) {
            var that = this
            var url = version + 'api/user/getuser'
            var params = { code: res.code, openid: that.globalData.openid }
            util.wxRequest(url, params, data => {
              if (data.status == 200) {
                that.globalData.login = true;
                resolve(1);
              } else if (data.status == 400) {
                //无此用户
                resolve(0);
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
          } else {
            console.log('登录失败！');
          }
        }
      })
    })
    return p;
  },
  // 用户注册
  register: function () {
    var that = this;
    var version = this.getVersion();
    var params = {
      openid: this.globalData.openid
    }
    var p = new Promise((resolve, reject) => {
      var url = version + 'api/user/register'
      util.wxRequest(url, params, data => {
        if (data.status == 200) {
          that.globalData.login = true;
          resolve(1)
        } else {
          this.globalData.login = false;
          resolve(0)
        }
      }, data => { }, data => { })
    })
    return p;
  },
  getToken:function () {
    var version = this.getVersion();
    var p = new Promise((resolve, reject) => {
      // 登录
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          if (res.code) {
            var that = this;
            //发起网络请求
            wx.request({
              url: version + 'api/user/getopenid',
              data: {
                js_code: res.code,
                grant_type: 'authorization_code',
              },
              success: function (response) {
                //判断openid是否获取成功
                console.log(response);
                if (response.data.openid != null && response.data.openid != undefined) {
                  //openid赋值
                  that.globalData.openid = response.data.openid;
                  var openid = response.data.openid;
                  resolve(openid);
                } else if (response.data == false) {
                  console.log('获取openid失败');
                }
              },
              fail() {
                reject();
              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    })
    return p;
  },
  //根据openid获取用户信息
  getUserInfo: function () {
    var version = this.getVersion();
    var params = {
      openid: this.globalData.openid
    }
    var p = new Promise((resolve, reject) => {
      var url = version + 'api/user/userQurey';
      util.wxRequest(url, params, data => {
        console.log(data);
        if (data.code == 200) {
          resolve(data.data);
        }
      }, data => { }, data => { })
    })
    return p;
  },
  getVersion: function () {
    console.log('envVersion', __wxConfig.envVersion);
    let version = __wxConfig.envVersion;
    switch (version) {
      case 'develop':
        return 'https://m.shanxijsd.com/';
        break;
      case 'trial':
        return 'https://m.shanxijsd.com/';
        break;
      case 'release':
        return 'https://m.shanxijsd.com/';
        break;
      default:
        return 'https://ceshi.shanxijsd.com/';
    }
  },
  //通用设置
  globalData: {
    mainurl: 'https://m.shanxijsd.com/', //正式使用是https
    mainurlimg:'https://m.shanxijsd.com/uploads/',
    openid: '',
    login: false, //登录状态，token过期为false
  }
})