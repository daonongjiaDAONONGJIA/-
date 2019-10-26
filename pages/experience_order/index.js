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
    start:'',
    end:'',
    day_num: 0,//天数
    house_num: 0,//房间数量
    food_num: 0,//补餐人数
    house_sel: [],//房间选择
    contactList: [],//出行人列表
    contact_ids: [],//出行人id
    is_pick:false,//是否接站
    is_send: false,//是否送站
    pick_type:1,//接站车型
    send_type: 1,//送站车型
    pick_id:0,//接站地址id
    send_id:0,//送站地址id
    pickMoney:0,//接着费用
    sendMoney:0,//送站费用,
    totalPrice:0,//总价
    useMoney:0,
    userRoll:0,
    useFsc:0,
    useHsf:0,
    useScore:0,
    use_money:0,
    use_fsc:0,
    use_roll:0,
    use_hsf:0,
    use_score:0,
    basePrice:0,
    houseTotalPrice:0,
    rollHouseTotalPrice:0,
    vid:0,
    house:[],
    house_ids:[],
    contact_id:0,
    is_default:0,
    pickAddress:'',
    sendAddess:'',
    pickDistance:0,
    sendDistance:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    var id = options.id;
    var type = options.type;
    var days = options.days;
    var number = options.number;
    var start = options.start;
    var end = options.end;
    var day_num =  days.split(',').length;
    this.setData({
      id: id,
      type: type,
      days: days,
      day_num: day_num,
      number: number,
      start:start,
      end: end
    })
    this.getMemberCardInfo();
    this.getGoodsType();
    this.getHouse();
    this.getContact();
    this.getVoucherList();
  },
  // 获取会员卡状态
  getMemberCardInfo: function () {
    var openid = app.globalData.openid;
    var mainurl = app.globalData.mainurl;
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
  getGoodsType: function () {
    var mainurl = app.globalData.mainurl;
    var openid = app.globalData.openid;
    var params = {
      id: this.data.type,
      openid: openid
    };
    var url = mainurl + 'api/goods/getPriceType';
    util.wxRequest(url, params, data => {
      console.log(data)
      wx.hideToast();
      var basePrice = this.data.number*this.data.day_num*data.data.price
      this.setData({
        goodsInfo: data.data,
        basePrice: basePrice
      })
      this.getTotalPrice();
      this.getLocation();
    }, data => { }, data => { });
  },
  getHouse: function () {
    var mainurl = app.globalData.mainurl;
    var openid = app.globalData.openid;
    var params = {
      openid: openid,
      goods_id: this.data.id,
      date: this.data.days
    };
    var url = mainurl + 'api/goods/getHouse';
    util.wxRequest(url, params, data => {
      var house = [];
      for (var i = 0; i < data.data.length; i++) {
        var house_item = {
          "id": data.data[i].id,
          "house_name": data.data[i].house_name,
          "type_name": data.data[i].type_name,
          "type_id": data.data[i].type_id,
          "selected": false,
          "money": data.data[i].money,
          "memberPrice": data.data[i].memberPrice
        }
        house.push(house_item);
      }
      this.setData({
        "house": house
      })
    }, data => { }, data => { });
  },
  selHouse: function (e) {
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var house_sel = this.data.house_sel;
    var house_ids = this.data.house_ids;
    var house = this.data.house;
    if (house[index].selected == false) {
      house[index].selected = true;
      house_sel.push(index);
      house_ids.push(house[index].id);
    } else {
      var index1 = house_sel.indexOf(index);
      if (index1 > -1) {
        house_sel.splice(index1, 1);
        house_ids.splice(house[index].id);
        house[index].selected = false;
      }
    }
    this.setData({
      house_sel: house_sel,
      house: house,
      house_num: house_sel.length,
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
      vid: 0,
      houseTotalPrice: 0,
      rollHouseTotalPrice: 0,
    })
    this.getHousePrice();
  },
  //房费
  getHousePrice:function(){
    var house_sel = this.data.house_sel;
    var houseList = this.data.house;
    var house_price = 0;
    for (var i = 0; i < houseList.length; i++) {
      if (house_sel.indexOf(i) != -1) {
        //使用金猪券 是原价
        house_price += parseFloat(houseList[i].money)
      }
    }
    var houseTotalPrice = house_price * this.data.day_num;
    this.setData({
      houseTotalPrice: houseTotalPrice
    })
    this.getTotalPrice();
  },
  //获取常用联系人
  getContact: function () {
    var mainurl = app.globalData.mainurl;
    var openid = app.globalData.openid;
    var url = mainurl + 'api/user/getContactDefault';
    var params = {
      openid: openid
    };
    util.wxRequest(url, params, data => {
      console.log(data);
      if (data.code == 200) {
        this.setData({
          contactDefault:data.data,
          contact_id: data.data.id,
          is_default:1
        })
      } else {
        this.setData({
          is_default:0,
          contact_id:0
        })
      }
    }, data => { }, data => { });
  },
  selContact:function(){
    wx.navigateTo({
      url: '/pages/sel_contact1/index?contact_id='+this.data.contact_id,
    })
  },
  //添加出行人
  addContact: function () {
    if(this.data.house_num==0){
      wx.showToast({
        icon:'none',
        title: '请先选择房型'
      })
      return false;
    }
    var contact_ids = this.data.contact_ids;
    if (contact_ids.length==0){
      var contact_ids_str = "";
    }else{
      var contact_ids_str = contact_ids.join(',');
    }
    wx.navigateTo({
      url: '/pages/sel_contact/sel_contact?contact_ids=' + contact_ids_str + "&number=" + this.data.number
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
    if (this.data.totalPrice == 0 && this.data.use_hsf==0) {
      wx.showToast({
        icon: 'none',
        title: '总金额为0！'
      })
      return false;
    }
    wx.navigateTo({
      url: '/pages/voucher_list/index?vid='+this.data.vid,
    })
  },
  // 修改人数
  changeNum: function (e) {
    var cz = e.currentTarget.dataset.cz;
    var number = this.data.number;
    var house_num = this.data.house_num;
    var food_num = this.data.food_num;
    if (cz == 'add') {
      if ((number - house_num) > food_num){
        food_num = food_num + 1;
      }
    } else {
      if (food_num >= 1) {
        food_num = food_num - 1;
      }
    }
    this.setData({
      food_num: food_num,
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
  },
  getLocation: function (e) {
    var address = this.data.goodsInfo.address;
    var that = this;
    qqmapsdk.geocoder({
      //获取表单传入地址
      address: address, //地址参数，例：固定地址，address: '北京市海淀区彩和坊路海淀西大街74号'
      success: function (res) {//成功后的回调
        console.log(res);
        var res = res.result;
        var latitude = res.location.lat;
        var longitude = res.location.lng;
        that.setData({
          lat1: latitude,
          lon1: longitude
        })
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        console.log(res);
      }
    })
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
          pickAddress:''
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
          sendAddess:''
        })
        return false
      } else {
        this.setData({
          send_id: id,
          sendAddess:address
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
  getCarService:function(e){
    if (this.data.house_num == 0) {
      wx.showToast({
        icon: 'none',
        title: '请先选择房型'
      })
      return false;
    }
    var type = e.currentTarget.dataset.type;
    if(type=='pick'){
      var is_pick = !this.data.is_pick;
      if(is_pick==false){
        this.setData({
          pick_id:0,
          pickMoney:0,
          pick_type:1,
          
        })
        this.getTotalPrice();
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
        this.getTotalPrice();
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
  getCarMoney: function (type) {
    var mainurl = app.globalData.mainurl;
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
      this.getTotalPrice();
    }, data => { }, data => { });
  },
  getDiscount:function(e){
    if(this.data.house_num == 0){
      wx.showToast({
        icon:'none',
        title: '请先选择房型！'
      })
    }
    var type = e.currentTarget.dataset.type;
    //使用余额
    if(type=='money'){
      if(this.data.useMoney>0){
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
      }else{
        if (this.data.totalPrice == 0) {
          wx.showToast({
            icon: 'none',
            title: '总金额为0！'
          })
          return false;
        }else{
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
        this.getHousePrice();
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
          }else{
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
    var mainurl = app.globalData.mainurl;
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
  getHsf:function(){
    if (this.data.use_hsf == 0) {
      this.setData({
        use_hsf: 0,
        useHsf: 0,
        vid:0,
        hsfAmount:0
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
  getTotalPrice:function(){
    var totalPrice = 0;//总价
    //基础价格
    var basePrice = this.data.basePrice;
    //饭费
    var food = this.data.goodsInfo.foot*this.data.food_num*this.data.day_num;
    //房费
    var houseTotalPrice = this.data.houseTotalPrice;
    //车费
    var car = this.data.pickMoney + this.data.sendMoney;
    //使用优惠
    var useMoney = this.data.useMoney;
    var useFsc = this.data.useFsc;
    var userRoll = this.data.userRoll;
    var useHsf = this.data.useHsf;
    var useScore = this.data.useScore;
    console.log(this.data.userRoll);
    totalPrice = basePrice + food + houseTotalPrice + car - useMoney - useFsc - userRoll - useHsf - useScore;
    this.setData({
      totalPrice:totalPrice
    })
  },
  confirmOrder: function () {
    if (this.data.order_sn_submit != '') {
      var url = app.globalData.mainurl + 'api/order/judgeOrder'
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
    if (this.data.contactList.length == 0) {
      wx.showToast({
        icon: 'none',
        title: '请添加出行人！'
      })
      return false;
    }
    var mainurl = app.globalData.mainurl;
    var openid = app.globalData.openid;
    if(this.data.totalPrice==0){
      var order_type = 4
    }else{
      var order_type = 0
    }
    var params = {
      openid: openid,
      pid: this.data.type,
      total_money: this.data.totalPrice,
      //total_money: 0.01,
      number:this.data.number,
      start_time:this.data.start,
      end_time: this.data.end,
      houseId: this.data.house_ids.join(","),
      contact_id:this.data.contactDefault.id,
      days_number:this.data.day_num,
      foot_number:this.data.food_num,
      source: 0,
      score_price: 0,
      card_money: this.data.useMoney,
      vid:this.data.vid,
      vouchers_money:this.data.useHsf,
      fsc_money:this.data.useFsc,
      roll:this.data.userRoll/2,
      pedestrians_id:this.data.contact_ids.join(","),
      pick_switch:(this.data.is_pick==true)?1:0,
      pick_address:this.data.pickAddress,
      pick_price:this.data.pickMoney,
      send_switch: (this.data.is_send == true) ? 1 : 0,
      send_address:this.data.sendAddess,
      send_price: this.data.sendMoney,
      order_type:order_type,
      pick_car: (this.data.pick_type)?"五座车" : "七座车",
      send_car: (this.data.send_type == 1)?"五座车" :"七座车"
    };
    var url = mainurl + 'api/order/submitOrder';
    util.wxRequest(url, params, data => {
      console.log(data);
      if(order_type==0){
        this.setData({
          wxdata: data.data.wxData,
          order: data.order,
          order_sn_submit: data.order.order_sn_submit
        })
        this.pay()
      }else{
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
  //获取地图
  getMap: function (e) {
    wx.navigateTo({
      url: '/pages/map/map?address=' + this.data.goodsInfo.address
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
    console.log(this.data.contact_ids);
    console.log(this.data.contactList);
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