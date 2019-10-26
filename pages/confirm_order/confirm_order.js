//index.js 
//获取应用实例 
const app = getApp();
const util = require('../../utils/util.js');
Page({
  data: {
    year: 0,
    month: 0,
    date: ['日', '一', '二', '三', '四', '五', '六'],
    dateArr: [],
    isToday: 0,
    isTodayWeek: false,
    todayIndex: 0,
    number: 1,
    house_num:1,
    isDefault: 0,
    totalPrice: 0,
    actuallyPrice: 0,
    shopPrice: 0,
    cardMoney: 0,
    useCardMoney: 0,
    fscCard:0,
    useFscCard:0,
    priceArr: [],
    memberpriceArr: [],
    shoppriceArr: [],
    isUseCard: false,
    isUseFsc:false,
    vid: 0,
    amount_of: 0,
    useAmountOf: 0,
    seletedDay:''
  },
  onLoad: function (options) {
    var id = options.id;
    this.setData({
      id: id
    })
    let now = new Date();
    now.setDate(now.getDate() + 2);//获取后天后的日期
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    this.setData({
      year: year,
      month: month,
      isToday: '' + year + month + now.getDate()
    })
    this.getGoods();
    this.getFscCount();
    this.dateInit();
    this.getContact();
    this.getVoucher();
  },
  getGoods:function(){
    var mainurl = app.globalData.mainurl;
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
        goodsInfo: data.data,
        cardMoney: parseFloat(data.data.card_money)
      })
    }, data => { }, data => { });
  },
  getFscCount:function(){
    var mainurl = app.globalData.mainurl;
    var openid = app.globalData.openid;
    var params = {
      openid: openid
    };
    var url = mainurl + 'api/ddj/getFscCount';
    util.wxRequest(url, params, data => {
      console.log(data);
      this.setData({
        fscCard:data.data
      })
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
          if (num >= 10) {
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
        obj = {
          isToday: '' + year + (month + 1) + num,
          dateNum: num,
          seletedDay: seletedDay
        };
      } else {
        obj = {
          dateNum:''
        };
      }
      dateArr[i] = obj;
      console.log(dateArr);
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
    let year = this.data.year - 1;
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
    var date = e.currentTarget.dataset.date;
    console.log(date);
    this.setData({
      selectDate: date
    });
    if(this.data.totalPrice==0){
      if(this.data.goodsInfo.level==1){
        this.setData({
          totalPrice: this.data.goodsInfo.member_price,
          actuallyPrice: this.data.goodsInfo.member_price,
        })
      }else{
        this.setData({
          totalPrice: this.data.goodsInfo.price,
          actuallyPrice: this.data.goodsInfo.price,
        })
      }
      
    }
  },
  // 修改人数
  changeNum: function (e) {
    var cz = e.currentTarget.dataset.cz;
    var number = this.data.number;
    var house_num = this.data.house_num;
    if (cz == 'add') {
      number = number+1;
      house_num = Math.round(number/2)
    } else {
      if(num>1){
        number = number - 1;
        house_num = Math.round(number/2)
      }else{
        wx.showToast({
          icon:'none',
          title: '人数最少不能小于1。'
        })
      }
    }
    console.log(Math.round(number / 2))
    this.setData({
      number: number,
      house_num: house_num
    });
    if (this.data.goodsInfo.level == 1){
      var totalPrice = parseFloat(this.data.goodsInfo.price) * number
    }else{
      var totalPrice = parseFloat(this.data.goodsInfo.member_price) * number
    }
    this.setData({
      totalPrice: totalPrice,
      actuallyPrice: totalPrice,
      useCardMoney:0,
      useFscCard:0,
      isUseCard: false,
      isUseFsc: false,
      vid: 0,
      amount_of: 0,
      useAmountOf: 0
    })                 
  },
  // 修改房间数
  changeNum1: function (e) {
    var cz = e.currentTarget.dataset.cz;
    var number = this.data.number;
    var house_num = this.data.house_num;
    if (cz == 'add') {
      if (house_num == number){
        wx.showToast({
          icon: 'none',
          title: '房间数量不能大于人数。'
        })
      }else{
        house_num = house_num + 1
      }
    } else {
      if (house_num > Math.round(number / 2)) {
        house_num = house_num - 1
      } else {
        wx.showToast({
          icon: 'none',
          title: '房间数量不能小于' + house_num
        })
      }
    }
    this.setData({
      house_num: house_num
    });
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
  getVoucher: function () {
    var mainurl = app.globalData.mainurl;
    var openid = app.globalData.openid;
    var params = {
      openid: openid,
      page: 1
    };
    var url = mainurl + 'api/Vouchers/getVoucherList';
    util.wxRequest(url, params, data => {
      console.log(data.data.data.length);
      this.setData({
        voucherList: data.data.data,
        voucherNum: data.data.data.length
      })
    }, data => { }, data => { });
  },
  selVoucher: function (e) {
    var vid = e.currentTarget.dataset.vid;
    var amount_of = parseFloat(e.currentTarget.dataset.price);
    var totalPrice = this.data.totalPrice;
    var actuallyPrice = this.data.actuallyPrice;
    if (this.data.vid != 0) {
      actuallyPrice = parseFloat(actuallyPrice) + parseFloat(this.data.useAmountOf);
      this.setData({
        vid: 0,
        amount_of: 0,
        useAmountOf: 0
      })
    } else {
      this.setData({
        vid: vid,
        amount_of: amount_of
      })
      if (actuallyPrice > 0) {
        if (actuallyPrice >= this.data.amount_of) {
          actuallyPrice = parseFloat(actuallyPrice) - parseFloat(this.data.amount_of);
          this.setData({
            useAmountOf: this.data.amount_of
          })
        } else {
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
  changeCard: function (e) {
    var cardMoney = this.data.cardMoney;
    var useCardMoney = this.data.useCardMoney;
    var actuallyPrice = parseFloat(this.data.actuallyPrice);
    console.log(cardMoney)
    if (this.data.actuallyPrice > 0) {
      var isUseCard = !this.data.isUseCard;
      if (isUseCard == true) {
        this.setData({
          isUseCard: isUseCard
        })
        if (actuallyPrice > cardMoney) {
          actuallyPrice = parseFloat(actuallyPrice) - parseFloat(this.data.cardMoney);
          this.setData({
            actuallyPrice: actuallyPrice,
            useCardMoney: this.data.cardMoney
          })
        } else {
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
          useCardMoney: 0
        })
      }
    } else {
      if (this.data.isUseCard == false) {
        wx.showToast({
          icon: 'none',
          title: '实际支付已经为0元'
        })
      } else {
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
  changeFsc: function (e) {
    var fscCard = this.data.fscCard;
    var useFscCard = this.data.useFscCard;
    var actuallyPrice = parseFloat(this.data.actuallyPrice);
    if (this.data.actuallyPrice > 0) {
      var isUseFsc = !this.data.isUseFsc;
      if (isUseFsc == true) {
        this.setData({
          isUseFsc: isUseFsc
        })
        if (actuallyPrice > 200) {
          if (fscCard>=200){
            actuallyPrice = parseFloat(actuallyPrice) - 200;
            this.setData({
              actuallyPrice: actuallyPrice,
              useFscCard: 200
            })
          }else{
            actuallyPrice = parseFloat(actuallyPrice) - fscCard;
            this.setData({
              actuallyPrice: actuallyPrice,
              useFscCard: fscCard
            })
          }
        } else {
          actuallyPrice = parseFloat(actuallyPrice) - fscCard;
          this.setData({
            actuallyPrice: actuallyPrice,
            useFscCard: fscCard
          })
        }
      } else {
        this.setData({
          isUseFsc: isUseFsc
        })
        actuallyPrice = parseFloat(actuallyPrice) + parseFloat(this.data.useFscCard);
        this.setData({
          actuallyPrice: actuallyPrice,
          useFscCard: 0
        })
      }
    } else {
      if (this.data.isUseFsc == false) {
        wx.showToast({
          icon: 'none',
          title: '实际支付已经为0元'
        })
      } else {
        var isUseFsc = !this.data.isUseFsc;
        this.setData({
          isUseFsc: isUseFsc
        })
        var actuallyPrice = parseFloat(this.data.actuallyPrice);
        actuallyPrice = parseFloat(actuallyPrice) + parseFloat(this.data.useFscCard);
        this.setData({
          actuallyPrice: actuallyPrice,
          useFscCard: 0
        })
      }
    }
  },
  confirmOrderPrice: function () {
    if (this.data.actuallyPrice == 0) {
      this.confirmOrder1();
    } else {
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
    if (this.data.selectDate == '') {
      wx.showToast({
        icon: 'none',
        title: '您还没有选择出行日期！'
      })
      return false;
    }
    if (this.data.name == "") {
      wx.showToast({
        icon: 'none',
        title: '您还填写出行人信息！'
      })
      return false;
    }
    var mainurl = app.globalData.mainurl;
    var openid = app.globalData.openid;
    var user = { "name": this.data.name, "phone": this.data.phone, "idcard": this.data.idcard }
    if (this.data.vid != 0) {
      var vouchers_money = this.data.useAmountOf
    } else {
      var vouchers_money = 0
    }
    var params = {
      openid: openid,
      package_id: this.data.goodsInfo.id,
      totalMoney: this.data.actuallyPrice,
      shopPrice: this.data.shopPrice,
      orderNum: this.data.number,
      date: this.data.selectDate,
      user: user,
      houseNum:this.data.house_num,
      cardMoney: this.data.useCardMoney,
      vid: this.data.vid,
      vouchers_money: vouchers_money,
      fsc_money:this.data.useFscCard
    };
    console.log(params);
    var url = mainurl + 'api/package/submitOrder';
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
  confirmOrder1: function () {
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
    if (this.data.selectDate == '') {
      wx.showToast({
        icon: 'none',
        title: '您还没有选择出行日期！'
      })
      return false;
    }
    if (this.data.name == "") {
      wx.showToast({
        icon: 'none',
        title: '您还填写出行人信息！'
      })
      return false;
    }
    var mainurl = app.globalData.mainurl;
    var openid = app.globalData.openid;
    var user = { "name": this.data.name, "phone": this.data.phone, "idcard": this.data.idcard }
    if (this.data.vid != 0) {
      var vouchers_money = this.data.useAmountOf
    } else {
      var vouchers_money = 0
    }
    var params = {
      openid: openid,
      package_id: this.data.goodsInfo.id,
      totalMoney: this.data.actuallyPrice,
      shopPrice: this.data.shopPrice,
      orderNum: this.data.number,
      date: this.data.selectDate,
      user: user,
      houseNum: this.data.house_num,
      cardMoney: this.data.useCardMoney,
      vid: this.data.vid,
      vouchers_money: vouchers_money,
      fsc_money: this.data.useFscCard
    };
    console.log(params);
    var url = mainurl + 'api/package/noMoney';
    util.wxRequest(url, params, data => {
      console.log(data)
      if (data.code == 200) {
        wx.navigateTo({
          url: '/pages/skip/skip?page=order&order_id=' + data.data.id + '&totalPrice=' + data.data.total_money + '&goods_id=' + data.data.goods_id + "&type=2",
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
          url: '/pages/skip/skip?page=order&order_id=' + that.data.order.id + '&totalPrice=' + that.data.order.total_money + '&goods_id=' + that.data.order.goods_id +"&type=2",
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
  showModal: function () {
    if (this.data.totalPrice == 0) {
      wx.showToast({
        icon: "none",
        title: '您还没选择入住房间。'
      })
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