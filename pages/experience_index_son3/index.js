// pages/experience_index_son3/index.js
var app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [{ 'id': 1, 'img': 'https://m.shanxijsd.com/static/images/ty1.jpg' }, { 'id': 2, 'img': 'https://m.shanxijsd.com/static/images/ty1.jpg' }, { 'id': 3, 'img': 'https://m.shanxijsd.com/static/images/ty3.jpg' }],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    //所有图片的高度  
    imgheights: [],
    //图片宽度 
    imgwidth: 750,
    current: 0,
    cate_id:0,
    page:1,
    days:'',
    hotList:[]
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
        that.getBanner();
        that.getCate();
        that.getHot();
      })
    } else {
      that.getBanner();
      that.getCate();
      that.getHot();
    }
    
  },
  getBanner: function () {
    var mainurl = app.globalData.mainurl;
    var mainurl1 = app.globalData.mainurlimg;
    var url = this.data.version + 'api/shop/getRolling';
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
  getCate:function(){
    var mainurl = app.globalData.mainurl;
    var url = this.data.version + 'api/shop/cateList';
    var openid = app.globalData.openid;
    var params = {
      openid: openid
    };
    util.wxRequest(url, params, data => {
      if (data.code == 200) {
       console.log(data)
       this.setData({
         cateList:data.data
       })
      }
    }, data => { }, data => { });
  },
  getHot: function () {
    var mainurl = app.globalData.mainurl;
    var url = this.data.version + 'api/shop/home';
    var openid = app.globalData.openid;
    var params = {
      openid: openid,
      page:this.data.page
    };
    util.wxRequest(url, params, data => {
      if (data.code == 200) {
        console.log(data);
        var days = this.getRemainderTime(data.data.goods_top.good_time);
        this.setData({
          goodsTop: data.data.goods_top,
          days:days
        })
        if (data.data.goods_list.data == 0) {
          wx.showToast({
            title: '暂无更多数据~',
            icon: 'none'
          })
          // 隐藏加载框
          wx.hideLoading();
        } else {
          var hotList = this.data.hotList;
          for (var i = 0; i < data.data.goods_list.data.length; i++) {
            hotList.push(data.data.goods_list.data[i]);
          }
          // 设置数据
          this.setData({
            hotList: hotList
          })
          // 隐藏加载框
          wx.hideLoading();
        }
      }
    }, data => { }, data => { });
  },
  getRemainderTime: function (endtime){
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
  getCateOne:function(e){
    var id = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '/pages/goods_list/index?cate_id='+id+"&name="+name,
    })
  },
  getDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goods_detail/index?id=' + id
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
    this.getHot();
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