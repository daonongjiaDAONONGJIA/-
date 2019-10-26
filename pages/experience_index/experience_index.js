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
    listPlay:[],
    listPlace:[],
    list:[],
    keywords:'',
    is_voucher:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var version = app.getVersion();
    this.setData({
      version: version
    })
    var that = this;
    this.getBanner();
    this.getArea();
    console.log(app.userLogin());
    if (app.globalData.login==false) {
      app.userLogin().then((resArg) => {
        console.log(resArg);
        that.getRecommend('AllHomestay');
        that.getRecommend('SetMeal');
        that.getRecommend('Interaction');
        that.homePosGood();
      })
    } else {
      that.getRecommend('AllHomestay');
      that.getRecommend('SetMeal');
      that.getRecommend('Interaction');
      that.homePosGood();
    }
  },
  //获取轮播图数据
  getBanner:function(){
    var mainurl = app.globalData.mainurl;
    var url = this.data.version + 'api/ad/getRolling';
    var params = {
    };
    util.wxRequest(url, params, data => {
      if (data.code == 200) {
        this.setData({
          imgUrls: data.list
        })
      }
    }, data => { }, data => { });
  },
  //查看轮播图详情
  getBannerView: function (e) {
    var type = e.currentTarget.dataset.type;
    if (type == 1) {
      wx.navigateTo({
        url: '/pages/experience_index_son1/experience_index',
      })
    }
    if (type == 2) {
      wx.navigateTo({
        url: '/pages/package/index'
      })
    }
    if (type == 3) {
      wx.navigateTo({
        url: '/pages/experience_index_son2/experience_index'
      })
    }
    if (type == 4) {
      wx.navigateTo({
        url: '/pages/experience_index_son3/index'
      })
    }
  },
  //获取热门目的地
  getArea: function () {
    var mainurl = app.globalData.mainurl;
    var url = this.data.version + 'api/ad/getWar';
    var params = {

    };
    util.wxRequest(url, params, data => {
      if (data.code == 200) {
        this.setData({
          areaList: data.list
        })
      }
    }, data => { }, data => { });
  },
  //产品列表页
  goodsList: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/experience/experience?cid=' + id,
    })
  },
  search: function (e) {
    this.setData({ keywords: e.detail.value })
  },
  getSearch: function () {
    if (this.data.keywords.length > 0) {
      wx.navigateTo({
        url: '/pages/experience/experience?cid=0&keywords=' + this.data.keywords,
      })
    } else {
      wx.showToast({
        icon: "none",
        title: '请输入您要搜索得关键字！'
      })
    }
  },
  getRoll:function(){
    wx.navigateTo({
      url: '/pages/voucher_intro2/index',
    })
  },
  getRecommend:function(type){
    var openid = app.globalData.openid;
    var mainurl = app.globalData.mainurl;
    var url = this.data.version + 'api/ad/adPosData';
    var params = {
      openid: openid,
      type_id:type
    };
    util.wxRequest(url, params, data => {
      if (data.code == 200) {
        if (type == 'AllHomestay') {
          this.setData({
            list1: data.data,
            list_pos1: data.posRes
          })
        }
        if (type == 'SetMeal'){
          this.setData({
            list2: data.data,
            list_pos2: data.posRes
          })
        }
        if (type == 'Interaction') {
          this.setData({
            list3: data.data,
            list_pos3: data.posRes
          })
        }
      }
    }, data => { }, data => { });
  },
  homePosGood:function(){
    var openid = app.globalData.openid;
    var mainurl = app.globalData.mainurl;
    var url = this.data.version + 'api/ad/homePosGood';
    var params = {
      openid: openid
    };
    util.wxRequest(url, params, data => {
      if (data.code == 200) {
        var days = this.getRemainderTime('2019/10/02');
        this.setData({
          hot:data.data,
          days:days
        })
      }
    }, data => { }, data => { });
  },
  getRemainderTime: function (endtime) {
    var date1 = new Date();  //开始时间  
    var date2 = new Date(endtime);    //结束时间  
    var date3 = date2.getTime() - date1.getTime()  //时间差的毫秒数  
    //计算出相差天数  
    var days = Math.floor(date3 / (24 * 3600 * 1000))

    //计算出小时数  

    var leave1 = date3 % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数  
    var hours = Math.floor(leave1 / (3600 * 1000))
    //计算相差分钟数  
    var leave2 = leave1 % (3600 * 1000)        //计算小时数后剩余的毫秒数  
    var minutes = Math.floor(leave2 / (60 * 1000))
    //计算相差秒数  
    var leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数  
    var seconds = Math.round(leave3 / 1000)
    return ("还剩" + days + "天结束")
    //return ("还剩" + days + "天 " + hours + "小时 " + minutes + " 分钟" + seconds + " 秒")  
  },
  getMore:function(e){
    var type = e.currentTarget.dataset.type;
    if(type==1){
      wx.navigateTo({
        url: '/pages/experience/experience?cid=0',
      })
    }
    if (type == 2) {
      wx.navigateTo({
        url: '/pages/package/index'
      })
    }
    if (type == 3) {
      wx.navigateTo({
        url: '/pages/experience_index_son2/index'
      })
    }
    if (type == 4) {
      wx.navigateTo({
        url: '/pages/experience_index_son3/index'
      })
    }
  },
  getRecommendList:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/experience_recommend/index?id=' + id,
    })
  },
  //跳转到二级页面首页
  getSonIndex: function (e) {
    var id = e.currentTarget.dataset.id;
    if(id==1){
      wx.navigateTo({
        url: '../experience_index_son1/experience_index',
      })
    }else if(id==2){
      wx.navigateTo({
        url: '../experience_index_son2/index',
      })
    } else if (id == 3){
      wx.navigateTo({
        url: '../experience_index_son3/index',
      })
    } else if (id == 4) {
      wx.navigateTo({
        url: '../experience_index_son4/index',
      })
    }
  },
  //跳转商品详情页面
  showGoods: function (e) {
    var id = e.currentTarget.dataset.id;
    var type = e.currentTarget.dataset.type;
    if(type==1){
      wx.navigateTo({
        url: '/pages/experience_detail/experience_detail?id=' + id,
      })
    }
    if (type == 2) {
      wx.navigateTo({
        url: '/pages/package_detail/index?id=' + id,
      })
    }
    if (type == 3) {
      wx.navigateTo({
        url: '/pages/activity_detail/index?id=' + id,
      })
    }
    if (type == 4) {
      wx.navigateTo({
        url: '/pages/goods_detail/index?id=' + id,
      })
    }
  },
  //跳转到轮播图详情页
  getIntro:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/intro_detail/index?id=' + id,
    })
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
  //获取优惠券
  getVouchers:function(){
    var openid = app.globalData.openid;
    var mainurl = app.globalData.mainurl;
    var url = this.data.version + 'api/Cash/getCash';
    var params = {
      openid: openid
    };
    util.wxRequest(url, params, data => {
      console.log(data);
      if (data.code == 200 || data.code == 205) {
        this.setData({
          voucher:data.data,
          is_voucher:1
        })
      }
    }, data => { }, data => { });
  },
  closeVoucher:function(){
    this.setData({
      is_voucher: 0
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
    var that = this;
    if (app.globalData.login == false) {
      app.userLogin().then((resArg) => {
        that.getVouchers();
      })
    } else {
      that.getVouchers();
    }
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