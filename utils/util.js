const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('-')
}

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const getDays = (strDateStart, strDateEnd) => {
  var strSeparator = "-"; //日期分隔符
  var oDate1;
  var oDate2;
  var iDays;
  oDate1 = strDateStart.split(strSeparator);
  oDate2 = strDateEnd.split(strSeparator);
  var strDateS = new Date(oDate1[0], oDate1[1] - 1, oDate1[2]);
  var strDateE = new Date(oDate2[0], oDate2[1] - 1, oDate2[2]);
  iDays = parseInt(Math.abs(strDateS - strDateE) / 1000 / 60 / 60 / 24)//把相差的毫秒数转换为天数 
  return iDays;
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const wxRequest = (url, params, successCallback, errorCallback, completeCallback) => {
  wx.request({
    url: url,
    data: params || {},
    header: { 'content-type': 'application/json' },
    method: 'POST',
    success: function (res) {
      if (res.statusCode == 200) {
        successCallback(res.data)
      } else {
        errorCallback(res)
      }
    },
    fail: function (res) {
      errorCallback(res)
    },
    complete: function (res) {
      completeCallback(res)
    }
  })
}
function checkUpdateVersion() {
  //创建 UpdateManager 实例
  const updateManager = wx.getUpdateManager();
  //检测版本更新
  updateManager.onCheckForUpdate(function (res) {
    // 请求完新版本信息的回调
    if (res.hasUpdate) {
      //监听小程序有版本更新事件
      updateManager.onUpdateReady(function () {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success(res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate();
            }
          }
        })
      })

      updateManager.onUpdateFailed(function () {
        // 新版本下载失败
        wx.showModal({
          title: '已经有新版本咯~',
          content: '请您删除当前小程序，到微信 “发现-小程序” 页，重新搜索打开呦~',
        })
      })
    }
  })
}
module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  getDays: getDays,
  wxRequest: wxRequest,
  checkUpdateVersion: checkUpdateVersion
}
