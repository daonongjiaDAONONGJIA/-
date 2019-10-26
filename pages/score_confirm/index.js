// pages/goods_confirm/index.js
const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_default: 0,
    consignee_id: 0
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
    this.setData({
      id: options.id
    })
    this.getMemberCardInfo();
    this.goodsInfo();
    this.getContact();
  },
  // 获取会员卡状态
  getMemberCardInfo: function () {
    var openid = app.globalData.openid;
    var mainurl = app.globalData.mainurl;
    var url = this.data.version + 'api/memberCard/getMemberCardInfo'
    var params = {
      openid: openid
    }
    util.wxRequest(url, params, data => {
      console.log(data);
      var cardInfo = data.data;
      this.setData({
        cardInfo: cardInfo
      })
    }, data => { }, data => { })
  },
  goodsInfo: function () {
    var openid = app.globalData.openid;
    var url = this.data.version + 'api/task/goodsInfo'
    var params = {
      id: this.data.id,
      openid: openid
    }
    util.wxRequest(url, params, data => {
      console.log(data);
      if (data.code == 200) {
        this.setData({
          goodsInfo: data.data
        })
      } else {
        
      }
    }, data => { }, data => { })
  },
  //添加联系人
  addConsignee: function () {
    wx.navigateTo({
      url: '/pages/sel_consignee/index?consignee_id=' + this.data.consignee_id
    })
  },
  //获取常用联系人
  getContact: function () {
    var mainurl = app.globalData.mainurl;
    var openid = app.globalData.openid;
    var url = this.data.version + 'api/user/getConsigneeDefault';
    var params = {
      openid: openid
    };
    util.wxRequest(url, params, data => {
      console.log(data);
      if (data.code == 200) {
        this.setData({
          is_default: 1,
          contactDefault: data.data,
          consignee_id: data.data.id
        })
      } else {
        this.setData({
          is_default: 0
        })
      }
    }, data => { }, data => { });
  },
  confirmOrder: function () {
    if (this.data.consignee_id == 0) {
      wx.showToast({
        icon: 'none',
        title: '请添加收货人！'
      });
      return false;
    }
    var openid = app.globalData.openid;
    var mainurl = app.globalData.mainurl;
    var url = this.data.version + 'api/task/submitGoods'
    var params = {
      openid: openid,
      goods_id:this.data.id,
      consignee_id: this.data.consignee_id
    }
    util.wxRequest(url, params, data => {
      console.log(data);
      if(data.code==200){
        wx.showToast({
          icon: 'none',
          title: data.msg
        })
        wx.navigateTo({
          url: '/pages/score_order/index',
        })
      }else{
        wx.showToast({
          icon:'none',
          title: data.msg
        })
      }
    }, data => { }, data => { })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getVoucher: function () {
    wx.navigateTo({
      url: '/pages/voucher_list/index',
    })
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