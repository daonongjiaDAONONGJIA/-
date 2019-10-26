// pages/experience_detail/experience_detail.js
var WxParse = require('../../wxParse/wxParse.js');
// 引入SDK核心类
var QQMapWX = require('../../qqmap/qqmap-wx-jssdk.min.js');
// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: 'KXGBZ-GQY6J-6D5F7-FZFYL-V33R7-ETFGS' // 必填
});
var app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsImgs:'',
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    //所有图片的高度  
    imgheights: [],
    //图片宽度 
    imgwidth: 750,
    markers: [{
      iconPath: '../../images/favorites.png',
      id: 0,
      latitude: '',
      longitude: '',
      width: 50,
      height: 50
    }],
    address: '',
    days:1,//天数
    number:1,//人数
    is_pick: false,//是否接站
    is_send: false,//是否送站
    pick_type: 1,//接站车型
    send_type: 1,//送站车型
    pick_id: 0,//接站地址id
    send_id: 0,//送站地址id
    pickMoney: 0,//接着费用
    sendMoney: 0,//送站费用,
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
    pickAddress: '',
    sendAddess: '',
    pickDistance: 0,
    sendDistance: 0,
    is_show: 0,
    unionid:'',
    goods_state:1
  },
  onLoad(options) {
    var that = this;
    var version = app.getVersion();
    var curDate = new Date();
    var startDate = util.formatDate(curDate);
    this.setData({
      version: version,
      startDate: startDate,
      endDate: startDate,
      days: 1
    })
    var id = options.id;
    wx.showToast({
      icon: 'loading',
      title: '数据加载中~'
    })
    if (app.globalData.login == false) {
      app.userLogin().then((resArg) => {
        that.setData({
          goodsId: id
        });
        that.getGoodsCollect();
        that.getGoodsinfo();
        that.getContact();
      })
    } else {
      that.setData({
        goodsId: id
      });
      that.getGoodsCollect();
      that.getGoodsinfo();
      that.getContact();
    }
  }, 
  //获取体验详细信息
  getGoodsinfo: function () {
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
    var openid = app.globalData.openid;
    var params = {
      id: this.data.goodsId,
      openid: openid
    };
    var url = this.data.version + 'api/goods/getGoodsInfo';
    util.wxRequest(url, params, data => {
      this.setData({
        goodsInfo: data.goodsInfo,
        goodsPrice: data.goodsInfo.price,
        goodsImgs: data.goodsImgs,
        goodsComment: data.commentRes,
        goodsRelated: data.related,
        typeList: data.typeList,
        memberInfo: data.memberInfo,
        head_src: data.memberInfo.head_src.replace('123', '0'),
        level:data.level,
        goods_fsc: parseFloat(data.goodsInfo.fsc)
      });
      console.log(data.goods_state);
      this.getMap();
      this.getMemberCardInfo();
      this.getVoucherList();
      this.getVoucherNum();
      var article = WxParse.wxParse('article', 'html', data.goodsInfo.guide, this, 5);
      this.getTotalPrice();
    }, data => { }, data => { });
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
  // 获取商品收藏状态
  getGoodsCollect:function(){
    var openid = app.globalData.openid;
    var params = {
      id: this.data.goodsId,
      openid: openid,
      type:1
    };
    var url = this.data.version + 'api/goods/doCollect';
    util.wxRequest(url, params, data => {
      this.setData({
        status:data.status
      })
    }, data => { }, data => { });
  },
  // 收藏商品
  goodsCollect:function(){
    var that = this;
    var openid = app.globalData.openid;
    var params = {
      goods_id: this.data.goodsId,
      openid: openid
    };
    var url = this.data.version + 'api/goods/addCollect';
    app.getUserInfo().then((data) => {
      if(data.unionid!=null && data.phone!=null){
        util.wxRequest(url, params, data => {
          wx.showToast({
            title: data.msg,
          })
          that.setData({
            status: data.status
          })
        }, data => { }, data => { });
      }else{
        wx.navigateTo({
          url: '/pages/login/index'
        })
      }
    })
  },
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
  //查看道家风采
  getStyle: function () {
    wx.navigateTo({
      url: '/pages/style/index?id=' + this.data.id + "&type=type"
    })
  },
  //获取推荐体验
  getGoodsRelated(e){
    var id = e.currentTarget.dataset.id;
    this.setData({
      goodsId: id
    });
    this.getGoodsCollect(id);
    this.getGoodsinfo(id);
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  //地图
  getMap:function() {
    var _this = this;
    //调用地址解析接口
    qqmapsdk.geocoder({
      //获取表单传入地址
      address: _this.data.goodsInfo.address, //地址参数，例：固定地址，address: '北京市海淀区彩和坊路海淀西大街74号'
      success: function (res) {//成功后的回调
        console.log(res);
        var res = res.result;
        var latitude = res.location.lat;
        var longitude = res.location.lng;
        //根据地址解析在地图上标记解析地址位置
        _this.setData({ // 获取返回结果，放到markers及poi中，并在地图展示
          address: _this.data.goodsInfo.address,
          markers: [{
            id: 0,
            title: res.title,
            latitude: latitude,
            longitude: longitude,
            iconPath: '../../images/address.png',//图标路径
            width: 40,
            height: 40
          }],
          poi: { //根据自己data数据设置相应的地图中心坐标变量名称
            latitude: latitude,
            longitude: longitude
          },
          lat1: latitude,
          lon1: longitude
        });
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        console.log(res);
      }
    })
  },
  //获取地图
  viewMap: function (e) {
    var address = e.currentTarget.dataset.address;
    wx.navigateTo({
      url: '/pages/map/map?address=' + this.data.goodsInfo.address
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
  getAddress: function (e) {
    var type = e.currentTarget.dataset.type;
    var address = e.currentTarget.dataset.address;
    var id = e.currentTarget.dataset.aid;
    console.log(id);
    var that = this;
    if (type == 'pick') {
      if (this.data.pick_id == id) {
        this.setData({
          pick_id: 0,
          pickMoney: '',
          pickAddress: ''
        })
        return false
      } else {
        this.setData({
          pick_id: id,
          pickAddress: address
        })
      }
    }
    if (type == 'send') {
      if (this.data.send_id == id) {
        this.setData({
          send_id: 0,
          sendMoney: '',
          sendAddess: ''
        })
        return false
      } else {
        this.setData({
          send_id: id,
          sendAddess: address
        })
      }
    }
    qqmapsdk.geocoder({
      //获取表单传入地址
      address: address, //地址参数，例：固定地址，address: '北京市海淀区彩和坊路海淀西大街74号'
      success: function (res) {//成功后的回调
        console.log(res);
        var res = res.result;
        var latitude = res.location.lat;
        var longitude = res.location.lng;
        that.setData({
          lat2: latitude,
          lon2: longitude
        })
        that.getDistance(type);
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        console.log(res);
      }
    })
  },
  getDistance: function (type) {
    var that = this;
    qqmapsdk.calculateDistance({
      mode: 'driving',
      from: {
        latitude: this.data.lat1,
        longitude: this.data.lon1,
      },
      to: [{
        latitude: this.data.lat2,
        longitude: this.data.lon2,
      }],
      success: function (res) {
        console.log(res);
        var distance = res.result.elements['0'].distance;
        if (type == 'pick') {
          that.setData({
            pickDistance: distance
          })
        }
        if (type == 'send') {
          that.setData({
            sendDistance: distance
          })
        }
        that.setData({
          distance: distance
        })
        that.getCarMoney(type);
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },
  getCarService: function (e) {
    var type = e.currentTarget.dataset.type;
    if (type == 'pick') {
      var is_pick = !this.data.is_pick;
      if (is_pick == false) {
        this.setData({
          pick_id: 0,
          pickMoney: 0,
          pick_type: 1
        })
      }
      this.setData({
        is_pick: is_pick
      })

    }
    if (type == 'send') {
      var is_send = !this.data.is_send;
      if (is_send == false) {
        this.setData({
          send_id: 0,
          sendMoney: 0,
          send_type: 1
        })
      }
      this.setData({
        is_send: is_send
      })
    }
  },
  //获取接送站车型
  getCarType: function (e) {
    var type = e.currentTarget.dataset.type;
    var num = e.currentTarget.dataset.num;
    if (type == 'pick') {
      this.setData({
        pick_type: num
      })
      if (this.data.pick_id != 0) {
        this.getCarMoney(type)
      }
    }
    if (type == 'send') {
      this.setData({
        send_type: num
      })
      if (this.data.send_id != 0) {
        this.getCarMoney(type)
      }
    }
  },
  //获取接送车费
  getCarMoney: function (type) {
    var mainurl = this.data.version;
    var openid = app.globalData.openid;
    if (type == 'pick') {
      var params = {
        carType: this.data.pick_type,
        distance: this.data.distance
      };
    } else {
      var params = {
        carType: this.data.send_type,
        distance: this.data.distance
      };
    }
    var url = mainurl + 'api/goods/getFare';
    util.wxRequest(url, params, data => {
      if (type == 'pick') {
        this.setData({
          pickMoney: data.data
        })
      }
      if (type == 'send') {
        this.setData({
          sendMoney: data.data
        })
      }
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
      this.getTotalPrice();
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
      }else{
        wx.showToast({
          icon: 'none',
          title: '优惠券不可用！'
        })
      }
    }
    if (type == 'roll') {
      if(this.data.goodsInfo.roll==1 && this.data.roll>0){
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
      }else{
        wx.showToast({
          icon:'none',
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
  bindDateChange: function (e) {
    console.log(e);
    var type = e.currentTarget.dataset.type;
    var date = e.detail.value;
    if(type=='start'){
      if (date < this.data.endDate) {
        this.setData({
          startDate: e.detail.value, 
        });
        var days = util.getDays(this.data.startDate,this.data.endDate)+1;
        this.setData({
          days: days
        });
        this.getTotalPrice();
      }else{
        this.setData({
          startDate: e.detail.value,
          endDate: e.detail.value,
        });
        var days = util.getDays(this.data.startDate, this.data.endDate)+1;
        this.setData({
          days: days
        });
        this.getTotalPrice();
      }
    }
    if (type == 'end') {
      if (date > this.data.startDate){
        this.setData({
          endDate: e.detail.value
        })
        var days = util.getDays(this.data.startDate, this.data.endDate)+1;
        this.setData({
          days: days
        });
        this.getTotalPrice();
      }else{
        this.setData({
          startDate: e.detail.value,
          endDate: e.detail.value,
        });
        var days = util.getDays(this.data.startDate, this.data.endDate) + 1;
        this.setData({
          days: days
        });
        this.getTotalPrice();
      }   
    }
    console.log('picker发送选择改变，携带值为', e.detail.value)
  },
  //计算总价
  getTotalPrice: function () {
    var totalPrice = 0;//总价
    //基础价格
    var basePrice = this.data.goodsPrice*this.data.number*this.data.days;
    //车费
    var car = this.data.pickMoney + this.data.sendMoney;
    //使用优惠
    var useFsc = this.data.useFsc;
    var userRoll = this.data.userRoll;
    var useHsf = this.data.useHsf;
    totalPrice = basePrice + car - useFsc - userRoll - useHsf;
    this.setData({
      totalPrice: totalPrice
    })
  },
  //提交定单
  confirmOrder: function () {
    var that = this;
    app.getUserInfo().then((data) => {
      if (data.unionid == null || data.phone == null) {
        wx.navigateTo({
          url: '/pages/login/index',
        })
      }else{
        that.showModal();
      }
    })
  },
  submitOrder:function(){
    var openid = app.globalData.openid;
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
            if (pages[i].route == "pages/experience_detail/experience_detail") {
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
    if (this.data.totalPrice == 0) {
      var order_type = 4
    } else {
      var order_type = 0
    }
    if (this.data.contact_id == 0) {
      wx.showToast({
        icon: 'none',
        title: '请添加联系人！'
      })
      return false;
    }
    var params = {
      openid: openid,
      id: this.data.goodsId,
      total_money: this.data.totalPrice,
      //total_money: 0.01,
      number: this.data.number,
      start_time: this.data.startDate,
      end_time: this.data.endDate,
      contact_id: this.data.contactDefault.id,
      days_number: this.data.days,
      cardMoney: 0,
      vid: this.data.vid,
      vouchers_money: this.data.useHsf,
      fsc_money: this.data.useFsc,
      roll: this.data.userRoll,
      pick_switch: (this.data.is_pick == true) ? 1 : 0,
      pick_address: this.data.pickAddress,
      pick_price: this.data.pickMoney,
      send_switch: (this.data.is_send == true) ? 1 : 0,
      send_address: this.data.sendAddess,
      send_price: this.data.sendMoney,
      order_type: order_type,
      pick_car: (this.data.pick_type) ? "五座车" : "七座车",
      send_car: (this.data.send_type == 1) ? "五座车" : "七座车"
    };
    console.log(params)
    var url = this.data.version + 'api/order/submitOrder';
    util.wxRequest(url, params, data => {
      console.log(data);
      if (order_type == 0) {
        this.setData({
          wxdata: data.data.wxData,
          order: data.order,
          order_sn_submit: data.order.order_sn_submit
        })
        this.pay()
      } else {
        wx.navigateTo({
          url: '/pages/skip/skip?page=order&order_id=' + data.data.id + '&totalPrice=' + data.data.total_money + '&goods_id=' + data.data.goods_id + "&type=1",
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
          url: '/pages/skip/skip?page=order&order_id=' + that.data.order.id + '&totalPrice=' + that.data.order.total_money + '&goods_id=' + that.data.order.goods_id + "&type=1",
        })
      },
      'fail': function (res) {
        //如果取消支付，执行删除去付款订单
        console.log(res);
        wx.navigateTo({
          url: '/pages/order/details/details?orderId=' + that.data.order.id + '&page=confirm_order',
        })
      },
      'complete': function (res) {
        console.log(res);
      }
    })
  },
  getComment: function () {
    var that = this;
    app.getUserInfo().then((data) => {
      if (data.unionid == null || data.phone == null) {
        wx.navigateTo({
          url: '/pages/login/index',
        })
      } else {
        wx.navigateTo({
          url: '/pages/experience_comment/index?&goods_id=' + that.data.goodsId
        })
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
    this.getGoodsinfo();
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
    imgheights[e.target.dataset.id] = imgheight;
    this.setData({
      imgheights: imgheights
    })
  },
  bindchange: function (e) {
    this.setData({ current: e.detail.current })
  }
})