// pages/my_center/my_center.js
var app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_show: 0,
    unionid:'',
    phone:''
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
    this.getUnionid();
    this.getMemberStatus();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getMemberStatus:function(){
    var mainurl = this.data.version;
    var openid = app.globalData.openid;
    var params = {
      openid: openid
    };
    var url = mainurl + 'api/memberCard/getMemberCardInfo';
    util.wxRequest(url, params, data => {
      console.log(data);
      this.setData({
        status:data
      })
      console.log(this.data.status);
    }, data => { }, data => { });
  },
  //卡片页面
  getVip:function(){
    wx.navigateTo({
      url: '/pages/my_card/index',
    })
  },
  getVip1:function(){
    wx.navigateTo({
      url: '/pages/vip_intro/vip_intro',
    })
  },
  //根据openid获取用户信息
  getUnionid: function () {
    var params = {
      openid: app.globalData.openid
    }
    console.log(app.globalData.openid);
    var url = this.data.version + 'api/user/userQurey';
    util.wxRequest(url, params, data => {
      console.log(data);
      if (data.code == 200) {
        if (data.data.unionid != null && data.data.phone!=null) {
          this.setData({
            unionid: data.data.unionid,
            phone:data.data.phone,
            is_show: 0
          }) 
        } else {
          this.setData({
            is_show: 1
          })
        }
      }
    }, data => { }, data => { })
  },
  //登录页面
  userLogin:function(){
     wx.navigateTo({
       url: '/pages/login/index'
     })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getUnionid();
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
  },
  //判断是否登录状态
  getToUser: function (e) {
    console.log(e)
    var skip_url = e.currentTarget.dataset.url;
    if (this.data.unionid==''){
       wx.navigateTo({
         url: '/pages/login/index'
       })
    }else{
      wx.navigateTo({
        url: skip_url
      })
    }
  }
})