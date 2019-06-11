// pages/journey/journey.js
// pages/home/home.js
import {
  config
} from '../../config.js'
const md5 = require('../../utils/md5.js')
import {
  HTTP
} from '../../utils/http.js'
const request = new HTTP().request
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneNumber:'',
    content:null,
    id:'',
    click_status:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      id: options.id
    })
    // console.log(options, options.id)
    that.login(options.id)
 
  },
  login: function (id){
    var that = this
    request({
      url: '/api/Ltinerary/ltinerary',
      method: 'POST',
      data: {
        id: id,
        user_id: app.globalData.userInfo.user_id,
        appkey: md5.hexMD5(getApp().globalData.appKey),
      }
    }).then(res => {
      console.log(res, '行程中的订单')
      that.setData({
        content: res.data.data
      })
      if (res.data.data.ltinerary==0){
        wx.setNavigationBarTitle({
          title: '朱家林自行车'
        })
      }else{
        wx.setNavigationBarTitle({
          title: '朱家林电动车'
        })
      }

      
      //status 0 完成   1  正在骑行中    2 结束骑行未付款
    })
  },
  //客服电话
  cuserClick() {
    var that = this
    wx.showModal({
      title: '',
      content: '即将呼叫客服号码\r\n' + that.data.phoneNumber,
      confirmColor: '#000',
      cancelColor: '#000',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.makePhoneCall({
            phoneNumber: that.data.phoneNumber
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    // wx.showActionSheet({
    //   itemList: [that.data.phoneNumber],
    //   itemColor: "#4A90E2",
    //   success: function (res) {
    //     if (res.errMsg == 'showActionSheet:ok') {
    //       wx.makePhoneCall({
    //         phoneNumber: that.data.phoneNumber
    //       })
    //     }
    //   }
    // })
  },
  /**
 * 报修页面 
 */
  repairClick(e) {
    // console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/repair/repair?id=' + e.currentTarget.dataset.id
    })
  },
  // 关锁
  guanClick:function(){
    var that = this
    wx.showModal({
      title: '',
      content: '请务必确认您已经在电子围栏内进行了关锁操作并关锁成功，若您确认已关锁请点击我确认，反之点击取消',
      cancelText: "我再看看",//默认是“取消”
      cancelColor: '#000',//取消文字的颜色
      confirmText: "我确认",//默认是“确定”
      confirmColor: '#000',//确定文字的颜色
      success:function(res){
        if (res.confirm){
          console.log('点击确定')
          request({
            url: '/api/bicycle_abnormality/abnormality',
            method: 'POST',
            data: {
              id: that.data.content.id,
              user_id: app.globalData.userInfo.user_id,
              appkey: md5.hexMD5(getApp().globalData.appKey),
            }
          }).then(res => {
            console.log(res, '点击关锁')
            if(res.data.code==200){
              wx.showToast({
                title: '结束订单成功',
                icon:'none'
              })
              //重新获取页面数据
              console.log(that.data.content.id)
              that.login(that.data.content.id)
            } else if (res.data.code == 601){
              wx.showToast({
                title: '行程不存在',
                icon: 'none'
              })
            }
          })
        } else {
          console.log('点击取消')

        }
      }
    })
  },
  //订单支付
  btnPay: function () {
    var that = this
    if (that.data.click_status){
      that.setData({
        click_status:false
      })
      request({
        url: '/api/wxpay/handle',
        method: 'POST',
        data: {
          user_id: app.globalData.userInfo.user_id,
          appkey: md5.hexMD5(getApp().globalData.appKey),
          id:that.data,id,
          type: '1'
        }
      }).then(res => {
        console.log(res)
        console.log(res.data.data, '支付参数')
        that.pay1(res.data.data, 1)
      })
    }

  },
  pay1: function (data, type) {
    var that = this
    console.log(data)
    wx.requestPayment({
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.package,
      signType: data.signType,
      paySign: data.paySign,
      success: function (result) {
        that.setData({
          click_status: true
        })
        console.log(result, '调起支付')
        //支付成功的调取
        request({
          url: '/api/wxpay/wxsuccessnotify',
          method: 'POST',
          data: {
            user_id: app.globalData.userInfo.user_id,
            appkey: md5.hexMD5(getApp().globalData.appKey),
            type: type,
            order_id: data.order_id
          }
        }).then(res => {

          console.log(res, '支付成功回调')
          if (res.data.code == 200) {
            that.login(that.data.content.id)
            that.setData({
              yj_status: false
            })
          } else {
            wx.showToast({
              title: that.data.msg,
              icon: 'none'
            })
          }
        })
      },
      fail: function (res) {
        that.setData({
          click_status: true
        })
        console.log(res, '取消支付')
        request({
          url: '/api/wxpay/wxerrornotify',
          method: 'POST',
          data: {
            user_id: app.globalData.userInfo.user_id,
            appkey: md5.hexMD5(getApp().globalData.appKey),
            type: type
          }
        }).then(res => {
          console.log(res, '支付失败回调')
        })
      }
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
    console.log('1',this.data.id)
    var that = this
    request({
      url: '/api/Ltinerary/ltinerary',
      method: 'POST',
      data: {
        id: that.data.id,
        user_id: app.globalData.userInfo.user_id,
        appkey: md5.hexMD5(getApp().globalData.appKey),
      }
    }).then(res => {
      console.log(res, '行程中的订单')
      that.setData({
        content: res.data.data
      })
      //status 0 完成   1  正在骑行中    2 结束骑行未付款
    })

    //获取客服手机号
    request({
      url: '/api/mobile/mobile',
      method: 'POST',
      data: {
        user_id: app.globalData.userInfo.user_id,
        appkey: md5.hexMD5(getApp().globalData.appKey),
      }
    }).then(res => {
      console.log(res, '客服电话')
      that.setData({
        phoneNumber: res.data.data
      })
    })
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