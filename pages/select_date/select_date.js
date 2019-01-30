// pages/select_date/select_date.js
var app = getApp();
const util = require('../../utils/util.js');
Page({
  data: {
    currentDate: "2017年05月03日",
    dayList: '',
    currentDayList: [],
    currentObj: '',
    currentDay: '',
    //日期初始化选中样式
    selectCSS: 'bk-color-day',
    selectedCSS:'selected',
    selectDate:[],
    selectedDate:[],
    goods_id:''
  },
  onLoad: function (options) {
    var that = this;
    var goods_id = options.goods_id;
    var mainurl = app.globalData.mainurl;
    var openid = app.globalData.openid;
    this.setData({
      goods_id: goods_id
    })
    var params = {
      id: goods_id
    };
    var url = mainurl + 'api/goods/getDate';
    util.wxRequest(url, params, data => {
      //console.log(data)
      let selectDate = [];
      for(var i=0;i<data.data.length;i++){
        selectDate.push(data.data[i].date);
      }
      this.setData({
        selectDate: selectDate
      })
      var currentObj = this.getCurrentDayString()
      this.setData({
        currentDate: currentObj.getFullYear() + '/' + (currentObj.getMonth() + 1) + '/' + currentObj.getDate(),
        currentDay: currentObj.getDate(),
        currentObj: currentObj,
        currentYear: currentObj.getFullYear(),
        currentMonth: currentObj.getMonth(),
      })
      for (var i = 0; i < 3; i++) {
        this.doDay()
      }
    }, data => { }, data => { });
   
  },
  doDay: function (e) {
    var that = this;
    var currentObj = that.data.currentObj
    var Y = currentObj.getFullYear();
    var m = this.data.currentMonth;
    var d = currentObj.getDate();
    var str = '';
    console.log(m)
    m += 1;
    if (m <= 12) {
      str = Y + '/' + m + '/' + d
    } else {
      Y=Y+1;
      str = (Y + 1) + '/' + 1 + '/' + d
    }
    console.log(str);
    currentObj = new Date(str)
    this.setData({
      currentMonth: m,
      currentYear:Y
    })
    this.setSchedule(currentObj);
  },
  getCurrentDayString: function () {
    var objDate = this.data.currentObj
    if (objDate != '') {
      return objDate
    } else {
      var c_obj = new Date()
      var a = c_obj.getFullYear() + '/' + (c_obj.getMonth() + 1) + '/' + c_obj.getDate()
      return new Date(a)
    }
  },
  setSchedule: function (currentObj) {
    var that = this
    let m = this.data.currentMonth;
    let Y = currentObj.getFullYear()
    let d = currentObj.getDate();
    var dayString = Y + '/' + m + '/' + currentObj.getDate()
    var currentDayNum = new Date(Y, m, 0).getDate()
    var currentDayWeek = currentObj.getUTCDay() + 1
    var result = currentDayWeek - (d % 7 - 1);
    var firstKey = result <= 0 ? 7 + result : result;
    var currentDayList = [];
    var f = 0
    for (var i = 0; i < 35; i++) {
      let data = []
      if (i < firstKey - 1) {
        currentDayList[i] = {
          m:m,
          date: Y + '-' + m + '-' + (f + 1),
          num:'',
          selected:false,
          isSelected: false
        }
      } else {
        if (f < currentDayNum) {
          let seletedDay = "";
          if(m>=10){
            if ((f + 1)>=10){
              seletedDay = Y + '-' + m + '-' + (f + 1);
            }else{
              seletedDay = Y + '-' + m + '-0' + (f + 1);
            }
          }else{
            if ((f + 1) >= 10) {
              seletedDay = Y + '-0' + m + '-' + (f + 1);
            } else {
              seletedDay = Y + '-0' + m + '-0' + (f + 1);
            }
          }
          if (this.data.selectDate.indexOf(seletedDay)!=-1){
            currentDayList[i] = {
              m: m,
              num: f + 1,
              date: seletedDay,
              selected: true,
              isSelected: false
            };
          }else{
            currentDayList[i] = {
              m: m,
              num: f + 1,
              date: seletedDay,
              selected: false,
              isSelected: false
            };
          }
          f = currentDayList[i]['num']
        } else if (f >= currentDayNum) {
          currentDayList[i] = {
            m:m,
            date: Y + '-' + m + '-' + (f + 1),
            num: '',
            selected: false,
            isSelected: false
          }
        }
      }
    }
    let currentDayListTemp = this.data.currentDayList;
    currentDayListTemp.push({
      'month':m,
      'data':currentDayList
    })
    that.setData({
      currentDayList: currentDayListTemp
    })
  },
  //选择具体日期方法--xzz1211
  selectDay: function (e) {
    var index = e.currentTarget.dataset.index;
    var m = e.currentTarget.dataset.m;
    var date = e.currentTarget.dataset.date;
    var currentDayList = this.data.currentDayList;
    let selectedDate = this.data.selectedDate;
    for (let i in currentDayList){
      //console.log(m)
      //console.log(currentDayList[i]['month'])
      if (currentDayList[i]['month']==m){
        for(let j=0;j<35;j++){
          if (currentDayList[i]['data'][j]['date'] == date){
            if (currentDayList[i]['data'][j]['isSelected']){
              let index1 = selectedDate.indexOf(currentDayList[i]['data'][j]['date']);
              selectedDate.splice(index1,1);
              this.setData({
                selectedDate: selectedDate
              })
            }else{
              selectedDate.push(date);
              this.setData({
                selectedDate: selectedDate
              });
            }
            currentDayList[i]['data'][j]['isSelected'] = !currentDayList[i]['data'][j]['isSelected'];
          }
        }
      }
    }
    this.setData({
      currentDayList: this.data.currentDayList,
    });
  },
  selDate:function(){
    if (this.data.selectedDate.length>0){
      app.globalData.orderData.date = this.data.selectedDate
      wx.navigateTo({
        url: '/pages/confirm_order/confirm_order?goods_id=' + this.data.goods_id
      })
    }else{
      wx.showToast({
        title: '请选择日期！',
        icon:'none'
      })
    }
    
  }
})