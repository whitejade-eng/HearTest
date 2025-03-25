// pages/userPureResult/userPureResult.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    srcimg:'',    
    isReady: false, //图片加载状态标志
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //获取结果图 D:\TUT\Seven\SevenDjang0\static\img
    // var srcimg = 'http://localhost:8080/static/img/'+'20240613160338386286'+'.png';
    var srcimg = 'http://localhost:8080/static/img/'+app.globalData.userRandomNumber+'.png';
    //获取状态标志
    this.setData({
      srcimg:srcimg,
    });
    this.checkImageExists(srcimg);
    // var isResourceLoaded = wx.getStorageSync('isResourceLoaded');
    // if(isResourceLoaded !=true){
    //   this.checkUrlImg(this.setData.srcimg);
    // }
    // else {
    //   console.log('纯音测试结果加载完毕')
    // }
  
    
    
    // var srcimg = 'http://19.2.168.0.109:8080/static/mic/'+app.globalData.userRandomNumber+'.png';

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  /**
   * 检测图片是否生成
   */
  checkImageExists: function (srcimg) {
    const that = this;
    wx.request({
      url: 'https://localhost:8080/check-image-exists', //后端接口地址
      method: 'POST',
      data: {
        srcimg:srcimg,
      },
      success(res) {
        if (res.data.exists) {
          // 图片已生成，初始化界面
          that.setData({ isReady: true });
          console.log('图片已生成，开始初始化界面');
        } else {
          // 图片未生成，继续轮询
          setTimeout(() => that.checkImageExists(), 3000); // 每3秒轮询一次
        }
      },
      fail(err) {
        console.error('检查图片是否存在失败:', err);
      }
    });
  },


  
  btnReturn:function(){
    //确认是否退出
  wx.showModal({
    title:'退出测试',
    content:'确定退出本次测试，结果将不会保存',
    showCancel:true,
    cancelColor:'#DEB887',
    confirmColor:'#DEB887',
    success:function (res){
      if (res.cancel){
        //点击取消,默认隐藏弹框
      }
      else{
        //点击确认
        //删除临时文件
        let fsm = wx.getFileSystemManager();
        fsm.unlink({
          filePath:wx.env.USER_DATA_PATH+'/'+app.globalData.userRandomNumber+'.txt',
          success:res=>{
            console.info(res);
          },
          fail:res=>{
            console.info(res);
          },
        })
        //删除本地缓存
        wx.removeStorageSync('count');
        wx.removeStorageSync('score');
        //wx.removeStorageSync('countTone')
    //返回管理界面
    wx.redirectTo({
      url:'../userLogin/userLogin'
    })
  }
    }
})
  }
})