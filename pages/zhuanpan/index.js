/**
 * 大转盘抽奖
 */
var WxParse = require('../../wxParse/wxParse.js');
var util = require("../../utils/util.js");
var app = getApp();
Page({
  //奖品配置
  awardsConfig: {
    chance: true,
    awards: [
      { 'index': 0 },
      { 'index': 1 },
      { 'index': 2 },
      { 'index': 3 },
      { 'index': 4 },
      { 'index': 5 }
    ]
  },

  data: {
    awardsList: {},
    animationData: {},
    btnDisabled: '',
    unionid:'',
    score:0
  },
  onLoad:function(){
    var version = app.getVersion();
    this.setData({
      version: version
    })
    if (!app.globalData.openid) {
      app.getToken().then((resArg) => {  
        this.getMemberCardInfo();
      })
    } else {
      this.getMemberCardInfo();
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
          this.getSignData();
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
        this.getSignData();
      } else {
        wx.showToast({
          icon: 'none',
          title: data.msg
        })
      }
    }, data => { }, data => { })
  },
  // 获取会员卡状态
  getMemberCardInfo: function () {
    var openid = app.globalData.openid;
    var mainurl = app.globalData.mainurl;
    var url = this.data.version + 'api/memberCard/getMemberCardInfo'
    var params = {
      openid: openid
    }
    util.wxRequest(url, params, data => {
      console.log(data);
      if (data.code == 200) {
        this.setData({
          cardInfo: data.data
        })
      } else {

      }
      this.getUnionid();
    }, data => { }, data => { })
  },
  //获取转盘数据
  getSignData: function () {
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
    var params = {
      openid: app.globalData.openid
    }
    var url = this.data.version + 'api/task/luckDrawIndex';
    util.wxRequest(url, params, data => {
      console.log(data);
      if (data.code == 200) {
        this.setData({
          rewardData:data.data,
          reward: data.data.reward
        });
        var article = WxParse.wxParse('article', 'html', data.data.content, this, 5);
        if (this.data.cardInfo.score < this.data.rewardData.reward_score) {
          this.setData({
            btnDisabled: 'disabled'
          });
        }
        this.drawAwardRoundel();
      } else {
        wx.showToast({
          icon: 'none',
          title: data.msg
        })
      }
    }, data => { }, data => { })
  },
  onReady: function (e) {
    //分享
    wx.showShareMenu({
      withShareTicket: true
    });
  },
  //画抽奖圆盘
  drawAwardRoundel: function () {
    console.log(this.data.reward)
    var awards = this.awardsConfig.awards;
    var awardsList = [];
    var turnNum = 1 / awards.length;  // 文字旋转 turn 值
    // 奖项列表
    for (var i = 0; i < awards.length; i++) {
      awardsList.push({ turn: i * turnNum + 'turn', lineTurn: i * turnNum + turnNum / 2 + 'turn', award: this.data.reward[i]+'积分' });
    }
    this.setData({
      btnDisabled: this.awardsConfig.chance ? '' : 'disabled',
      awardsList: awardsList
    });
    if (this.data.rewardData.reward_type == 1) {
      this.setData({
        btnDisabled: 'disabled'
      });
    }
  },
  //发起抽奖
  playReward: function () {
    console.log(this.data.rewardData.reward_type);
    if (this.data.rewardData.reward_type == 1) {
      wx.showToast({
        icon:'none',
        title: '您今天已经参与过了'
      });
      return false;
    }
    //中奖index
    var awardIndex = Math.floor(Math.random() * (5 - 0)) + 0;
    var runNum = 5;//旋转8周
    var duration = 4000;//时长
    // 旋转角度
    this.runDeg = this.runDeg || 0;
    this.runDeg = this.runDeg + (360 - this.runDeg % 360) + (360 * runNum - awardIndex * (360 / 6))
    console.log(this.runDeg);
    //创建动画
    var animationRun = wx.createAnimation({
      duration: duration,
      timingFunction: 'ease'
    })
    animationRun.rotate(this.runDeg).step();
    this.setData({
      animationData: animationRun.export(),
      btnDisabled: 'disabled'
    });

    // 中奖提示
    var awardsConfig = this.awardsConfig;
    setTimeout(function () {
      this.setData({
        btnDisabled: '',
        score: this.data.reward[awardIndex]
      });
      this.getScore();
    }.bind(this), duration);
  },
  // 获取会员卡状态
  getScore: function () {
    var openid = app.globalData.openid;
    var mainurl = app.globalData.mainurl;
    var url = this.data.version + 'api/task/luckDrawPay'
    var params = {
      openid: openid,
      score: this.data.score
    }
    util.wxRequest(url, params, data => {
      console.log(data);
      if (data.code == 200) {
        if (this.data.score==0){
          wx.showModal({
            title: '很遗憾',
            content: '您没有抽中积分，加油！',
            showCancel: false
          });
          this.getMemberCardInfo();
          this.getSignData();
        }else{
          wx.showModal({
            title: '恭喜',
            content: '获得' + (this.data.score + '积分'),
            showCancel: false
          });
          this.getMemberCardInfo();
          this.getSignData();
        }  
      }else{
        wx.showToast({
          icon:'none',
          title: data.msg
        })
      }
    }, data => { }, data => { })
  },
  onShareAppMessage: function () {
    var that = this;
    return util.doShare("大转盘抽奖", "pages/zhuanpan/index", that);
  }
})