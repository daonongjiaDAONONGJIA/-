// pages/transfer_fsc/index.js
var app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    this.setData({
      'card_sn': options.card_sn
    })
    this.getVoucherList();
  },
  transferFsc: function () {
    var mainurl = app.globalData.mainurl;
    var openid = app.globalData.openid;
    var params = {
      openid: openid,
      card_sn: this.data.card_sn,
      fsc_id: this.data.fsc_id
    };
    var url = mainurl + 'api/ddj/transferFsc';
    util.wxRequest(url, params, data => {
      console.log(data);
      if(data.code==200){
        wx.showToast({
          icon: 'none',
          title: data.msg
        })
        setTimeout(function(){
          wx.navigateBack({
            delta: 2
          })
        },1000)
        
      }else{
        wx.showToast({
          icon:'none',
          title:data.msg
        })
      }
    }, data => { }, data => { });
  },
  getVoucherList: function () {
    var mainurl = app.globalData.mainurl;
    var openid = app.globalData.openid;
    var params = {
      openid: openid,
      page: this.data.page
    };
    var url = mainurl + 'api/ddj/getFscList';
    util.wxRequest(url, params, data => {
      console.log(data);
      this.setData({
        voucherList: data.data.data,
        fsc_id: data.data.data[0].id
      })
    }, data => { }, data => { });
  },
  selVoucher: function (e) {
    var vid = e.currentTarget.dataset.vid;
    var index = e.currentTarget.dataset.index;
    this.setData({
      fsc_id: vid,
      vid: vid,
      index: index
    });
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