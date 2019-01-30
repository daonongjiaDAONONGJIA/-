// pages/experience_detail/experience_detail.js
//var WxParse = require('../../wxParse/wxParse.js');
var WxParse = require('../../wxParse/html2json.js');
var app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsImgs:'',
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    //所有图片的高度  
    imgheights: [],
    //图片宽度 
    imgwidth: 750,
    current: 0,
    goodsInfo:"",
    goodsId:'',
    goodsAtricle:'',
    status:-1,
    selected:100
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showToast({
      icon: 'loading',
      title: '数据加载中~'
    })
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
    var id = options.id;
    this.getGoodsCollect(id);
    this.getGoodsinfo(id);
    this.getGoodsAtricle(id);
    this.setData({
      goodsId: id
    });
  },
  getGoodsinfo: function (id) {
    var mainurl = app.globalData.mainurl;
    var openid = app.globalData.openid;
    var params = {
      id:id,
      openid: openid
    };
    var url = mainurl + 'api/goods/getGoodsInfo';
    util.wxRequest(url, params, data => {
      console.log(data)
      this.setData({
        goodsInfo: data.goodsInfo,
        goodsImgs: data.goodsImgs,
        goodsComment: data.commentRes
      })
    }, data => { }, data => { });
  },
  // 获取商品描述
  getGoodsAtricle: function (id) {
    var that = this;
    var mainurl = app.globalData.mainurl;
    var params = {
      id: id
    };
    var url = mainurl + 'api/goods/getGoodsAtricle';
    util.wxRequest(url, params, data => {
      let artiles = data.list;
      let htmlAry = [];
      for (let i = 0; i < artiles.length; i++) {
        htmlAry[i] = WxParse.html2json(artiles[i].content, 'returnData');//重点，就是这里。只要这么干就能直接获取到转化后的node格式数据；
      }
      that.setData({
        htmlAry: htmlAry,
        goodsAtricle: artiles
      });
    }, data => { }, data => { });
  },
  // 获取商品收藏状态
  getGoodsCollect:function(id){
    var mainurl = app.globalData.mainurl;
    var openid = app.globalData.openid;
    var params = {
      goodsId: id,
      openid: openid
    };
    var url = mainurl + 'api/goods/doCollect';
    util.wxRequest(url, params, data => {
      this.setData({
        status:data.status
      })
    }, data => { }, data => { });
  },
  // 收藏商品
  goodsCollect:function(){
    var mainurl = app.globalData.mainurl;
    var openid = app.globalData.openid;
    var params = {
      goodsId: this.data.goodsId,
      openid: openid
    };
    var url = mainurl + 'api/goods/addCollect';
    util.wxRequest(url, params, data => {
      wx.showToast({
        title: data.msg,
      })
      this.setData({
        status: data.status
      })
    }, data => { }, data => { });
  },
  showIntro:function(e){
    var index = e.currentTarget.dataset.id
    if (index==this.data.selected){
      this.setData({
        selected: 100
      })
    }else{
      this.setData({
        selected: index
      })
    }
  },
  viewDate:function(){
    app.globalData.orderData = [];
    wx.navigateTo({
      url: '/pages/select_date/select_date?goods_id=' + this.data.goodsId,
    })
  },
  //查看更多评论
  comments:function(){
    wx.navigateTo({
      url: '/pages/experience_talk/experience_talk?goods_id=' + this.data.goodsId,
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
    imgheights[e.target.dataset.id] = imgheight;
    this.setData({
      imgheights: imgheights
    })
  },
  bindchange: function (e) {
    // console.log(e.detail.current)
    this.setData({ current: e.detail.current })
  }
})