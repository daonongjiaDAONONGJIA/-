var app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contactList:[],
    sel_id:0
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
    var consignee_id = options.consignee_id;
    this.setData({
      consignee_id: consignee_id,
      sel_id: consignee_id
    })
    wx.showToast({
      icon: 'loading',
      title: '数据加载中~'
    })
    this.getConsignee();
  },
  // 获取出行人列表
  getConsignee: function () {
    var mainurl = this.data.version;
    var openid = app.globalData.openid;
    var params = {
      openid: openid,
      page: this.data.page
    };
    var contactList = this.data.contactList;
    var url = mainurl + 'api/user/getConsignee';
    util.wxRequest(url, params, data => {
      console.log(data);
      this.setData({
        contactList:data.data
      })
      wx.hideToast();
    }, data => { }, data => { });
  },
  selContact: function (e) {
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    this.setData({
      sel_id:id
    });
    var contactDefault = this.data.contactList[index];
    var consignee_id = this.data.contactList[index].id;
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    //直接调用上一个页面对象的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
      is_default: 1,
      contactDefault: contactDefault,
      consignee_id: consignee_id
    });
    wx.navigateBack({
      delta: 1
    })
  },
  // 添加联系人
  addContact: function () {
    wx.navigateTo({
      url: '/pages/add_consignee/index?type=sel'
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