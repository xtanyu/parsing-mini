//index.js
//获取应用实例
const app = getApp();
const request = require('../../utils/request.js');
Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    videoUrl: '',
    videoTitle: '',
    isShow: false,
    isDownload: false,
    isButton: true
  },

  //组件的生命周期
  lifetimes: {
    created: function () {
      if (!wx.getStorageSync('openId')) {
      //初始化次数及信息
      var urlContent = app.globalData.url + "api/wx/login"
      request.requestPostApi(urlContent, {}, this, null, function (res) {
        console.error(res)
      })       
    }
    },
    attached: function () {
      // 在组件实例进入页面节点树时执行
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  //组件的函数
  methods: {
    openVideoInfo: function(){
      wx.navigateTo({
        url: 'test?id=1'
      })
    },
    urlInput: function (e) {
      this.setData({
        videoUrl: e.detail.value.trim()
      })
    },
    // 视频地址匹配是否合法
    regUrl: function (t) {
      return /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(t)
    },
    findUrlByStr: function (t) {
      return t.match(/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/)
    },
    submit: function () {
      this.setData({
        isButton: false
      })
      if (this.regUrl(this.data.videoUrl)) {
        this.parseVideo();
      } else {
        this.showToast('请复制短视频平台分享链接后再来')
        this.setData({
          isButton: true
        })
      }
    },

    // 视频解析
    parseVideo: function () {
      var that = this;
      var params = {
        url: this.data.videoUrl
      };
      request.requestPostApi(app.globalData.url + 'api/video/getVideoInfo', params, this, function (res) {
        if (res.status != 200) {
          that.showToast('解析失败请检查链接正确性,或重试一次')
        } else {
          let url = res.data.url
          if(!url){
            that.showToast('解析失败')
          }else{
            if (url.indexOf("https") == -1) {
              url = url.replace('http', 'https')
            }
            that.setData({
              isShow: true,
              url: url,
              shortUrl: url.substring(0, 15) + "..."
            })
          }
        }
        that.setData({
          isButton: true
        })
      }, function (res) {
        console.error(res)
      })
    },
    hideModal() {
      this.setData({
        isShow: false,
        isUrlDownload: false
      })
    },
    saveVideo() {
      let that = this
      that.setData({
        isDownload: true,
      })
      var t = this;
      wx.getSetting({
        success: function (o) {
          o.authSetting['scope.writePhotosAlbum'] ? t.download() : wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: function () {
              t.download()
            },
            fail: function (o) {
              t.setData({
                isDownload: false,
                isShow: false,
              })
              wx.showModal({
                title: '提示',
                content: '视频保存到相册需获取相册权限请允许开启权限',
                confirmText: '确认',
                cancelText: '取消',
                success: function (o) {
                  o.confirm ? (wx.openSetting({
                    success: function (o) {}
                  })) : ''
                }
              })
            }
          })
        }
      })
    },

    download: function () {
      var t = this,
      e = this.data.url;
      wx.downloadFile({
        url: e,
        success: function (o) {
          wx.saveVideoToPhotosAlbum({
            filePath: o.tempFilePath,
            success: function (o) {
              t.showToast('视频保存成功')
              t.setData({
                isDownload: false,
                isShow: false,
              })
            },
            fail: function (o) {
              t.showToast('视频保存失败')
              t.setData({
                isDownload: false,
              })
            }
          })
        },
        fail: function (o) {
          t.setData({
            isUrlDownload: true,
            isDownload: false,
          })
        }
      })
    },
    onShareAppMessage: function () {
      return {
        path: '/pages/video/video',
      }
    },
    prevent: function () {
      // console.log(event.currentTarget.dataset.url);
      wx.setClipboardData({
        data: this.data.url,
      });
    },
    showToast: function (text) {
      wx.showToast({
        title: text,
        icon: 'none',
        duration: 2000,
        mask: true
      })
    },
    copy : function(){
      wx.getClipboardData({
        success: res => {
          var str = res.data.trim()
          if (this.regUrl(str)) {
            console.error(this.findUrlByStr(str))
            this.setData({
              videoUrl: this.findUrlByStr(str)[0],
              videoTitle: str.substring(0, 20),
              shortVideoUrl: this.findUrlByStr(str)[0].substring(0, 35) + "...",
            })
          }else{
            this.showToast("请复制短视频平台分享链接后再来")
          }
        }
      })
    }
  },
  pageLifetimes: {
    show: function () {
      // 如果剪切板内有内容则尝试自动填充
      wx.getClipboardData({
        success: res => {
          var str = res.data.trim()
          if (this.regUrl(str)) {
            wx.showModal({
              title: '检测到剪切板有视频地址，是否自动填入？',
              success: res => {
                if (res.confirm) {
                  this.setData({
                    videoUrl: this.findUrlByStr(str)[0],
                    videoTitle: str.substring(0, 20),
                    shortVideoUrl: this.findUrlByStr(str)[0].substring(0, 35) + "...",
                  })
                }
              }
            })
          }
        }
      })
    },
    hide: function () {
      // 页面被隐藏
    },
    resize: function (size) {
      // 页面尺寸变化
    }
  }
})

// Page({
//   data: {
//     userInfo: {},
//     videoUrl: '',
//     videoTitle : '',
//     isShow: false,
//     isDownload: false,
//     isButton :true
//   },

//   onLoad: function () {

//   },

//   onShow() {
//     console.error(111)
//     // 如果剪切板内有内容则尝试自动填充
//     wx.getClipboardData({
//       success: res => {
//         var str = res.data.trim()
//         if (this.regUrl(str)) {
//           wx.showModal({
//             title: '检测到剪切板有视频地址，是否自动填入？',
//             success: res => {
//               if (res.confirm) {
//                 console.error(this.findUrlByStr(str))
//                 this.setData({
//                   videoUrl: this.findUrlByStr(str)[0],
//                   videoTitle : str.substring(0,20),
//                   shortVideoUrl : this.findUrlByStr(str)[0].substring(0,35)+"...",
//                 })
//               }
//             }
//           })
//         }
//       }
//     })
//   },
//   urlInput :function(e){
//     this.setData({
//       videoUrl: e.detail.value.trim()
//     })
//   },
//   // 视频地址匹配是否合法
//   regUrl: function (t) {
//     return /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(t)
//   },
//   findUrlByStr : function(t){
//     return t.match(/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/)
//   },
//   submit: function () {
//     this.setData({
//       isButton :false
//     })
//     if (this.regUrl(this.data.videoUrl)) {
//       this.parseVideo();
//     } else {
//       wx.showToast({
//         title: '请复制短视频平台分享链接后再来',
//         icon: 'none',
//         duration: 2000,
//         mask: true
//       })
//       this.setData({isButton :true})
//     }
//   },

//   // 视频解析
//   parseVideo: function () {
//     var that = this;
//     var params = {
//       url: this.data.videoUrl,
//     };
//     request.requestGetApi('https://video.xtyu.top', null, params, this, function (res) {
//       if (res.code == 201) {
//         wx.showToast({
//           title: '解析失败请检查链接正确性,或重试一次',
//           icon: 'none',
//           duration: 2000,
//           mask: true
//         })
//       } else {
//         console.log(res)
//         let url = res.data.url
//         if(url.indexOf("https")==-1){
//            url = url.replace('http', 'https')
//         }
//         that.setData({
//           isShow: true,
//           url: url,
//           shortUrl : url.substring(0,15)+"..."
//         })
//       }
//       that.setData({isButton:true})
//     })
//   },
//   hideModal() {
//     this.setData({
//       isShow: false,
//       isUrlDownload : false
//     })
//   },
//   saveVideo() {
//     let that = this
//     that.setData({
//       isDownload: true,
//     })
//     var t = this
//     wx.getSetting({
//       success: function (o) {
//           o.authSetting['scope.writePhotosAlbum'] ? t.download() : wx.authorize({
//           scope: 'scope.writePhotosAlbum',
//           success: function () {
//             t.download()
//           },
//           fail: function (o) {
//             t.setData({
//               isDownload: false,
//               isShow: false,
//             })
//             wx.showModal({
//               title: '提示',
//               content: '视频保存到相册需获取相册权限请允许开启权限',
//               confirmText: '确认',
//               cancelText: '取消',
//               success: function (o) {
//                 o.confirm ? (wx.openSetting({
//                   success: function (o) {}
//                 })) : ''
//               }
//             })
//           }
//         })
//       }
//     })
//   },

//   download: function () {
//     var t = this,
//     e = this.data.url;
//     (n = wx.downloadFile({
//       url: e,
//       success: function (o) {
//         wx.saveVideoToPhotosAlbum({
//           filePath: o.tempFilePath,
//           success: function (o) {
//             wx.showToast({
//               title: '视频保存成功',
//               icon: 'none',
//               duration: 2000,
//               mask: true
//             })
//             t.setData({
//               isDownload: false,
//               isShow: false,
//             })
//           },
//           fail: function (o) {
//             wx.showToast({
//               title: '视频保存失败',
//               icon: 'none',
//               duration: 2000,
//               mask: true
//             })
//             t.setData({
//               isDownload: false,
//             })
//           }
//         })
//       },
//       fail: function (o) {
//         t.setData({
//           isUrlDownload : true,
//           isDownload: false,
//         })
//       }
//     }))
//   },
//   onShareAppMessage: function () {
//     return {
//         path: '/pages/video/video',
//     }
// },
// prevent: function() {
//   // console.log(event.currentTarget.dataset.url);
//   wx.setClipboardData({
//       data: this.data.url,
//   });
// },
// })