// pages/noiseTest.js
// index.js
// 获取应用实例
const app = getApp()
const innerAudioContext = wx.createInnerAudioContext();
Page({
  data: {
    
    dBHL:[-10, -8,-6,-4,-2,0,2,4,6,8,10],
    testDBHL:-10,
    userChoose:[0,0,0,0,0,0,
      0,0,0,0,0,0,
      0,0,0,0,0,0,
      0,0,0,0,0,0,
      0,0,0,0,0,0,
      0,0,0,0,0,0,],//测试者每个字的声强数据
    userChooseER:[0,0],//测试者该字是否超出-10或10时的标记
    testSNR:-10,//当前测试的声强
    SelectDisable: 'none',//直到选择听清了才可以进行选择，此之前不能点击选项和下一题
    SelectDisable_SNR:null,

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
    answerJson:{"userSelectSex":"","noiseType":"","SNR":"","id":"","userSelect":"","trueSelect":"","userScore":0,"userHesitationTime":"",},
    userScore:0,//最终成绩
    userAccuracy:{"m":0,"s":0,"x":0,"sh":0,"u":0,"i":0,"a":0},//每个音节被正确选择的次数
    userSNRCount:{"m":0,"s":0,"x":0,"sh":0,"u":0,"i":0,"a":0},//每个音节累计的信噪比
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
    var userSNRCount = wx.getStorageSync('userSNRCount');
    //读取信噪比记录
    var userChoose = wx.getStorageSync('userChoose');
    //var countTone = wx.getStorageSync('countTone')
    console.log("score="+score);
    console.log("userAccuracy="+userAccuracy);
    console.log("userSNRCount="+userSNRCount);
    //console.log("countTone="+countTone)
    if(count||score){
      this.setData({
      count:count,
      userScore:score,
      userAccuracy:userAccuracy,
      userSNRCount:userSNRCount,
      //countTone:countTone      
      userChoose:userChoose,
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
    //从-10开始生成
    this.newNoiseSNR();
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


    
    
    //记录题号和选项，以及用户选择的参数、最终的信噪比，结果写入临时文件，（是否选择正确）
    var count = this.data.count+1;
    var score = this.data.userScore;
    //var countTone = this.data.countTone;
    this.data.answerJson.id = this.data.count;
    this.data.answerJson.trueSelect = this.data.trueSelect;
    this.data.answerJson.userSelectSex = app.globalData.sex;
    this.data.answerJson.noiseType = app.globalData.noise;
    this.data.answerJson.SNR = this.data.testSNR;
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
            this.data.userAccuracy.m += 1;this.data.userSNRCount.m  +=this.data.testSNR;  
            break;  
        case (this.data.answerJson.trueSelect >= 7 && this.data.answerJson.trueSelect <= 11):  
            this.data.userAccuracy.sh += 1;   this.data.userSNRCount.sh  +=this.data.testSNR;
            break;  
        case (this.data.answerJson.trueSelect >= 12 && this.data.answerJson.trueSelect <= 16):  
            this.data.userAccuracy.x += 1;   this.data.userSNRCount.x  +=this.data.testSNR;
            break;  
        case (this.data.answerJson.trueSelect >= 17 && this.data.answerJson.trueSelect <= 21):  
            this.data.userAccuracy.s += 1;   this.data.userSNRCount.s +=this.data.testSNR;
            break;  
        case (this.data.answerJson.trueSelect >= 22 && this.data.answerJson.trueSelect <= 26):  
            this.data.userAccuracy.u += 1;   this.data.userSNRCount.u  +=this.data.testSNR;
            break;  
        case (this.data.answerJson.trueSelect >= 27 && this.data.answerJson.trueSelect <= 31):  
            this.data.userAccuracy.a += 1;   this.data.userSNRCount.a  +=this.data.testSNR;
            break;  
        case (this.data.answerJson.trueSelect >= 32 && this.data.answerJson.trueSelect <= 36):  
            this.data.userAccuracy.i += 1;   this.data.userSNRCount.i  +=this.data.testSNR;
            break;  
    }  

    }
    var answerJson = JSON.stringify(this.data.answerJson);
    console.log(answerJson);
    //还原SNR和界面参数
    this.setData({
      testSNR:-10,
      SelectDisable:'none',
      SelectDisable_SNR:null,
    });
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
    wx.setStorageSync('userSNRCount', this.data.userSNRCount);
    //wx.setStorageSync('countTone', countTone)
    //判断题数是否足够
    if(count>=37){
      //关闭当前页面，将文件传入后端
      this.upload();
      console.log("最终成绩："+score);
      //删除本地缓存
      wx.removeStorageSync('userChoose');
      wx.removeStorageSync('score');
      //wx.removeStorageSync('userAccuracy');
      //wx.removeStorageSync('countTone')
      wx.redirectTo({
        url: '/pages/noiseResult/noiseResult?userScore='+score,
      })
      
    }else{
      wx.redirectTo({
      url: '/pages/noiseTest/noiseTest',
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

     // 在音频地址后加上时间戳，避免缓存
    // innerAudioContext.src = this.data.srcMic+ '?timestamp=' + new Date().getTime();; //设置音频地址that.data.srcMic,应为相对路径
    const srcWithTimestamp = this.data.srcMic + '?timestamp=' + new Date().getTime();
    innerAudioContext.src = srcWithTimestamp; // 设置带时间戳的音频地址
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

  test_audioPause() {
    // this.setData({
    //   isPlay: false
    // })
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

  yes_question:function(){
    
    //暂停播放
    this.test_audioPause();
    //记录当前信噪比
    var id = this.data.trueSelect-1;
    var userChoose = this.data.userChoose || [];
    userChoose[id] = this.data.testSNR;
    wx.setStorageSync('userChoose', userChoose);
    //显示单选界面
    this.setData({
      SelectDisable:null,
      SelectDisable_SNR:'none',
    });
    this.audioPlay();

    
  },

  no_question:function(){
     //暂停播放
     this.test_audioPause();
    //判定是否达到最低的10
    if(this.data.testSNR<10){
      //未达到，继续增加2，生成音频并且播放
      var testSNR = this.data.testSNR+2;
      this.setData({
        testSNR:testSNR,
      })
      //生成音频
      this.newNoiseSNR();
      console.log('当次音频已生成!')
      this.setData({
        srcMic:'http://localhost:8080/static/mic/'+app.globalData.micsrc+this.data.trueSelect+'.wav'+ '?timestamp=' + new Date().getTime(),
      })
      this.audioPlay();


    }
    else{
      //已经达到，提示已经达到，倾听纯净音频
      wx.showToast({
        title: '已到最大信噪比',
        icon:'error',
        duration: 1500,
        mask:false,
      })
      //记录
    //显示单选界面
    this.setData({
      SelectDisable:null,
      SelectDisable_SNR:'none',
      testSNR:12,
    });
    //再播放一次纯净音频
    this.setData({
      srcMic:'http://localhost:8080/static/mic/'+app.globalData.sex+'/young/0/'+this.data.trueSelect+'.wav',
    })
      this.audioPlay();
    
    }
    
    
  },

//获取当前测试信噪比，实时生成音频 noise和sex存储在app中
  newNoiseSNR:function(){
    console.log('app.globalData.sex='+app.globalData.sex);
    var sex = app.globalData.sex;
    var noise = app.globalData.noise;
    var id = this.data.trueSelect;
    var SNR = this.data.testSNR;
    var newNoiseSetJSON = {
      'sex':sex,
      'noise':noise,
      'id':id,
      'SNR':SNR,
    };
    console.log('newNoiseJSON='+JSON.stringify(newNoiseSetJSON));
    wx.request({
      url: 'http://localhost:8080/RpaidGetNoise/',
      //url: 'https://baiyutut.top:8000/Rapid7ToneDetermination/',
      method:'POST',
      header:{
        "content-type": "application/json",
        'Cache-Control': 'no-cache',  // 不使用缓存
      },
      data:{
        newNoiseSetJSON:newNoiseSetJSON,
      },
      success:res=>{
        console.log("传输："+JSON.stringify(newNoiseSetJSON));
        
        if (res.statusCode === 200) {
          wx.showToast({
            title: '传输成功！',
            icon: 'success',
            duration: 1500
          });
  
          // 启动任务状态轮询
          this.pollTaskStatus(res.data.task_id);
        } else {
          wx.showToast({
            title: '传输失败！',
            icon: 'none',
            duration: 1500
          });
          console.error(res);
        }
      },
      fail: err => {
        wx.showToast({
          title: '请求失败！',
          icon: 'none',
          duration: 1500
        });
        console.error(err);
      }
    });
  },
    
  pollTaskStatus: function (taskId) {
    const self = this;
    const maxRetries = 10;  // 设置最大重试次数
    let retries = 0;
  
    // 每 2 秒查询一次任务状态
    const intervalId = setInterval(function () {
      if (retries >= maxRetries) {
        clearInterval(intervalId);
        wx.showToast({
          title: '任务超时，请重试',
          icon: 'none',
          duration: 1500
        });
        return;
      }
  
      wx.request({
        url: `http://localhost:8080/check_task_status/${taskId}/`,  // 后端查询接口URL
        method: 'GET',
        header: {
          'Cache-Control': 'no-cache',  // 不使用缓存
        },
        success: res => {
          if (res.statusCode === 200) {
            const status = res.data.status;
  
            // 显示任务状态
            console.log('任务状态：', status);
            self.setData({
              taskStatus: status
            });
  
            // 如果任务完成，停止轮询并播放音频
            if (status === 'Completed') {
              
              clearInterval(intervalId);
              // 任务完成后，获取音频文件路径
              var src = res.data.audioUrl;  // 后端返回音频URL（或者路径）
              console.log('音频url：'+src);
  
            } else if (status.includes('Failed')) {
              clearInterval(intervalId);
              wx.showToast({
                title: '获取失败，请重试',
                icon: 'none',
                duration: 1500
              });
            }
          } else {
            console.error('查询任务状态失败:', res);
          }
        },
        fail: err => {
          console.error('请求失败:', err);
        }
      });
  
      retries++;
    }, 2000);  // 每 2 秒检查一次任务状态
  },

   checkTaskStatus:function(taskId) {
    const intervalId = setInterval(() => {
      fetch(`/check_task_status/${taskId}/`)
        .then(response => response.json())
        .then(data => {
          console.log('Task Status:', data.status);
          if (data.status === 'Completed') {
            clearInterval(intervalId);  // 停止轮询
            alert('Task completed!');
          }
        });
    }, 2000);  // 每 2 秒检查一次任务状态
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
          wx.removeStorageSync('userAccury');
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
