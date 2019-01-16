App({
  codeid:'',
  //httpUrl:'https://xcx.ebike-charge.com',//生产
  httpUrl:'https://xcxbeta.ebike-charge.com',//测试
  globalData: {
    hasLogin: false,
    apiW:0,
    apiH:0,
    authCode:null,
    sessionid:null,
  },
  onLaunch(options) {
    //console.log('App Launch', options);
    //console.log('getSystemInfoSync', my.getSystemInfoSync());
    //console.log('SDKVersion', my.SDKVersion);
    
    my.getSystemInfo({
      success: (res) => {
        this.globalData.apiW = res.windowWidth;
        this.globalData.apiH = res.windowHeight - 40;
      }
    })

    //静默授权获取用户的userid
    if(this.globalData.authCode == null){
      my.getAuthCode({
            scopes: ['auth_user','auth_base'],
            success: res => {
              console.info('静默授权code==' + res.authCode);
              this.globalData.authCode = res.authCode;
              if (res.authCode) {
                // 认证成功
                // 调用自己的服务端接口，让服务端进行后端的授权认证，并且种session，需要解决跨域问题
                my.httpRequest({
                  url: this.httpUrl + '/ebike-charge/aliPayXcx/getXcxMsg.x', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
                  data: {
                    code: res.authCode
                  },
                  success: (re) => {
                    // 授权成功并且服务器端登录成功
                    this.globalData.sessionid = re.data.sessionid;     
                    console.log(this.globalData.sessionid);   
                  },
                });
              }
            },
          });
    }

    //获取关联普通二维码的码值，放到全局变量qrCode中
    if (options.query && options.query.qrCode) {
      var wx ='0';
      var qrCode = options.query.qrCode;
      if(qrCode.split('?').length < 2){
        wx = '1';
      }
      var cs = qrCode.split('?')[1];

      if(cs.split('&')[0].split('=').length < 2){
        wx = '1';
      }
      var name = cs.split('&')[0].split('=')[0];
      var codeid = cs.split('&')[0].split('=')[1];

      if(name != 'cdczno'){
        wx = '1';
      }
      this.codeid = codeid;

      // 二维码不在有效范围内
      if(wx == '1'){
        my.navigateTo({ url: '../tipview/cdview/cdview?status=wx'});
      }

      // 根据充电插座获取插座状态，如果
      my.httpRequest({
          url: this.httpUrl + '/ebike-charge/aliPayXcx/getCzgk.x', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
          data: {
            cdczno: codeid
          },
          success: (re) => {
            // 插座不是空闲，跳转到提示页面
            if(re.data.status != '0'){
                // 跳转到提示页面
              my.navigateTo({ url: '../tipview/cdview/cdview?status=' + re.data.status});
            }      
          },
          fail: () => {
            reject({});
          },
        });
    }
  },

  getSessionId() {
    return new Promise((resolve, reject) => {
      if (this.globalData.sessionid != null){
          console.log(this.globalData.sessionid);
          resolve(this.globalData.sessionid);
      }else{
          console.info('app.getSessionId静默授权code==' + this.globalData.authCode);
          if (this.globalData.authCode) {
            // 认证成功
            // 调用自己的服务端接口，让服务端进行后端的授权认证，并且种session，需要解决跨域问题
            my.httpRequest({
              url: this.httpUrl + '/ebike-charge/aliPayXcx/getXcxMsg.x', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
              data: {
                code: this.globalData.authCode
              },
              success: (re) => {
                // 授权成功并且服务器端登录成功
                this.globalData.sessionid = re.data.sessionid; 
                resolve(re.data.sessionid);            
              },
            });
          }else{
            //静默授权获取用户的userid
            my.getAuthCode({
              scopes: ['auth_user','auth_base'],
              success: res => {
                console.info('静默重新授权code==' + res.authCode);
                this.globalData.authCode = res.authCode;
                if (res.authCode) {
                  // 认证成功
                  // 调用自己的服务端接口，让服务端进行后端的授权认证，并且种session，需要解决跨域问题
                  my.httpRequest({
                    url: this.httpUrl + '/ebike-charge/aliPayXcx/getXcxMsg.x', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
                    data: {
                      code: res.authCode
                    },
                    success: (re) => {
                      // 授权成功并且服务器端登录成功
                      this.globalData.sessionid = re.data.sessionid;     
                      console.log(this.globalData.sessionid); 

                      resolve(re.data.sessionid);  
                    },
                  });
                }
              },
            });
          }       
      }
    });
  },
});
