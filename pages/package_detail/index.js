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
    imgList: [],
    type: "",
    type_name:'',
    type_id: 0,
    price: 0,
    shop_price:0,
    totalPrice: 0,//总价
    userRoll: 0,
    useFsc: 0,
    useHsf: 0,
    use_fsc: 0,
    use_roll: 0,
    use_hsf: 0,
    vid: 0,
    contact_id: 0,
    is_default: 0,
    number:1,
    is_show:0,
    unionid:'',
    goods_state:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    var that = this;
    var version = app.getVersion();
    var id = options.id;
    var curDate = new Date();
    var startDate = util.formatDate(curDate);
    this.setData({
      id: id,
      version: version,
      start: startDate,
      startDate: startDate
    })
    wx.showToast({
      icon: 'loading',
      title: '数据加载中~'
    })
    if (app.globalData.login == false) {
      app.userLogin().then((resArg) => {
        that.goodsInfo();
        that.getMemberCardInfo();
        that.getVoucherList();
        that.getVoucherNum();
        that.getContact();
      })
    } else {
      that.goodsInfo();
      that.getMemberCardInfo();
      that.getVoucherList();
      that.getVoucherNum();
      that.getContact();
    }
  },
  goodsInfo: function () {
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
    var mainurl = this.data. version;
    var openid = app.globalData.openid;
    var params = {
      id: this.data.id,
      openid: openid
    };
    var url = mainurl + 'api/package/getPackageInfo';
    util.wxRequest(url, params, data => {
      console.log(data)
      wx.hideToast();
      var price = data.data.price
      this.setData({
        goodsInfo: data.data,
        imgList: data.data.thumb,
        typeList:data.data.type,
        price: price,
        goods_fsc: parseFloat(data.data.fsc),
        days: data.data.type[0].days,
        type_id: data.data.type[0].id,
        price: data.data.type[0].price,
        type_name: data.data.type[0].type_name
      })
      var article = WxParse.wxParse('article', 'html', data.data.content, this, 5);
      this.getTotalPrice();
    }, data => { }, data => { });
  },
  goodsBuy: function () {
    if(this.data.type_id==0){
      wx.showToast({
        icon:'none',
        title: '请选择购买类型！'
      })
      return false;
    }
    wx.navigateTo({
      url: '/pages/package_confirm/index?id=' + this.data.id + "&package_type_id=" + this.data.type_id + "&price=" + this.data.price + "&shop_price=" + this.data.shop_price
    })
  },
  //使用优惠
  getDiscount: function (e) {
    var type = e.currentTarget.dataset.type;
    if (type == 'fsc') {
      if (this.data.goods_fsc > 0 && this.data.fsc_money > 0) {
        if (this.data.useFsc > 0) {
          this.setData({
            //优惠信息清零
            userRoll: 0,
            useFsc: 0,
            useHsf: 0,
            use_fsc: 0,
            use_roll: 0,
            use_hsf: 0,
            vid: 0
          })
        } else {
          if (this.data.totalPrice == 0) {
            wx.showToast({
              icon: 'none',
              title: '总金额为0！'
            })
            return false;
          } else {
            if (this.data.goods_fsc > this.data.fsc_money) {
              if (this.data.totalPrice >= this.data.fsc_money) {
                this.setData({
                  useFsc: this.data.fsc_money
                })
              } else {
                this.setData({
                  useFsc: this.data.totalPrice
                })
              }
            } else {
              if (this.data.totalPrice >= this.data.goods_fsc) {
                this.setData({
                  useFsc: this.data.goods_fsc
                })
              } else {
                this.setData({
                  useFsc: this.data.totalPrice
                })
              }
            }
            this.setData({
              use_fsc: 1
            })
          }
        }
        this.getTotalPrice();
      } else {
        wx.showToast({
          icon: 'none',
          title: '优惠券不可用！'
        })
      }
    }
    if (type == 'roll') {
      if (this.data.goodsInfo.roll == 1 && this.data.roll > 0) {
        if (this.data.userRoll > 0) {
          this.setData({
            //优惠信息清零
            userRoll: 0,
            use_roll: 0
          });
          this.getTotalPrice();
        } else {
          if (this.data.totalPrice == 0) {
            wx.showToast({
              icon: 'none',
              title: '总金额为0！'
            })
            return false;
          } else {
            if (this.data.totalPrice > this.data.cardInfo.roll) {
              this.setData({
                userRoll: this.data.cardInfo.roll
              })
            } else {
              this.setData({
                userRoll: this.data.totalPrice
              })
            }
            this.setData({
              use_roll: 1
            })
            this.getTotalPrice();
          }
        }
      } else {
        wx.showToast({
          icon: 'none',
          title: '优惠券不可用！'
        })
      }

    }
  },
  //和顺发优惠券列表
  getVoucherList: function () {
    var mainurl = this.data.version;
    var openid = app.globalData.openid;
    var params = {
      openid: openid,
      page: 1
    };
    var url = mainurl + 'api/Vouchers/getVoucherList';
    util.wxRequest(url, params, data => {
      this.setData({
        voucherList: data.data.data
      })
    }, data => { }, data => { });
  },
  getVoucherNum: function (e) {
    var mainurl = this.data.version;
    var openid = app.globalData.openid;
    var params = {
      openid: openid
    };
    var url = mainurl + 'api/Vouchers/getVoucher';
    util.wxRequest(url, params, data => {
      this.setData({
        voucherNum: data.data
      })
    }, data => { }, data => { });
  },
  //使用和顺发代金券
  useHsfVoucher: function () {
    if (this.data.totalPrice == 0 && this.data.use_hsf == 0) {
      wx.showToast({
        icon: 'none',
        title: '总金额为0！'
      })
      return false;
    }
    wx.navigateTo({
      url: '/pages/voucher_list/index?vid=' + this.data.vid,
    })
  },
  getHsf: function () {
    if (this.data.use_hsf == 0) {
      this.setData({
        //优惠信息清零
        userRoll: 0,
        useFsc: 0,
        useHsf: 0,
        use_fsc: 0,
        use_roll: 0,
        use_hsf: 0,
        vid: 0
      })
    } else {
      if (this.data.totalPrice >= this.data.hsfAmount) {
        this.setData({
          useHsf: this.data.hsfAmount
        })
      } else {
        this.setData({
          useHsf: this.data.totalPrice
        })
      }
    }
    this.getTotalPrice();
  },
  //获取常用联系人
  getContact: function () {
    var openid = app.globalData.openid;
    var url = this.data.version + 'api/user/getContactDefault';
    var params = {
      openid: openid
    };
    util.wxRequest(url, params, data => {
      console.log(data);
      if (data.code == 200) {
        this.setData({
          contactDefault: data.data,
          contact_id: data.data.id,
          is_default: 1
        })
      } else {
        this.setData({
          is_default: 0,
          contact_id: 0
        })
      }
    }, data => { }, data => { });
  },
  selContact: function () {
    wx.navigateTo({
      url: '/pages/sel_contact1/index?contact_id=' + this.data.contact_id,
    })
  },
  // 修改人数
  changeNum: function (e) {
    var cz = e.currentTarget.dataset.cz;
    var number = this.data.number;
    if (cz == 'add') {
      number = number + 1;
    } else {
      if (number > 1) {
        number = number - 1;
      }
    }
    this.setData({
      number: number
    });
    this.getTotalPrice();
  },
  bindDateChange: function (e) {
    console.log(e);
    var type = e.currentTarget.dataset.type;
    var date = e.detail.value;
    this.setData({
      startDate: e.detail.value,
    });
  },
  //计算总价
  getTotalPrice: function () {
    var totalPrice = 0;//总价
    //基础价格
    var basePrice = parseFloat(this.data.price) * this.data.number;
    //使用优惠
    var useFsc = this.data.useFsc;
    var userRoll = this.data.userRoll;
    var useHsf = this.data.useHsf;
    totalPrice = basePrice - useFsc - userRoll - useHsf;
    this.setData({
      totalPrice: totalPrice
    })
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
  //提交定单
  submitOrder:function(){
    if (this.data.order_sn_submit != '') {
      var url = this.data.version + 'api/order/judgeOrder'
      var params = {
        order_sn_submit: this.data.order_sn_submit
      }
      util.wxRequest(url, params, data => {
        if (data.code == 400) {
          console.log(data);
          wx.showToast({
            title: data.msg,
            icon: 'none'
          })
          var pages = getCurrentPages()
          for (var i = 0; i < pages.length; i++) {
            if (pages[i].route == "pages/package_detail/index") {
              var delta = pages.length - i - 2;
              console.log(delta)
              wx.navigateBack({
                delta: delta
              })
            }
          }
        }
      }, data => { }, data => { })
    }
    var mainurl = this.data.version;
    var openid = app.globalData.openid;
    if (this.data.totalPrice == 0) {
      var order_type = 4
    } else {
      var order_type = 0
    }
    if (this.data.contact_id == 0) {
      wx.showToast({
        icon: 'none',
        title: '请增加联系人！'
      })
      return false;
    }
    var params = {
      openid: openid,
      package_type_id: this.data.type_id,
      date: this.data.startDate,
      contact_id: this.data.contact_id,
      total_money: this.data.totalPrice,
      //total_money: 0.01,
      vid: this.data.vid,
      vouchers_money: this.data.useHsf,
      fsc_money: this.data.useFsc,
      roll: this.data.userRoll,
      order_type: order_type,
      number: this.data.number
    };
    console.log(params)
    var url = mainurl + 'api/package/submitOrder';
    util.wxRequest(url, params, data => {
      console.log(data)
      if (data.code == 200) {
        if (order_type == 0) {
          this.setData({
            wxdata: data.data.wxData,
            order: data.order,
            order_sn_submit: data.order.order_sn_submit
          })
          this.pay()
        } else {
          wx.navigateTo({
            url: '/pages/skip/skip?page=order&order_id=' + data.data.id + '&totalPrice=' + data.data.total_money + '&goods_id=' + data.data.goods_id + "&type=2",
          })
        }
      } else {
        wx.showToast({
          icon: 'none',
          title: data.msg
        })
      }
    }, data => { }, data => { });
  },
  // 发起微信支付
  pay: function () {
    var that = this
    var wxdata = this.data.wxdata
    var timeStamp = wxdata.timeStamp + ''
    var nonceStr = wxdata.nonceStr + ''
    var wxpackage = wxdata.package + ''
    var paySign = wxdata.sign + ''
    wx.requestPayment({
      'timeStamp': timeStamp,
      'nonceStr': nonceStr,
      'package': wxpackage,
      'signType': 'MD5',
      'paySign': paySign,
      'success': function (res) {
        console.log(res)
        app.globalData.orderData = [];
        wx.navigateTo({
          url: '/pages/skip/skip?page=order&order_id=' + that.data.order.id + '&totalPrice=' + that.data.order.total_money + '&goods_id=' + that.data.order.goods_id + "&type=2",
        })
      },
      'fail': function (res) {
        //如果取消支付，执行删除去付款订单
        console.log(res);
        wx.navigateTo({
          url: '/pages/order/package_detail/index?orderId=' + that.data.order.id + '&page=confirm_order',
        })
      },
      'complete': function (res) {
        console.log(res);
      }
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
  selType: function (e) {
    var price = e.currentTarget.dataset.price;
    var type_id = e.currentTarget.dataset.typeid;
    var type = e.currentTarget.dataset.type;
    var type_name = e.currentTarget.dataset.typename;
    this.setData({
      type_id: type_id,
      type: type,
      price: price,
      type_name: type_name,
      userRoll: 0,
      useFsc: 0,
      useHsf: 0,
      use_fsc: 0,
      use_roll: 0,
      use_hsf: 0,
      vid: 0,
      days:type
    })
    this.getTotalPrice();
  },
  // 获取会员卡状态
  getMemberCardInfo: function () {
    var openid = app.globalData.openid;
    var url = this.data.version + 'api/memberCard/getMemberCardInfo'
    var params = {
      openid: openid
    }
    util.wxRequest(url, params, data => {
      console.log(data);
      this.setData({
        cardInfo: data.data,
        fsc_money: parseFloat(data.data.fsc_money),
        roll: parseFloat(data.data.roll)
      })
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