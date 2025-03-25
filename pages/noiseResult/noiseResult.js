// pages/noiseResult/noiseResult.js

import * as echarts from "../../ec-canvas/echarts.js"
const app = getApp()
let bar = [];
function initChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

  var option = {
    xAxis: {
      type: 'category',
      data:  ['m', 's', 'x', 'sh','u', 'i', 'a']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data:  bar,
        type: 'bar',
        color:'#3da9fc',
      }
    ]
  };

  chart.setOption(option);
  return chart;
}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    userScore:0,
    userAccuracyResult:{"m":0,"s":0,"x":0,"sh":0,"u":0,"i":0,"a":0},//每个音节的平均信噪比
    u:{},
    ec: {
      onInit: initChart
    },

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var userAccuracy = wx.getStorageSync('userAccuracy'); // 获取数据  
    var userSNRCount = wx.getStorageSync('userSNRCount');
    console.log(userAccuracy); // 输出 'value'
    console.log(userSNRCount); // 输出 'value'
    //计算userAccuracyResult    
      var u_AR = this.Cal_userAccuracyResult(userAccuracy,userSNRCount);
      this.setData({
        userScore:(options.userScore*100/180).toFixed(2),
        userAccuracyResult:u_AR,
      });
      bar  = this.data.u;
      //更新数据
      this.setData({ //重新setData渲染canvas
        ec: {
          onInit: initChart
        }
      })

  
  },


  //计算userAccuracyResult
  Cal_userAccuracyResult:function(userAccuracy, userSNRCount){
   var that = this;
  //  var m_A = 100*userAccuracy.m/6;
  //  that.data.userAccuracyResult.m =  m_A.toFixed(2);
  //  that.data.userAccuracyResult.s = 100*userAccuracy.s/5;
  //  that.data.userAccuracyResult.x = 100*userAccuracy.x/5;
  //  that.data.userAccuracyResult.sh = 100*userAccuracy.sh/5;
  //  that.data.userAccuracyResult.u = 100*userAccuracy.u/5;
  //  that.data.userAccuracyResult.i = 100*userAccuracy.i/5;
  //  that.data.userAccuracyResult.a = 100*userAccuracy.a/5;
   that.data.userAccuracyResult.m =  (userSNRCount.m/userAccuracy.m).toFixed(2);
   that.data.userAccuracyResult.s = (userSNRCount.s/userAccuracy.s).toFixed(2);
   that.data.userAccuracyResult.x = (userSNRCount.x/userAccuracy.x).toFixed(2);
   that.data.userAccuracyResult.sh = (userSNRCount.sh/userAccuracy.sh).toFixed(2);
   that.data.userAccuracyResult.u = (userSNRCount.u/userAccuracy.u).toFixed(2);
   that.data.userAccuracyResult.i = (userSNRCount.i/userAccuracy.i).toFixed(2);
   that.data.userAccuracyResult.a = (userSNRCount.a/userAccuracy.a).toFixed(2);
   var u = [that.data.userAccuracyResult.m, that.data.userAccuracyResult.s, that.data.userAccuracyResult.x,that.data.userAccuracyResult.sh, that.data.userAccuracyResult.u, that.data.userAccuracyResult.i,
    that.data.userAccuracyResult.a];
   //计算完毕，刷新界面，并传递值
   that.setData({
    u:u,
  });
   return that.data.userAccuracyResult;
  },



  btnReturn:function(){
    //删除临时文件
    // let fsm = wx.getFileSystemManager();
    // fsm.unlink({
    //   filePath:wx.env.USER_DATA_PATH+'/'+ app.globalData.userRandomNumber +'.txt',
    //   success:res=>{
    //     console.info(res);
    //   },
    //   fail:res=>{
    //     console.info(res);
    //   },
    // })
    //删除本地缓存
    wx.removeStorageSync('count');
    wx.removeStorageSync('score');
    wx.removeStorageSync('userAccuracy');
    wx.removeStorageSync('userSNRCount');
    //wx.removeStorageSync('countTone')
    //返回管理界面
    wx.redirectTo({
      url:'../userLogin/userLogin'
    })
  }

})