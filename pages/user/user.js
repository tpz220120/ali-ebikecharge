var app = getApp();

Page({
  data: {
    user:'',
    account_num:'0',
    dqcd_num:'0',
    bindPhone:'',
    sfbd:'',
    sfxsbd:'',
  },
  onLoad() {
    this.getUserInfo();
  },

  onShow() {
    if(app.globalData.sessionid != null){
        my.httpRequest({
        url: app.httpUrl + '/ebike-charge/aliPayXcx/initUser.x', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
        data: {
          sessionid: app.globalData.sessionid
        },
        success: (re) => {
          // 授权成功并且服务器端登录成功
          this.setData({
            account_num: re.data.account_num,
            dqcd_num:re.data.dqcd_num,
            bindPhone:re.data.bindPhone,
            sfbd:re.data.sfbd,
          });
        },
        fail: () => {
        },
      });
    }
  },

  getUserInfo:function(){
    my.getAuthCode({
        scopes: ['auth_user'],
        success: res => {
          console.info(res.authCode);
          if (res.authCode) {
            my.getAuthUserInfo({
              success: (res) => {
                my.hideLoading();
                var p = {
                  nickName:res.nickName,//获取的用户昵称
                  avatar:res.avatar,//获取的用户头像图片
                }
              
                this.setData({
                  user:p,
                  sfxsbd:'1'
                })
              }
            })
          }
        },
        fail: () => {
          console.log('用户授权失败！');
        },
      });
  },
  handleListItemTap(e) {
    var i = e.currentTarget.dataset.index;
    console.log(i);
    if(i ==2){
      my.navigateTo({ url: 'user-cdjl/user-cdjl' });
    }else if(i ==0){
      my.navigateTo({ url: 'cz/cz' });
    }else if(i ==1){
      my.navigateTo({ url: 'xfjl/xfjl' });
    }else if(i ==3){
      my.navigateTo({ url: 'hiscd/hiscd' });
    }else if(i ==4){
      my.navigateTo({ url: 'about/about' });
    }else if(i ==5){
      my.navigateTo({ url: '../tsjy/tsjy' });
    }else{
      my.alert({
        title:'此功能暂未开放！',
      })
    }
  },

  bindPhone(e) {
    console.log(this.data.bindPhone);
    my.navigateTo({ url: 'bindphone/bindphone?phone=' + this.data.bindPhone});
  },
});
