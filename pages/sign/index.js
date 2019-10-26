// pages/sign/index.js
var app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    unionid:'',
    pid:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var pid = options.pid;
    var version = app.getVersion();
    this.setData({
      version: version
    })
    if (app.globalData.login == false) {
      app.userLogin().then((resArg) => {
        if(pid){
          this.setData({
            pid: pid
          })
          this.getBind();
        }
      })
    } else {
      if (pid) {
        this.setData({
          pid: pid
        })
        this.getBind();
      }
    }
  },
 
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //获取用户信息
  getUnionid:function(){
    var params = {
      openid: app.globalData.openid
    }
    var url = this.data.version + 'api/user/userQurey';
    util.wxRequest(url, params, data => {
      console.log(data);
      if(data.code==200){
        if (data.data.unionid != null && data.data.phone != null){
          this.setData({
            userData:data.data,
            unionid: data.data.unionid
          })
          this.getSignData();
          this.getLuckDrawData();
        }else{
          wx.navigateTo({
            url: '/pages/login/index'
          })
        }
      }
    }, data => { }, data => { })
  },
  getBind: function () {
    var params = {
      openid: app.globalData.openid,
      pid:this.data.pid
    }
    var url = this.data.version + 'api/task/getBind';
    util.wxRequest(url, params, data => {
    }, data => { }, data => { })
  },
  //获取积分数据
  getSignData:function(){
    var params = {
      openid: app.globalData.openid
    }
    var url = this.data.version + 'api/task/index';
    util.wxRequest(url, params, data => {
      console.log(data);
      if (data.code == 200) {
        this.setData({
          task:data.data
        });
      } else {
        wx.showToast({
          icon: 'none',
          title: data.msg
        })
      }
    }, data => { }, data => { })
  },
  //获取转盘数据
  getLuckDrawData: function () {
    var params = {
      openid: app.globalData.openid
    }
    var url = this.data.version + 'api/task/luckDrawIndex';
    util.wxRequest(url, params, data => {
      console.log(data);
      if (data.code == 200) {
        this.setData({
          rewardData: data.data,
          reward: data.data.reward
        });
      } else {
        wx.showToast({
          icon: 'none',
          title: data.msg
        })
      }
    }, data => { }, data => { })
  },
  //签到
  signUp:function(){
    var params = {
      openid: app.globalData.openid
    }
    var url = this.data.version + 'api/task/checkIn';
    util.wxRequest(url, params, data => {
      console.log(data);
      if(data.code==200){
        this.getSignData();
        wx.showToast({
          icon: 'none',
          title: data.msg + "+" + data.data.scores
        })
      }else{
        wx.showToast({
          icon:'none',
          title: data.msg
        })
      }
      
    }, data => { }, data => { })
  },
  getTask: function () {
    var params = {
      openid: app.globalData.openid
    }
    var url = this.data.version + 'api/task/acceptTask';
    util.wxRequest(url, params, data => {
      console.log(data);
      if (data.code == 200) {
        this.getSignData();
        wx.showToast({
          icon: 'none',
          title: data.msg
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: data.msg
        })
      }
    }, data => { }, data => { })
  },
  //完成浏览
  completeTask: function () {
    var params = {
      openid: app.globalData.openid
    }
    var url = this.data.version + 'api/task/completetTask';
    util.wxRequest(url, params, data => {
      console.log(data);
      if (data.code == 200) {
        this.getSignData();
        wx.showToast({
          icon: 'none',
          title: data.msg
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: data.msg
        })
      }
    }, data => { }, data => { })
  },
  //答题
  answerProblem:function(e){
    console.log(e);
    var id = e.currentTarget.dataset.aid;
    var params = {
      openid: app.globalData.openid,
      problem_id: this.data.task.problem.id,
      answer_id:id
    }
    var url = this.data.version + 'api/task/problemTask';
    util.wxRequest(url, params, data => {
      console.log(data);
      if (data.code == 200) {
        if (this.data.task.problem.right_key_id == id) {
          wx.showToast({
            icon: 'none',
            title: '恭喜你获得了' + data.data.scores+'积分！'
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '很遗憾，你答错了！'
          })
        }
        this.getSignData();
      } else {
        wx.showToast({
          icon: 'none',
          title: data.msg
        })
      }
    }, data => { }, data => { })
  },
  //查看抽奖
  awardView:function(){
    wx.navigateTo({
      url: '/pages/zhuanpan/index'
    })
  },
  //查看积分商城
  scoreShop: function () {
    wx.navigateTo({
      url: '/pages/score_shop/index'
    })
  },
  viewGoods:function(){
    wx.switchTab({
      url: '/pages/experience_index/experience_index'
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var version = app.getVersion();
    this.setData({
      version: version
    })
    if (app.globalData.login == false) {
      app.userLogin().then((resArg) => {
        this.getUnionid();
      })
    } else {
      this.getUnionid();
    }
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
    console.log(this.data.userData.id);
    return {
      title: '道农家任务中心',
      path: '/pages/sign/index?pid=' + this.data.userData.id,
      success: function (res) {
        // 转发成功
        console.log(res);
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  }
})