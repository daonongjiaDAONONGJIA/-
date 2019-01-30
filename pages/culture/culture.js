// pages/culture/culture.js
var app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    cid:'',
    status:'all'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCate();
    this.getArticle();
  },
  getArticle:function(){
    var mainurl = app.globalData.mainurl;
    var params = {
      page:this.data.page,
      cid:this.data.cid,
      status: this.data.status
    };
    var url = mainurl + 'api/article/getList';
    util.wxRequest(url, params, data => {
      console.log(data)
      this.setData({
        articleList: data.list.data
      })
    }, data => { }, data => { });
    
  },
  getCate:function(){
    var mainurl = app.globalData.mainurl;
    var params = {
    };
    var url = mainurl + 'api/article/getCate';
    util.wxRequest(url, params, data => {
      console.log(data)
      wx.hideToast();
      this.setData({
        articleCate: data.data
      })
    }, data => { }, data => { });
  },
  //修改文章分类
  changeArticle:function(e){
    console.log(e);
    var cid = e.currentTarget.dataset.id;
    if(cid!=''){
      this.setData({
        cid: cid,
        status: 'son',
        page:1
      })
    }else{
      this.setData({
        cid: '',
        status: 'all',
        page: 1
      })
    }
    this.getArticle();
  },
  //
  articleDetail:function(e){
    var aid = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/culture_detail/cultrue_detail?aid=' + aid,
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
    console.log('后退');
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
    var mainurl = app.globalData.mainurl;
    var page = this.data.page + 1;
    this.setData({
      page:page
    })
    var params = {
      page: this.data.page,
      cid: this.data.cid,
      status: this.data.status
    };
    var url = mainurl + 'api/article/getList';
    util.wxRequest(url, params, data => {
      console.log(data)
      if (data.list.data>0){
        var articleList = this.data.articleList;
        for (var i = 0; i < data.list.data.length; i++) {
          articleList.push(data.list.data[i]);
        }
        this.setData({
          articleList: articleList
        })
      }else{
        wx.showToast({
          title: '暂无更多数据~',
          icon: 'none'
        })
      }
    }, data => { }, data => { });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})