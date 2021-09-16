const app = getApp();
const request = require('../../utils/request.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    parsingInfo : null,
    isDownload : false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var thar = this;
    var urlContent = app.globalData.url + "api/video/getParsingInfo"
    request.requestPostApi(urlContent, {}, this, function (res) {
      if (res.status == 200) {
        if(res.data.length!=0){
          thar.setData({
            parsingInfo:res.data
          })
        }
      } else {
        console.error(res)
      }
    }, function (res) {
      console.error(res)
    });
  },
   
  saveVideo:function(res){
    let that = this
    that.setData({
      isDownload: true,
    })
    var t = this;
    console.error("进入下载方法"+res.currentTarget.dataset.url)
    var url = res.currentTarget.dataset.url;
    if (url.indexOf("https") == -1) {
      url = url.replace('http', 'https')
    }
    wx.getSetting({
      success: function (o) {
        o.authSetting['scope.writePhotosAlbum'] ? t.download(url) : wx.authorize({
          scope: 'scope.writePhotosAlbum',
          success: function () {
            t.download(url)
          },
          fail: function (o) {
            t.setData({
              isDownload: false
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
  download: function (res) {
    var t = this,
    e = res;
    wx.downloadFile({
      url: e,
      success: function (o) {
        wx.saveVideoToPhotosAlbum({
          filePath: o.tempFilePath,
          success: function (o) {
            t.showToast('视频保存成功')
            t.setData({
              isDownload: false
            })
          },
          fail: function (o) {
            t.showToast('视频保存失败')
            t.setData({
              isDownload: false
            })
          }
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
  showToast: function (text) {
    wx.showToast({
      title: text,
      icon: 'none',
      duration: 2000,
      mask: true
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
});
