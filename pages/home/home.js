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
    // 维度
    latitude: getApp().globalData.latitude,
    // 经度
    longitude: getApp().globalData.longitude,
    // 客服电话
    phoneNumber: '',
    // 地图标记点
    // markers: [{
    //     iconPath: '/images/home/gongxiangdanche@3x.png',
    //     id: 0,
    //     latitude: 40.0406680000,
    //     longitude: 116.3080290000,
    //     width: 25,
    //     height: 30
    //   },
    //   {
    //     iconPath: '/images/home/gongxiangdanche@3x.png',
    //     id: 1,
    //     latitude: 23.09,
    //     longitude: 113.324521,
    //     width: 25,
    //     height: 30
    //   },
    //   {
    //     iconPath: '/images/home/gongxiangdanche@3x.png',
    //     id: 2,
    //     latitude: 23.096,
    //     longitude: 113.33,
    //     width: 25,
    //     height: 30
    //   }
    // ],
    markers: [],
    userAgr: false, // 是否同意协议
    mu_status: false, //协议判断
    yj_status: false, //充值押金弹层
    btn_text: '扫码开锁', //开锁按钮btn文案
    bth_status: false, //判断开锁成功后底部按钮的变化
    qx_lunxun: null,
    tabStatus: false, //车辆切换
    click_status: true,
    hailiangStatus:true
  },

  xieyi: function() {
    wx.navigateTo({
      url: '/pages/xieyi/xieyi',
    })
  },
  // 同意协议
  useragrClick(e) {
    var that = this
    console.log(e.target.dataset.index, )
    if (e.target.dataset.index == 1) {
      // 同意协议
      // 发送请求,成功后修改全局userAgrBool状态并返回
      app.globalData.userAgrBool = true
      this.setData({
        mu_status: false
      })
      request({
        url: '/api/agree/agree',
        method: 'POST',
        data: {
          user_id: app.globalData.userInfo.user_id,
          appkey: md5.hexMD5(getApp().globalData.appKey)
        }
      }).then(res => {
        console.log(res, '同意返回')
        //同意协议后重新获取数据
        that.login()
      })

    }
    if (e.target.dataset.index == 2) {
      this.setData({
        mu_status: false
      })
    }

  },
  /**
   * 视野发生变化时触发
   */
  regionchange(e) {
    var that = this
    console.log(e.type)
  },

  /**
   * 点击标记点时触发，会返回marker的id
   */
  markertap(e) {
    console.log(e.markerId)
  },


  /**
   * 客服事件触发-拨打电话
   */
  cuserClick() {
    var that = this
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
      var phone1 = res.data.data
      wx.showModal({
        title: '',
        content: '即将呼叫客服号码\r\n' + res.data.data,
        confirmColor: '#000',
        cancelColor: '#000',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.makePhoneCall({
              phoneNumber: phone1
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      // wx.showActionSheet({
      //   itemList: [res.data.data],
      //   itemColor: "#4A90E2",
      //   success: function(res) {
      //     if (res.errMsg == 'showActionSheet:ok') {

      //     }
      //   }
      // })
    })

  },
  //车型切换
  tabClick: function(e) {
    var that = this
    // console.log(e.currentTarget.dataset.status)
    var status = e.currentTarget.dataset.status
    //当车型切换的时候该做的
    //1.改变title，btn，还车描述
    //2.判断当前是否有订单

    //0为自行车，1为电动车  有任何一项都提示有订单
    if (that.data.qx_lunxun.ltinerary == 0 || that.data.qx_lunxun.ltinerary == 1) {
      console.log(that.data.qx_lunxun.ltinerary, '当前有订单')
      var text = that.data.qx_lunxun.ltinerary == 0 ? '自行车' : '电动车'
      wx.showToast({
        title: '有进行中的' + text + '订单',
        icon: 'none',
        duration: 2000
      })
    } else {
      console.log('当前无订单可以骑行')
      if (status == 0) {
        //自行车
        that.setData({
          tabStatus: false
        })
        wx.setNavigationBarColor({
          frontColor: '#ffffff', // 必写项
          backgroundColor: '#279b5f', // 传递的颜色值
          animation: { // 可选项
            duration: 0,
            timingFunc: 'easeIn'
          }

        })
        that.bicycle(app.globalData.userInfo)
      } else {
        //电动车
        that.setData({
          tabStatus: true
        })
        //改变颜色
        wx.setNavigationBarColor({
          frontColor: '#ffffff', // 必写项
          backgroundColor: '#00a0e9', // 传递的颜色值
          animation: { // 可选项
            duration: 0,
            timingFunc: 'easeIn'
          }

        })
        that.bicycle(app.globalData.userInfo)
      }
    }

    // if (that.data.qx_lunxun.ltinerary == 0 || that.data.qx_lunxun.ltinerary == 1){
    //   var text = that.data.qx_lunxun.ltinerary==0?'自行车':'电动车'
    //   wx.showToast({
    //     title: '有进行中的'+text+'订单',
    //     icon:'none',
    //     duration: 2000
    //   })
    // }else{
    //   if (status == 1) {
    //     that.setData({
    //       tabStatus: true
    //     })

    //     wx.setNavigationBarColor({
    //       frontColor: '#ffffff', // 必写项
    //       backgroundColor: '#279b5f', // 传递的颜色值
    //       animation: { // 可选项
    //         duration: 400,
    //         timingFunc: 'easeIn'
    //       }

    //     })

    //     that.bicycle(app.globalData.userInfo)
    //   } else {

    //     that.setData({
    //       tabStatus: false
    //     })

    //     wx.setNavigationBarColor({
    //       frontColor: '#ffffff', // 必写项
    //       backgroundColor: '#00a0e9', // 传递的颜色值
    //       animation: { // 可选项
    //         duration: 400,
    //         timingFunc: 'easeIn'
    //       }

    //     })
    //     that.bicycle(app.globalData.userInfo)
    //   }
    // }

  },
  /** 
   * 将地图中心移动到当前定位点
   */
  moveToLocation() {
    var that = this
    if (that.data.latitude == '' && that.data.longitude == '') {
      //未授权位置信息是打开微信设置
      wx.openSetting({
        success: function(res) {
          // res.authSetting = {
          //   "scope.userInfo": true,
          //   "scope.userLocation": true
          // }
          // console.log(res.authSetting['scope.userLocation'])
          if (res.authSetting['scope.userLocation'] == true) {
            wx.showToast({
              title: '',
              icon: 'loading',
              duration: 100,
              success: function() {
                that.mapCtx.moveToLocation()
              }
            })
          }
        }
      })
    } else {
      wx.showToast({
        title: '',
        icon: 'loading',
        duration: 100,
        success: function() {
          that.mapCtx.moveToLocation()
        }
      })
    }

  },


  /**
   * 还车温馨指南
   */
  guideClick() {
    wx.navigateTo({
      url: '/pages/guide/guide'
    })
  },

  /**
   * 消息中心
   */
  newsClick() {
    wx.navigateTo({
      url: '/pages/news/news'
    })
  },

  /**
   * 报修页面 
   */
  repairClick() {
    wx.navigateTo({
      url: '/pages/repair/repair'
    })
  },
  // 常见问题
  issue: function() {
    wx.navigateTo({
      url: '/pages/issue/issue',
    })
  },
  /**
   * 开锁事件
   */
  unlockingClick() {
    var that = this
    console.log(getApp().globalData.userInfo.protocol)
    // 是否同意协议
    if (app.globalData.userInfo.protocol == '0') {
      // wx.navigateTo({
      //   url: '/pages/uagr/uagr'
      // })
      this.setData({
        mu_status: true
      })
      return
    } else {
      // if (app.globalData.userInfo.money == '0') {
      //   that.setData({
      //     yj_status: true
      //   })
      // } else {
      //判断位置是否授权
      //扫码开锁
      that.position_showModal()

    }


  },
  //弹框提醒开锁
  position_showModal: function() {
    var that = this

    // 资费提示
    var text = ''
    if (that.data.tabStatus) {
      text = '电单车30元/30分钟,\r\n不满30分钟按30分钟计算,\r\n切勿将车辆骑出朱家林园区\r\n\r\n结束后将车停在安全位置\r\n手动按下车锁，完成锁车'

    } else {
      text = '亲子车10元/30分钟,\r\n多人车20元/30分钟,\r\n不满30分钟按30分钟计算\r\n切勿将车辆骑出朱家林园区\r\n\r\n结束后将单车骑入电子围栏听到“请锁车”提示音后\r\n手动按下车锁，完成锁车'
    }
    wx.showModal({
      title: '资费及还车提示',
      content: text,
      showCancel: false,
      confirmText: '知道了',
      success(res) {
        if (res.confirm) {


          // 是否缴纳押金

          // 资费提示弹框

          // 拉取扫码
          wx.scanCode({
            success: (res) => {
              console.log(res)
              console.log(res.result.split('=')[1])
              var lock_id = res.result.split('=')[1]
              console.log(res.errMsg)

              if (res.errMsg == 'scanCode:ok') {
                //获取车辆开锁
                request({
                  url: '/api/unlock/unlock',
                  method: 'POST',
                  data: {
                    user_id: app.globalData.userInfo.user_id,
                    lock_id: lock_id,
                    appkey: md5.hexMD5(getApp().globalData.appKey),
                    type: that.data.tabStatus ? 1 : 0
                  }
                }).then(res => {
                 
                  console.log(res.data, '下达指令开锁')
                  wx.showLoading({
                    title: '正在请求',
                    mask: true
                  })
                  if (res.data.code) {
                    wx.hideLoading()
                  }
                  if (res.data.code == 200) {
                    var a = 0
                    clearInterval(timer)
                    //轮询
                    var timer = setInterval(function() {
                      //确认是否正常开锁
                      request({
                        url: '/api/unlocking/unlocking',
                        method: 'POST',
                        data: {
                          user_id: app.globalData.userInfo.user_id,
                          lock_id: lock_id,
                          appkey: md5.hexMD5(getApp().globalData.appKey)
                        }
                      }).then(res => {

                        console.log(res, '判断是否开锁成功')
                        //开锁成功
                        if (res.data.code == 200) {
                          clearInterval(timer)
                          wx.hideLoading()
                          that.setData({
                            bth_status: true
                          })

                          that.qx_lunxun(app.globalData.userInfo)
                        }
                      })
                      a++
                      // console.log(a)
                      if (a == 30) {
                        wx.hideLoading()
                        wx.showToast({
                          title: '开锁失败，请重新扫码',
                          icon: 'none',
                          duration: 2000
                        })
                        that.setData({
                          btn_text: '扫码开锁'
                        })

                        clearInterval(timer)
                      } else {
                        console.log('开锁不成功调用轮询')
                        wx.showLoading({
                          title: '开锁中，请稍等',
                          mask: true,
                          success: function(res) {
                            // console.log(res)

                          }
                        })
                        that.setData({
                          btn_text: '开锁中'
                        })
                      }
                    }, 1000)

                  } else if (res.data.code == 201) {
                    wx.showToast({
                      title: res.data.msg,
                      icon: 'none',
                      mask: true,
                      duration: 2000
                    })

                  } else if (res.data.code == 202) {

                    that.setData({
                      yj_status: true
                    })
                  } else {
                    wx.showToast({
                      title: res.data.msg,
                      icon: 'none',
                      mask: true,
                      duration: 2000
                    })
                  }
                })
              } else {
                // if (that.data.qx_lunxun.ltinerary == 0){

                // }else if(that.data.qx_lunxun.ltinerary == 1){

                // }else{

                // }

              }
            }
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this

    wx.showLoading({
      title: '加载中',
    })
    // 获取定位
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        var latitude = res.latitude
        var longitude = res.longitude
        console.log(latitude, longitude)
        that.setData({
          latitude: latitude,
          longitude: longitude,
        })
      }
    })
    // 登录
    that.login()


  },
  login: function() {
    var that = this


    // // 获取基础信息
    // request({
    //   url: '/api/User/oauth',
    //   method: 'POST',
    //   data: {
    //     user_id: app.globalData.userInfo.user_id,
    //     appkey: md5.hexMD5(getApp().globalData.appKey),
    //   }
    // }).then(res => {
    //   console.log(res, '获取基础信息')

    //   wx.hideLoading()
    //   let appKey = res.data.data.open_id + config.APP_KEY
    //   getApp().globalData.appKey = appKey
    //   getApp().globalData.userInfo = res.data.data
    //   that.bicycle(res.data.data)
    //   // //打开小程序判断是否有正在进行中的订单
    //   console.log('调用轮询')
    //   that.qx_lunxun(res.data.data)
    //   //判断押金状态
    //   if (res.data.data.money == 0) {
    //     console.log('未交押金')
    //     that.setData({
    //       status: 0
    //     })
    //     wx.setTabBarItem({
    //       index: 1,
    //       text: '交押金'
    //     })
    //   } else {
    //     console.log('已交押金')
    //     that.setData({
    //       status: 1
    //     })
    //     wx.setTabBarItem({
    //       index: 1,
    //       text: '退押金'
    //     })
    //   }

    // })
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
                that.bicycle(res.data.data)
                // //打开小程序判断是否有正在进行中的订单
                console.log('调用轮询')
                that.qx_lunxun(res.data.data)
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
  // 获取车辆位置信息
  bicycle: function(data) {
    var that = this
    //获取车辆位置
    request({
      url: '/api/position/bicycle',
      method: 'POST',
      data: {
        user_id: data.user_id,
        appkey: md5.hexMD5(getApp().globalData.appKey),
        type: that.data.tabStatus ? 1 : 0
      }
    }).then(res => {
      console.log(res.data, '车辆位置信息')
      that.setData({
        markers: res.data.data
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    //创建 map 上下文 MapContext 对象
    this.mapCtx = wx.createMapContext('map')
  },
  hc_click: function() {

  },
  //进行中订单查询
  qx_lunxun: function(data) {
    var that = this

    var a = 0
    clearInterval(timer)
    //轮询
    var timer = setInterval(function() {
      a++
      //骑行中轮询
      request({
        url: '/api/order/order',
        method: 'POST',
        data: {
          user_id: data.user_id,
          appkey: md5.hexMD5(getApp().globalData.appKey),
        }
      }).then(res => {

        wx.hideLoading()
        console.log(res.data, '骑行中轮询')
        if (res.data.code == 207) {
          clearInterval(timer)
          that.setData({
            bth_status: false,
            // tabStatus: false
          })

        } else {
          that.setData({
            bth_status: true,
            btn_text: '扫码开锁'
          })
          //有自行车订单
          if (res.data.data.ltinerary == 0) {
            //未结束订单为自行车  
            that.setData({
              tabStatus: false
            })
            wx.setNavigationBarColor({
              frontColor: '#ffffff', // 必写项
              backgroundColor: '#279B5F', // 传递的颜色值
              animation: { // 可选项
                duration: 0,
                timingFunc: 'easeIn'
              }

            })
          } else {
            // 有电动车订单
            that.setData({
              tabStatus: true
            })
            wx.setNavigationBarColor({
              frontColor: '#ffffff', // 必写项
              backgroundColor: '#00a0e9', // 传递的颜色值
              animation: { // 可选项
                duration: 0,
                timingFunc: 'easeIn'
              }

            })
          }
        }
        that.setData({
          qx_lunxun: res.data.data
        })


        if (res.data.data.type == 1) {
          clearInterval(timer)
        }
      })

    }, 1000)

  },
  //查看当前进行订单
  qx_xingcheng: function(e) {
    console.log(e.currentTarget.dataset.id)
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/journey/journey?id=' + id,
    })
  },

  //押金支付
  pay: function() {
    var that = this

    if (that.data.click_status) {
      that.setData({
        click_status: false
      })
      console.log('点击一次')
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
          click_status: true,
          hailiangStatus:false
        })
        console.log(result, '前台回调调起支付')
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
            that.setData({
              tabStatus: false,
            })

            console.log('支付')
            // if (that.data.tabStatus) {
            // console.log('蓝色')
            // wx.setNavigationBarColor({
            //   frontColor: '#ffffff', // 必写项
            //   backgroundColor: '#00a0e9', // 传递的颜色值
            //   animation: { // 可选项
            //     duration: 0,
            //     timingFunc: 'easeIn'
            //   }
            // })
            // } else {
            console.log('绿色')
            wx.setNavigationBarColor({
              frontColor: '#ffffff', // 必写项
              backgroundColor: '#279B5F', // 传递的颜色值
              animation: { // 可选项
                duration: 0,
                timingFunc: 'easeIn'
              }
            })
            // }
            that.login()
            that.setData({
              yj_status: false
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
  //不支付押金
  noPay: function() {
    this.setData({
      yj_status: false
    })
  },
  //还车点
  carPointClick: function() {
    wx.navigateTo({
      url: '/pages/carPoint/carPoint',
    })
  },
  //订单支付
  btnPay: function() {
    var that = this

    if (that.data.click_status) {
      that.setData({
        click_status: false
      })
      console.log('支付点击次数')
      request({
        url: '/api/wxpay/handle',
        method: 'POST',
        data: {
          user_id: app.globalData.userInfo.user_id,
          appkey: md5.hexMD5(getApp().globalData.appKey),
          id: that.data.qx_lunxun.id,
          type: '1'
        }
      }).then(res => {
        console.log(res)
        console.log(res.data.data, '支付参数')
        that.pay1(res.data.data, 1)
      })

    }

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    console.log('调用login')
    wx.login()
    if (that.data.tabStatus) {
      wx.setNavigationBarColor({
        frontColor: '#ffffff', // 必写项
        backgroundColor: '#00a0e9', // 传递的颜色值
        animation: { // 可选项
          duration: 0,
          timingFunc: 'easeIn'
        }
      })
    } else {
      wx.setNavigationBarColor({
        frontColor: '#ffffff', // 必写项
        backgroundColor: '#279B5F', // 传递的颜色值
        animation: { // 可选项
          duration: 10,
          timingFunc: 'easeIn'
        }
      })
    }
    if (app.globalData.userInfo) {
      that.bicycle(app.globalData.userInfo)
      // //打开小程序判断是否有正在进行中的订单
      console.log('调用轮询')
      that.qx_lunxun(app.globalData.userInfo)
    }


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