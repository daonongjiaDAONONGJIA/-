// pages/add_contact/add_contact.js
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
    wx.hideShareMenu();
    var id = options.id;
    this.setData({
      id:id
    })
    this.getContact();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //获取联系人信息
  getContact:function(){
    var mainurl = app.globalData.mainurl;
    var openid = app.globalData.openid;
    var params = {
      openid: openid,
      id: this.data.id
    };
    var url = mainurl + 'api/user/getConsigneeInfo';
    util.wxRequest(url, params, data => {
      console.log(data)
      wx.hideToast();
      this.setData({
        contact: data.data
      })
    }, data => { }, data => { });
  },
  //修改联系人
  editConsignee: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    var mainurl = app.globalData.mainurl;
    var openid = app.globalData.openid;
    var params = {
      id:this.data.id,
      openid: openid,
      name: e.detail.value.name,
      phone: e.detail.value.phone,
      address: e.detail.value.address
    };
    var url = mainurl + 'api/user/updateConsignee';
    util.wxRequest(url, params, data => {
      console.log(data);
      if (data.code == 200) {
        wx.showToast({
          title: data.msg,
        })
        wx.navigateTo({
          url: '/pages/consignee/index',
        })
      } else {
        wx.showToast({
          title: data.msg,
        })
      }
    }, data => { }, data => { });
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