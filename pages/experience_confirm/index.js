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
    startDate:'',
    endDate:'',
    selDays:'',
    number:1,
    selStartDate:'',
    selDate:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    var goods_id = options.goods_id;
    var type = options.type;
    var res = wx.getSystemInfoSync();
    this.setData({
      id: goods_id,
      type: type,
      platform: res.platform
    });
    console.log(this.data.platform);
    this.getStartDate();
  },
  getStartDate: function () {
    var mainurl = app.globalData.mainurl;
    var openid = app.globalData.openid;
    var params = {
      pid: this.data.type,
      id:this.data.id,
      openid: openid
    };
    var url = mainurl + 'api/goods/getDate';
    util.wxRequest(url, params, data => {
      wx.hideToast();
      this.setData({
        selStartDate: data.data[0].date
      });
      this.getCalendar();
    }, data => { }, data => { });
  },
  // 修改人数
  changeNum: function (e) {
    if(this.data.startDate==""){
      wx.showToast({
        icon:'none',
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
  getCalendar:function(){
    let now = new Date();
    now.setDate(now.getDate() + 2);//获取后天后的日期
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    this.setData({
      year: year,
      month: month
    })
    this.dateInit(year, month);
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
    if (this.data.platform=='ios'){
      if (nextMonth<10){
        date_str = year + "/" + "0" + nextMonth + "/00"
      }else{
        date_str = year + "/" + nextMonth + "/00"
      }
      console.log(date_str)
      startWeek = new Date(date_str).getDay();             //目标月1号对应的星期 
      dayNums = new Date(date_str).getDate();       //获取目标月有多少天 
    }else{
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
        if(this.data.selDays!=''){
          if (this.data.selDays.indexOf(date_str) != -1){
            obj = {
              dateNum: num,
              date: date_str,
              is_sel:true
            };
          }else{
            obj = {
              dateNum: num,
              date: date_str,
              is_sel: false
            };
          }
        }else{
          obj = {
            dateNum: num,
            date: date_str,
            is_sel: false
          };
        }
       
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
    this.dateInit(year, this.data.month);
  },
  selectDay:function(e){
    var date = e.currentTarget.dataset.date;
    var selDate = this.data.selDate;
    if (selDate.length==1){
      selDate.push(date);
      if (selDate[0] > selDate[1]){
        this.setData({
          selDate: selDate,
          startDate: selDate[1],
          endDate: selDate[0]
        })
        this.getDays(this.data.startDate, this.data.endDate);
      }else{
        this.setData({
          selDate: selDate,
          startDate: selDate[0],
          endDate: selDate[1]
        })
        this.getDays(this.data.startDate, this.data.endDate);
      }
    } else if (selDate.length==0){
      selDate.push(date);
      this.setData({
        selDate: selDate,
        startDate: selDate[0]
      })
    } else if (selDate.length ==2){
      this.setData({
        selDate: [date],
        startDate: date,
        endDate:'',
        selDays:''
      })
      this.dateInit(this.data.year,this.data.month);
    }
  },
  // 获取间隔天数
  getDays:function (day1, day2) {
    // 获取入参字符串形式日期的Date型日期
    var d1 = this.getDate(day1);
    var d2 = this.getDate(day2);
    // 定义一天的毫秒数
    var dayMilliSeconds = 1000 * 60 * 60 * 24;
    // 获取输入日期的毫秒数
    var d1Ms = d1.getTime();
    var d2Ms = d2.getTime();
    // 定义返回值
    var ret;
    // 对日期毫秒数进行循环比较，直到d1Ms 大于等于 d2Ms 时退出循环
    // 每次循环结束，给d1Ms 增加一天
    for (d1Ms; d1Ms <= d2Ms; d1Ms += dayMilliSeconds) {
      // 如果ret为空，则无需添加","作为分隔符
      if (!ret) {
        // 将给的毫秒数转换为Date日期
        var day = new Date(d1Ms);

        // 获取其年月日形式的字符串
        ret = this.getYMD(day);
      } else {

        // 否则，给ret的每个字符日期间添加","作为分隔符
        var day = new Date(d1Ms);
        ret = ret + ',' + this.getYMD(day);
      }
    }
    this.setData({
      selDays:ret
    })
    console.log(this.data.selDays);
    this.dateInit(this.data.year,this.data.month);
  },
  getDate:function(day){
    var strArr = day.split('-');
    var date = new Date(strArr[0], strArr[1] - 1, strArr[2]);
    return date;
  },
  getYMD:function(day){
    var year = day.getFullYear();
    var month = day.getMonth() + 1;
    var day = day.getDate();
    var retDate = year + "-";  // 获取年份。
    if (month<10){
      retDate += "0" + month + "-";
    }else{
      retDate += month;
    }  
    if (day < 10) {
      retDate += "0" + day;
    } else {
      retDate += day;
    }       
    return retDate;                          // 返回日期。
  },
  getOrder:function(){
    if (this.data.startDate==''){
      wx.showToast({
        icon:'none',
        title: '请选择开始时间'
      })
      return false;
    }
    if (this.data.endDate == '') {
      wx.navigateTo({
        url: '/pages/experience_order/index?id=' + this.data.id + "&type=" + this.data.type + "&number=" + this.data.number + "&days=" + this.data.selDays + "&start=" + this.data.startDate + "&end=" + this.data.startDate
      })
    }else{
      wx.navigateTo({
        url: '/pages/experience_order/index?id=' + this.data.id + "&type=" + this.data.type + "&number=" + this.data.number + "&days=" + this.data.selDays + "&start=" + this.data.startDate + "&end=" + this.data.endDate
      })
    }
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