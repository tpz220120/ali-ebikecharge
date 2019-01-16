var app =getApp();
Page({
   
onShow() {
    var that = this;
    my.showLoading();
    app.getSessionId().then(function(sessionid){
      my.httpRequest({
        url: app.httpUrl + '/ebike-charge/workOrder/initTsjy.x', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
        data: {
          sessionid: sessionid
        },
        success: (re) => {
          // 授权成功并且服务器端登录成功
          my.hideLoading();
          that.setData({
            tsjyList: re.data.tsjyList,
            tcount:re.data.tcount,
            userid:re.data.userid,
          });       
        },
        fail: () => {
          my.hideLoading();
        },
      });
    })
  },

  tsjy(e){
      my.navigateTo({
          url:'newtsjy/newtsjy?userid=' + this.data.userid
      });
  },
  tsjymx(e){
    console.log(e);
      my.navigateTo({
          url:'tsjymx/tsjymx?id=' + e.currentTarget.dataset.tsjyid + "&tsjg=" + e.currentTarget.dataset.tsjyjg
      });
  }
});
