// pages/my_center/my_center.js
var app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
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
  //判断是否登录
  getToUser: function (e) {
    console.log(e)
    var skip_url = e.currentTarget.dataset.url
    var openid = app.globalData.openid;
    var mainurl = app.globalData.mainurl;
    var url = mainurl + 'api/User/get_user_info';
    var params = {
      openid: openid
    };
    util.wxRequest(url, params, data => {
      if (data.code == 400) {
        this.setData({
          userType: true
        })
      } else {
        this.getUserAct(skip_url);
      }
    }, data => { }, data => { });
  },
  //判断是否是注册用户
  getUserAct: function (skip_url) {
    var openid = app.globalData.openid;
    var mainurl = app.globalData.mainurl;
    var url = mainurl + 'api/member/getMemberAct';
    var params = {
      openid: openid
    };
    util.wxRequest(url, params, data => {
      if (data.code == 400) {
        wx.navigateTo({
          url: skip_url
        })
      } else {
        wx.showToast({
          title: data.msg,
        })
      }
    }, data => { }, data => { });
  },
  //关闭弹窗
  cole: function () {
    this.setData({
      userType: false
    })
  },
  /**
 * 重新登录
 */
  login: function (e) {
    wx.login({
      success: res => {
        if (res.code) {
          var that = this
          var url = app.globalData.mainurl + 'api/user/getuser'
          var params = {
            code: res.code,
            openid: app.globalData.openid,
            nick_name: e.detail.userInfo.nickName,
            head_src: e.detail.userInfo.avatarUrl,
          }
          util.wxRequest(url, params, data => {
            if (data.status == 200) {
              app.globalData.userInfo = data.data
              app.globalData.login = true
              this.setData({
                userType: false
              })
              wx.showToast({
                title: '登录成功',
                icon: 'success',
                duration: 2000
              })
            } else {
              //错误，需用户重新授权登录
              app.globalData.login = false
              wx.showToast({
                title: data.msg,
                icon: 'none',
                duration: 2000
              })
            }
          }, data => { }, data => { })
        }
      }
    })
  }
})