// pages/news/news.js
import { config } from '../../config.js'
const md5 = require('../../utils/md5.js')
import { HTTP } from '../../utils/http.js'
const request = new HTTP().request
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    request({
      url: '/api/msg/msg',
      method: 'POST',
      data: {
        user_id: app.globalData.userInfo.user_id,
        appkey: md5.hexMD5(getApp().globalData.appKey)
      }
    }).then(res => {
      console.log(res,'消息中心')
      if(res.data.code==207){
        that.setData({
          list:[]
        })
      }else{
        that.setData({
          list: res.data.data
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