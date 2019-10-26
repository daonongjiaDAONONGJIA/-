// pages/experience_order/index.js
const app = getApp();
const util = require('../../utils/util.js');
// 引入SDK核心类
var QQMapWX = require('../../qqmap/qqmap-wx-jssdk.min.js');
// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: 'KXGBZ-GQY6J-6D5F7-FZFYL-V33R7-ETFGS' // 必填
});
Page({
  /**
   * 页面的初始数据
   */
  data: {
    start: '',
    end: '',
    house_num: 1,//房间数量
    house_sel: [],//房间选择
    contactList: [],//出行人列表
    contact_ids: [],//出行人id
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
    vid: 0,
    basePrice:'',//计算价格
    is_default:0,
    contact_id:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var version = app.getVersion();
    wx.hideShareMenu();
    wx.showToast({
      icon: 'loading',
      title: '数据加载中~'
    })
    var id = options.id;
    var package_type_id = options.package_type_id;
    var price = options.price;
    var shop_price = options.shop_price;
    var number = options.number;
    var start = options.start;
    this.setData({
      id: id,
      package_type_id: package_type_id,
      number: number,
      start: start,
      house_num: 1,
      version: version
    })
    this.getMemberCardInfo();
    //获取套餐信息
    this.getPackageInfo();
    //获取套餐类型信息
    this.getPackageType();
    //获取联系人信息
    this.getContact();
    //获取和顺发代金券
    this.getVoucherList();
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
        cardInfo: cardInfo,
        cardRoll: parseFloat(cardInfo.roll),
        cardMoney: parseFloat(cardInfo.money),
        fscMoney: parseFloat(cardInfo.fsc_money),
        score: cardInfo.score
      })
    }, data => { }, data => { })
  },
  //获取套餐信息
  getPackageInfo: function () {
    var mainurl = this.data.version;
    var openid = app.globalData.openid;
    var params = {
      id: this.data.id,
      openid: openid
    };
    var url = mainurl + 'api/package/getPackageInfo';
    util.wxRequest(url, params, data => {
      console.log(data)
      wx.hideToast();
      this.setData({
        goodsInfo: data.data
      })
    }, data => { }, data => { });
  },
  //根据类型获取信息
  getPackageType:function(){
    var mainurl = this.data.version;
    var openid = app.globalData.openid;
    var params = {
      id: this.data.package_type_id,
      openid: openid
    };
    var url = mainurl + 'api/package/packageType';
    util.wxRequest(url, params, data => {
      console.log(data)
      wx.hideToast();
      var basePrice = this.data.number * parseFloat(data.data.price);
      this.setData({
        goodsInfoType: data.data,
        basePrice: basePrice
      })
      this.getTotalPrice();
    }, data => { }, data => { });
  },
  //获取常用联系人
  getContact: function () {
    var mainurl = this.data.version
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
  //添加出行人
  addContact: function () {
    var contact_ids = this.data.contact_ids;
    if (contact_ids.length == 0) {
      var contact_ids_str = "";
    } else {
      var contact_ids_str = contact_ids.join(',');
    }
    var number = this.data.goodsInfoType.number * this.data.number
    wx.navigateTo({
      url: '/pages/sel_contact/sel_contact?contact_ids=' + contact_ids_str + "&number=" + number
    })
  },
  //删除出行人
  delContact: function (e) {
    var id = e.currentTarget.dataset.id;
    console.log(id)
    var contactList = this.data.contactList;
    var contact_ids = this.data.contact_ids;
    for (var i = 0; i < contactList.length; i++) {
      if (contactList[i].id == id) {
        contactList.splice(i, 1);
        contact_ids.splice(i, 1)
      }
    }
    this.setData({
      contactList: contactList,
      contact_ids: contact_ids
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
  // 修改房间数
  changeNum: function (e) {
    var cz = e.currentTarget.dataset.cz;
    var number = Math.ceil((this.data.goodsInfoType.number * this.data.number)/2);
    var house_num = this.data.house_num;
    if (cz == 'add') {
      if (house_num < number) {
        house_num = house_num + 1;
      }
    } else {
      if ( 1 < house_num) {
        house_num = house_num - 1;
      }
    }
    this.setData({
      house_num: house_num
    });
    this.getTotalPrice();
  },
  getDiscount: function (e) {
    if (this.data.house_num == 0) {
      wx.showToast({
        icon: 'none',
        title: '请先选择房型！'
      })
    }
    var type = e.currentTarget.dataset.type;
    //使用余额
    if (type == 'money') {
      if (this.data.useMoney > 0) {
        this.setData({
          //优惠信息清零
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
          if (this.data.totalPrice >= this.data.cardInfo.money) {
            this.setData({
              useMoney: this.data.cardInfo.money
            })
          } else {
            this.setData({
              useMoney: this.data.totalPrice
            })
          }
          this.setData({
            use_money: 1
          })
        }
      }
      this.getTotalPrice();
    }
    //使用积分
    if (type == 'score') {
      if (this.data.useScore > 0) {
        this.setData({
          //优惠信息清零
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
          if (this.data.totalPrice >= parseFloat(this.data.goodsInfo.cheap)) {
            this.setData({
              useScore: parseFloat(this.data.goodsInfo.cheap)
            })
            this.setData({
              use_score: 1
            })
          } else {
            wx.showToast({
              icon: 'none',
              title: '总额小于积分可抵用得金额'
            })
          }

        }
      }
      this.getTotalPrice();
    }
    if (type == 'fsc') {
      if (this.data.useFsc > 0) {
        this.setData({
          //优惠信息清零
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
          vid: 0
        })
        this.getHousePrice();
      } else {
        if (this.data.totalPrice == 0) {
          wx.showToast({
            icon: 'none',
            title: '总金额为0！'
          })
          return false;
        } else {
          if (this.data.totalPrice >= this.data.cardInfo.fsc_money) {
            this.setData({
              useFsc: this.data.cardInfo.fsc_money
            })
          } else {
            this.setData({
              useFsc: this.data.totalPrice
            })
          }
          this.setData({
            use_fsc: 1
          })
        }
      }
      this.getTotalPrice();
    }
    if (type == 'roll') {
      if (this.data.userRoll > 0) {
        this.setData({
          //优惠信息清零
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
          vid: 0
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
          if (this.data.totalPrice >= 2 * this.data.cardInfo.roll) {
            this.setData({
              userRoll: 2 * this.data.cardInfo.roll
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
    }
  },
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
      console.log(this.data.voucherList);
    }, data => { }, data => { });
  },
  getHsf: function () {
    if (this.data.use_hsf == 0) {
      this.setData({
        use_hsf: 0,
        useHsf: 0,
        vid: 0,
        hsfAmount: 0
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
    if (this.data.contactList.length == 0) {
      wx.showToast({
        icon: 'none',
        title: '请添加出行人！'
      })
      return false;
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
      package_type_id: this.data.package_type_id,
      date: this.data.start,
      contact_id: this.data.contactDefault.id,
      pedestrians_id: this.data.contact_ids.join(","),
      total_money: this.data.totalPrice,
      //total_money: 0.01,
      number: this.data.number,
      house_number: this.data.house_num,
      card_money: this.data.useMoney,
      vid: this.data.vid,
      vouchers_money: this.data.useHsf,
      fsc_money: this.data.useFsc,
      roll: this.data.userRoll/2,
      source: 0,
      score_price: 0,
      order_type: order_type
    };
    var url = mainurl + 'api/package/submitOrder';
    util.wxRequest(url, params, data => {
      console.log(data)
      if(data.code==200){
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
      }else{
        wx.showToast({
          icon:'none',
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