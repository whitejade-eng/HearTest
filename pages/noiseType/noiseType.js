// pages/noiseType.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sex:'',
    noise:'',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  //性别选择
  radioChangeSex:function(e){
    var sex = e.detail.value;
    this.setData({
      sex:sex,
    })
    console.log('选择性别：'+sex)

  },

   //噪声类型选择
   radioChangeNoise:function(e){
    var noise = e.detail.value;
    this.setData({
      noise:noise,
    })
    console.log('选择类型：'+noise)

  },

  //传输类型
  btnFormSubmit:function(e){
    var that = this;
    //获取输入数据
    var sex = that.data.sex;
    var noise = that.data.noise;
    //拼接音频文件地址
    //var micsrc = sex+'/young/noise/';
    var micsrc = sex+'/young/0/noise/';
    
    app.globalData.micsrc = micsrc;
    app.globalData.sex = sex;
    app.globalData.noise = noise;
    console.log('app.globalData.sex='+app.globalData.sex);
    //检测是否全部输入，否则提示有未输入项
    if (sex == '') {
      wx.showToast({  
        title: '性别不能为空',
        icon: "none"
      })
      return;
    } else if(noise == ''){
      wx.showToast({
        title: '噪声类型不能为空',
        icon: "none"
      })
      return;
    } 
    //全部输入，提交json数组
    var NoiseTypeJson = {
    'sex':sex,
    'noise':noise,}
    app.globalData.noise = noise;
    console.log('NoiseTypeJson:'+JSON.stringify(NoiseTypeJson));
    
      wx.redirectTo({
        url: '/pages/noiseTest/noiseTest',
      });
    
    
  },


//监听返回事件
btnReturn:function(){
  wx.showModal({
    title: '温馨提示',
    showCancel: false,
    content: '即将关闭小程序',
    success(res) {
    if (res.confirm) {
        wx.exitMiniProgram({success: (res) => {}})
    }
  }
})
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

  }
})