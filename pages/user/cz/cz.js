var app =getApp();

Page({
  data: {
    num_zs:'',
    num_xs:'',
    check:0,//金额框选中标志
    zfje:'',//支付金额显示
  },
  onLoad() {
      // 此id为充电插座编号
      if(app.globalData.sessionid == null){
          var that = this;
          app.getSessionId().then(function(sessionid){
              that.getAccount(sessionid);
          });
      }else{
          this.getAccount(app.globalData.sessionid);
      }
  },

  getAccount:function(sessionid){
    my.httpRequest({
        url: app.httpUrl + '/ebike-charge/xcxUserCenter/getAccount.x', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
        data: {
          sessionid:sessionid,
        },
        success: (re) => {
          if(re.data != null){
              console.log(re.data);
              
              var zs = re.data.account_num;
              var xs = '';
              if(re.data.account_xs == '1'){
                  xs = '.' +  re.data.account_num_xs;
              }
              this.setData({
                  num_zs:zs,
                  num_xs:xs,
              });
          }
        },
        fail: () => {
        },
    });
  },

  innum(e){
    var v = e.currentTarget.dataset.v;
    this.setData({
      check:v,
      zfje:v,
    })
  },

  ljcz(e){
    // 金额不对
    if(parseFloat(this.data.zfje) <=0 || parseFloat(this.data.zfje) >=9999){
        my.alert({title:'亲',content:'请输入正确的支付金额！'})
        return;
    }

    my.httpRequest({
      url: app.httpUrl + '/ebike-charge/pay/goAliPayCz.x', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
      data: {
        sessionid:app.globalData.sessionid,
        czje:this.data.zfje
      },
      success: (re) => {
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
              if(code == '9000'){
                this.getAccount(app.globalData.sessionid);                     
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
        
        }else if(re.data.status == '10'|| re.data.status == '20'){
          my.alert({
              title:'充值失败',
              content:re.data.msg,
          })
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
});
