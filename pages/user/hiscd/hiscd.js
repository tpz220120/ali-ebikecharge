var app =getApp();

Page({
  data: {
      month:'',
      wdqjl:'',
      cdList:[],
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

    this.getCdList(current);  
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

          this.getCdList(res.date);  
        },
    });
  },

  showDetail(e){
    var index = e.currentTarget.dataset.index;

    var expanded = 'cdList['+index+'].expanded';

    var cdDate = this.data.cdList;
    var ex = cdDate[index].expanded
    this.setData({
      [expanded]:!ex,
    })
  },

  getCdList:function(month){
    my.httpRequest({
        url: app.httpUrl + '/ebike-charge/xcxUserCenter/getHisCd.x', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
        data: {
          sessionid: app.globalData.sessionid,
          month:month
        },
        success: (re) => {
          // 授权成功并且服务器端登录成功
          var dd=re.data.cdList;
          for(var i=0;i<dd.length;i++){
            dd[i].expanded=false;
          }

          this.setData({
            wdqjl: re.data.wdqjl,
            cdList:dd,
          });        
        },
        fail: () => {
        },
      });
  },

  gotk(e){

    console.log(e);
      var type = e.currentTarget.dataset.type;
      var id = e.currentTarget.dataset.id;
      // 申请退款
      if(type == '10'){
        var userid = e.currentTarget.dataset.userid;
        my.navigateTo({ url: '../../tsjy/newtsjy/newtsjy?type=sqtk&id=' + id + '&userid=' + userid});
        // "/advice/sqtk.jsp?id=" + id + "&csm=" + $("#csm").val() + "&userid=" + userid;
      // 处理中
      }else if(type == '20'){
        my.navigateTo({ url: 'tkd/tkd?type=dq&id=' + id});
        //"/workOrder/initSqtkGd.do?type=dq&id=" + id + "&csm=" + $("#csm").val();
      }else if(type == '30' || type == '40'){
        my.navigateTo({ url: 'tkd/tkd?type=his&id=' + id});
        //"/workOrder/initSqtkGd.do?type=his&id=" + id + "&csm=" + $("#csm").val();
      }
  }
});
