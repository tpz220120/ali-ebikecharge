var app = getApp();

Page({
  data: {
    info:[],
    dcount:'',
    dinfo:[],
    imgcount:0,
  },
  onLoad(option) {
    my.showLoading();
    my.httpRequest({
        url: app.httpUrl + '/ebike-charge/workOrder/initSqtkGd.x', // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
        data: {
          type: option.type,
          id: option.id
        },
        success: (re) => {
          // 授权成功并且服务器端登录成功
          my.hideLoading();
          this.setData({
            info: re.data.info,
            dinfo:re.data.dinfo,
            dcount:re.data.dcount,
            imgcount:re.data.imgcount,
          });       
        },
        fail: () => {
          my.hideLoading();
        },
      });
  },
  previewImage(e){
    console.log(e);
    // my.previewImage({
    //   current: 1,
    //   urls: [
    //     e.currentTarget.dataset.imsrc,
    //   ],
    // });

    my.downloadFile({
      url: e.currentTarget.dataset.imsrc,
      success({ apFilePath }) {
        console.log(apFilePath);
        my.previewImage({
          urls: [apFilePath],
        });
      },
      fail(res) {
        my.alert({
          content: res.errorMessage || res.error,
        });
      },
    });
  },
});
