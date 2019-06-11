// pages/wallet/wallet.js
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
    status: 0,
    click_status: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this



    // wx.startPullDownRefresh()






    // 退押金中
    // wx.showModal({
    //   title: '',
    //   content: '退还押金后，您将失去在朱家林\r\n畅骑的权益，押金及余额会在1 - 5工作日内\r\n退还到您的微信账户，是否确认退还？',
    //   cancelText: '取消',
    //   confirmText: '确定',
    //   success: function (res) {
    //     if (res.confirm) {
    //       console.log('用户点击确定')
    //     } else if (res.cancel) {
    //       console.log('用户点击取消')
    //     }
    //   }
    // })
  },
  tuiClick: function() {
    var that = this
    wx.showModal({
      title: '提示',
      content: '退还押金后，您将失去在朱家林畅骑的权益，押金及余额会在1-5工作日内退还到您的微信账户，是否确认退还？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          request({
            url: '/api/refund/refund',
            method: 'POST',
            data: {
              user_id: app.globalData.userInfo.user_id,
              appkey: md5.hexMD5(getApp().globalData.appKey),
            }
          }).then(res => {
            console.log(res, '退款')
            if (res.data.code == 200) {
              wx.showToast({
                title: '退款成功',
                icon: 'none'
              })
              wx.setTabBarItem({
                index: 1,
                text: '退押金'
              })
              // that.setData({
              //   status: 0
              // })

              that.login()
            } else if (res.data.code == 401) {
              // 退押金
              wx.showModal({
                content: '您还有进行中的订单，请完成后再进行押金退还操作',
                cancelText: '取消',
                confirmText: '确定',
                success: function(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                    wx.switchTab({
                      url: '/pages/home/home',
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
              that.login()
            } else {
              console.log('111', res)
              wx.showToast({
                title: res.data.msg,
                icon: 'none'
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      },
      fail: function(res) {

      }
    })

  },
  pay: function() {
    var that = this
    if (that.data.click_status) {
      that.setData({
        click_status: false
      })
      request({
        url: '/api/wxpay/handle',
        method: 'POST',
        data: {
          user_id: app.globalData.userInfo.user_id,
          appkey: md5.hexMD5(getApp().globalData.appKey),
          type: '2'
        }
      }).then(res => {
        console.log(res)
        console.log(res.data.data, '支付参数')
        that.pay1(res.data.data, 2)
      })
    }


  },
  pay1: function(data, type) {
    var that = this
    console.log(data)
    wx.requestPayment({
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.package,
      signType: data.signType,
      paySign: data.paySign,
      success: function(result) {
        that.setData({
          click_status: true
        })
        console.log(data.order_id)
        console.log(result, '前台成功调起支付')
        that.login()

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
          wx.setTabBarItem({
            index: 1,
            text: '退押金'
          })
          console.log(res, '支付成功回调')
          if (res.data.code == 200) {
            that.setData({
              status: 1
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
        })
      },
      fail: function(res) {
        that.setData({
          click_status: true
        })
        console.log(res, '前台取消支付')
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
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    // wx.setNavigationBarColor({
    //   frontColor: '#ffffff', // 必写项
    //   backgroundColor: '#279b5f', // 传递的颜色值
    //   animation: { // 可选项
    //     duration: 0,
    //     timingFunc: 'easeIn'
    //   }

    // })
    // if (app.globalData.userInfo == null) {
    that.login()

    // } else {
    that.setData({
      userInfo: app.globalData.userInfo
    })
    if (app.globalData.userInfo.money == 0) {
      console.log('未交押金')
      that.setData({
        status: 0
      })
      wx.setTabBarItem({
        index: 1,
        text: '交押金'
      })
    } else {
      console.log('已交押金')
      that.setData({
        status: 1
      })
      wx.setTabBarItem({
        index: 1,
        text: '退押金'
      })
    }
    // }
  },
  login: function() {
    var that = this



    // 获取基础信息
    request({
      url: '/api/User/oauth',
      method: 'POST',
      data: {
        user_id: app.globalData.userInfo.user_id,
        appkey: md5.hexMD5(getApp().globalData.appKey),
      }
    }).then(res => {
      console.log(res, '获取基础信息')
      let appKey = res.data.data.open_id + config.APP_KEY
      getApp().globalData.appKey = appKey
      getApp().globalData.userInfo = res.data.data
      that.setData({
        userInfo: res.data.data
      })
      wx.hideLoading()
      // console.log(res.data.data.mobile_phone)
      if (app.globalData.userInfo.money == 0) {
        console.log('未交押金')
        that.setData({
          status: 0
        })
        wx.setTabBarItem({
          index: 1,
          text: '交押金'
        })
      } else {
        console.log('已交押金')
        that.setData({
          status: 1
        })
        wx.setTabBarItem({
          index: 1,
          text: '退押金'
        })
      }
    })

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})