// pages/template/navigation-bar/navigation-bar.js
const app = getApp()
Component({
    properties: {
        // defaultData（父页面传递的数据）
        defaultData: {
            type: Object,
            value: {
                title: "我是默认标题"
            },
            observer: function (newVal, oldVal) {}
        }
    },
    data: {
        navBarHeight: app.globalData.navBarHeight,
        menuRight: app.globalData.menuRight,
        menuTop: app.globalData.menuTop,
        menuHeight: app.globalData.menuHeight,
        menuBottom:app.globalData.menuBottom,
    },
    attached: function () {

    },
    methods: {
      ListenReturn(){
        const myEventDetail = {} // detail对象，提供给事件监听函数
        this.triggerEvent("run", myEventDetail)
        //第一个参数，就是给这个事件起个名字，要在组件的bind后面用，第二个参数是传入数据，还有第三个参数等
    }
  }
})