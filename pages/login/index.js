// pages/login/index.js
var app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    unionid:'',
    is_phone:0
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
    var version = app.getVersion();
    this.setData({
      version: version
    })
    this.getUserInfo();
  },
  //根据openid获取用户信息
  getUserInfo: function () {
    var params = {
      openid: app.globalData.openid
    }
    var url = this.data.version + 'api/user/userQurey';
    util.wxRequest(url, params, data => {
      console.log(data);
      if (data.code == 200) {
        this.setData({
          userInfo:data.data
        })
        if (data.data.unionid!=null){
          this.setData({
            unionid: data.data.unionid
          })
        }
        if (data.data.phone!= null) {
          this.setData({
            phone: data.data.phone
          })
        }
      }
    }, data => { }, data => { })
  },
  //获取用户权限
  getAuthorize: function (e) {
    var that = this;
    console.log(e);
    wx.login({
      success: res => {
        if (res.code) {
          console.log(res);
          var loginCode = res.code
          wx.request({
            url: that.data.version + 'api/user/getopenid',
            data: {
              js_code: res.code,
              grant_type: 'authorization_code',
            },
            success: function (response) {
              console.log(response);
              if (response.data.openid != null && response.data.openid != undefined) {
                that.setData({
                  session_key: response.data.session_key,
                  loginCode: loginCode,
                  encryptedData: encodeURIComponent(e.detail.encryptedData),
                  iv: e.detail.iv
                })
                if (e.type == 'getphonenumber') {
                  that.getAuthorizeInfo(e.type);
                }else{
                  that.getAuthorizeInfo(e.type);
                }
              } else if (response.data == false) {
                console.log('获取openid失败');
              }
            },
            fail: function () {
              console.log('获取openid失败');
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  //解码获取unionid ，手机号等信息
  getAuthorizeInfo: function (type) {
    var params = {
      encryptedData: this.data.encryptedData,
      iv: this.data.iv,
      session_key: this.data.session_key,
      openid: app.globalData.openid
    }
    var url = this.data.version + 'api/user/decryptData';
    util.wxRequest(url, params, data => {
      console.log(data);
      if (data.code == 200) {
        if (type == 'getphonenumber') {
          //绑定用户手机号
          this.bindPhone(data.data);
        } else {
          //绑定用户信息
          this.bindUser(data.data);
        }
      } else {
        wx.showToast({
          icon: 'none',
          title: data.msg
        })
      }
    }, data => { }, data => { })
  },
  //绑定用户手机号
  bindPhone: function (data) {
    var params = {
      openid: app.globalData.openid,
      phone: data.purePhoneNumber
    }
    var url = this.data.version + 'api/user/phoneBinding';
    util.wxRequest(url, params, data => {
      console.log(data);
      if (data.code == 200) {
        wx.showToast({
          icon: 'none',
          title: '获取成功！'
        });
        wx.navigateBack()
      } else {
        wx.showToast({
          icon: 'none',
          title: data.msg
        })
      }
    }, data => { }, data => { })
  },
  closePhone:function(){
    this.setData({
      is_phone:0
    })
  },
  //绑定用户信息
  bindUser: function (data) {
    var unionid = data.unionId;
    var params = {
      openid: app.globalData.openid,
      unionid: data.unionId,
      head_src: data.avatarUrl,
      nick_name: data.nickName
    }
    var url = this.data.version + 'api/user/unionidBinding';
    util.wxRequest(url, params, data => {
      console.log(data);
      if (data.code == 200) {
        this.setData({
          unionid: unionid,
          is_phone: 1
        });
        wx.showToast({
          icon: 'none',
          title: '获取成功！'
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: data.msg
        })
      }
    }, data => { }, data => { })
  },
  phoneAuth:function(type){
    this.setData({
      is_phone: 1
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