var app =getApp();

Page({
  data: {
    glbz1:'',
    glbz2:'',
    glbz3:'',
    glbz4:'',
    check:0,//金额框选中标志
    zfje:'',//支付金额显示
    flag:0,//计费模版弹出窗口显示余额支付还是支付宝支付的标志，1为弹出，0为关闭
    sfmzf:'2',//是否免是否 1为免支付，0为计费支付，2为默认初始值
    pluginfo:{},
    stationinfo:{},
    account:0,//账户余额
    radiov:'1',
    yechecked:false,
    alichecked:true,
    mincharge:0,
    yebzzf:'',
  },
  onLoad(option) {
    var id;
    // 如果是外面扫码那么判断是否有全局变量的扫码id在
    if(app.codeid != ''){
      id = app.codeid;
      app.codeid = '';
    }else{
      id = option.id;
    }

    // 此id为充电插座编号
    if(app.globalData.sessionid == null){
        var that = this;
        app.getSessionId().then(function(sessionid){
          console.log(sessionid);
          that.showPlugMsg(id,sessionid);
        });
    }else{
        this.showPlugMsg(id,app.globalData.sessionid);
    } 
  },

  innum(e){
    var v = e.currentTarget.dataset.v;
    this.setData({
      check:v,
      zfje:v,
    })
  },

  ljzf(e){
    // 最低消费
    if(parseFloat(this.data.zfje) < parseFloat(this.data.mincharge)){
        my.alert({title:'亲',content:'最低消费金额为' + this.data.mincharge + '元！'})
        return;
    }

    // 金额不对
    if(parseFloat(this.data.zfje) >=9999){
        my.alert({title:'亲',content:'请输入正确的支付金额！'})
        return;
    }

    // 如果账户有余额，那么余额支付，否则支付宝支付
    if(parseFloat(this.data.account) >= parseFloat(this.data.zfje)){
        this.setData({
          radiov:0,
          yechecked:true,
          alichecked:false,
        })
    }else{
        this.setData({
          radiov:1,
          yechecked:false,
          alichecked:true,
        })
    }
    this.setData({
      flag:1
    })
  },

  mfcd(){
    var cdczno = this.data.pluginfo.chargeplugNo;
    var sessionid = app.globalData.sessionid;

    my.httpRequest({
        url: app.httpUrl + '/ebike-charge/aliPayXcx/startMfcd.x', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
        data: {
          cdczno:cdczno,
          sessionid:sessionid,
        },
        success: (re) => {
            if(re.data.status == '1'){
              // 跳转到充电信息页面
              my.redirectTo({ url: '../cdxx/cdxx?id=' + cdczno});
            }else{
              // 跳转到提示页面
              my.navigateTo({ url: '../tipview/cdview/cdview?status=' + re.data.status});
            }
          
        },
        fail: () => {
        },
    });
  },

  bindKeyInput(e){
    this.setData({
      zfje: e.detail.value,
    });
  },

  back(e){
    this.setData({
      yebzzf:'',
      flag:0
    })
  },

  showPlugMsg:function(cdczno,sessionid){
    // 根据充电插座获取电站以及计费信息
    my.httpRequest({
        url: app.httpUrl + '/ebike-charge/aliPayXcx/getCdzfDetail.x', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
        data: {
          cdczno:cdczno,
          sessionid:sessionid,
        },
        success: (re) => {
          if(re.data != null){
              var sfmzf;
              if(re.data.sfmzf){
                  sfmzf = '1';
              }else{
                  sfmzf = '0';
              }
             
              var pluginfo = re.data.pluginfo;//插座信息
              var stinfo = re.data.stationinfo;//充电站信息
              if(pluginfo != null){
                  this.setData({
                      pluginfo:pluginfo,
                  });
              }

              if(stinfo != null){
                  this.setData({
                      stationinfo:stinfo,
                      glbz1:'0<功率≤' + stinfo.stepPower1 + 'W',
                      glbz2:stinfo.stepPower1 + '<功率≤'+ stinfo.stepPower2 + 'W',
                      glbz3:stinfo.stepPower2 + '<功率≤'+ stinfo.stepPower3 + 'W',
                      glbz4:'功率>' + stinfo.stepPower3  + 'W',
                  });
              }      
              this.setData({
                  sfmzf:sfmzf,
                  account:re.data.account,
                  mincharge:re.data.stationinfo.minCharge
              });
          }
        },
        fail: () => {
        },
    });
  },

  radioChange: function(e) {
    this.setData({
      yebzzf:''
    })
    this.setData({
        radiov:e.detail.value // 选中框的值
    });
  },

  qrzf(e){
    console.log(this.data.radiov);
    var cdczno = this.data.pluginfo.chargeplugNo;
    // 余额支付
    if(this.data.radiov == '0'){
      //余额支付的时候余额必须大于支付金额，否则提示
      if(parseFloat(this.data.account) < parseFloat(this.data.zfje)){
          this.setData({
            yebzzf:'不足以支付！'
          })

          return;
      }
       my.httpRequest({
          url: app.httpUrl + '/ebike-charge/pay/goAliYezf.x', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
          data: {
            sessionid:app.globalData.sessionid,
            zfje:this.data.zfje,
            orgno:this.data.pluginfo.subburo,         
            cdczno:cdczno,
          },
          success: (re) => {
            console.log("余额支付！状态为：" + re.data.status);
            //根据插座状态跳转页面
            // 跳转到充电信息页面
            if(re.data.status == '0'){
                my.redirectTo({ url: '../cdxx/cdxx?id=' + cdczno});
            //订单生成失败，原因见回传信息
            }else if(re.data.status == '10'){
              my.alert({
                  title:'充电失败',
                  content:re.data.msg,
              })
            //无效的插座
            }else{
              // 跳转到提示页面
              my.navigateTo({ url: '../tipview/cdview/cdview?status=' + re.data.status});
            }
          },
          fail: () => {
          },
      });
    }else{
      console.log(app.globalData.sessionid)
        if(app.globalData.sessionid == null){
            my.alert({
              title: '亲',
              content: '您必须授权才能支付，请重新扫码！',
              buttonText: '我知道了'
            });
        }else{      
          my.httpRequest({
            url: app.httpUrl + '/ebike-charge/pay/goAliPay.x', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
            data: {
              sessionid:app.globalData.sessionid,
              zfje:this.data.zfje,
              orgno:this.data.pluginfo.subburo,         
              cdczno:cdczno,
            },
            success: (re) => {
              console.log(re);
              // 跳转到充电信息页面
              if(re.data.status == '0'){
                var ddid = re.data.ddid;
                my.tradePay({
                  tradeNO: re.data.body, //完整的支付参数拼接成的字符串，从服务端获取
                  success: (res) => {
                    var code = res.resultCode;
                    // 9000	订单支付成功
                    // 8000	正在处理中
                    // 4000	订单支付失败
                    // 6001	用户中途取消
                    // 6002	网络连接出错
                    // 6004	支付结果未知（有可能已经支付成功），请查询商户订单列表中订单的支付状态
                    // 99	用户点击忘记密码导致快捷界面退出(only iOS)
                    // 根据返回码跳转页面
                    console.log(code);
                    if(code == '9000'){
                      // 支付成功开启充电
                      my.httpRequest({
                          url: app.httpUrl + '/ebike-charge/aliPayXcx/startZfbcd.x', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
                          data: {
                            cdczno:cdczno,
                            zfje:this.data.zfje,
                            orgno:this.data.pluginfo.subburo, 
                            ddid:ddid,
                            sessionid:app.globalData.sessionid,
                          },
                          success: (re) => {
                              if(re.data.status == '0' || re.data.status == '1'){
                                // 跳转到充电信息页面
                                my.redirectTo({ url: '../cdxx/cdxx?id=' + cdczno});
                              }else{
                                // 跳转到提示页面
                                my.navigateTo({ url: '../tipview/cdview/cdview?status=' + re.data.status});
                              }
                          },
                          fail: () => {
                          },
                      });                      
                    }else if(code == '4000' ){
                      my.alert({
                        content: '订单支付失败！',
                      });
                    }
                    //其他情况不跳转页面，留在本页面不动
                  },
                  fail: (res) => {
                    // my.alert({
                    // content: JSON.stringify(res),
                    // });
                  }
                });
              //订单生成失败，原因见回传信息
              }else if(re.data.status == '10'){
                my.alert({
                    title:'充电失败',
                    content:re.data.msg,
                })
              //无效的插座
              }else{
                // 跳转到提示页面
                my.navigateTo({ url: '../tipview/cdview/cdview?status=' + re.data.status});
              }
            },
            fail: () => {
            },
         });
        }     
    }
  },
});
