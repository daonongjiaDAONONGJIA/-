// pages/goods_detail/index.js
var app = getApp();
const util = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');
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
    stock:0,
    type_id:0,
    type_name:'',
    price:0,
    number:1,
    is_show:0,
    unionid:'',
    state:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id
    })
    var version = app.getVersion();
    this.setData({
      version: version
    })
    var that = this;
    if (app.globalData.login == false) {
      app.userLogin().then((resArg) => {
        that.goodsInfo();
        that.getGoodsCollect();
        that.getUnionid();
      })
    } else {
      that.goodsInfo();
      that.getGoodsCollect();
      that.getUnionid();
    }
  },
  goodsInfo:function(){
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
    var url = this.data.version + 'api/shop/goodsInfo';
    var openid = app.globalData.openid;
    var params = {
      openid: openid,
      goods_id: this.data.id
    };
    util.wxRequest(url, params, data => {
      if (data.code == 200) {
        console.log(data)
        var price = data.data.price
        this.setData({
          goodsInfo: data.data,
          imgUrls: data.data.thumb,
          typeList:data.data.type,
          stock: data.data.type[0].stock,
          type_id: data.data.type[0].id,
          type_name: data.data.type[0].type_name,
          price: data.data.type[0].price
        })
        console.log(data.data.state);
        var article = WxParse.wxParse('article', 'html', data.data.content, this, 5);
      }
    }, data => { }, data => { });
  },
  // 获取商品收藏状态
  getGoodsCollect: function () {
    var mainurl = app.globalData.mainurl;
    var openid = app.globalData.openid;
    var params = {
      id: this.data.id,
      openid: openid,
      type: 4
    };
    var url = this.data.version + 'api/goods/doCollect';
    util.wxRequest(url, params, data => {
      this.setData({
        status: data.status
      })
    }, data => { }, data => { });
  },
  // 收藏商品
  goodsCollect: function () {
    var that = this;
    var openid = app.globalData.openid;
    var params = {
      goods_id: this.data.id,
      openid: openid
    };
    var url = this.data.version + 'api/shop/addCollect';
    app.getUserInfo().then((data) => {
      if (data.unionid != null && data.phone != null) {
        util.wxRequest(url, params, data => {
          wx.showToast({
            title: data.msg,
          })
          that.setData({
            status: data.status
          })
        }, data => { }, data => { });
      } else {
        wx.navigateTo({
          url: '/pages/login/index'
        })
      }
    })
  },
  getBack:function(){
    wx.navigateBack()
  },
  selType:function(e){
    var price = e.currentTarget.dataset.price;
    var type_id = e.currentTarget.dataset.typeid;
    var type_name = e.currentTarget.dataset.typename;
    var stock = e.currentTarget.dataset.stock;
    if (this.data.type_id==type_id){
      
    }else{
      this.setData({
        type_id: type_id,
        stock: stock,
        type_name: type_name,
        price: price,
        number: 1
      })
    }
  },
  // 修改数量
  changeNum: function (e) {
    var cz = e.currentTarget.dataset.cz;
    var number = this.data.number;
    if (cz == 'add') {
      if (number < this.data.stock) {
        number = number + 1;
      }
    } else {
      if (number > 1) {
        number = number - 1;
      }
    }
    this.setData({
      number: number
    });
    console.log();
  },
  //确认定单
  confirmOrder: function () {
    var that = this;
    app.getUserInfo().then((data) => {
      if (data.unionid == null || data.phone == null) {
        wx.navigateTo({
          url: '/pages/login/index',
        })
      } else {
        that.showModal();
      }
    })
  },
  buyGoods:function(){
    if (this.data.unionid == '') {
      this.setData({
        is_show: 1,
        value: false
      })
      return false;
    }
    if (this.data.type_id==0){
      wx.showToast({
        icon:'none',
        title: '请选择产品类型'
      });
      return false;
    }
    if (this.data.stock == 0) {
      wx.showToast({
        icon: 'none',
        title: '商品库存为0，请重新选择！'
      });
      return false;
    }
    wx.navigateTo({
      url: '/pages/goods_confirm/index?id=' + this.data.id + "&type_id=" + this.data.type_id + "&number=" + this.data.number,
    })
  },
  getMember: function () {
    wx.navigateTo({
      url: '/pages/vip_intro/vip_intro'
    })
  },
  //查看优惠券
  getVoucher: function (e) {
    var type = e.currentTarget.dataset.type;
    app.getUserInfo().then((data) => {
      if (data.unionid == null || data.phone == null) {
        wx.navigateTo({
          url: '/pages/login/index',
        })
      } else {
        if (type == 'hsf') {
          wx.navigateTo({
            url: '/pages/voucher_intro/index'
          })
        }
        if (type == 'fsc') {
          wx.navigateTo({
            url: '/pages/voucher_intro1/index'
          })
        }
        if (type == 'roll') {
          wx.navigateTo({
            url: '/pages/voucher_intro2/index'
          })
        }
      }
    })
  },
  getCard: function () {
    wx.navigateTo({
      url: '/pages/my_card/index'
    })
  },
  getUnionid: function () {
    var params = {
      openid: app.globalData.openid
    }
    console.log(app.globalData.openid);
    var url = this.data.version + 'api/user/userQurey';
    util.wxRequest(url, params, data => {
      console.log(data);
      if (data.code == 200) {
        if (data.data.unionid != null) {
          this.setData({
            unionid: data.data.unionid
          })
        } else {

        }
      }
    }, data => { }, data => { })
  },
  getUserInfo: function (e) {
    var that = this;
    wx.login({
      success: res => {
        if (res.code) {
          var loginCode = res.code
          wx.request({
            url: that.data.version + 'api/user/getopenid',
            data: {
              js_code: res.code,
              grant_type: 'authorization_code',
            },
            success: function (response) {
              //判断openid是否获取成功
              console.log(response);
              if (response.data.openid != null && response.data.openid != undefined) {
                that.setData({
                  session_key: response.data.session_key,
                  loginCode: loginCode,
                  encryptedData: encodeURIComponent(e.detail.encryptedData),
                  iv: e.detail.iv
                })
                that.getUserInfoData();
              } else if (response.data == false) {
                console.log('获取openid失败');
              }
            },
            fail: function () {
              console.log('获取openid失败');
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  getUserInfoData: function () {
    var params = {
      encryptedData: this.data.encryptedData,
      iv: this.data.iv,
      session_key: this.data.session_key,
      openid: app.globalData.openid
    }
    var url = this.data.version + 'api/user/decryptData';
    util.wxRequest(url, params, data => {
      console.log(data);
      if (data.code == 200) {
        this.setData({
          userInfo: data.data
        })
        this.unionidBinding();
      } else {
        wx.showToast({
          icon: 'none',
          title: data.msg
        })
      }
    }, data => { }, data => { })
  },
  unionidBinding: function (data) {
    var params = {
      openid: app.globalData.openid,
      unionid: this.data.userInfo.unionId,
      head_src: this.data.userInfo.avatarUrl,
      nick_name: this.data.userInfo.nickName
    }
    var url = this.data.version + 'api/user/unionidBinding';
    util.wxRequest(url, params, data => {
      console.log(data);
      if (data.code == 200) {
        this.setData({
          unionid: this.data.userInfo.unionId,
          is_show: 0
        });
      } else {
        wx.showToast({
          icon: 'none',
          title: data.msg
        })
      }
    }, data => { }, data => { })
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
    imgheights.push(imgheight);
    this.setData({
      imgheights: imgheights
    })
  },
  bindchange: function (e) {
    this.setData({ current: e.detail.current })
  }
})