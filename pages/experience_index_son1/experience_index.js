// pages/experience_index/experience_index.js
var app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [{ 'id': 1, 'img': 'https://m.shanxijsd.com/static/images/ty1.jpg' }, { 'id': 2, 'img': 'https://m.shanxijsd.com/static/images/ty1.jpg' }, { 'id': 3, 'img': 'https://m.shanxijsd.com/static/images/ty3.jpg' }],
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    //所有图片的高度  
    imgheights: [],
    //图片宽度 
    imgwidth: 750,
    current: 0,
    cid:0,
    page:1,
    keywords:'',
    goodsList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var version = app.getVersion();
    this.setData({
      version: version
    })
    if (app.globalData.login == false) {
      app.userLogin().then((resArg) => {
        that.goodList();
        that.getRecommend();
      })
    } else {
      that.goodList();
      that.getRecommend();
    }
  },
  getRecommend: function (id) {
    var openid = app.globalData.openid;
    var url = this.data.version + 'api/ad/adPosData';
    var params = {
      openid: openid,
      type_id: 'TopHomestay'
    };
    util.wxRequest(url, params, data => {
      if (data.code == 200) {
        console.log(data);
        this.setData({
          list: data.data,
          imgList: data.posRes
        })
      }
    }, data => { }, data => { });
  },
  getArea:function(){
    var mainurl = app.globalData.mainurl;
    var url = this.data.version  + 'api/ad/getWar';
    var params = {

    };
    util.wxRequest(url, params, data => {
      console.log(data);
      if (data.code == 200) {
        this.setData({
          areaList: data.list
        })
      }
    }, data => { }, data => { });
  },
  //产品列表页
  goodList: function () {
    if (this.data.cid != 0) {
      var params = {
        page: this.data.page,
        cid: this.data.cid,
        keywords: this.data.keywords
      };
    } else {
      var params = {
        page: this.data.page,
        status: 'all',
        keywords: this.data.keywords
      };
    }
    console.log(params);
    var url = this.data.version + 'api/goods/getGoodsAll/';
    util.wxRequest(url, params, data => {
      wx.hideToast();
      var goodsList = this.data.goodsList;
      if (data.goods.data.length == 0) {
        wx.showToast({
          title: '暂无更多数据~',
          icon: 'none'
        })
        // 隐藏加载框
        wx.hideLoading();
      } else {
        for (var i = 0; i < data.goods.data.length; i++) {
          goodsList.push(data.goods.data[i]);
        }
        // 设置数据
        this.setData({
          goodsList: goodsList
        })
        // 隐藏加载框
        wx.hideLoading();
      }
      // this.setData({
      //   goodsList: data.goods.data
      // })
    }, data => { }, data => { });
  },
  //跳转商品详情页面
  showGoods: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/experience_detail/experience_detail?id=' + id,
    })
  },
  search: function (e) {
    console.log(e.detail.value);
    this.setData({ keywords: e.detail.value })
  },
  getSearch: function () {
    if (this.data.keywords.length > 0) {
      this.setData({
        page: 1
      })
      this.goodList();
    } else {
      this.setData({
        page: 1,
        keywords:''
      })
    }

  },
  getShop:function(){
    wx.navigateTo({
      url: '/pages/shop/shop'
    })
  },
  getPackage:function(){
    wx.navigateTo({
      url: '/pages/package/index'
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
    var page = this.data.page + 1;
    this.setData({
      page: page
    })
    this.goodList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  imageLoad: function (e) {//获取图片真实宽度 
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      //宽高比  
      ratio = imgwidth / imgheight;
    //console.log(imgwidth, imgheight)
    //计算的高度值  
    var viewHeight = 750 / ratio;
    var imgheight = viewHeight;
    var imgheights = this.data.imgheights;
    //把每一张图片的对应的高度记录到数组里  
    imgheights.push(imgheight);
    this.setData({
      imgheights: imgheights
    })
    //console.log(imgheights)
  },
  bindchange: function (e) {
    console.log(e.detail.current)
    this.setData({ current: e.detail.current })
  }
})