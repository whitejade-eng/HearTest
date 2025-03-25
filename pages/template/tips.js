// pages/template/tips.js
Page({

  /**
   * 页面的初始数据
   */
  onLoad: function (e) {
    var that = this;
    console.log(new Date().toLocaleDateString());
    that.setData({
      isTipTrue:true
    })
   },
   tipAgree:function(e){
    this.setData({
      isTipTrue:false
    })
 },
})