// pages/goods_confirm/index.js
const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    basePrice:0,
    baseRollPrice:0,
    totalPrice: 0,//总价
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
    vid:0,
    number:1,
    is_default:0,
    consignee_id:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    var version = app.getVersion();
    this.setData({
      version: version
    })
    this.setData({
      id: options.id,
      type_id:options.type_id,
      userInfo: app.globalData.userInfo,
      number:options.number
    })
    this.getMemberCardInfo();
    this.goodsInfo();
    this.goodsTypeInfo();
    this.getContact();
    this.getVoucherList();
    this.getVoucherNum();
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
  goodsInfo: function () {
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
        this.setData({
          goodsInfo: data.data,
          imgUrls: data.data.thumb,
          goods_fsc: parseFloat(data.data.fsc)
        })
      }
    }, data => { }, data => { });
  },
  goodsTypeInfo: function () {
    var mainurl = app.globalData.mainurl;
    var url = this.data.version + 'api/shop/getShopGoodsType';
    var openid = app.globalData.openid;
    var params = {
      openid: openid,
      id: this.data.type_id
    };
    util.wxRequest(url, params, data => {
      if (data.code == 200) {
        console.log(data);
        var basePrice = this.data.number * parseFloat(data.data.price);
        this.setData({
          goodsTypeInfo: data.data,
          basePrice: basePrice
        })
        this.getTotalPrice();
      }
    }, data => { }, data => { });
  },
  //添加联系人
  addConsignee:function(){
    wx.navigateTo({
      url: '/pages/sel_consignee/index?consignee_id=' + this.data.consignee_id
    })
  },
  //获取常用联系人
  getContact: function () {
    var mainurl = app.globalData.mainurl;
    var openid = app.globalData.openid;
    var url = this.data.version + 'api/user/getConsigneeDefault';
    var params = {
      openid: openid
    };
    util.wxRequest(url, params, data => {
      console.log(data);
      if (data.code == 200) {
        this.setData({
          is_default:1,
          contactDefault: data.data,
          consignee_id: data.data.id
        })
      } else {
        this.setData({
          is_default: 0
        })
      }
    }, data => { }, data => { });
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
    //基础价格
    var basePrice = this.data.basePrice;
    //使用优惠
    var useFsc = this.data.useFsc;
    var userRoll = this.data.userRoll;
    var useHsf = this.data.useHsf;
    var totalPrice = basePrice - useFsc - userRoll - useHsf ;
    this.setData({
      totalPrice: totalPrice
    })
  },
  confirmOrder: function () {
    if (this.data.consignee_id==0){
      wx.showToast({
        icon:'none',
        title: '请添加收货人！'
      });
      return false;
    }
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
            if (pages[i].route == "pages/goods_detail/index") {
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
    var mainurl = app.globalData.mainurl;
    var openid = app.globalData.openid;
    if (this.data.totalPrice == 0) {
      var order_type = 4
    } else {
      var order_type = 0
    }
    var params = {
      openid: openid,
      pid: this.data.type_id,
      total_money: this.data.totalPrice,
      //total_money: 0.01,
      number: this.data.number,
      consignee_id: this.data.contactDefault.id,
      source: 0,
      score_price: 0,
      card_money: this.data.useMoney,
      vid: this.data.vid,
      vouchers_money: this.data.useHsf,
      fsc_money: this.data.useFsc,
      roll: this.data.userRoll,
      order_type: order_type
    };
    var url = this.data.version + 'api/shop/submitOrder';
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
          url: '/pages/skip/skip?page=order&order_id=' + data.data.id + '&totalPrice=' + data.data.total_money + '&goods_id=' + data.data.goods_id + "&type=4",
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
          url: '/pages/skip/skip?page=order&order_id=' + that.data.order.id + '&totalPrice=' + that.data.order.total_money + '&goods_id=' + that.data.order.goods_id + "&type=4",
        })
      },
      'fail': function (res) {
        //如果取消支付，执行删除去付款订单
        console.log(res);
        wx.navigateTo({
          url: '/pages/order/goods_detail/index?orderId=' + that.data.order.id + '&page=confirm_order',
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
  getVoucher:function(){
    wx.navigateTo({
      url: '/pages/voucher_list/index',
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

  }
})