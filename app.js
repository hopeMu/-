//app.js
var utils = require('./utils/util')
import {
  config
} from './config.js'
const md5 = require('./utils/md5.js')
import {
  HTTP
} from './utils/http.js'
const request = new HTTP().request
App({
  globalData: {
    userInfo: null, // 用户信息
    user_id: null, // 用户唯一标识符
    userAgrBool: false, // 同意协议弹框控制
    latitude: '', // 经度
    longitude: '', // 纬度
    appKey: '',
    number: null //微信扫一扫接收的参数
  },
  onLaunch: function(options) {
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

                let appKey = res.data.data.open_id + config.APP_KEY
                that.globalData.appKey = appKey
                that.globalData.userInfo = res.data.data


              })


            }
          });
        }
      }
    })
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    console.log("全局onLaunch options==" + JSON.stringify(options))
    let q = decodeURIComponent(options.query.q)
    if (q) {
      console.log("全局onLaunch onload url=" + q, '1111111')
      console.log("全局onLaunch onload 参数 flag=" + utils.getQueryString(q, 'flag'), '-------', q.split('number=') + '111')
    }

  }
})