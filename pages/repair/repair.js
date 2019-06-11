// pages/repair/repair.js
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
    // 图片数组
    imagePaths: [],
    imagePaths1: [],
    // 视频数组
    videoPaths: [], 
    // url: 'https://api.izhujialin.com/',//正式
    url: 'https://api.sdzhujialin.com/',  //测试
    inputValue: '',
    baoxouValue: '',
    imgArr: [],
    videoArr: [],
    valueLength: 0,
    nub:''    //上传视频必传参数
  },



  /**
   * 图片视频上传按钮
   */
  uploadClick() {
    let that = this
    wx.showActionSheet({
      itemList: ['上传图片', '上传视频'],
      success(res) {
        console.log(res.tapIndex)
        if (res.tapIndex === 0) {
          that.uploadImage()
        }
        if (res.tapIndex === 1) {
          that.uploadVideo()
        }
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },

  /**
   * 图片上传
   */
  uploadImage() {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        console.log(res)
        // tempFilePath可以作为img标签的src属性显示图片
        let imagePaths = this.data.imagePaths
        let videoPaths = this.data.videoPaths
        if (that.data.imgArr.length + that.data.videoArr.length> 9) {
          // 超过限制
          wx.showToast({
            title: '上传数量超过最大限制',
            icon: 'none',
            duration: 2000
          })
          return
        }
        imagePaths.push(...res.tempFilePaths)
        console.log(res.tempFilePaths)
        this.setData({
          imagePaths: res.tempFilePaths,
          imagePaths1: imagePaths
        })


        wx.showModal({
          title: '图片',
          content: '确认上传此图片',
          success: function (res) {
            wx.showLoading({
              title: '图片上传中',
              mask: true
            })
            if (res.confirm) {
              console.log(app.globalData.userInfo.user_id)
              // for (var i = 0, h = that.data.imagePaths.length; i < h; i++) {
              wx.uploadFile({
                url: that.data.url + 'api/repair/upload', //接口
                filePath: that.data.imagePaths[0],
                name: 'img',
                formData: {
                  'user': 'test',
                  'user_id': app.globalData.userInfo.user_id,
                  'appkey': md5.hexMD5(getApp().globalData.appKey),
                  'lock_id': that.data.inputValue,
                  'nub': that.data.nub
                },
                success: function (res) {
                  console.log(res)
                  wx.hideLoading()
                  var data = JSON.parse(res.data) 
                  if (data.code==200){
                    console.log(JSON.parse(res.data))
                    
                    var arr = that.data.imgArr
                    arr.push(data.data)
                    console.log(arr)
                    that.setData({
                      imgArr: arr,
                      nub:data.data.nub
                    })
                  // console.log(res.data.replace(/[\\]/g, ""), '图片上传')
                  // var json = res.data.replace(/[\\]/g, "")

                  // var str = json.replace(/["]/g, "")
                  // // img   
                  // console.log(str.split(',')[0].slice(6))
                  // //id
                  // console.log(str.split(',')[1].slice(3).split('}')[0])

                  // var obj = {}; //或者 var obj=new Object();
                  // var key = "img";
                  // var value = str.split(',')[0].slice(6)
                  // var key1 = "id";
                  // var value1 = str.split(',')[0].slice(6)
                  // obj[key] = value;
                  // obj[key1] = str.split(',')[1].slice(3).split('}')[0];

                  // var arr = that.data.imgArr
                  // arr.push(obj)
                  // console.log(obj,arr)
                  // that.setData({
                  //   imgArr: arr
                  // })

                  }else{
                    wx.showToast({
                      title: '上传失败',
                      icon: 'none',
                      duration: 2000
                    })
                  }

                },
                fail: function (error) {
                  console.log(error);
                }
              })
              // }


            } else {
              console.log('弹框后点取消', '222')
                wx.hideLoading()
            }
          }
        })


      }
    })
  },

  /**
   * 视频上传
   */
  uploadVideo() {
    var that = this
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: res => {
        // console.log(res.tempFilePath)
        let videoPaths = that.data.videoPaths
        let imagePaths = that.data.imagePaths
        if (that.data.imgArr.length + that.data.videoArr.length + 1 > 9) {
          // 超过限制
          wx.showToast({
            title: '上传数量超过最大限制',
            icon: 'none',
            duration: 2000
          })
          return
        }
        var arr = []
        arr.push(res.tempFilePath)
        console.log(res, arr)
        // videoPaths.push(res.tempFilePath)
        that.setData({
          videoPaths: arr
        })




        wx.showModal({
          title: '视频',
          content: '确认上传此视频',
          success: function (res) {
            if (res.confirm) {
              wx.showLoading({
                title: '视频上传中',
                mask:true
              })
              console.log(app.globalData.userInfo.user_id)
              // for (var i = 0, h = that.data.videoPaths.length; i < h; i++) {
              wx.uploadFile({
                url: that.data.url + 'api/repair/upload', //接口
                filePath: that.data.videoPaths[0],
                name: 'video',
                formData: {
                  'user': 'test',
                  'user_id': app.globalData.userInfo.user_id,
                  'appkey': md5.hexMD5(getApp().globalData.appKey),
                  'lock_id': that.data.inputValue,
                  'nub': that.data.nub
                },
                success: function (res) {
                  wx.hideLoading()
                  // console.log(res.data)
                  console.log(JSON.parse(res.data))
                  var data = JSON.parse(res.data)
                  if(data.code==200){
                    var arr = that.data.videoArr
                    arr.push(data.data)
                    console.log(arr)
                    that.setData({
                      videoArr: arr,
                      nub: data.data.nub
                    })
                  }else{
                    wx.showToast({
                      title: '上传失败',
                      icon: 'none',
                      duration: 2000
                    })
                  }
                 

                  // var json = res.data.replace(/[\\]/g, "")
                  // var str = json.replace(/["]/g, "")
                  // // video
                  // console.log(str.split(','))
                  // console.log(str.split(',')[2].slice(12))
                  // //id
                  // console.log(str.split(',')[3].slice(3).split('}')[0])

                  // var obj = {}; //或者 var obj=new Object();
                  // var key = "img";
                  // var value = str.split(',')[2].slice(12)
                  // var key1 = "id";
                  // var value1 = str.split(',')[3].slice(3).split('}')[0]
                  // obj[key] = value;
                  // obj[key1] = value1
                  // var arr = that.data.videoArr
                  // arr.push(obj)
                  // // console.log(obj)
                  // that.setData({
                  //   videoArr: arr
                  // })

                },
                fail: function (error) {
                  console.log(error);
                }
              })
              // }


            } else {
              console.log('弹框后点取消', '222')
              wx.hideLoading()

            }
          }
        })
      }
    })
  },

  /**
   * 图片预览
   */
  preImages(e) {
    let imagePaths = this.data.imagePaths1
    wx.previewImage({
      current: imagePaths[e.currentTarget.dataset.index], // 当前显示图片的http链接
      urls: imagePaths // 需要预览的图片http链接列表
    })
  },

  /**
   * 视频预览
   */
  // preVideo(e) {
  //   this.VideoContext.stop()
  //   let videoPaths = this.data.videoPaths
  //   console.log(e, e.currentTarget.dataset.index)
  //   console.log(videoPaths)
  //   wx.previewImage({
  //     current: videoPaths[e.currentTarget.dataset.index],
  //     urls: videoPaths
  //   })
  //   this.VideoContext.play()
  // },

  // 车辆编号
  getinput: function (e) {
    console.log(e.detail.value)
    this.setData({
      inputValue: e.detail.value
    })
  },
  //报修描述
  bindTextAreaBlur(e) {
    console.log(e.detail.value)

    this.setData({
      valueLength: e.detail.value.length
    })
    //最多字数限制
    if (e.detail.value.length == 100) {// 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
      wx.showToast({
        title: '只能输入100字',
        icon: 'none'
      })

    } else {
      this.setData({
        baoxouValue: e.detail.value
      })

    }



  },
  btn: function () {
    var that = this

    if (that.data.inputValue == '') {
      wx.showToast({
        title: '请添加车辆编号',
        icon: 'none'
      })
      return false
    }
    if (that.data.baoxouValue == '') {
      wx.showToast({
        title: '请添加报修描述',
        icon: 'none'
      })
      return false
    }
    request({
      url: '/api/repair/repair',
      method: 'POST',
      data: {
        user_id: app.globalData.userInfo.user_id,
        lock_id: that.data.inputValue,
        content: that.data.baoxouValue,
        appkey: md5.hexMD5(getApp().globalData.appKey),
        nub:that.data.nub
      }
    }).then(res => {
      console.log(res, '报修返回')
      if (res.data.code == 200) {
        // wx.showToast({
        //   title: '报修成功',
        //   icon: 'success',
        //   success: function (res) {

        //     setTimeout(function () {
        // wx.showModal({
        //   title: '',
        //   content: '感谢支持',
        //   confirmColor: '#000',
        //   showCancel: false,
        //   success(res) {
        //     wx.switchTab({
        //       url: '/pages/home/home',
        //     })
        //   }
        // })

        //     }, 1500)
        //   }
        // })
        wx.showModal({
          title: '',
          content: '感谢您的支持',
          confirmColor: '#000',
          showCancel: false,
          success(res) {
            wx.switchTab({
              url: '/pages/home/home',
            })
          }
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    })

  },


  //删除图片
  delete: function (e) {
    var that = this
    console.log(e.currentTarget.dataset.ids)
    var ids = e.currentTarget.dataset.ids
    var arr = this.data.imgArr
    var arr1 = this.data.videoArr
    if (e.currentTarget.dataset.status == 'img') {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].id == ids) {
          arr.splice(i, 1);
          break;
        }
      }
      // console.log(arr)
      this.setData({
        imgArr: arr
      })
    } else if (e.currentTarget.dataset.status == 'video') {
      for (var i = 0; i < arr1.length; i++) {
        if (arr1[i].id == ids) {
          arr1.splice(i, 1);
          break;
        }
      }
      console.log(arr1)
      this.setData({
        videoArr: arr1
      })
    }
    //删除图片
    request({
      url: '/api/repair/moveRepairImg',
      method: 'POST',
      data: {
        user_id: app.globalData.userInfo.user_id,
        id: ids,
        appkey: md5.hexMD5(getApp().globalData.appKey),
        'nub': that.data.nub
      }
    }).then(res => {
      console.log(res)
      console.log(res.data.data)
      // if (res.data.code) {
      //   wx.showToast({
      //     title: '报修成功',
      //     icon: 'success'
      //   })
      if(res.data.data=='无'){
        that.setData({

          nub: ''
        })
      } else {
        that.setData({

          nub: res.data.data
        })
      }
        
      // }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
      inputValue: options.id
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