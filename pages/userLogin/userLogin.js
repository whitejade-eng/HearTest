// pages/userManagement/userManagement.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled:true,
    HearLoss:false,
    userRandomNumber:'',
    userName:'',
    userAge:'',
    userSex:'male',
    userLossTime:'',
    userLEar:'无',
    userREar:'无',
    array:['无','人工耳蜗','助听器'],
    index1:0,
    index2:0,
    userListenTest:'',
    micsrc:'',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function(options) {
    // var imageId = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,
    //   21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36];
    // var Id_shuffle=this.shuffle(imageId)
    // app.globalData.imageId = Id_shuffle;
    // console.log(Id_shuffle);
    console.log(new Date().toLocaleDateString());
    this.setData({
      isTipTrue:true
    })
    this.setData({
      userRandomNumber:this.randomNumber(),
    })
    console.log(this.data.userRandomNumber);
  },

  randomNumber:function(){
    var nowTime = new Date();
    let month = nowTime.getMonth()+1;
    let day = nowTime.getDate();
    let hours = nowTime.getHours();
    let minutes = nowTime.getMinutes();
    let seconds = nowTime.getSeconds();
    month = this.setTimeDateFmt(month);
    day = this.setTimeDateFmt(day);
    hours = this.setTimeDateFmt(hours);
    minutes = this.setTimeDateFmt(minutes);
    seconds = this.setTimeDateFmt(seconds);
    let orderCode = nowTime.getFullYear().toString() + month.toString() + day + hours + minutes + seconds + (Math.round(Math.random() *1000000)).toString();
    console.log(orderCode);
    return orderCode;
  },
  
  tipAgree:function(){
    this.setData({
      isTipTrue:false
    })
 },

  setTimeDateFmt:function(s){
    // 个位数补齐十位数
    return s < 10 ? '0' + s : s;  
  },

  //使用随机算法  Fisher-Yates 洗牌算法-经典 shuffle 算法 生成题目序列
  shuffle:function(arr){
    var res = [];
    let tempArr = arr.slice();//复制原数组
    while (tempArr.length > 0) {
      const index = Math.floor(Math.random() * tempArr.length);
      const [current] = tempArr.splice(index, 1);
      res.push(current);
    }
    return res;
  },

  //性别选择
  radioChange1:function(e){
    var sex = e.detail.value;
    this.setData({
      userSex:sex,
    })
    console.log('选择性别：'+sex)

  },

    //test项目选择
    radioChange2:function(e){
      var test = e.detail.value;
      this.setData({
        userListenTest:test,
      })
      console.log('选择测试项目：'+test)
  
    },

  //听损选择
  radioChange3:function(e){
    var hearloss = e.detail.value;
    if(hearloss=='true'){
      this.setData({
      HearLoss:true,
    })
    }else{
      this.setData({
        HearLoss:false,
      })
    }
    console.log('选择听损：'+hearloss)

  },
  

  //左耳佩戴
  bindPickerChange3:function(e){
    var pickIndex = e.detail.value;
    console.log('佩戴：',pickIndex)
    this.setData({
      index1:pickIndex,
      userLEar:this.data.array[pickIndex]
    })
    
  },

  //右耳佩戴
  bindPickerChange4:function(e){
    var pickIndex = e.detail.value;
    console.log('佩戴：',pickIndex)
    this.setData({
      index2:pickIndex,
      userREar:this.data.array[pickIndex]
    })
    
  },

  btnFormSubmit:function(e){
    var that = this;
    //获取输入数据
    var userName = e.detail.value.userName;
    var userSex = that.data.userSex;
    var userAge = e.detail.value.userAge;
    var HearLoss = that.data.HearLoss;
    var userLossTime = e.detail.value.userLossTime;
    var userLEar = e.detail.value.userLEar;
    var userREar = e.detail.value.userREar;
    var userListenTest = that.data.userListenTest;
    //检测是否全部输入，否则提示有未输入项
    if (userName == '') {
      wx.showToast({  
        title: '名字不能为空',
        icon: "none"
      })
      return;
    } else if(userSex == ''){
      wx.showToast({
        title: '性别不能为空',
        icon: "none"
      })
      return;
    } else if (userAge == '') {
      wx.showToast({
        title: '年龄不能为空',
        icon: "none"
      })
      return;
    }  else if(userLossTime == ''){
      wx.showToast({
        title: '听力损失时间不能为空',
        icon: "none"
      })
      return;

    }  else if (userLEar == '') {
      wx.showToast({
        title: '左耳听损不能为空',
        icon: "none"
      })
      return;
    }  else if (userREar == '') {
      wx.showToast({
        title: '右耳听损不能为空',
        icon: "none"
      })
      return;
    }  else if (userListenTest == '') {
      wx.showToast({
        title: '发音人年龄不能为空',
        icon: "none"
      })
      return;
    } 
    //全部输入，提交json数组
    var userJson = {
    'userRandomNumber':this.data.userRandomNumber,  
    'userName':userName,
    'userAge':userAge,
    'userSex':userSex,
    'HearLoss':HearLoss,
    'userLossTime':userLossTime,
    'userLEar':{'Ear':userLEar,'Aid':that.data.userLEar},
    'userREar':{'Ear':userREar,'Aid':that.data.userREar},
    };
    var userChoose ={
    'userListenTest':userListenTest,
    }
    console.log('userjson:'+JSON.stringify(userJson));
    console.log('userChoose:'+JSON.stringify(userChoose));
    //连接到服务器
    console.log("尝试连接服务器");
    wx.request({
      url: 'http://localhost:8080/Rapid7ToneDetermination/',
      // url: 'http://localhost:8080/Rapid7ToneDetermination/',
      //url: 'https://baiyutut.top:8000/Rapid7ToneDetermination/',
      method:'POST',
      header:{
        "content-type": "application/x-www-form-urlencoded"
      },
      data:{
        userJson:JSON.stringify(userJson),
        userChoose:JSON.stringify(userChoose),
      },
      success:res=>{
        console.log("传输："+userJson+userChoose);
        
        if(res.statusCode==0){
          wx.showToast({
            title: '填写失败！',
            icon:  'loading',
            duration:1500
          })
          console.log(res);
          return ;
        } else {
          wx.showToast({
            title: '填写成功！',
            icon:  'success',
            duration:1500
          })

        }
      },
    })
    //拼接音频文件地址
    if(userListenTest == 'seven'){
      var micsrc = 'seven/'
    }
    else if(userListenTest == 'pure'){
      micsrc = 'pure/'
    }
    else if(userListenTest == 'noise'){
      micsrc = 'noise/'
    }

    console.log('micsrc='+micsrc);
    app.globalData.micsrc = micsrc;
    app.globalData.userRandomNumber = this.data.userRandomNumber;

    //开始测试，创建临时文件
    let fsm = wx.getFileSystemManager();
    fsm.writeFile({
      filePath:wx.env.USER_DATA_PATH+'/'+this.data.userRandomNumber+'.txt',
      data:JSON.stringify(userJson)+'\n'+JSON.stringify(userChoose)+'\n',
      encoding:"utf-8",
      success: res => {

        console.info(res)
    
      },
    
      fail: res => {
    
        console.info(res)
    
      }

    });
    if(userListenTest == 'seven'){
      var imageId = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,
      21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36];
      var Id_shuffle=this.shuffle(imageId)
      app.globalData.imageId = Id_shuffle;
      console.log(Id_shuffle);
      wx.redirectTo({
        url: '/pages/index/index',
      });
    }
    else if(userListenTest == 'noise'){
      var imageId = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,
      21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36];
      var Id_shuffle=this.shuffle(imageId)
      app.globalData.imageId = Id_shuffle;
      console.log(Id_shuffle);
      wx.redirectTo({
        url: '/pages/noiseType/noiseType',
      });
    }
    else {
      wx.redirectTo({
        url: '/pages/pure/pure',
      });
    }
    
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
  }
})