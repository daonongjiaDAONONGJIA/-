var app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contactLists:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showToast({
      icon: 'loading',
      title: '数据加载中~'
    })
    this.contactList();
  },
  // 获取收藏列表
  contactList: function () {
    var mainurl = app.globalData.mainurl;
    var openid = app.globalData.openid;
    var params = {
      openid: openid,
      token: app.globalData.userInfo.token,
      page: this.data.page
    };
    var url = mainurl + 'api/user/getContact';
    util.wxRequest(url, params, data => {
      console.log(data)
      wx.hideToast();
      this.setData({
        contactLists: data.data
      })
    }, data => { }, data => { });
  },
  // 添加联系人
  addContact:function(){
    wx.navigateTo({
      url: '/pages/add_contact/add_contact'
    })
  },
  //设置默认 删除 联系人
  operateContact:function(e){
    console.log(e);
    var operate = e.currentTarget.dataset.operate;
    var id = e.currentTarget.dataset.id;
    if (operate=="default"){
      this.defaultContact(id)
    }
    if (operate == "edit") {
      this.editContact(id)
    }
    if (operate == "delete") {
      wx.showModal({
        title: '提示',
        content: '你确定要删除此联系人么？',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定');
            this.deleteContact(id)
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  editContact:function(id){
    wx.navigateTo({
      url: '/pages/edit_contact/edit_contact?id='+id,
    })
  },
  defaultContact: function (id) {
    var mainurl = app.globalData.mainurl;
    var openid = app.globalData.openid;
    var params = {
      openid: openid,
      token: app.globalData.userInfo.token,
      id: id
    };
    var url = mainurl + 'api/user/setContact';
    util.wxRequest(url, params, data => {
      console.log(data)
      this.contactList();
    }, data => { }, data => { });
  },
  deleteContact:function(id){
    var mainurl = app.globalData.mainurl;
    var openid = app.globalData.openid;
    var params = {
      openid: openid,
      token: app.globalData.userInfo.token,
      id: id
    };
    var url = mainurl + 'api/user/delContact';
    util.wxRequest(url, params, data => {
      console.log(data)
      this.contactList();
    }, data => { }, data => { });
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

  }
})