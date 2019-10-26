// pages/experience_detail/experience_detail.js
//var WxParse = require('../../wxParse/wxParse.js');
var WxParse = require('../../wxParse/wxParse.js');
var app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsImgs:'',
    indicatorDots: false,
    autoplay: false,
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
    selected:100,
    goodsDesc:'',
    goodsType:0,
    goodsSonType:0,
    goodsSonTypes:[],
    is_son:0,
    currentDate: "2017年05月03日",
    dayList: '',
    currentDayList: [],
    currentObj: '',
    currentDay: '',
    //日期初始化选中样式
    selectCSS: 'bk-color-day',
    selectedCSS: 'selected',
    selectDate: [],
    selectedDate: [],
    totalPrice:0,
    dateindexs:[]
  },
  onLoad(options) {
    var that = this;
    var version = app.getVersion();
    this.setData({
      version: version
    })
    var id = options.id;
    wx.showToast({
      icon: 'loading',
      title: '数据加载中~'
    })
    if (!app.globalData.openid) {
      app.getToken().then((resArg) => {
        that.setData({
          goodsId: id
        });
        that.getGoodsCollect();
        that.getGoodsinfo();
      })
    } else {
      that.setData({
        goodsId: id
      });
      that.getGoodsCollect();
      that.getGoodsinfo();
    }
    //获取banner图片
  }, 
  getGoodsinfo: function () {
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
      id: this.data.goodsId,
      openid: openid
    };
    var url = this.data.version + 'api/goods/getGoodsInfo';
    util.wxRequest(url, params, data => {
      this.setData({
        goodsInfo: data.goodsInfo,
        goodsImgs: data.goodsImgs,
        goodsComment: data.commentRes,
        goodsRelated: data.related,
        typeList: data.typeList,
        level:data.level
      });
      var article = WxParse.wxParse('article', 'html', data.goodsInfo.guide, this, 5);
    }, data => { }, data => { });
  },
  // 获取商品收藏状态
  getGoodsCollect:function(){
    var mainurl = app.globalData.mainurl;
    var openid = app.globalData.openid;
    var params = {
      id: this.data.goodsId,
      openid: openid,
      type:1
    };
    var url = this.data.version + 'api/goods/doCollect';
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
      goods_id: this.data.goodsId,
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
  goodsType:function(e){
    console.log(e);
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/experience_type/index?id='+id+'&goods_id='+this.data.goodsId
    })
  },
  getComment:function(){
    wx.navigateTo({
      url: '/pages/experience_comment/index?&goods_id=' + this.data.goodsId
    })
  },
  //查看更多
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
  //查看更多评论
  comments:function(){
    wx.navigateTo({
      url: '/pages/experience_talk/experience_talk?goods_id=' + this.data.goodsId,
    })
  },
  //获取地图
  getMap: function (e) {
    var address = e.currentTarget.dataset.address;
    wx.navigateTo({
      url: '/pages/map/map?address=' + this.data.goodsInfo.address
    })
  },
  //获取推荐体验
  getGoodsRelated(e){
    var id = e.currentTarget.dataset.id;
    this.setData({
      goodsId: id
    });
    this.getGoodsCollect(id);
    this.getGoodsinfo(id);
    // this.getGoodsAtricle(id);
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  getShare:function(){
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  getStyle: function () {
    wx.navigateTo({
      url: '/pages/style/index?id=' + this.data.goodsId +"&type=detail"
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
    this.getGoodsinfo();
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
  showModal: function () {

    var that = this;

    that.setData({

      value: true

    })

    var animation = wx.createAnimation({

      duration: 600,//动画的持续时间 默认400ms 数值越大，动画越慢 数值越小，动画越快

      timingFunction: 'ease',//动画的效果 默认值是linear

    })

    this.animation = animation

    setTimeout(function () {

      that.fadeIn();//调用显示动画

    }, 200)

  },
  // 隐藏遮罩层

  hideModal: function () {

    var that = this;

    var animation = wx.createAnimation({

      duration: 800,//动画的持续时间 默认400ms 数值越大，动画越慢 数值越小，动画越快

      timingFunction: 'ease',//动画的效果 默认值是linear

    })

    this.animation = animation

    that.fadeDown();//调用隐藏动画

    setTimeout(function () {

      that.setData({

        value: false

      })

    }, 720)
    //先执行下滑动画，再隐藏模块
  },
  //动画集

  fadeIn: function () {

    this.animation.translateY(0).step()

    this.setData({

      animationData: this.animation.export()//动画实例的export方法导出动画数据传递给组件的animation属性

    })

  },

  fadeDown: function () {

    this.animation.translateY(300).step()

    this.setData({

      animationData: this.animation.export(),

    })

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
    this.setData({ current: e.detail.current })
  }
})