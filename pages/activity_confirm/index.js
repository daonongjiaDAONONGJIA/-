// pages/activity_confirm/index.js
var app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    number:1,
    totalPrice:0,
    basePrice:0,
    useMoney: 0,
    userRoll: 0,
    useFsc: 0,
    useHsf: 0,
    useScore: 0,
    use_money: 0,
    use_fsc: 0,
    use_roll: 0,
    use_hsf: 0,
    use_score: 0,
    vid: 0,
    is_default: 0,
    contact_id:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    var that = this;
    var id = options.id;
    var number = options.number;
    var pid = options.pid;
    var version = app.getVersion();
    wx.showToast({
      icon: 'loading',
      title: '数据加载中~'
    })
    if (!app.globalData.openid) {
      app.getToken().then((resArg) => {
        that.setData({
          id: id,
          number:number,
          pid: pid,
          version: version
        });
        that.getMemberCardInfo();
        that.getGoodsinfo();
        that.getContact();
        that.getGoodsType();
        that.getVoucherList();
        that.getVoucherNum();
      })
    } else {
      that.setData({
        id: id,
        number: number,
        pid: pid,
        version: version
      });
      that.getMemberCardInfo();
      that.getGoodsinfo();
      that.getContact();
      that.getGoodsType();
      that.getVoucherList();
      that.getVoucherNum();
    }
  },
  getGoodsinfo: function () {
    var mainurl = this.data.version;
    var openid = app.globalData.openid;
    var params = {
      id: this.data.id,
      openid: openid
    };
    var url = mainurl + 'api/activity/activityInfo';
    util.wxRequest(url, params, data => {
      var basePrice = this.data.number * parseFloat(data.data.price);
      this.setData({
        goodsInfo: data.data,
        basePrice: basePrice,
        imgUrls: data.data.thumb,
        goods_fsc: parseFloat(data.data.fsc)
      });
      this.getTotalPrice();
    }, data => { }, data => { });
  },
  // 获取会员卡状态
  getMemberCardInfo: function () {
    var openid = app.globalData.openid;
    var mainurl = this.data.version;
    var url = mainurl + 'api/memberCard/getMemberCardInfo'
    var params = {
      openid: openid
    }
    util.wxRequest(url, params, data => {
      console.log(data);
      var cardInfo = data.data;
      this.setData({
        cardInfo: data.data,
        fsc_money: parseFloat(data.data.fsc_money),
        roll: parseFloat(data.data.roll)
      })
    }, data => { }, data => { })
  },
  //根据类型获取信息
  getGoodsType: function () {
    var mainurl = this.data.version;
    var openid = app.globalData.openid;
    var params = {
      id: this.data.pid,
      openid: openid
    };
    var url = mainurl + 'api/activity/getTimeId';
    util.wxRequest(url, params, data => {
      console.log(data)
      this.setData({
        goodsInfoType: data.data
      })
    }, data => { }, data => { });
  },
  //获取常用联系人
  getContact: function () {
    var mainurl = this.data.version;
    var openid = app.globalData.openid;
    var url = mainurl + 'api/user/getContactDefault';
    var params = {
      openid: openid
    };
    util.wxRequest(url, params, data => {
      console.log(data);
      if (data.code == 200) {
        this.setData({
          contactDefault: data.data,
          is_default:1,
          contact_id: data.data.id
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
      url: '/pages/sel_contact1/index?contact_id=' + this.data.contact_id
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
  useHsf: function () {
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
  getTotalPrice: function () {
    var totalPrice = 0;//总价
    //基础价格
    var basePrice = this.data.basePrice;
    //使用优惠
    var useMoney = this.data.useMoney;
    var useFsc = this.data.useFsc;
    var userRoll = this.data.userRoll;
    var useHsf = this.data.useHsf;
    var useScore = this.data.useScore;
    totalPrice = basePrice - useMoney - useFsc - userRoll - useHsf - useScore;
    this.setData({
      totalPrice: totalPrice
    })
  },
  getVoucher: function () {
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
  confirmOrder: function () {
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
            if (pages[i].route == "pages/activity_detail/index") {
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
    var params = {
      openid: openid,
      pid: this.data.pid,
      contact_id: this.data.contactDefault.id,
      total_money: this.data.totalPrice,
      //total_money: 0.01,
      number: this.data.number,
      card_money: this.data.useMoney,
      vid: this.data.vid,
      vouchers_money: this.data.useHsf,
      fsc_money: this.data.useFsc,
      roll: this.data.userRoll/2,
      source: 0,
      score_price: 0,
      order_type: order_type
    };
    var url = mainurl + 'api/activity/submitOrder';
    util.wxRequest(url, params, data => {
      console.log(data)
      if (order_type == 0) {
        this.setData({
          wxdata: data.data.wxData,
          order: data.order,
          order_sn_submit: data.order.order_sn_submit
        })
        this.pay()
      } else {
        wx.navigateTo({
          url: '/pages/skip/skip?page=order&order_id=' + data.data.id + '&totalPrice=' + data.data.total_money + '&goods_id=' + data.data.goods_id + "&type=3",
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
          url: '/pages/skip/skip?page=order&order_id=' + that.data.order.id + '&totalPrice=' + that.data.order.total_money + '&goods_id=' + that.data.order.goods_id + "&type=3",
        })
      },
      'fail': function (res) {
        //如果取消支付，执行删除去付款订单
        console.log(res);
        wx.navigateTo({
          url: '/pages/order/activity_detail/index?orderId=' + that.data.order.id + '&page=confirm_order',
        })
      },
      'complete': function (res) {
        console.log(res);
      }
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

  }
})