var app = getApp();
//地图展示附近100km之内的99个电站，无论地图缩放还是变大，如果中心点不变化不重新加载
Page({
  data: {
    tipshow:'0',
    tipname:'',
    stid:'',
    scale: 16,
    longitude:'',
    latitude:'',
    markers:[],
    controls:[],
    mainHeight:500,
    sfjz:false,///刚开始数据是否加载完成，防止regionMap重复调用
    regionover:true,///一次regionMap结束后不能重复调用
    regionjd:'',//上一次移动的经度
    regionwd:'',//上一次移动的维度
  },
  onLoad(){
      my.showLoading();
      var that = this;
      my.getLocation({
          success(res) {
            that.setData({
              longitude:res.longitude,
              latitude:res.latitude,
              // circles:{
              //   latitude: res.latitude,
              //   longitude: res.longitude,
              //   color: '#0076FF88',
              //   fillColor: '#0076FF33',
              //   radius: 100,
              // },
            });
            my.httpRequest({
            url: app.httpUrl + '/ebike-charge/aliPayXcx/getStationList.x', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
            data: {
              longitude: res.longitude,
              latitude:res.latitude,
              limit:99,// 99个站点
              dis:100,// 100km
            },
            success: (re) => {
              my.hideLoading();
              if(re.data != null){
                  var st = re.data;
                  var insStDate = new Array();
                  //var includeDate = new Array();
                  var k=0;
                  for(var i=0;i<st.length;i++){      
                      var stDate = st[i];   
                      var market = new Object();
                      market.id=stDate.id;
                      market.latitude=stDate.latitude;
                      market.longitude=stDate.longitude;              
                      market.width=36;
                      market.height=45;
                      market.iconPath='/image/mark-kx.png';
                      insStDate[i] = market;
                      // // 显示1km内的圈
                      // if(stDate.distance < 1){
                      //     var inc = new Object();
                      //     inc.latitude=stDate.latitude;
                      //     inc.longitude=stDate.longitude;
                      //     includeDate[k] = inc;
                      //     k++;
                      // }
                  }

                  // 地图中心的market
                  var marketc = new Object();
                  marketc.id='center';
                  marketc.latitude=res.latitude;
                  marketc.longitude=res.longitude;              
                  marketc.width=20;
                  marketc.height=33;
                  marketc.iconPath='/image/mark-dw.png';
                  insStDate[st.length] = marketc;

                  console.log(insStDate);
                  that.setData({
                    //includePoints:includeDate,
                    markers:insStDate,
                    sfjz:true,
                  });

                  // 使用 my.createMapContext 获取 map 上下文
                  that.mapCtx = my.createMapContext('map');
                  that.setData({
                    mainHeight:app.globalData.apiH,
                    controls:[
                    {
                      id: 1,
                      position: {
                        left: 10,
                        top: app.globalData.apiH * 0.8,
                        width: 40,
                        height: 40,
                      },
                      iconPath:'/image/main-tsjy.png',
                      clickable: true,
                    },
                    {
                      id: 2,
                      position: {
                        left: 10,
                        top: app.globalData.apiH * 0.88,
                        width: 40,
                        height: 40,
                      },
                      iconPath:'/image/main-location.png',
                      clickable: true,
                    },
                    {
                      id: 3,
                      position: {
                        left: app.globalData.apiW -50,
                        top: app.globalData.apiH * 0.8,
                        width: 40,
                        height: 40,
                      },
                      iconPath:'/image/main-sm.png',
                      clickable: true,
                    },
                    {
                      id: 4,
                      position: {
                        left: app.globalData.apiW -50,
                        top: app.globalData.apiH * 0.88,
                        width: 40,
                        height: 40,
                      },
                      iconPath:'/image/main-user.png',
                      clickable: true,
                    },
                    {
                      id: 5,
                      position: {
                        left: app.globalData.apiW *0.25,
                        top: app.globalData.apiH * 0.86,
                        width: app.globalData.apiW *0.5,
                        height: 50,
                      },
                      iconPath:'/image/scan.png',
                      clickable: true,
                    },
                  ]
                  })
              }
            },
            fail: () => {
              // 根据自己的业务场景来进行错误处理
              my.hideLoading();
            },
        });
      },
      fail() {
        my.hideLoading();
        my.alert({ title: '定位失败' });
      },
    })
  },
  controltap(e) {
    // 投诉建议
    if (e.controlId === 1) {
       my.navigateTo({ url: '../tsjy/tsjy' });
    }

    // 定位
    var that = this;
    if (e.controlId === 2) {
      my.getLocation({
        success(res) {
          my.hideLoading();
          console.log(res);
          that.setData({
            longitude:res.longitude,
            latitude:res.latitude
          });

          that.mapCtx.moveToLocation();
          // 地图中心的market
          var st = that.data.markers;
          for(var i=0;i<st.length;i++){      
              var stDate = st[i];   
              if(stDate.id == 'center'){
                 var latitude = 'markers['+i+'].latitude';
                 var longitude = 'markers['+i+'].longitude';
                  that.setData({
                    //includePoints:includeDate,
                    [latitude]:res.latitude,
                    [longitude]:res.longitude,
                  });

                  break;
              }
          }
          
        },
        fail() {
          my.hideLoading();
          my.alert({ title: '定位失败' });
        },
      })
    }

    // 充电说明
    if (e.controlId === 3) {
      my.navigateTo({ url: '../cdsm/cdsm' });
    }

    // 我的
    if (e.controlId === 4) {
      my.navigateTo({ url: '../user/user' });
    }

    // 扫码充电
    if (e.controlId === 5) {
      my.scan({
      type: 'qr',
      success: (res) => {  
        if(res.code.split('?').length < 2){
           my.navigateTo({ url: '../tipview/cdview/cdview?status=wx'});
        }else{
           var cs = res.code.split('?')[1];
          // 二维码规则
          if(cs.split("&").length == 1){
            var name = cs.split("=")[0];
            var id = cs.split("=")[1];
            if(name == 'cdczno'){
                // 根据充电插座编号查找插座信息
                // 根据充电插座获取插座状态，如果
                my.httpRequest({
                  url: app.httpUrl + '/ebike-charge/aliPayXcx/getCzgk.x', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
                  data: {
                    cdczno: id
                  },
                  success: (re) => {
                    // 插座不是空闲，跳转到提示页面
                    if(re.data.status != '0'){
                      // 跳转到提示页面
                      my.navigateTo({ url: '../tipview/cdview/cdview?status=' + re.data.status});
                    }else{
                      my.navigateTo({ url: '../paycharge/paycharge?id=' + id});
                    }      
                  },
                  fail: () => {
                    reject({});
                  },
                });
            }else{
                my.navigateTo({ url: '../tipview/cdview/cdview?status=wx'});
            } 
          }else{
            my.navigateTo({ url: '../tipview/cdview/cdview?status=wx'});
          } 
        }
      },
    });
    }
  },
  regionchange(e) {
    // 上一次跟本次移动的经纬度一致的情况下，不重复调用
    if(this.data.regionjd == e.longitude && this.data.regionwd== e.latitude){
      return;
    }

    // 注意：如果缩小或者放大了地图比例尺以后，请在 onRegionChange 函数中重新设置 data 的
    // scale 值，否则会出现拖动地图区域后，重新加载导致地图比例尺又变回缩放前的大小。
    if (e.type === 'end' && this.data.sfjz && this.data.regionover) {
      this.setData({
        //includePoints:includeDate,
        regionover:false,
        scale: e.scale,
        regionjd:e.longitude,
        regionwd:e.latitude
      });
      my.showLoading();
      var that = this;
      my.httpRequest({
        url: app.httpUrl + '/ebike-charge/aliPayXcx/getStationList.x', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
        data: {
          longitude: e.longitude,
          latitude:e.latitude,
          limit:99,// 99个站点
          dis:100,// 100km
        },
        success: (re) => {
          my.hideLoading();
          if(re.data != null){
              var st = re.data;
              var insStDate = new Array();
              var k=0;
              for(var i=0;i<st.length;i++){      
                  var stDate = st[i];   
                  var market = new Object();
                  market.id=stDate.id;
                  market.latitude=stDate.latitude;
                  market.longitude=stDate.longitude;              
                  market.width=36;
                  market.height=45;
                  market.iconPath='/image/mark-kx.png';
                  insStDate[i] = market; 
              }

              // 地图中心的market
              var marketc = new Object();
              marketc.id='center';
              marketc.latitude=e.latitude;
              marketc.longitude=e.longitude;              
              marketc.width=20;
              marketc.height=33;
              marketc.iconPath='/image/mark-dw.png';
              insStDate[st.length] = marketc;

              that.setData({
                markers:insStDate,
                longitude:e.longitude,
                latitude:e.latitude,
                regionover:true,
              });

              console.log(2424242);
          }
        },
        fail: () => {
          // 根据自己的业务场景来进行错误处理
          my.hideLoading();
        },
      });
    } 
  },
  markertap(e) {
    //根据id查找电站名称
    var stid = e.markerId;
    if(stid != 'center'){
        my.httpRequest({
          url: app.httpUrl + '/ebike-charge/aliPayXcx/getStName.x', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
          data: {
            id: stid
          },
          success: (re) => {
            if(re.data != null){
              this.setData({
                tipname:re.data.name,
                stid:re.data.id,
                tipshow: '1'
              });
            }
              
          },
          fail: () => {
            // 根据自己的业务场景来进行错误处理
          },
      });
    }
  },
  tap(e) {
    this.setData({
        tipshow: '0'
      });
  },

  goDetail(e) {
    console.log(this.data);
    my.navigateTo({ url: '../charge/charge?id=' + this.data.stid });
  },
});
