const request = require('../../utils/request.js');
const app = getApp();
Page({
  data: {
    PageCur: 'resolution'
  },
  NavChange(e) {
    this.setData({
      PageCur: e.currentTarget.dataset.cur
    })
  },
  onShareAppMessage() {
    return {
      title: '短视频去水印工具',
      path: '/pages/index/index'
    }
  },
})