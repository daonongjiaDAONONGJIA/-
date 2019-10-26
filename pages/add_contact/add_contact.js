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
    var version = app.getVersion();
    wx.hideShareMenu();
    var type = options.type;
    this.setData({
      type:type,
      version: version
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //添加联系人
  addContact:function(e){
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    var mainurl = this.data.version;
    var openid = app.globalData.openid;
    var params = {
      openid: openid,
      name:e.detail.value.name,
      phone:e.detail.value.phone,
      idcard:e.detail.value.idcard
    };
    var url = mainurl + 'api/user/addContact';
    util.wxRequest(url, params, data => {
      console.log(data);
      if(data.code==200){
        wx.showToast({
          title: data.msg,
        })
        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1];   //当前页面
        var prevPage = pages[pages.length - 2];  //上一个页面
        //直接调用上一个页面对象的setData()方法，把数据存到上一个页面中去
        wx.navigateBack({
          delta: 1,
          success: function () {
            prevPage.contactList(); // 执行前一个页面的onLoad方法
          }
        })
      }else{
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