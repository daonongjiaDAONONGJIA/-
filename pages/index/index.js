//获取应用实例
var app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [{ 'id': 1, 'img': '../../images/ty1.jpg' }, { 'id': 2, 'img': '../../images/ty1.jpg' },{ 'id':3, 'img': '../../images/ty3.jpg' }],
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    //所有图片的高度  
    imgheights: [],
    //图片宽度 
    imgwidth: 750,
    current: 0,
    hotList: [],
    tehuiList: [],
    newList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.loadIndex();
    // this.getHot()
    // this.getTehui()
    // this.getNew()
  },
  //获取热卖商品
  getHot: function () {
    var mainurl = app.globalData.mainurl;
    var url = mainurl + 'api/index/getHot';
    var params = {

    };
    util.wxRequest(url, params, data => {
      console.log(data);
      if (data.code == 200) {
        this.setData({
          hotList: data.data
        })
      }
    }, data => { }, data => { });
  },
  //获取特惠商品
  getTehui: function () {
    var mainurl = app.globalData.mainurl;
    var url = mainurl + 'api/index/getTehui';
    var params = {

    };
    util.wxRequest(url, params, data => {
      if (data.code == 200) {
        this.setData({
          tehuiList: data.data
        })
      }
    }, data => { }, data => { });
  },
  //获取新品商品
  getNew: function () {
    var mainurl = app.globalData.mainurl;
    var url = mainurl + 'api/index/getNew';
    var params = {

    };
    util.wxRequest(url, params, data => {
      if (data.code == 200) {
        this.setData({
          newList: data.data
        })
      }
    }, data => { }, data => { });
  },
 
  //跳转商品详情页面
  showGoods: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../goods/goodsinfo/goods?id=' + id,
    })
  },
  //首页数据获取
  loadIndex: function () {
    var mainurl = app.globalData.mainurl;
    var url = mainurl + 'api/index/hdp';
    var params = {};
    util.wxRequest(url, params, data => {
      //console.log(data['banner'])
      this.setData({
           imgUrls: data['banner']
      })
    }, data => { }, data => { });
  },
  //跳转列表
  toList:function(e){
    var id = e.currentTarget.dataset.id
    console.log(id)
    wx.navigateTo({
      url: '../goods/goodslist/index?cid=' + id
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  imageLoad: function (e) {//获取图片真实宽度 
      var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      //宽高比  
      ratio = imgwidth / imgheight;
      console.log(imgwidth, imgheight)
      //计算的高度值  
      var viewHeight = 750 / ratio;
      var imgheight = viewHeight;
      var imgheights = this.data.imgheights;
      //把每一张图片的对应的高度记录到数组里  
      imgheights[e.target.dataset.id] = imgheight;
      this.setData({
        imgheights: imgheights
      })
    console.log(imgheights)
  },
  bindchange: function (e) {
    // console.log(e.detail.current)
    this.setData({ current: e.detail.current })
  }
})