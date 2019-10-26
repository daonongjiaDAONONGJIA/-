// pages/experience_confirm/index.js
const app = getApp();
const util = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    year: 0,
    month: 0,
    date: ['日', '一', '二', '三', '四', '五', '六'],
    dateArr: [],
    isToday: 0,
    isTodayWeek: false,
    todayIndex: 0,
    number: 1,
    startDate: '',
    selDate:'',
    selDays:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    var id = options.id;
    var package_type_id = options.package_type_id;
    var price = options.price;
    var shop_price = options.shop_price;
    var res = wx.getSystemInfoSync();
    this.setData({
      id: id,
      package_type_id: package_type_id,
      price:price,
      shop_price: shop_price,
      platform: res.platform
    })
    this.getCalendar();
  },
  // 修改人数
  changeNum: function (e) {
    if (this.data.selDate == "") {
      wx.showToast({
        icon: 'none',
        title: '请选择出行时间！'
      })
      return false;
    }
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
  },
  //初始化日历
  getCalendar: function () {
    let now = new Date();
    now.setDate(now.getDate() + 2);//获取后天后的日期
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let dates = now.getDate();
    if(month<10){
      var month_str = "0" + month
    }else{
      var month_str = month
    }
    if (dates < 10) {
      var dates_str = "0" + dates
    }else{
      var dates_str = dates
    }
    console.log(dates);
    let startDate = year + "-" + month_str + "-" + dates_str;
    this.setData({
      year: year,
      month: month,
      startDate: startDate
    })
    console.log(this.data.startDate);
    this.dateInit(year,month);
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
    let date_str = "";
    let startWeek = 0;
    let dayNums = 0;
    if (this.data.platform == 'ios') {
      if (nextMonth < 10) {
        date_str = year + "/" + "0" + nextMonth + "/00"
      } else {
        date_str = year + "/" + nextMonth + "/00"
      }
      console.log(date_str)
      startWeek = new Date(date_str).getDay();             //目标月1号对应的星期 
      dayNums = new Date(date_str).getDate();       //获取目标月有多少天 
    } else {
      startWeek = new Date(year + ',' + (month + 1) + ',' + 1).getDay();             //目标月1号对应的星期 
      dayNums = new Date(year, nextMonth, 0).getDate();       //获取目标月有多少天 
    }
    let obj = {};
    let num = 0;
    if (month + 1 > 11) {
      nextYear = year + 1;
      if (this.data.platform == 'ios') {
        if (nextMonth < 10) {
          date_str = nextYear + "/" + "0" + nextMonth + "/00"
        } else {
          date_str = nextYear + "/" + nextMonth + "/00"
        }
        dayNums = new Date(date_str).getDate();       //获取目标月有多少天 
      } else {
        dayNums = new Date(nextYear, nextMonth, 0).getDate();       //获取目标月有多少天 
      }
    }
    arrLen = startWeek + dayNums;
    for (let i = 0; i < arrLen; i++) {
      if (i >= startWeek) {
        num = i - startWeek + 1;
        //判断是否是可选日期
        let m = month;
        let date_str = "";
        if (m >= 10) {
          if (num >= 10) {
            date_str = year + '-' + m + '-' + num;
          } else {
            date_str = year + '-' + m + '-0' + num;
          }
        } else {
          if (num >= 10) {
            date_str = year + '-0' + m + '-' + num;
          } else {
            date_str = year + '-0' + m + '-0' + num;
          }
        }
        obj = {
          dateNum: num,
          date: date_str
        };
      } else {
        obj = {
          dateNum: ''
        };
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
    let now = new Date();
    let now_month = now.getMonth()+1;
    //全部时间的月份都是按0~11基准，显示月份才+1 
    let year = this.data.month - 2 < 0 ? this.data.year - 1 : this.data.year;
    let month = this.data.month - 2 < 0 ? 11 : this.data.month - 2;
    if((month+1)>=now_month){
      this.setData({
        year: year,
        month: (month + 1)
      })
      this.dateInit(year, month);
    }
  },
  nextMonth: function () {
    //全部时间的月份都是按0~11基准，显示月份才+1 
    let year = this.data.month > 11 ? this.data.year + 1 : this.data.year;
    let month = this.data.month > 11 ? 0 : this.data.month;
    this.setData({
      year: year,
      month: (month + 1)
    })
    this.dateInit(year,this.data.month);
  },
  selectDay: function (e) {
    var date = e.currentTarget.dataset.date;
    console.log(date);
    this.setData({
      selDate: date
    })
  },
  getOrder: function () {
    if (this.data.selDate==''){
      wx.showToast({
        icon:'none',
        title: '请选择出行日期'
      })
      return false;
    }
    wx.navigateTo({
      url: '/pages/package_order/index?id=' + this.data.id + "&package_type_id=" + this.data.package_type_id + "&price=" + this.data.price + "&shop_price=" + this.data.shop_price +"&number="+this.data.number+"&start="+this.data.selDate
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