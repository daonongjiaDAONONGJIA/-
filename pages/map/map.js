// 引入SDK核心类
var QQMapWX = require('../../qqmap/qqmap-wx-jssdk.min.js');
// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: 'KXGBZ-GQY6J-6D5F7-FZFYL-V33R7-ETFGS' // 必填
});
Page({
  data: {
    markers: [{
      iconPath: '../../images/favorites.png',
      id: 0,
      latitude: '',
      longitude: '',
      width: 50,
      height: 50
    }],
    address:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    this.formSubmit(options.address)
  },
  formSubmit(address) {
    var _this = this;
    //调用地址解析接口
    qqmapsdk.geocoder({
      //获取表单传入地址
      address: address, //地址参数，例：固定地址，address: '北京市海淀区彩和坊路海淀西大街74号'
      success: function (res) {//成功后的回调
        console.log(res);
        var res = res.result;
        var latitude = res.location.lat;
        var longitude = res.location.lng;
        //根据地址解析在地图上标记解析地址位置
        _this.setData({ // 获取返回结果，放到markers及poi中，并在地图展示
          address:address,
          markers: [{
            id: 0,
            title: res.title,
            latitude: latitude,
            longitude: longitude,
            iconPath: '../../images/address.png',//图标路径
            width: 40,
            height: 40,
            callout: {
              content: "导航去这里\n"+address,
              fontSize: 14,
              color: '#000',
              bgColor: '#fff',
              padding: 8,
              borderRadius: 4,
              boxShadow: '4px 8px 16px 0 rgba(0)',
              display:'ALWAYS'
            }
          }],
          poi: { //根据自己data数据设置相应的地图中心坐标变量名称
            latitude: latitude,
            longitude: longitude
          }
        });
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        console.log(res);
      }
    })
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  },
  callouttap(e){
    var that = this;
    wx.getLocation({//获取当前经纬度
      type: 'wgs84', //返回可以用于wx.openLocation的经纬度，官方提示bug: iOS 6.3.30 type 参数不生效，只会返回 wgs84 类型的坐标信息  
      success: function (res) {
        console.log(res)
        wx.openLocation({//​使用微信内置地图查看位置。
          latitude: that.data.markers[0].latitude,//要去的纬度-地址
          longitude: that.data.markers[0].longitude,//要去的经度-地址
          name: that.data.address,
          address: that.data.address
        })
      }
    })
  }
})