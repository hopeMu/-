// pages/login/login.js
import {
  config
} from '../../config.js'
import {
  HTTP
} from '../../utils/http.js'
const request = new HTTP().request
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // btn loading 
    loading: false,
    //判断小程序的API，回调，参数，组件等是否在当前版本可用
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          console.log('用户已授权')
          // that.queryUsreInfo();
          wx.switchTab({
            url: '/pages/home/home',
          })
        } else {
          console.log('用户未授权')
          // wx.navigateTo({
          //   url: '/pages/login/login',
          // })
        }
      }
    })
  },
  bindGetUserInfo: function (e) {
    var that = this;
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      that.queryUsreInfo();
      //授权成功后，跳转进入小程序首页

    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  },
  //获取用户信息接口
  queryUsreInfo: function () {
    this.setData({
      loading: true
    })
    let that = this
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          let code = res.code
          wx.getUserInfo({
            success: (res) => {
              console.log(res.userInfo)
              // app.globalData.userInfo = res.userInfo
              let iv = res.iv
              let encryptedData = res.encryptedData
              // 获取用户信息
              // 发起网络请求

              request({
                url: '/api/login/oauth',
                method: 'POST',
                data: {
                  code: code,
                  iv: iv,
                  encryptedData: encryptedData
                }
              }).then(res => {
                console.log(res.data)
                that.setData({
                  loading: false,
                })

                that.url()
                let appKey = res.data.data.open_id + config.APP_KEY
                getApp().globalData.appKey = appKey
                getApp().globalData.userInfo = res.data.data

                // getApp().globalData.user_id = res.data.data.user_id

                //判断押金状态
                if (res.data.data.money == 0) {
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


            }
          });
        }
      }
    })
  },
  url: function () {
    wx.switchTab({
      url: '/pages/home/home',
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