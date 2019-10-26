// pages/experience_detail/experience_detail.js
var WxParse = require('../../wxParse/wxParse.js');
var app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsImgs: '',
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    //所有图片的高度  
    imgheights: [],
    //图片宽度 
    imgwidth: 750,
    current: 0,
    goodsInfo: "",
    selTime:0,
    number:1,
    quota:1,
    totalPrice:0,
    apply:"",
    unionid:'',
    is_show:0,
    state:1
  },
  onLoad(options) {
    var that = this;
    var id = options.id;
    var version = app.getVersion();
    wx.showToast({
      icon: 'loading',
      title: '数据加载中~'
    })
    if (app.globalData.login == false) {
      app.userLogin().then((resArg) => {
        that.setData({
          id: id,
          version: version
        });
        that.getGoodsinfo();
        that.getUnionid();
        that.getMemberCardInfo();
        that.getVoucherList();
        that.getVoucherNum();
      })
    } else {
      that.setData({
        id: id,
        version: version
      });
      that.getGoodsinfo();
      that.getUnionid();
      that.getMemberCardInfo();
      that.getVoucherList();
      that.getVoucherNum();
    }
    //获取banner图片
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
      id: this.data.id,
      openid: openid
    };
    var url = this.data.version + 'api/activity/activityInfo';
    util.wxRequest(url, params, data => {
      var totalPrice = this.data.number * parseFloat(data.data.price)
      this.setData({
        goodsInfo: data.data,
        imgList: data.data.thumb,
        time:data.data.time,
        totalPrice: totalPrice,
        roll_price:parseFloat(data.data.price)/2,
        fsc:parseFloat(data.data.fsc)
      });
      var article = WxParse.wxParse('article', 'html', data.data.content, this, 5);

    }, data => { }, data => { });
  },
  getMember: function () {
    wx.navigateTo({
      url: '/pages/vip_intro/vip_intro'
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
  getCard: function () {
    wx.navigateTo({
      url: '/pages/my_card/index'
    })
  },
  getSelTime:function(e){
    var id = e.currentTarget.dataset.id;
    var quota = e.currentTarget.dataset.quota;
    var apply = e.currentTarget.dataset.apply;
    this.setData({
      selTime:id,
      quota:quota,
      apply: apply
    })
  },
  // 修改数量
  changeNum: function (e) {
    var cz = e.currentTarget.dataset.cz;
    var number = this.data.number;
    if (cz == 'add') {
      if (number < this.data.quota) {
        number = number + 1;
      }
    } else {
      if (number > 1) {
        number = number - 1;
      }
    }
    this.setData({
      number: number
    });
    var totalPrice = this.data.number * parseFloat(this.data.goodsInfo.price)
    this.setData({
      totalPrice: totalPrice
    });
  },
  //获取地图
  getMap: function (e) {
    var address = e.currentTarget.dataset.address;
    wx.navigateTo({
      url: '/pages/map/map?address=' + this.data.goodsInfo.address
    })
  },
  getShare: function () {
    wx.showShareMenu({
      withShareTicket: true
    })
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
      } else {
        wx.showToast({
          icon: 'none',
          title: '优惠券不可用！'
        })
      }
    }
    if (type == 'roll') {
      if (this.data.goodsInfo.roll == 1 && this.data.roll > 0) {
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
      } else {
        wx.showToast({
          icon: 'none',
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
  useHsfVoucher: function () {
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
  //提交定单
  confirmOrder: function () {
    var that = this;
    app.getUserInfo().then((data) => {
      if (data.unionid == null || data.phone == null) {
        wx.navigateTo({
          url: '/pages/login/index',
        })
      } else {
        that.showModal();
      }
    })
  },
  buyGoods: function () {
    if(this.data.unionid==''){
      this.setData({
        is_show:1,
        value:false
      })
      return false;
    }
    if (this.data.selTime == 0) {
      wx.showToast({
        icon: 'none',
        title: '请选择活动时间！'
      });
      return false;
    }
    if (this.data.quota == 0) {
      wx.showToast({
        icon: 'none',
        title: '数量为0，请重新选择！'
      });
      return false;
    }
    wx.navigateTo({
      url: '/pages/activity_confirm/index?id=' + this.data.id + "&number=" + this.data.number + "&pid=" + this.data.selTime,
    })
  },
  getStyle: function () {
    wx.navigateTo({
      url: '/pages/style/index?id=' + this.data.id + "&type=activity"
    })
  },
  getUnionid: function () {
    var params = {
      openid: app.globalData.openid
    }
    console.log(app.globalData.openid);
    var url = this.data.version + 'api/user/userQurey';
    util.wxRequest(url, params, data => {
      console.log(data);
      if (data.code == 200) {
        if (data.data.unionid != null) {
          this.setData({
            unionid: data.data.unionid
          })
        } else {

        }
      }
    }, data => { }, data => { })
  },
  getUserInfo: function (e) {
    var that = this;
    wx.login({
      success: res => {
        if (res.code) {
          var loginCode = res.code
          wx.request({
            url: that.data.version + 'api/user/getopenid',
            data: {
              js_code: res.code,
              grant_type: 'authorization_code',
            },
            success: function (response) {
              //判断openid是否获取成功
              console.log(response);
              if (response.data.openid != null && response.data.openid != undefined) {
                that.setData({
                  session_key: response.data.session_key,
                  loginCode: loginCode,
                  encryptedData: encodeURIComponent(e.detail.encryptedData),
                  iv: e.detail.iv
                })
                that.getUserInfoData();
              } else if (response.data == false) {
                console.log('获取openid失败');
              }
            },
            fail: function () {
              console.log('获取openid失败');
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  getUserInfoData: function () {
    var params = {
      encryptedData: this.data.encryptedData,
      iv: this.data.iv,
      session_key: this.data.session_key,
      openid: app.globalData.openid
    }
    var url = this.data.version + 'api/user/decryptData';
    util.wxRequest(url, params, data => {
      console.log(data);
      if (data.code == 200) {
        this.setData({
          userInfo: data.data
        })
        this.unionidBinding();
      } else {
        wx.showToast({
          icon: 'none',
          title: data.msg
        })
      }
    }, data => { }, data => { })
  },
  unionidBinding: function (data) {
    var params = {
      openid: app.globalData.openid,
      unionid: this.data.userInfo.unionId,
      head_src: this.data.userInfo.avatarUrl,
      nick_name: this.data.userInfo.nickName
    }
    var url = this.data.version + 'api/user/unionidBinding';
    util.wxRequest(url, params, data => {
      console.log(data);
      if (data.code == 200) {
        this.setData({
          unionid: this.data.userInfo.unionId,
          is_show:0
        });
      } else {
        wx.showToast({
          icon: 'none',
          title: data.msg
        })
      }
    }, data => { }, data => { })
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
    imgheights.push(imgheight);
    this.setData({
      imgheights: imgheights
    })
  },
  bindchange: function (e) {
    this.setData({ current: e.detail.current })
  }
})