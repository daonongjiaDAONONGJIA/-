// pages/shop_index/shop_index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageType: 1,
    // index
    userInfo: {},
    open: false,   //是否打开红包
    page: true,   //红包是否显示 
    orderOrBusiness: 'order',
    newsarr: [
      { id: 0, message: "本店新用户立减1元（在线支付专享）" },
      { id: 1, message: "本店新用户立减2元（在线支付专享）" },
      { id: 2, message: "本店新用户立减3元（在线支付专享）" },
      { id: 3, message: "本店新用户立减4元（在线支付专享）" },
      { id: 4, message: "本店新用户立减5元（在线支付专享）" }
    ],
    autoplay: true,
    interval: 3000,
    duration: 500,
    vertical: true,
    circular: true,

    menu: [
      { id: 0, name: "热销" },
      { id: 1, name: "新品" },
      { id: 2, name: "下午茶" },
      { id: 3, name: "滋味盖饭" },
      { id: 4, name: "日式小食" },
      { id: 5, name: "系列套餐" },
      { id: 6, name: "特色炖汤" },
      { id: 7, name: "下午茶" },
      { id: 8, name: "日式小食" },
      { id: 9, name: "滋味盖饭" },
      { id: 10, name: "系列套餐" },
    ],
    arr2: [
      { id: 0, value: "香辣味" },
      { id: 1, value: "盐焗味" },
      { id: 2, value: "蒜香味" },
      { id: 3, value: "姜葱味" },
    ],

    height: 0,
    orderType: 0,  //点菜类型
    restaurant: false,  //餐厅点菜
    map_address: '',
    buycar_num: 0,
    block: false,  //选规格
    foodtype: 0,  //选规格种类
    bindId: 0,

    // buycar
    totalMoney: 0,
    chooseAll: false,
    arr: [
      { id: 0, img: "../../images/food2.jpg", name: "五花肉石锅拌饭", num: "3", price: "51.21", selected: false },
      { id: 1, img: "../../images/food2.jpg", name: "五花肉石锅拌饭", num: "3", price: "61", selected: false },
      { id: 2, img: "../../images/food2.jpg", name: "五花肉石锅拌饭", num: "3", price: "71", selected: false },
      { id: 3, img: "../../images/food2.jpg", name: "五花肉石锅拌饭", num: "3", price: "81", selected: false },
      { id: 4, img: "../../images/food2.jpg", name: "五花肉石锅拌饭", num: "3", price: "81", selected: false }
    ],
    arr3: [
      { id: 0, img: "../../images/food2.jpg", name: "五花肉石锅拌饭", num: "0", price: "51", message: "配米饭一份哦", message2: "月售330｜好评率100%", message3: [{ id: 0, value: "香辣味" }, { id: 1, value: "盐焗味" }, { id: 2, value: "蒜香味" }, { id: 3, value: "姜葱味" },] },
      { id: 1, img: "../../images/food2.jpg", name: "五花肉石锅拌饭", num: "0", price: "51", message: "配米饭一份哦", message2: "月售330｜好评率100%", message3: '' },
      { id: 2, img: "../../images/food2.jpg", name: "五花肉石锅拌饭", num: "0", price: "51", message: "配米饭一份哦", message2: "月售330｜好评率100%", message3: [{ id: 0, value: "香辣味2" }, { id: 1, value: "盐焗味2" }, { id: 2, value: "蒜香味2" }, { id: 3, value: "姜葱味2" },] },
      { id: 3, img: "../../images/food2.jpg", name: "五花肉石锅拌饭", num: "0", price: "51", message: "配米饭一份哦", message2: "月售330｜好评率100%", message3: [{ id: 0, value: "香辣味3" }, { id: 1, value: "盐焗味3" }, { id: 2, value: "蒜香味3" }, { id: 3, value: "姜葱味3" },] },
      { id: 4, img: "../../images/food2.jpg", name: "五花肉石锅拌饭", num: "0", price: "51", message: "配米饭一份哦", message2: "月售330｜好评率100%", message3: [{ id: 0, value: "香辣味4" }, { id: 1, value: "盐焗味4" }, { id: 2, value: "蒜香味4" }, { id: 3, value: "姜葱味4" },] },
    ],
    // order
    orderOk: false,
    // me
    img: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: (res.windowHeight * .82) + 'px'
        })
      }
    });
  },
  turnMenu: function (e) {
    var type = e.target.dataset.index;
    console.log(type)
    this.setData({
      orderType: type
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