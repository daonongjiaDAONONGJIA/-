var app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contactLists:[],
    contactList:[],
    contact_ids:[]
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
    wx.showToast({
      icon: 'loading',
      title: '数据加载中~'
    })
    var contact_ids = options.contact_ids;
    var number = options.number;
    console.log(number);
    if (contact_ids!=""){
      var temp = options.contact_ids.split(",");
      var temp_arr = [];
      for(var i=0;i<temp.length;i++){
        temp_arr.push(parseInt(temp[i]));
      }
      this.setData({
        contact_ids: temp_arr,
        number:number
      })
    }else{
      this.setData({
        number: number
      })
    }
    this.contactList();
  },
  // 获取出行人列表
  contactList: function () {
    var mainurl = this.data.version;
    var openid = app.globalData.openid;
    var params = {
      openid: openid,
      page: this.data.page
    };
    var contactList = this.data.contactList;
    var url = mainurl + 'api/user/getContact';
    util.wxRequest(url, params, data => {
      console.log(data)
      wx.hideToast();
      var contactLists = [];
      for(var i=0;i<data.data.length;i++){
        console.log(this.data.contact_ids);
        if (this.data.contact_ids.indexOf(data.data[i].id)==-1){
          var temp = {
            'id': data.data[i].id,
            'name': data.data[i].name,
            'phone': data.data[i].phone,
            'idcard': data.data[i].idcard,
            'is_sel': false
          }
        }else{
          var temp = {
            'id': data.data[i].id,
            'name': data.data[i].name,
            'phone': data.data[i].phone,
            'idcard': data.data[i].idcard,
            'is_sel': true
          }
          contactList.push(temp)
        }
        contactLists.push(temp)
      }
      this.setData({
        contactLists: contactLists,
        contactList: contactList
      })
    }, data => { }, data => { });
  },
  selContact: function (e) {
    var index = e.currentTarget.dataset.index;
    var contactList = this.data.contactList;
    var contactLists = this.data.contactLists;
    var contact_ids = this.data.contact_ids;
    if (contactLists[index].is_sel==false){
      console.log(this.data.contactList.length);
      console.log(this.data.number);
      if (this.data.contactList.length==this.data.number){
        wx.showToast({
          icon:'none',
          title: '人数不能超过'+this.data.number+"个人"
        })
        return false;
      }
      contactLists[index].is_sel = true;
      contact_ids.push(this.data.contactLists[index].id);
      console.log(this.data.contactLists[index].id)
      var temp = {
        'id': this.data.contactLists[index].id,
        'name': this.data.contactLists[index].name,
        'phone': this.data.contactLists[index].phone,
        'idcard': this.data.contactLists[index].idcard
      }
      contactList.push(temp);
    }else{
      var index1 = contact_ids.indexOf(contactLists[index].id);
      if (index1 > -1) {
        contact_ids.splice(index1, 1);
        contactList.splice(index1,1);
      }
      contactLists[index].is_sel = false;
    }
    this.setData({
      contactLists: contactLists,
      contact_ids: contact_ids,
      contactList: contactList
    })
  },
  confirmContact:function(){
    var contactList = this.data.contactList;
    var contact_ids = this.data.contact_ids;
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    //直接调用上一个页面对象的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
      contact_ids: contact_ids,
      contactList: contactList
    });
    wx.navigateBack({
      delta: 1
    })
  },
  // 添加联系人
  addContact: function () {
    wx.navigateTo({
      url: '/pages/add_contact/add_contact?type=sel'
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