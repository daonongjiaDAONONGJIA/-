//index.js 
//获取应用实例 
const app = getApp();
const util = require('../../utils/util.js');
// 引入SDK核心类
var QQMapWX = require('../../qqmap/qqmap-wx-jssdk.min.js');
// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: 'KXGBZ-GQY6J-6D5F7-FZFYL-V33R7-ETFGS' // 必填
});
Page({
  data: {
    year: 0,
    month: 0,
    date: ['日', '一', '二', '三', '四', '五', '六'],
    dateArr: [],
    isToday: 0,
    isTodayWeek: false,
    todayIndex: 0,
    selectedDate:[],
    house:[],
    selectedhouse:[],
    number:1,
    isDefault: 0,
    totalPrice:0,
    actuallyPrice:0,
    shopPrice:0,
    cardMoney:0,
    useCardMoney:0,
    priceArr:[],
    memberpriceArr:[],
    shoppriceArr:[],
    isUseIntegral:false,
    isUseCard:false,
    vid:0,
    amount_of:0,
    useAmountOf:0,
    is_food:false,
    is_insure:false,
    selectedHoseMoney:0,
    contactList:[],
    contactIds:[],
    is_js:0,
    carTypep:1,
    carTypes:1,
    pickMoney:0,
    sendMoney:0,
    pick_id:0,
    send_id:0
  },
  onLoad: function (options) {
    var goods_id = options.goods_id;
    var type = options.type;
    this.setData({
      id: goods_id,
      type: type
    })
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    this.setData({
      year: year,
      month: month,
      isToday: '' + year + month + now.getDate()
    })
    app.globalData.orderData.contactList = [];
    app.globalData.orderData.contactIds = [];
    this.getGoodsType();
    this.getDate();
    this.getContact();
    this.getIntegral();
    this.getVoucher();
  },
  onShow:function(){
    this.setData({
      contactList: app.globalData.orderData.contactList,
      contactIds: app.globalData.orderData.contactIds
    })
  },
  getGoodsType:function(){
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
      this.setData({
        goodsInfo: data.data
      })
      this.getLocation();
    }, data => { }, data => { });
  },
  getDate:function(){
    var that = this;
    var mainurl = app.globalData.mainurl;
    var openid = app.globalData.openid;
    var params = {
      openid: openid,
      id: this.data.goods_id,
      pid: this.data.type
    };
    var url = mainurl + 'api/goods/getDate';
    util.wxRequest(url, params, data => {
      console.log(data);
      this.setData({
        selDate:data.data,
        level:data.level
      })
      this.dateInit();
    }, data => { }, data => { });
  },
  dateInit: function (setYear, setMonth) {
    //全部时间的月份都是按0~11基准，显示月份才+1 
    let dateArr = [];            //需要遍历的日历数组数据 
    let arrLen = 0;             //dateArr的数组长度 
    let now = setYear ? new Date(setYear, setMonth) : new Date();
    let year = setYear || now.getFullYear();
    let nextYear = 0;
    let month = setMonth || now.getMonth();         //没有+1方便后面计算当月总天数 
    let nextMonth = (month + 1) > 11 ? 1 : (month + 1);
    let startWeek = new Date(year + ',' + (month + 1) + ',' + 1).getDay();             //目标月1号对应的星期 
    let dayNums = new Date(year, nextMonth, 0).getDate();       //获取目标月有多少天 
    let obj = {};
    let num = 0;
    if (month + 1 > 11) {
      nextYear = year + 1;
      dayNums = new Date(nextYear, nextMonth, 0).getDate();
    }
    arrLen = startWeek + dayNums;
    for (let i = 0; i < arrLen; i++) {
      if (i >= startWeek) {
        num = i - startWeek + 1;
        //判断是否是可选日期
        let m = month + 1;
        let seletedDay = "";
        if (m >= 10) {
          if (num>= 10) {
            seletedDay = year + '-' + m + '-' + num;
          } else {
            seletedDay = year + '-' + m + '-0' + num;
          }
        } else {
          if (num >= 10) {
            seletedDay = year + '-0' + m + '-' + num;
          } else {
            seletedDay = year + '-0' + m + '-0' + num;
          }
        }
        let selected = false;
        let price = 0;
        let member_price = 0;
        let shop_price = 0;
        let store = 0;
        let dateindex = 0;
        for (let j = 0; j < this.data.selDate.length; j++) {
          if (this.data.selDate[j].date == seletedDay) {
            selected = true;
            dateindex = j;
            price = this.data.selDate[j].price;
            member_price = this.data.selDate[j].member_price;
            shop_price = this.data.selDate[j].shop_price;
          }
        }
        if (selected == true) {
          if (this.data.selectedDate.indexOf(seletedDay)!=-1){
            obj = {
              isToday: '' + year + (month + 1) + num,
              dateNum: num,
              date: seletedDay,
              selected: true,
              isSelected: true,
              price: price,
              member_price: member_price,
              shop_price: shop_price,
              dateindex: dateindex
            }
          }else{
            obj = {
              isToday: '' + year + (month + 1) + num,
              dateNum: num,
              date: seletedDay,
              selected: true,
              isSelected: false,
              price: price,
              member_price: member_price,
              shop_price: shop_price,
              dateindex: dateindex
            }
          }
          
        } else {
          obj = {
            isToday: '' + year + (month + 1) + num,
            dateNum: num,
            date: seletedDay,
            selected: false,
            isSelected: false
          };
        } 
      } else {
        obj = {};
      }
      dateArr[i] = obj;
    }
    this.setData({
      dateArr: dateArr
    })
    let nowDate = new Date();
    let nowYear = nowDate.getFullYear();
    let nowMonth = nowDate.getMonth() + 1;
    let nowWeek = nowDate.getDay();
    let getYear = setYear || nowYear;
    let getMonth = setMonth >= 0 ? (setMonth + 1) : nowMonth;
    if (nowYear == getYear && nowMonth == getMonth) {
      this.setData({
        isTodayWeek: true,
        todayIndex: nowWeek
      })
    } else {
      this.setData({
        isTodayWeek: false,
        todayIndex: -1
      })
    }
  },
  lastMonth: function () {
    //全部时间的月份都是按0~11基准，显示月份才+1 
    let year = this.data.month - 2 < 0 ? this.data.year - 1 : this.data.year;
    let month = this.data.month - 2 < 0 ? 11 : this.data.month - 2;
    this.setData({
      year: year,
      month: (month + 1)
    })
    this.dateInit(year, month);
  },
  nextMonth: function () {
    //全部时间的月份都是按0~11基准，显示月份才+1 
    let year = this.data.month > 11 ? this.data.year + 1 : this.data.year;
    let month = this.data.month > 11 ? 0 : this.data.month;
    this.setData({
      year: year,
      month: (month + 1)
    })
    this.dateInit(year, month);
  },
  lastYear: function () {
    //全部时间的月份都是按0~11基准，显示月份才+1 
    let year = this.data.year-1;
    this.setData({
      year: year,
      month: this.data.month
    })
    this.dateInit(year, this.data.month);
  },
  nextYear: function () {
    //全部时间的月份都是按0~11基准，显示月份才+1 
    let year = this.data.year + 1;
    this.setData({
      year: year,
      month: this.data.month
    })
    this.dateInit(year, this.data.month);
  },
  selectDay: function (e) {
    var index = e.currentTarget.dataset.index;
    var dateArr = this.data.dateArr;
    var priceArr = this.data.priceArr;
    var memberpriceArr = this.data.memberpriceArr;
    var shoppriceArr = this.data.shoppriceArr;
    var selectedDate = this.data.selectedDate;
    if (dateArr[index].isSelected==false){
      selectedDate.push(dateArr[index].date);
      priceArr.push(dateArr[index].price);
      memberpriceArr.push(dateArr[index].member_price)
      shoppriceArr.push(dateArr[index].shop_price)
    } else {
      var index1 = selectedDate.indexOf(dateArr[index].date);
      if (index1 > -1) {
        selectedDate.splice(index1, 1);
        priceArr.splice(index1,1);
        memberpriceArr.splice(index1,1);
        shoppriceArr.splice(index1, 1)
      }
    }
    dateArr[index].isSelected = !dateArr[index].isSelected;
    this.setData({
      dateArr:dateArr,
      priceArr: priceArr,
      memberpriceArr: memberpriceArr,
      shoppriceArr: shoppriceArr,
      selectedDate: selectedDate,
      house: [],
      selectedhouse: [],
      number: 1,
      totalPrice: 0,
      actuallyPrice:0,
      shopPrice: 0,
      isUseIntegral: false,
      isUseCard:false,
      useCardMoney: 0,
      selectedHoseMoney:0
    });
    if(selectedDate.length>0){
      this.getHouse();
    }else{
      this.setData({
        "house": []
      })
    }
    this.getTotalPrice(); 
  },
  getHouse:function(){
    var mainurl = app.globalData.mainurl;
    var openid = app.globalData.openid;
    var params = {
      openid: openid,
      goods_id: this.data.id,
      date:this.data.selectedDate
    };
    var url = mainurl + 'api/goods/getHouse';
    util.wxRequest(url, params, data => {
      var house = [];
      for(var i=0;i<data.data.length;i++){
        var house_item = {
          "id": data.data[i].id,
          "house_name": data.data[i].house_name,
          "type_name": data.data[i].type_name,
          "type_id": data.data[i].type_id,
          "selected":false,
          "money":data.data[i].money
        }
        house.push(house_item);
      }
      this.setData({
        "house": house
      })
    }, data => { }, data => { });
  },
  selHouse:function(e){
    if (this.data.selectedDate.length == 0) {
      wx.showToast({
        icon: 'none',
        title: '请先选择出行时间。'
      });
      return false;
    }
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var selectedhouse = this.data.selectedhouse;
    var selectedHoseMoney = this.data.selectedHoseMoney;
    var house = this.data.house;
    if (house[index].selected==false){
      house[index].selected = true;
      selectedhouse.push(id);
      selectedHoseMoney += parseFloat(house[index].money);
      this.setData({
        house: house,
        selectedhouse: selectedhouse,
        selectedHoseMoney: selectedHoseMoney
      })
    }else{
      var index1 = selectedhouse.indexOf(house[index].id);
      if (index1 > -1) {
        selectedhouse.splice(index1, 1);
      }
      house[index].selected = false;
      selectedHoseMoney = selectedHoseMoney - parseFloat(house[index].money);
      this.setData({
        house: house,
        selectedhouse: selectedhouse,
        selectedHoseMoney: selectedHoseMoney
      })
    }
    this.getTotalPrice();
  },
  // 修改人数
  changeNum: function (e) {
    if (this.data.selectedDate.length == 0) {
      wx.showToast({
        icon: 'none',
        title: '请先选择出行时间。'
      });
      return false;
    }
    var cz = e.currentTarget.dataset.cz;
    var number = this.data.number;
    if (cz == 'add') {
      number = number + 1;
    } else {
      if(number>1){
        number = number - 1;
      }
    }
    this.setData({
      number:number
    });
    this.getTotalPrice();
  },
  //获取常用联系人
  getContact: function () {
    if (app.globalData.orderData.name) {
      this.setData({
        name: app.globalData.orderData.name,
        phone: app.globalData.orderData.phone,
        idcard: app.globalData.orderData.idcard
      })
    } else {
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
            name: data.data.name,
            phone: data.data.phone,
            idcard: data.data.idcard,
            isDefault: 1
          });
          app.globalData.orderData.name = data.data.name;
          app.globalData.orderData.phone = data.data.phone;
          app.globalData.orderData.idcard = data.data.idcard;
        } else {
          wx.showToast({
            title: data.msg,
            icon: ''
          })
        }
      }, data => { }, data => { });
    }
  },
  //修改常用联系人
  changeContact: function (e) {
    wx.navigateTo({
      url: '/pages/change_contact/change_contact?goods_id=' + this.data.id,
    })
  },
  //选择餐费 选择保险
  selXm:function(e){
    if (this.data.selectedDate.length == 0) {
      wx.showToast({
        icon: 'none',
        title: '请先选择出行时间。'
      });
      return false;
    }
    var xm = e.currentTarget.dataset.xm;
    if(xm=='food'){
      var is_food = !this.data.is_food;
      this.setData({
        is_food:is_food
      })
    }
    if (xm == 'insure') {
      var is_insure = !this.data.is_insure;
      this.setData({
        is_insure: is_insure
      })
    }
    this.getTotalPrice();
  },
  //添加出行人
  addContact:function(){
    if (this.data.selectedDate.length == 0) {
      wx.showToast({
        icon: 'none',
        title: '请先选择出行时间。'
      });
      return false;
    }
    wx.navigateTo({
      url: '/pages/sel_contact/sel_contact',
    })
  },
  //删除出行人
  delContact:function(e){
    var id = e.currentTarget.dataset.id;
    console.log(id)
    var contactList = app.globalData.orderData.contactList;
    var contactIds = app.globalData.orderData.contactIds;
    for (var i = 0; i < contactList.length;i++){
      if (contactList[i].id==id){
        contactList.splice(i, 1);
        contactIds.splice(i,1)
      }
    }
    app.globalData.orderData.contactList = contactList;
    app.globalData.orderData.contactIds = contactIds;
    this.setData({
      contactList: app.globalData.orderData.contactList,
      contactIds: app.globalData.orderData.contactIds
    })
  },
  //获取积分优惠信息
  getIntegral: function () {
    var mainurl = app.globalData.mainurl;
    var openid = app.globalData.openid;
    var params = {
      openid: openid,
      type_id: this.data.type
    };
    var url = mainurl + 'api/goods/getIntegral';
    util.wxRequest(url, params, data => {
      console.log(data);
      this.setData({
        'integral':data.data,
        'cardMoney':parseFloat(data.data.card_money)
      })
    }, data => { }, data => { });
  },
  //获取代金券优惠信息
  getVoucher: function () {
    var mainurl = app.globalData.mainurl;
    var openid = app.globalData.openid;
    var params = {
      openid: openid,
      page:1,
      type_id: this.data.type
    };
    var url = mainurl + 'api/goods/getVouchers';
    util.wxRequest(url, params, data => {
      console.log(data.data.data.length);
      this.setData({
        vcode:data.code,
        status: data.state,
        voucherList:data.data.data,
        voucherNum: data.data.data.length
      })
    }, data => { }, data => { });
  },
  //选择使用代金券
  selVoucher:function(e){
    var vid = e.currentTarget.dataset.vid;
    var amount_of = parseFloat(e.currentTarget.dataset.price);
    var totalPrice = this.data.totalPrice;
    var actuallyPrice = this.data.actuallyPrice;
    if(this.data.vid!=0){
      actuallyPrice = parseFloat(actuallyPrice) + parseFloat(this.data.useAmountOf);
      this.setData({
        vid: 0,
        amount_of: 0,
        useAmountOf:0
      })
    }else{
      this.setData({
        vid: vid,
        amount_of: amount_of
      })
      if (actuallyPrice > 0) {
        if (actuallyPrice >= this.data.amount_of){
          actuallyPrice = parseFloat(actuallyPrice) - parseFloat(this.data.amount_of);
          this.setData({
            useAmountOf: this.data.amount_of
          })
        }else{
          this.setData({
            useAmountOf: actuallyPrice
          })
          actuallyPrice = 0;
        }
      }
    }
    this.setData({
      actuallyPrice: actuallyPrice
    })
  },
  getJs:function(){
    if (this.data.selectedDate.length==0){
      wx.showToast({
        icon:'none',
        title: '请先选择出行时间。'
      })
    }else{
      this.setData({
        is_js:1
      })
    }
  },
  getCar:function(e){
    var type = e.currentTarget.dataset.type;
    var ctype = e.currentTarget.dataset.ctype;
    if(type=='pick'){
      this.setData({
        carTypep: ctype
      })
      if(this.data.pick_id!=0){
        this.getCarMoney(type)
      } 
    }
    if (type == 'send') {
      this.setData({
        carTypes: ctype
      })
      if (this.data.send_id!= 0) {
        this.getCarMoney(type)
      } 
    }
  },
  getLocation:function(e){
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
  getAddress:function(e){
    var type = e.currentTarget.dataset.type;
    var address = e.currentTarget.dataset.address;
    var id = e.currentTarget.dataset.aid;
    console.log(id);
    var that = this;
    if(type=='pick'){
      if(this.data.pick_id==id){
        this.setData({
          pick_id: 0,
          pickMoney:''
        })
        return false
      }else{
        this.setData({
          pick_id: id 
        })
      }
    }
    if (type == 'send') {
      if (this.data.send_id == id) {
        this.setData({
          send_id: 0,
          sendMoney: ''
        })
        return false
      } else {
        this.setData({
          send_id: id
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
  getDistance:function(type){
    var that = this;
    qqmapsdk.calculateDistance({
      mode: 'driving',
      from:{
        latitude: this.data.lat1,
        longitude: this.data.lon1,
      },
      to:[{
        latitude: this.data.lat2,
        longitude: this.data.lon2,
      }],
      success: function (res) {
        console.log(res);
        var distance = res.result.elements['0'].distance;
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
  getCarMoney:function(type){
    var mainurl = app.globalData.mainurl;
    var openid = app.globalData.openid;
    if(type=='pick'){
      var params = {
        carType: this.data.carTypep,
        distance: this.data.distance
      };
    }else{
      var params = {
        carType: this.data.carTypes,
        distance: this.data.distance
      };
    }
    var url = mainurl + 'api/goods/getFare';
    util.wxRequest(url, params, data => {
      console.log(data);
      if(type=='pick'){
        this.setData({
          pickMoney: data.data
        })
      }
      if (type == 'send') {
        this.setData({
          sendMoney: data.data
        })
      }
      this.getTotalPrice();
    }, data => { }, data => { });
  },
  getTotalPrice:function(){
    var totalPrice = 0;
    var shopPrice = 0;
    for (var i = 0; i < this.data.selectedDate.length; i++) {
      if (this.data.goodsInfo.level == 2) {
        totalPrice = totalPrice + this.data.memberpriceArr[i] * this.data.number;
      } else {
        totalPrice = totalPrice + this.data.priceArr[i] * this.data.number;
      }
      shopPrice = shopPrice + this.data.shoppriceArr[i] * this.data.number;
    }
    if (this.data.is_food == true) {
      totalPrice += parseFloat(this.data.goodsInfo.foot) * this.data.number
    }
    if (this.data.is_insure == true) {
      totalPrice += parseFloat(this.data.goodsInfo.insure) * this.data.number
    }
    if (this.data.is_js == 1) {
      totalPrice = totalPrice + this.data.pickMoney + this.data.sendMoney
    }
    if (this.data.selectedhouse.length > 0) {
      totalPrice += this.data.selectedHoseMoney;
    }
    this.setData({
      shopPrice: shopPrice,
      totalPrice: totalPrice,
      actuallyPrice: totalPrice
    })
  },
  //姓名
  nameInput: function (e) {
    console.log(e)
    this.setData({
      name: e.detail.value
    })
  },
  //电话
  phoneInput: function (e) {
    console.log(e)
    this.setData({
      phone: e.detail.value
    })
  },
  //身份证号
  idcardInput: function (e) {
    console.log(e)
    this.setData({
      idcard: e.detail.value
    })
  }, 
  switchChange: function (e) {
    if (this.data.selectedDate.length == 0) {
      wx.showToast({
        icon: 'none',
        title: '请先选择出行时间。'
      });
      return false;
    }
    if (this.data.actuallyPrice == 0) {
      wx.showToast({
        icon: "none",
        title: '您支付得余额已经为0,不得使用积分抵扣！'
      })
      return false;
    }
    var actuallyPrice = parseFloat(this.data.actuallyPrice);
    var cheap = parseFloat(this.data.integral.cheap)
    if(actuallyPrice<cheap){
      if (this.data.isUseIntegral == false) {
        wx.showToast({
          icon: 'none',
          title: '对不起，您不符合使用积分得条件！'
        })
      } else {
        var isUseIntegral = !this.data.isUseIntegral;
        actuallyPrice = parseFloat(actuallyPrice) + parseFloat(cheap);
        this.setData({
          isUseIntegral: isUseIntegral,
          actuallyPrice: actuallyPrice
        })
      }
    }else{
      var isUseIntegral = !this.data.isUseIntegral;
      if (isUseIntegral == true) {
        actuallyPrice = parseFloat(actuallyPrice) - parseFloat(cheap);
        this.setData({
          actuallyPrice: actuallyPrice,
          isUseIntegral: isUseIntegral
        })
      } else {
        actuallyPrice = parseFloat(actuallyPrice) + parseFloat(cheap);
        this.setData({
          actuallyPrice: actuallyPrice,
          isUseIntegral: isUseIntegral
        })
      }
    }
  },
  switchChange1: function (e) {
    if (this.data.selectedDate.length == 0) {
      wx.showToast({
        icon: 'none',
        title: '请先选择出行时间。'
      });
      return false;
    }
    var cardMoney = this.data.cardMoney;
    var useCardMoney = this.data.useCardMoney;
    var actuallyPrice = parseFloat(this.data.actuallyPrice);
    if(this.data.actuallyPrice>0){
      var isUseCard = !this.data.isUseCard;
      if (isUseCard == true) {
        this.setData({
          isUseCard: isUseCard
        })
        console.log(this.data.cardMoney);   
        if (actuallyPrice>cardMoney){
          actuallyPrice = parseFloat(actuallyPrice) - parseFloat(this.data.cardMoney);
          this.setData({
            actuallyPrice: actuallyPrice,
            useCardMoney: this.data.cardMoney
          })
        }else{
          this.setData({
            actuallyPrice: 0,
            useCardMoney: actuallyPrice
          })
        }
      } else {
        this.setData({
          isUseCard: isUseCard
        })
        actuallyPrice = parseFloat(actuallyPrice) + parseFloat(this.data.useCardMoney);
        this.setData({
          actuallyPrice: actuallyPrice,
          useCardMoney:0
        })
      }
    }else{
      if (this.data.isUseCard == false) {
        wx.showToast({
          icon: 'none',
          title: '实际支付已经为0元'
        })
      }else{
        var isUseCard = !this.data.isUseCard;
        this.setData({
          isUseCard: isUseCard
        })
        var actuallyPrice = parseFloat(this.data.actuallyPrice);
        actuallyPrice = parseFloat(actuallyPrice) + parseFloat(this.data.useCardMoney);
        this.setData({
          actuallyPrice: actuallyPrice,
          useCardMoney: 0
        })
      }
    }
  },
  confirmOrderPrice:function(){
    if (this.data.actuallyPrice==0){
      this.confirmOrder1();
    }else{
      this.confirmOrder();
    }
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
          console.log(pages);
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
    if (this.data.selectedDate.length==0){
      wx.showToast({
        icon:'none',
        title: '您还没有选择出行日期！'
      })
      return false;
    }
    if (this.data.name == "") {
      wx.showToast({
        icon: 'none',
        title: '您还没有填写出行人信息！'
      })
      return false;
    }
    if (this.data.contactList.length == 0) {
      wx.showToast({
        icon: 'none',
        title: '您还填写出行人信息！'
      })
      return false;
    } else if (this.data.contactList.length != this.data.number && this.data.contactList.length != 0) {
      wx.showToast({
        icon: 'none',
        title: '您得出行人个数跟您得出行总人数不一致。'
      })
      return false;
    }
    var mainurl = app.globalData.mainurl;
    var openid = app.globalData.openid;
    var user = { "name": this.data.name, "phone": this.data.phone, "idcard": this.data.idcard }
    if (this.data.isUseIntegral==1){
      var source = this.data.integral.integral;
      var sourcePrice = this.data.integral.cheap;
    }else{
      var source = 0;
      var sourcePrice = 0;
    }
    if (this.data.vid != 0) {
      var vouchers_money = this.data.useAmountOf
    } else {
      var vouchers_money = 0
    }
    if(this.data.is_food ==true){
      var food = parseFloat(this.data.goodsInfo.foot * this.data.number)
    }else{
      var food = 0
    }
    if(this.data.is_insure==true){
       var insure = parseFloat(this.data.goodsInfo.insure * this.data.number)
    }else{
      var insure = 0
    }
    var params = {
      openid: openid,
      goodsId: this.data.id,
      totalMoney: 0.01,
      shopPrice: this.data.shopPrice,
      orderNum: this.data.number,
      dateId: this.data.selectedDate.join(","),
      user: user,
      pid: this.data.type,
      houseId: this.data.selectedhouse.join(","),
      source: source,
      sourcePrice: sourcePrice,
      cardMoney: this.data.useCardMoney,
      vid: this.data.vid,
      vouchers_money: vouchers_money,
      user_play:this.data.contactList,
      food: food,
      insure: insure
    };
    var url = mainurl + 'api/order/submitOrder';
    util.wxRequest(url, params, data => {
      console.log(data)
      if (data.code == 200) {
        this.setData({
          wxdata: data.data.wxData,
          order: data.order,
          order_sn_submit: data.order.order_sn_submit
        })
        this.pay()
      } else {
        wx.showToast({
          title: data.msg,
          icon: 'none'
        })
      }

    }, data => { }, data => { });
  },
  confirmOrder1:function(){
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
    if (this.data.selectedDate.length == 0) {
      wx.showToast({
        icon: 'none',
        title: '您还没有选择出行日期！'
      })
      return false;
    }
    if (this.data.name == "") {
      wx.showToast({
        icon: 'none',
        title: '您还没有填写出行人信息！'
      })
      return false;
    }
    if (this.data.contactList.length==0) {
      wx.showToast({
        icon: 'none',
        title: '您还填写出行人信息！'
      })
      return false;
    } else if (this.data.contactList.length != this.data.number && this.data.contactList.length != 0){
      wx.showToast({
        icon: 'none',
        title: '您得出行人个数跟您得出行总人数不一致。'
      })
      return false;
    }
    var mainurl = app.globalData.mainurl;
    var openid = app.globalData.openid;
    var user = { "name": this.data.name, "phone": this.data.phone, "idcard": this.data.idcard }
    if (this.data.isUseIntegral == 1) {
      var source = this.data.integral.integral;
      var sourcePrice = this.data.integral.cheap;
    } else {
      var source = 0;
      var sourcePrice = 0;
    }
    if (this.data.vid!=0){
      var vouchers_money  = this.data.useAmountOf
    }else{
      var vouchers_money = 0
    }
    if (this.data.is_food) {
      var food = parseFloat(this.data.goodsInfo.foot * this.data.number)
    } else {
      var food = 0
    }
    if (this.data.is_insure) {
      var insure = parseFloat(this.data.goodsInfo.insure * this.data.number)
    } else {
      var insure = 0
    }
    var params = {
      openid: openid,
      goodsId: this.data.id,
      totalMoney: this.data.actuallyPrice,
      shopPrice: this.data.shopPrice,
      orderNum: this.data.number,
      dateId: this.data.selectedDate.join(","),
      user: user,
      pid: this.data.type,
      houseId: this.data.selectedhouse.join(","),
      source: source,
      sourcePrice: sourcePrice,
      cardMoney: this.data.useCardMoney,
      vid: this.data.vid,
      vouchers_money: vouchers_money,
      user_play: this.data.contactList,
      food: food,
      insure: insure
    };
    console.log(params);
    var url = mainurl + 'api/order/noMoneyOrder';
    util.wxRequest(url, params, data => {
      app.globalData.orderData = [];
      if (data.code == 200) {
        wx.navigateTo({
          url: '/pages/skip/skip?page=order&order_id=' + data.data.id + '&totalPrice=' + data.data.total_money + '&goods_id=' + data.data.goods_id + "&type=1",
        })
      } else {
        wx.showToast({
          title: data.msg,
          icon: 'none'
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
  showModal: function () {
    if (this.data.selectedDate.length == 0) {
      wx.showToast({
        icon: 'none',
        title: '请先选择出行时间。'
      });
      return false;
    }
    if (this.data.actuallyPrice == 0) {
      wx.showToast({
        icon: "none",
        title: '您支付得余额已经为0,不得使用优惠券！'
      })
      return false;
    }
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