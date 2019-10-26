// pages/experience_detail1/index.js
var app = getApp();
const util = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    //所有图片的高度  
    imgheights: [],
    //图片宽度 
    imgwidth: 750,
    current: 0,
    imgList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    var version = app.getVersion();
    this.setData({
      version: version
    })
    var goods_id = options.goods_id;
    this.setData({
      id: id,
      goods_id: goods_id
    })
    wx.showToast({
      icon: 'loading',
      title: '数据加载中~'
    })
    var that = this;
    if (!app.globalData.openid) {
      app.getToken().then((resArg) => {
        that.goodsType();
      })
    } else {
      that.goodsType();
    }
  },
  getStyle:function(){
    wx.navigateTo({
      url: '/pages/style/index?id=' + this.data.id + "&type=type"
    })
  },
  goodsType: function () {
    WxParse.emojisInit('[]', "/wxParse/emojis/", {
      "00": "00.gif",
      "01": "01.gif",
      "02": "02.gif",
      "03": "03.gif",
      "04": "04.gif",
      "05": "05.gif",
      "06": "06.gif",
      "07": "07.gif",
      "08": "08.gif",
      "09": "09.gif",
      "09": "09.gif",
      "10": "10.gif",
      "11": "11.gif",
      "12": "12.gif",
      "13": "13.gif",
      "14": "14.gif",
      "15": "15.gif",
      "16": "16.gif",
      "17": "17.gif",
      "18": "18.gif",
      "19": "19.gif",
    });
    var mainurl = app.globalData.mainurl;
    var openid = app.globalData.openid;
    var params = {
      id: this.data.id,
      openid: openid
    };
    var url = this.data.version + 'api/goods/getPriceType';
    util.wxRequest(url, params, data => {
      wx.hideToast();
      this.setData({
        goodsInfo:data.data,
        imgList: data.data.thumb,
        goodsComment: data.data.comment,
        // contentList: data.data.contentList
      })
      var article = WxParse.wxParse('article', 'html', data.data.content, this, 5);
    }, data => { }, data => { });
  },
  goodsBuy:function(){
    // wx.navigateTo({
    //   url: '/pages/confirm_order1/index?type=' + this.data.id+'&goods_id=' + this.data.goods_id,
    // })
    wx.navigateTo({
      url: '/pages/experience_confirm/index?type=' + this.data.id+'&goods_id=' + this.data.goods_id,
    })
  },
  getMember:function(){
    wx.navigateTo({
      url: '/pages/vip_intro/vip_intro'
    })
  },
  getVoucher: function () {
    wx.navigateTo({
      url: '/pages/my_discount/index'
    })
  },
  getCard: function () {
    wx.navigateTo({
      url: '/pages/my_card/index'
    })
  },
  getPicBig:function(e){
    var imgs = e.currentTarget.dataset.imgs;
    var imgs_temp = [];
    for(var i=0;i<imgs.length;i++){
      imgs_temp.push(imgs[i].thumb)
    };
    wx.previewImage({
      current: '', 
      urls: imgs_temp
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

  },
  imageLoad: function (e) {//获取图片真实宽度 
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      //宽高比  
      ratio = imgwidth / imgheight;
    //计算的高度值  
    var viewHeight = 750 / ratio;
    var imgheight = viewHeight;
    var imgheights = this.data.imgheights;
    //把每一张图片的对应的高度记录到数组里  
    imgheights.push(imgheight);
    this.setData({
      imgheights: imgheights
    })
  },
  bindchange: function (e) {
    this.setData({ current: e.detail.current })
  }
})