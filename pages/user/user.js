// pages/user/user.js
import {
  config
} from '../../config.js'
import {
  HTTP
} from '../../utils/http.js'
const request = new HTTP().request
var app = getApp()
const md5 = require('../../utils/md5.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    p_status: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //查询以往订单
    // request({
    //   url: '/api/trip/trip',
    //   method: 'POST',
    //   data: {
    //     user_id: app.globalData.userInfo.user_id,
    //     appkey: md5.hexMD5(getApp().globalData.appKey),
    //   }
    // }).then(res => {
    //   console.log(res,'以往记录')
    //   that.setData({
    //     list:res.data.data
    //   })
    // })


    that.login()
    that.setData({
      userInfo: app.globalData.userInfo,
      phone: app.globalData.userInfo.replace_mobile,
    })
    if (that.data.userInfo.mobile_phone == 0) {
      that.setData({
        p_status: true,
        phone: ''
      })
    } else {
      that.setData({
        p_status: false,
        phone: that.data.userInfo.replace_mobile
      })
    }


    var that = this
    // if (app.globalData.userInfo == null) {

    // } else {

    // }





  },
  login: function () {
    console.log(app.globalData)
    var that = this
    if (app.globalData.userInfo.mobile_phone == 0) {
      // 登录
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          if (res.code) {
            let code = res.code
            wx.getUserInfo({
              success: (res) => {
                console.log(res.userInfo)
                app.globalData.nickName = res.userInfo.nickName
                that.setData({
                  nickName: res.userInfo.nickName
                })
                // app.globalData.userInfo = res.userInfo
                let iv = res.iv
                let encryptedData = res.encryptedData
                // 获取用户信息
                // 发起网络请求
                request({
                  url: '/api/login/oauth',
                  method: 'POST',
                  data: {
                    code,
                    iv,
                    encryptedData
                  }
                }).then(res => {
                  console.log(res.data)
                  let appKey = res.data.data.open_id + config.APP_KEY

                  getApp().globalData.appKey = appKey
                  getApp().globalData.userInfo = res.data.data
                  that.setData({
                    userInfo: res.data.data
                  })
                  if (res.data.data.mobile_phone == 0) {
                    that.setData({
                      p_status: true,
                      phone: ''
                    })
                  } else {
                    that.setData({
                      p_status: false,
                      phone: res.data.data.replace_mobile
                    })
                  }
                })
              }
            });
          }
        }
      })
    } else {
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
        that.setData({
          userInfo: res.data.data,
        })
        if (res.data.data.mobile_phone == 0) {
          that.setData({
            p_status: true,
            phone: ''
          })
        } else {
          that.setData({
            p_status: false,
            phone: res.data.data.replace_mobile
          })
        }
      })
    }

  },
  getPhoneNumber: function (e) { //点击获取手机号码按钮

    var that = this;
    wx.checkSession({
      success: function () {
        console.log(e.detail.errMsg)
        console.log(e.detail.iv)
        console.log(e.detail.encryptedData)
        var ency = e.detail.encryptedData;
        var iv = e.detail.iv;
        var sessionk = that.data.userInfo.sessionKey;
        if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
          that.setData({
            modalstatus: true
          });
          that.setData({
            p_status: true
          })
        } else { //同意授权
          that.setData({
            p_status: false
          })
          console.log(that.data.userInfo.session_key)
          //获取手机号
          request({
            url: '/api/phone/mobile',
            method: 'POST',
            data: {
              user_id: getApp().globalData.userInfo.user_id,
              appkey: md5.hexMD5(getApp().globalData.appKey),
              encrypdata: ency,
              ivdata: iv,
              session_key: that.data.userInfo.session_key
            }
          }).then(res => {
            console.log(res)
            if (res.data.code == 200) {
              console.log('请求手机号')
              that.login()
            }
          })


        }
      },
      fail: function () {
        console.log("session_key 已经失效，需要重新执行登录流程");
        // that.wxlogin(); //重新登录/
      }
    });
  },
  //行程详细
  click: function (e) {
    console.log(e.currentTarget.dataset.id)
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/journey/journey?id=' + id,
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
    var that = this
    // wx.setNavigationBarColor({
    //   frontColor: '#ffffff', // 必写项
    //   backgroundColor: '#279b5f', // 传递的颜色值
    //   animation: { // 可选项
    //     duration: 0,
    //     timingFunc: 'easeIn'
    //   }

    // })
    //查询以往订单
    request({
      url: '/api/trip/trip',
      method: 'POST',
      data: {
        user_id: app.globalData.userInfo.user_id,
        appkey: md5.hexMD5(getApp().globalData.appKey),
      }
    }).then(res => {
      console.log(res, '以往记录')
      if (res.data.code == 200) {
        that.setData({
          list: res.data.data
        })
      } else {
        that.setData({
          list: []
        })
      }

    })
  },
  gogogo: function () {
    wx.switchTab({
      url: '/pages/home/home',
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