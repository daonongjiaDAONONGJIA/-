// pages/experience_comment/index.js
var app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgs1: [],
    comment:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    this.setData({
      'goods_id':options.goods_id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getComment:function(e){
    this.setData({
      "comment":e.detail.value
    })
  },
  commentAdd: function () {
    var mainurl = app.globalData.mainurl;
    var openid = app.globalData.openid;
    var params = {
      openid: openid,
      goods_id: this.data.goods_id,
      content:this.data.comment
    };
    if (this.data.comment==''){
      wx.showToast({
        icon:'none',
        title: '请填写评论内容'
      })
      return false;
    }
    var url = mainurl + 'api/order/getCommentGoods';
    util.wxRequest(url, params, data => {
      console.log(data);
      this.setData({
        'insertId': data.insertId
      })
      if (this.data.imgs1.length>0){
        this.uploadALbum(data.insertId);
      }else{
        wx.showToast({
          icon: 'none',
          title: '提交成功！'
        })
        setTimeout(function () {
          wx.navigateBack({
            //返回上一级
            delta: 1,
          })
        }, 2000)
      }
      
    }, data => { }, data => { });
  },
  chooseImg1: function (e) {
    var that = this;
    var imgs1 = that.data.imgs1;
    if (imgs1.length >= 9) {
      this.setData({
        lenMore: 1
      });
      setTimeout(function () {
        that.setData({
          lenMore: 0
        });
      }, 2500);
      return false;
    }
    wx.chooseImage({
      // count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        var imgs1 = that.data.imgs1;
        for (var i = 0; i < tempFilePaths.length; i++) {
          if (imgs1.length >= 9) {
            that.setData({
              imgs1: imgs1
            });
          } else {
            imgs1.push(tempFilePaths[i]);
          }
        }
        that.setData({
          imgs1: imgs1
        });
        that.setData({
          picture1: []
        })
        var tempFilePaths = that.data.imgs1
      },
      fail: function (res) {
      },
      complete: function (res) {
      }
    });
  },
  uploadALbum: function (comment_id) {
    console.log(comment_id)
    let that = this;
    let data = {
      openid: app.globalData.openid,
      comment_id: comment_id
    }
    console.log(data)
    var mainurl = app.globalData.mainurl;
    var url = mainurl + 'api/order/getCommentFile';
    console.log(this.data.imgs1.length)
    for (let s = 0; s < this.data.imgs1.length; s++) {
      console.log(that.data.imgs1[s])
      wx.uploadFile({
        url: url,
        filePath: that.data.imgs1[s],
        name: 'thumb',
        formData: data,
        success: function (res) {
          var data = JSON.parse(res.data);
          if (res.statusCode == 200) {
            var data = JSON.parse(res.data);
            if (data.code == 200) {
              if (s == that.data.imgs1.length - 1) {
                wx.showToast({
                  icon:'none',
                  title: '提交成功！'
                })
                setTimeout(function(){
                  wx.navigateBack({
                    //返回上一级
                    delta: 1,
                  })
                },2000)
              }
            } else {
              
            }
          }

        }
      })
    }
  },
  // 删除图片
  deleteImg1: function (e) {
    var that = this;
    var imgs1 = this.data.imgs1;
    var index = e.currentTarget.dataset.index;
    imgs1.splice(index, 1);
    this.setData({
      imgs1: imgs1
    })
  },
  // 预览图片
  previewImg1: function (e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    //所有图片
    var imgs1 = this.data.imgs1;
    wx.previewImage({
      //当前显示图片
      current: imgs1[index],
      //所有图片
      urls: imgs1
    })
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