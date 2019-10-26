// pages/auth/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    unionid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var version = app.getVersion();
    this.setData({
      version: version
    })
    if (!app.globalData.openid) {
      app.getToken().then((resArg) => {
        this.getUnionid();
      })
    } else {
      this.getUnionid();
    }
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
            userData: data.data,
            unionid: data.data.unionid
          })
          //this.getSignData();
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
          unionid: this.data.userInfo.unionId
        });
        //this.getSignData();
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

  }
})