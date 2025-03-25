// pages/pure/pure.js
const app = getApp()
const innerAudioContext = wx.createInnerAudioContext()
Page({


  /**
   * 页面的初始数据
   */
  data: {
    pureHz:[1000,2000,4000,8000,500,250,125,10000],//测试频率
    dBHL:[0,5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100],//声强等级
    userChoose:[],//测试者每个频率的声强数据
    userChooseER:[0,0],//测试者超出0或100时的标记
    userChooseERALL:[],
    testPureHz:1000,//当前测试的频率
    test_count:0,//正式测试计数器，每完成一个频率+1
    testDBHL:40,//当前测试声强
    userTest_1:0,//预测试最终测得的声强 正式测试时需每次将当前测试声强设置为此值
    userTest_1_On:false,//是否完成预测试
    count_1:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//记录预测试声强正确听到次数
    count:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//记录声强正确听到次数 每个频率测试完后需归零
      },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //获取音频地址
    var mic_HzName = this.data.testPureHz+'/';
    var mic_DBHLName = this.data.testDBHL+'.wav'
    // var srcmic = 'http://localhost:8080/static/mic/'+'pure/'+mic_HzName+mic_DBHLName;
    // var srcmic = 'http://localhost:8080/static/mic/'+app.globalData.micsrc+mic_HzName+mic_DBHLName;
    var srcmic = 'http://localhost:8080/static/mic/'+app.globalData.micsrc+mic_HzName+mic_DBHLName;
    console.log(srcmic);
    //进入界面直接开始播放
    this.test_audioPlay(srcmic);
    
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
   * 修改音频地址
   */
  test_srcmic_revise:function(){
    var mic_HzName = this.data.testPureHz+'/';
    var mic_DBHLName = this.data.testDBHL+'.wav';
    // var srcmic = 'http://localhost:8080/static/mic/'+'pure/'+mic_HzName+mic_DBHLName;
    // var srcmic = 'http://localhost:8080/static/mic/'+app.globalData.micsrc+mic_HzName+mic_DBHLName;
    var srcmic = 'http://localhost:8080/static/mic/'+app.globalData.micsrc+mic_HzName+mic_DBHLName;
    console.log("revise src:"+srcmic);
    return srcmic;
  },

   /**
   *播放音频，设置；循环播放，每次按键的时候刷新播放
   */
  yuyinPlay: function (srcmic) {
    //创建内部 audio 上下文 InnerAudioContext 对象。
    innerAudioContext.autoplay=true;
    innerAudioContext.onError(function (res) {
    })
    if ((srcmic == '') || (srcmic == undefined)) {
      console.log('地址错误');
      return;
    }
    innerAudioContext.src = srcmic; //设置音频地址that.data.srcMic,应为相对路径    
    innerAudioContext.loop = true;//循环播放
    setTimeout(()=>{
    innerAudioContext.play(); //播放音频
    console.log('播放音频：'+srcmic)
  },1500)
  
  },

  test_audioPlay:function(srcmic){
    setTimeout(()=>{
      this.yuyinPlay(srcmic);
        },1500)

  },

  // 暂停播放
  test_audioPause() {
    // this.setData({
    //   isPlay: false
    // })
    innerAudioContext.pause();//暂停音频 

  },

    // 结束音频
    test_aend: function (e) {
      let that = this
      if ((that.data.src) || (that.data.src != undefined)) return
      innerAudioContext.pause();//暂停音频 
    },
  
  

  /**
   * 纯音测听 预测试
   */
  test_1_yes:function(){
    var testDBHL = this.data.testDBHL;
    //判定是否小于0
    if(testDBHL == 0){
      this.test_info_min();
      //计数判定 记录超界，视作听到+1      
      var i = (testDBHL)/5;
      var count_1=this.data.count_1;
      if(count_1[i]<2){
        count_1[i]++;
      this.setData({
        count_1:count_1,
      });
      //testDBHL不变      
      }
      else{//=2
        count_1[i]++;
        this.setData({
          count_1:count_1,
          userTest_1:this.data.testDBHL,
          userTest_1_On:true,
        });
        //提示：完成预测试        
        wx.showToast({
          title: '完成预测试！',
          icon:  'success',
          duration:1500
        });
        //结束播放
        this.test_audioPause();
      }
    }
    else{
      //正常判定
      var i = (testDBHL)/5;
      var count_1=this.data.count_1;
      if(count_1[i]<2){
        count_1[i]++;
        //判断运算是否出界
      if(testDBHL-20<0){
        testDBHL = 20;        
      }
      this.setData({
        count_1:count_1,
        testDBHL:testDBHL-20,
      });
      var srcmic = this.test_srcmic_revise();//切换音频
      this.test_audioPlay(srcmic);
      }
      else{//=2
        count_1[i]++;
        this.setData({
          count_1:count_1,
          userTest_1:this.data.testDBHL,
          userTest_1_On:true,
        });
        //提示：完成预测试
        wx.showToast({
          title: '完成预测试！',
          icon:  'success',
          duration:1500
        });
        //结束播放
        this.test_audioPause();

      }
    }


  },

  test_1_no:function(){
    var testDBHL = this.data.testDBHL;
    //判定超界
    if(testDBHL == 100){
      this.test_info_max();
      //计数判定 记录超界，视作听到+1      
      var i = (testDBHL)/5;
      var count_1=this.data.count_1;
      if(count_1[i]<2){
        count_1[i]++;
      this.setData({
        count_1:count_1,
      });
      //testDBHL不变
      
      }
      else{//=2
        count_1[i]++;
        this.setData({
          count_1:count_1,
          userTest_1:this.data.testDBHL,
          userTest_1_On:true,
        });
        //提示：完成预测试
        wx.showToast({
          title: '完成预测试！',
          icon:  'success',
          duration:1500
        });
        //结束播放
        this.test_audioPause();

      }

    }
    else{
      //判断运算是否出界
      if(testDBHL+10>100){
        testDBHL = 90;        
      }
      this.setData({
        testDBHL:testDBHL+10,
      });
      var srcmic = this.test_srcmic_revise();//切换音频
      this.test_audioPlay(srcmic);  
    }
    
  },


  /**
   * 纯音测听 正式测试
   */

  test_yes:function(){
    var testDBHL = this.data.testDBHL;
    var userChooseER = this.data.userChooseER;
    //判断是否到最小界
    if(testDBHL == 0){
      //提示已经最小
      this.test_info_min();
      //记录超界，视作听到+1
      var i = 0;//(testDBHL)/5
      var count=this.data.count;
      
      userChooseER[0]=userChooseER[0]+1;
      if(count[i]<2){
        count[i]++;
      this.setData({
        count:count,
        userChooseER:userChooseER,
        //testDBHL不变
      });
    }
    else{//=2
      count[i]++;
      var init_dBHL = this.data.userTest_1;
      //当前声强直接插入数组最末，计数器+！
      var userChoose = this.data.userChoose;
      var test_count = this.data.test_count;
      var pureHz = this.data.pureHz;
      var p = pureHz[test_count+1];
      var userChooseERALL = this.data.userChooseERALL;
      console.log("dbHL:"+testDBHL+",下一个："+p);      
      userChoose.push(testDBHL);
      console.log("dbHL:"+testDBHL+",userChooose:"+userChoose+",userChooseER:"+userChooseERALL);
      //记录越界结果，3个一组：频率，0越界，100越界
      userChooseERALL.push(pureHz[test_count]);
      userChooseERALL.push(userChooseER[0]);
      userChooseERALL.push(userChooseER[1]);
      this.setData({
        count:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        test_count:test_count+1,
        userChooseER:[0,0],
        userChoose:userChoose,
        userChooseERALL:userChooseERALL,
        testDBHL:init_dBHL,
        testPureHz:p,
      });
      var srcmic = this.test_srcmic_revise();//切换音频
      this.test_audioPlay(srcmic);
      //提示：完成当前频率，进入下一频率，testDBHL重置到预测试结果，count归零,越界记录，越界数组归零
    }
  }
    else{//testDB!=0
    var i = (testDBHL)/5;
    var count=this.data.count;
    if(count[i]<2){
      count[i]++;      
      //判断运算是否出界
      if(testDBHL-10<0){
        testDBHL = 10;        
      }
    this.setData({
      count:count,
      testDBHL:testDBHL-10,
    });
    var srcmic = this.test_srcmic_revise();//切换音频
      this.test_audioPlay(srcmic);
    
    }
    else{//=2
      count[i]++;
      var init_dBHL = this.data.userTest_1;
      //提示：完成当前频率，进入下一频率，testDBHL重置到预测试结果，count归零
      //当前声强直接插入数组最末，计数器+！
      var userChoose = this.data.userChoose;
      var test_count = this.data.test_count;
      var pureHz = this.data.pureHz;
      var p = pureHz[test_count+1];
      var userChooseERALL = this.data.userChooseERALL;
      console.log("dbHL:"+testDBHL+",下一个："+p);      
      userChoose.push(testDBHL);
      console.log("dbHL:"+testDBHL+",userChooose:"+userChoose+",userChooseER:"+userChooseERALL);
      //记录越界结果，3个一组：频率，0越界，100越界
      userChooseERALL.push(pureHz[test_count]);
      userChooseERALL.push(userChooseER[0]);
      userChooseERALL.push(userChooseER[1]);
      this.setData({
        count:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        test_count:test_count+1,
        userChooseER:[0,0],
        userChooseERALL:userChooseERALL,
        userChoose:userChoose,
        testDBHL:init_dBHL,
        testPureHz:p,
      });
      var srcmic = this.test_srcmic_revise();//切换音频
      this.test_audioPlay(srcmic);
      //提示：完成当前频率，进入下一频率，testDBHL重置到预测试结果，count归零

    }
      
  }
    
    

},


  test_no:function(){
    var testDBHL = this.data.testDBHL;
    var userChooseER = this.data.userChooseER;
    //判定是否已经到了最大
    if(testDBHL == 100){
      //提示：已经最大
      this.test_info_max();
      //记录次数，同时userChooseER记录超界
      var i = 20;//(testDBHL)/5
      var count=this.data.count;
      
      userChooseER[1]=userChooseER[1]+1;
      if(count[i]<2){
        count[i]++;
      this.setData({
        count:count,
        userChooseER:userChooseER,
        //testDBHL不变
      });
    
      }
      else{//=2
        count[i]++;
      var init_dBHL = this.data.userTest_1;
      //提示：完成当前频率，进入下一频率，testDBHL重置到预测试结果，count归零
      //当前声强直接插入数组最末，计数器+！
      var userChoose = this.data.userChoose;
      var test_count = this.data.test_count;
      var pureHz = this.data.pureHz;
      var p = pureHz[test_count+1];
      var userChooseERALL = this.data.userChooseERALL;
      //记录越界结果，3个一组：频率，0越界，100越界
      userChooseERALL.push(pureHz[test_count]);
      userChooseERALL.push(userChooseER[0]);
      userChooseERALL.push(userChooseER[1]);
      console.log("dbHL:"+testDBHL+",下一个："+p);      
      userChoose.push(testDBHL);
      console.log("dbHL:"+testDBHL+",userChooose:"+userChoose+",userChooseER:"+userChooseERALL);
      this.setData({
        count:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        test_count:test_count+1,
        userChooseER:[0,0],
        userChoose:userChoose,
        userChooseERALL:userChooseERALL,
        testDBHL:init_dBHL,
        testPureHz:p,
      });
      var srcmic = this.test_srcmic_revise();//切换音频
      this.test_audioPlay(srcmic);
      //提示：完成当前频率，进入下一频率，testDBHL重置到预测试结果，count归零
  
      }
      
    }
    else{
      //判断运算是否出界
      if(testDBHL+5>100){
        testDBHL = 95;        
      }
      var i = (testDBHL)/5;
      this.setData({
        testDBHL:testDBHL+5,
      });
      var srcmic = this.test_srcmic_revise();//切换音频
      this.test_audioPlay(srcmic);
    }
    
    
  },



  /**
   * 纯音测听 逻辑
   */


  yes_question:function(){
    
    //暂停播放
    this.test_audioPause();
    console.log(this.data.userTest_1_On);
    var userTest_1_On=this.data.userTest_1_On;
    console.log(userTest_1_On);    
    if(!this.data.userTest_1_On){
      this.test_1_yes();
    }
    else{
      //先判定是否结束
      if(this.test_end()){
        //结束播放
        this.test_audioPause();
        //跳转结果页
        wx.redirectTo({
          url:'../userPureResult/userPureResult'
        });
      }
      else{
        this.test_yes();
      }
    }
    
  },

  no_question:function(){
    
    //暂停播放
    this.test_audioPause();
    if(this.data.userTest_1_On==false){
      this.test_1_no();
    }
    else{
      //先判定是否结束
      if(this.test_end()){
        //结束播放
        this.test_audioPause();
        //跳转结果页
        wx.redirectTo({
          url:'../userPureResult/userPureResult'
        });
      }
      else{
        this.test_no();
      }
    }
    
  },



  /**
   * 纯音测听 播放 持续播放，间隔3S?
   */


   /**
   * 纯音测听 判定testDBHL是否移动到最小/最大，如果是最小/最大，停止移动，提示已经是最小/最大
   */
  test_info_min:function(){
    wx.showToast({
      title: '已是最小！',
      icon:  'info',
      duration:1500
    })
  },

  test_info_max:function(){
    wx.showToast({
      title: '已是最大！',
      icon:  'info',
      duration:1500
    })
  },

   /**
   * 纯音测听 判定结束
   */
  test_end:function(){
    var userChoose = this.data.userChoose;
    var testDBHL = this.data.testDBHL;
    if((userChoose.length==8)){
      //提示结束
      wx.showToast({
        title: '完成测试！',
        icon:  'success',
        duration:1500
      });
      //将数据以json形式传入服务器
      console.log("测试结果："+this.data.userChoose+this.data.userChooseERALL);
      var answerJson = {
        "userRandomNumber":app.globalData.userRandomNumber,
        "userChoose":this.data.userChoose,
        "userChooseERALL":this.data.userChooseERALL,
      };
      let fsm = wx.getFileSystemManager();
      fsm.appendFile({
        filePath:wx.env.USER_DATA_PATH+'/'+app.globalData.userRandomNumber+'.txt',
        data:JSON.stringify(answerJson),
        encoding:"utf-8",
        success:res=>{
          console.info(res)
        },
        fail:res=>{
          console.info(res)
        }
      }),
      console.log(answerJson);
      //上传结果
            //连接到服务器
      console.log("尝试连接服务器");
      wx.request({
        url: 'http://localhost:8080/RapidUpLoadPure/',
        // url: 'http://localhost:8080/RapidUpLoadPure/',
        //url: 'https://baiyutut.top:8000/Rapid7ToneDetermination/',
        method:'POST',
        header:{
          "content-type": "application/x-www-form-urlencoded"
        },
        data:{
          answerJson:JSON.stringify(answerJson),
        },
        success:res=>{
          console.log("传输："+answerJson);
          
          if(res.statusCode==0){
            wx.showToast({
              title: '传输失败！',
              icon:  'loading',
              duration:1500
            })
            console.log(res);
            return ;
          } else {
            wx.showToast({
              title: '传输成功！',
              icon:  'success',
              duration:1500
            })

          }
        },
      })
      this.upload();
      wx.redirectTo({
        url:'../userPureResult/userPureResult'
      });
      return true;
      //回到主界面
    }
    else{
      return false;
    }

  },




  //上传文件
  upload:function(){
    wx.uploadFile({
      filePath: wx.env.USER_DATA_PATH+'/'+app.globalData.userRandomNumber+'.txt',
      name: 'file',
      //url: 'https://baiyutut.top:8000/RapidUploadFile/',{
      // url: 'http://localhost:8080/RapidUploadFile/',
      url: 'http://localhost:8080/RapidUploadFile/',
      header:{
        "content-type": "application/x-www-form-urlencoded"
      },
    })
    success: (res) => {
      //成功后
     wx.alert({
        content: '上传结果成功'
      }),
      console.log('成功：'+res);
    };
    fail:(res) => {
      wx.alert({
        content: '上传失败'
      })
      console.log('失败：',res);
    }
  },


//监听左上角返回事件
btnReturn:function(){
  this.test_audioPause();
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
          url: '/pages/userLogin/userLogin',
          // url: '/pages/userLogin/userLogin',
        })

      }
    }

  })    
}

})
