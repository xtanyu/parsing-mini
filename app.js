// app.js
const request = require('utils/request.js');
App({
  onLaunch() {
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          this.globalData.Custom = capsule;
          this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    })
            // 获取小程序更新机制兼容
            if (wx.canIUse('getUpdateManager')) {
              const updateManager = wx.getUpdateManager()
              updateManager.onCheckForUpdate(function (res) {
                  // 请求完新版本信息的回调
                  if (res.hasUpdate) {
                      updateManager.onUpdateReady(function () {
                          wx.showModal({
                              title: '更新提示',
                              content: '新版本已经准备好，是否重启应用？',
                              success: function (res) {
                                  if (res.confirm) {
                                      // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                                      updateManager.applyUpdate()
                                  }
                              }
                          })
                      })
                      updateManager.onUpdateFailed(function () {
                          // 新的版本下载失败
                          wx.showModal({
                              title: '已经有新版本了哟~',
                              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
                          })
                      })
                  }
              })
          } else {
              // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
              wx.showModal({
                  title: '提示',
                  content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
              })
          }
  },
  globalData: {
     //url: "https://api.xtyu.top/",
     url:"http://127.0.0.1:10521/",
     ColorList: [{
        title: '嫣红',
        name: 'red',
        color: '#e54d42'
      },
      {
        title: '桔橙',
        name: 'orange',
        color: '#f37b1d'
      },
      {
        title: '明黄',
        name: 'yellow',
        color: '#fbbd08'
      },
      {
        title: '橄榄',
        name: 'olive',
        color: '#8dc63f'
      },
      {
        title: '森绿',
        name: 'green',
        color: '#39b54a'
      },
      {
        title: '天青',
        name: 'cyan',
        color: '#1cbbb4'
      },
      {
        title: '海蓝',
        name: 'blue',
        color: '#0081ff'
      },
      {
        title: '姹紫',
        name: 'purple',
        color: '#6739b6'
      },
      {
        title: '木槿',
        name: 'mauve',
        color: '#9c26b0'
      },
      {
        title: '桃粉',
        name: 'pink',
        color: '#e03997'
      },
      {
        title: '棕褐',
        name: 'brown',
        color: '#a5673f'
      },
      {
        title: '玄灰',
        name: 'grey',
        color: '#8799a3'
      },
      {
        title: '草灰',
        name: 'gray',
        color: '#aaaaaa'
      },
      {
        title: '墨黑',
        name: 'black',
        color: '#333333'
      },
      {
        title: '雅白',
        name: 'white',
        color: '#ffffff'
      },
    ]
  }
})