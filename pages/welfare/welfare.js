const app = getApp();
const request = require('../../utils/request.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    parsingInfo : null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    
  },
  mtCps:function(){
    wx.navigateToMiniProgram({
      appId: 'wxde8ac0a21135c07d',
      path: 'waimaiunion/pages/union/index?scene=1!cMRWVr5zYcDz!1!2!sVdWvg'
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
