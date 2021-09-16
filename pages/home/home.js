const request = require('../../utils/request.js');
const app = getApp();
Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    starCount: 0,
    forksCount: 0,
    visitTotal: 0,
    success:false,
    error:false
  },
  attached() {
    let that = this;
    numDH();
    function numDH() {
      var urlContent = app.globalData.url + "api/wx/login"
      request.requestPostApi(urlContent, {}, this, function (res) {
        if (res.status == 200) {
          that.setData({
            starCount: that.coutNum(res.data.signInSum),
            visitTotal: that.coutNum(res.data.videoNumber)
          })
        } else {
          console.error(res)
        }
      }, function (res) {
        console.error(res)
      });
    }
  },
  methods: {
    coutNum(e) {
      if (e > 1000 && e < 10000) {
        e = (e / 1000).toFixed(2) + 'k'
      }
      if (e > 10000) {
        e = (e / 10000).toFixed(2) + 'W'
      }
      return e
    },
    CopyLink(e) {
      wx.setClipboardData({
        data: e.currentTarget.dataset.link,
        success: res => {
          wx.showToast({
            title: '已复制',
            duration: 1000,
          })
        }
      })
    },
    showModal(e) {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    },
    hideModal(e) {
      this.setData({
        modalName: null
      })
    },
    showQrcode() {
      wx.previewImage({
        urls: ['https://oss.xtyu.top/blog-image/WechatIMG249_1623919690786.jpeg'],
        current: 'https://oss.xtyu.top/blog-image/WechatIMG249_1623919690786.jpeg' // 当前显示图片的http链接      
      })
    },
    sign() {
      let that = this;
      var urlContent = app.globalData.url + "api/wx/signIn"
      request.requestPostApi(urlContent, {}, this, function (res) {
        if (res.status == 200) {
          that.setData({
            starCount: that.coutNum(res.data.signInSum),
            visitTotal: that.coutNum(res.data.videoNumber),
            success:true
          })
        } else {
          that.setData({
            error:true
          })
        }
      }, function (res) {
        console.error(res)
      });
    },
    hideModal(){
      this.setData({
        error:false,
        success:false
      })
    }
  }
})