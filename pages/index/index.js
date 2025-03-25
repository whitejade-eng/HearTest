// index.js
// 获取应用实例
const app = getApp()
const innerAudioContext = wx.createInnerAudioContext();
Page({
  data: {
    //用户在页面停留的时长
    userHesitationTime:'',
    // 组件参数设置，传递到组件
    userRandomNumber:'',
    count:1,//题目计数器
    isClick:false,//防多次点击状态标志
    isPlay: true,//播放器状态标志
    srcMic: '',
    img_one : 1,
    img_two : 1,
    img_three : 1,
    img_four : 1,
    array: [1, 2, 3, 4],
    view1: 'selection1',
    view2: 'selection1',
    view3: 'selection1',
    view4: 'selection1',
    trueSelect:0,
    // 选项是否被点击
    isSelect: false,
    answerJson:{"id":"","userSelect":"","trueSelect":"","userScore":0,"userHesitationTime":"",},
    userScore:0,//最终成绩
    userAccuracy:{"m":0,"s":0,"x":0,"sh":0,"u":0,"i":0,"a":0},//每个音节被正确选择的次数
  },
  view1Click: function(e) {
    var select = this.data.img_one;
    // 选项没被选择时将执行
    if (!this.data.isSelect||this.data.answerJson.userSelect !=select) {
      this.data.answerJson.userSelect = select;
      console.log(select);
      this.setData({
        isSelect: true,
        view1:'selection2',
        view2:'selection3',
        view3:'selection3',
        view4:'selection3',
      })
    } else{
      this.data.answerJson.userSelect = 0;
      this.setData({
        isSelect: false,
        view1:'selection3',
        view2:'selection3',
        view3:'selection3',
        view4:'selection3',
      })
    }
  },
  view2Click: function(e) {
    var select = this.data.img_two;
    // 选项没被选择时将执行
    if (!this.data.isSelect||this.data.answerJson.userSelect !=select) {
      this.data.answerJson.userSelect = select;
      console.log(select);
      this.setData({
        isSelect: true,
        view1:'selection3',
        view2:'selection2',
        view3:'selection3',
        view4:'selection3',
      })
    } else{
      this.data.answerJson.userSelect = 0;
      this.setData({
        isSelect: false,
        view1:'selection3',
        view2:'selection3',
        view3:'selection3',
        view4:'selection3',
      })
    }
  },
  view3Click: function(e) {
    var select = this.data.img_three;
    // 选项没被选择时将执行
    if (!this.data.isSelect||this.data.answerJson.userSelect !=select) {
      this.data.answerJson.userSelect = select;
      console.log(select);
      this.setData({
        isSelect: true,
        view1:'selection3',
        view2:'selection3',
        view3:'selection2',
        view4:'selection3',
      })
    } else{
      this.data.answerJson.userSelect = 0;
      this.setData({
        isSelect: false,
        view1:'selection3',
        view2:'selection3',
        view3:'selection3',
        view4:'selection3',
      })
    }
  },
  view4Click: function(e) {
    var select = this.data.img_four;
    // 选项没被选择时将执行
    if (!this.data.isSelect||this.data.answerJson.userSelect !=select) {
      this.data.answerJson.userSelect = select;
      console.log(select);
      this.setData({
        isSelect: true,
        view1:'selection3',
        view2:'selection3',
        view3:'selection3',
        view4:'selection2',
      })
    } else{
      this.data.answerJson.userSelect = 0;
      this.setData({
        isSelect: false,
        view1:'selection3',
        view2:'selection3',
        view3:'selection3',
        view4:'selection3',
      })
    }
  },
  onLoad:function(options){
    //读取缓存题号
    var count = wx.getStorageSync('count');
    var score = wx.getStorageSync('score');
    //读取各音节正确次数
    var userAccuracy = wx.getStorageSync('userAccuracy');
    //var countTone = wx.getStorageSync('countTone')
    console.log("score="+score);
    console.log("userAccuracy="+userAccuracy);
    //console.log("countTone="+countTone)
    if(count||score){
      this.setData({
      count:count,
      userScore:score,
      userAccuracy:userAccuracy,
      //countTone:countTone
    })
    console.log("赋值成功，score="+this.data.userScore)
    //console.log("赋值成功，countTone="+this.data.countTone)
    }
        //从shuffle算法生成的序列提取，count-1为音频数组对应序号
    var imageId = app.globalData.imageId;
    //获取音频编号
    var toneId = imageId[count-1];
    console.log("toneId"+toneId)
    if(toneId==undefined){
      toneId = imageId[1-1];
    }
    //实验 36全音测试 随机正确音频Id
    //初始化选项数组
    var imageChooseId = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,
      21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36];
    //随机正确选项位置
    var select = (Math.floor(Math.random()*4)+1)-1;
    var img = [0,0,0,0];
    console.log("toneid"+toneId)
    //删除选项数组中对应音素的id
    switch(toneId!=null){
      case toneId<=6:
        imageChooseId.splice(0,6);
        break;
      case (toneId<=11&&toneId>=7):
        imageChooseId.splice(6,5);
        break;
      case (toneId<=16&&toneId>=12):
        imageChooseId.splice(11,5);
        break;
      case (toneId<=21&&toneId>=17):
        imageChooseId.splice(16,5);
        break;
      case (toneId<=26&&toneId>=22):
        imageChooseId.splice(21,5);
        break;
      case (toneId<=31&&toneId>=27):
        imageChooseId.splice(26,5);  
        break;
      case (toneId<=36&&toneId>=32):
        imageChooseId.splice(31,5);
        break;
    
    }
    
    for (var i =0;i<4;i++){
      var r = Math.floor(Math.random()*(imageChooseId.length-i));
      img[i] = imageChooseId[r];
      //删除imageChoosez中对应数
      imageChooseId.splice(r,1);
    }
    

    //设置正确选项
    img[select]=toneId;
    this.setData({
      img_one : img[0],
      img_two : img[1],
      img_three : img[2],
      img_four : img[3]
    });

    // //获取音频地址
    // }
    var srcmic = 'http://localhost:8080/static/mic/'+app.globalData.micsrc+img[select]+'.wav';
    //var srcmic = 'https://baiyutut.top:8000/static/mic/'+app.globalData.micsrc+img[select]+'.wav';
    
    
    this.setData({
     srcMic:srcmic,
     trueSelect:img[select]
    })
    //设置正确答案，关联音频
    this.audioPlay();
    console.log(img[select]);
  },

 
  Next_question:function(){
    if(this.data.isSelect==false){
      wx.showToast({
        title: '您尚未选择',
        icon:'error',
        duration: 1500,
        mask:false,
      })
    }
    else{
      if (this.data.isClick) {
        return;
      }
      this.setData({
        isClick: true,
    })
    setTimeout(() => {
        this.setData({
            isClick: true,
        })
    }, 2000)

    //记录题号和选项，结果写入临时文件，并且是否选择正确
    var count = this.data.count+1;
    var score = this.data.userScore;
    //var countTone = this.data.countTone;
    this.data.answerJson.id = this.data.count;
    this.data.answerJson.trueSelect = this.data.trueSelect;
     //计算时间戳
     var pageDate = new Date();
     console.log("unLoadhideDate:"+pageDate);
     var date = pageDate.getTime()-this.data.userHesitationTime;
     this.setData({
       userHesitationTime:date,
     })
     console.log("onUnload:"+date);
    this.data.answerJson.userHesitationTime = this.data.userHesitationTime;
    if(this.data.answerJson.trueSelect==this.data.answerJson.userSelect){
      score=score+5;
      this.data.userScore = score;
      this.data.answerJson.userScore = score;
      //判断trueSelect属于哪个音节
      switch (true) {  
        case (this.data.answerJson.trueSelect >= 1 && this.data.answerJson.trueSelect <= 6):  
            this.data.userAccuracy.m += 1;  
            break;  
        case (this.data.answerJson.trueSelect >= 7 && this.data.answerJson.trueSelect <= 11):  
            this.data.userAccuracy.sh += 1;  
            break;  
        case (this.data.answerJson.trueSelect >= 12 && this.data.answerJson.trueSelect <= 16):  
            this.data.userAccuracy.x += 1;  
            break;  
        case (this.data.answerJson.trueSelect >= 17 && this.data.answerJson.trueSelect <= 21):  
            this.data.userAccuracy.s += 1;  
            break;  
        case (this.data.answerJson.trueSelect >= 22 && this.data.answerJson.trueSelect <= 26):  
            this.data.userAccuracy.u += 1;  
            break;  
        case (this.data.answerJson.trueSelect >= 27 && this.data.answerJson.trueSelect <= 31):  
            this.data.userAccuracy.a += 1;  
            break;  
        case (this.data.answerJson.trueSelect >= 32 && this.data.answerJson.trueSelect <= 36):  
            this.data.userAccuracy.i += 1;  
            break;  
    }  

    }
    var answerJson = JSON.stringify(this.data.answerJson);
    console.log(answerJson);
      
    let fsm = wx.getFileSystemManager();
    fsm.appendFile({
      filePath:wx.env.USER_DATA_PATH+'/'+app.globalData.userRandomNumber+'.txt',
      data:answerJson,
      encoding:"utf-8",
      success:res=>{
        console.info(res)
      },
      fail:res=>{
        console.info(res)
      }
    })


    

    console.log(this.data.answerJson);
    console.log('当前count：'+this.data.count),
    //console.log('当前countTone：'+this.data.countTone),
    // app.globalData.click++;
    // console.log(app.globalData.click);
    wx.setStorageSync('count',count);
    wx.setStorageSync('score',score);
    wx.setStorageSync('userAccuracy', this.data.userAccuracy);
    //wx.setStorageSync('countTone', countTone)
    //判断题数是否足够
    if(count==37){
      //关闭当前页面，将文件传入后端
      this.upload();
      console.log("最终成绩："+score);
      //删除本地缓存
      wx.removeStorageSync('count');
      wx.removeStorageSync('score');
      //wx.removeStorageSync('userAccuracy');
      //wx.removeStorageSync('countTone')
      wx.redirectTo({
        url: '/pages/userResult/userResult?userScore='+score,
      })
      
    }else{
      wx.redirectTo({
      url: '/pages/index/index',
    })
    }
    

    }
    
  },
  yuyinPlay: function (e) {
    //创建内部 audio 上下文 InnerAudioContext 对象。
    innerAudioContext.autoplay=true;
    innerAudioContext.onError(function (res) {
    })
    if ((this.data.srcMic == '') || (this.data.srcMic == undefined)) {
      console.log('地址错误');
      return;
    }

    innerAudioContext.src = this.data.srcMic; //设置音频地址that.data.srcMic,应为相对路径
    setTimeout(()=>{
    innerAudioContext.play(); //播放音频
  },150)
  
  },
  //播放
  audioPlay() {
    setTimeout(()=>{
      this.yuyinPlay();
    this.setData({
      isPlay: true
    })
    },50)
    
  },
  // 暂停播放
  audioPause() {
    this.setData({
      isPlay: false
    })
    innerAudioContext.pause();//暂停音频 

  },
  // 结束语音
  end: function (e) {
    let that = this
    if ((that.data.src) || (that.data.src != undefined)) return
    innerAudioContext.pause();//暂停音频 
  },

  //上传文件
  upload:function(){
    wx.uploadFile({
      filePath: wx.env.USER_DATA_PATH+'/'+app.globalData.userRandomNumber+'.txt',
      name: 'file',
      //url: 'https://baiyutut.top:8000/RapidUploadFile/',
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

    //监听页面停留时长
  onShow: function(){
    //isClick作为是否刷新标记
    //开始时间戳
    // if(this.data.isClick == false){
    //   var pageOnShowDate = new Date();
    //   var date = pageOnShowDate.getTime();
    //   console.log("onShow:"+date);
    //   return date
    // } else {
    //   return 0;
    // }
    var pageOnShowDate = new Date();
    var date = pageOnShowDate.getTime();
    this.setData({
      userHesitationTime:date,
    })
    console.log("onShow:"+date);

  },

 onHide: function () {
    this.end();//结束音频
    //计算时间戳
    var pageDate = new Date();
    console.log("hidehideDate:"+pageDate);
    var date = pageDate.getTime()
    date = date-this.data.userHesitationTime;
    this.setData({
      userHesitationTime:date,
    })
    console.log("onHide:"+date);
  },
  
  onUnload: function () {
    this.end();//结束音频
    //计算时间戳
   
  },



  //监听左上角返回事件
  btnReturn:function(){
    this.end();//结束音频
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
