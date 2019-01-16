var app =getApp();

Page({
  data: {
      month:'',
      wdqjl:'',
      czList:[],
  },
  onLoad() {
   
  },

  onShow(){
     var t = new Date();
    var year = t.getFullYear();
    var month  = t.getMonth() + 1;
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    var current = year + "-" + month;
    this.setData({
      month: current
    });  
       my.httpRequest({
        url: app.httpUrl + '/ebike-charge/xcxUserCenter/getHisCz.x', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
        data: {
          sessionid: app.globalData.sessionid,
          month:this.data.month
        },
        success: (re) => {
          // 授权成功并且服务器端登录成功
          this.setData({
            wdqjl: re.data.wdqjl,
            czList:re.data.czList,
          });        
        },
        fail: () => {
        },
      });
  },

  getM(){
    var t = new Date();
    var year = t.getFullYear();
    var month  = t.getMonth() + 1;
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    var current = year + "-" + month;
    var start = (year - 1) + "-01";
    my.datePicker({
        format: 'yyyy-MM',
        currentDate: current,
        startDate: start,
        endDate: current,
        success: (res) => {
          this.setData({
            month: res.date
          });

          my.httpRequest({
            url: app.httpUrl + '/ebike-charge/xcxUserCenter/getHisCz.x', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
            data: {
              sessionid: app.globalData.sessionid,
              month:res.date
            },
            success: (re) => {
              // 授权成功并且服务器端登录成功
              this.setData({
                wdqjl: re.data.wdqjl,
                czList:re.data.czList,
              });        
            },
            fail: () => {
            },
          });  
        },
    });
  }
});
