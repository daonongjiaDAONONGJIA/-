// pages/money_record/index.js
var app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    orderList:[],
    indexs:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    this.setData({
      card_id:options.card_id
    })
    this.getOrder();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getOrder:function(){
    var mainurl = app.globalData.mainurl;
    var openid = app.globalData.openid;
    var params = {
      openid: openid,
      page:this.data.page
    };
    var url = mainurl + 'api/membercard/cardLog';
    util.wxRequest(url, params, data => {
      console.log(data);
      if (data.data.data.length>0){
        var orderList = this.data.orderList;
        for (var i = 0; i < data.data.data.length;i++){
          orderList.push(data.data.data[i])
        }
        this.setData({
          orderList: orderList
        })
        console.log(this.data.orderList)
      }else{
        wx.showToast({
          icon:'none',
          title: '没有更多记录了'
        })
      }
      
      console.log(data);
    }, data => { }, data => { });
  },
  getOrder1:function(){
    var mainurl = app.globalData.mainurl;
    var openid = app.globalData.openid;
    var params = {
      openid: openid,
      page: this.data.page,
      card_id:this.data.card_id
    };
    var url = mainurl + 'api/membercard/moneyLog';
    util.wxRequest(url, params, data => {
      console.log(data);
      if (data.data.data.length > 0) {
        var orderList = this.data.orderList;
        for (var i = 0; i < data.data.data.length; i++) {
          orderList.push(data.data.data[i])
        }
        this.setData({
          orderList: orderList
        })
        console.log(this.data.orderList)
      } else {
        wx.showToast({
          icon: 'none',
          title: '没有更多记录了'
        })
      }
    }, data => { }, data => { });
  },
  getType:function(e){
    console.log(e)
    var index = e.currentTarget.dataset.index;
    this.setData({
      page:1,
      indexs:index,
      orderList:[]
    })
    if(index==1){
      this.getOrder();
    }
    if (index == 2) {
      this.getOrder1();
    }
    console.log(this.data.orderList)
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
    var page = this.data.page+1
    this.setData({
      page: page
    });
    if (this.data.indexs == 1) {
      this.getOrder();
    }
    if (this.data.indexs == 2) {
      this.getOrder1();
    }
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