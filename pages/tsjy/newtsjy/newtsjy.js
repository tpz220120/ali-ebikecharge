var app = getApp();
Page({
  data: {
    tempFilePath: '',
    filec:0,
    textareav:'',
    userid:'',
    textsm:'',
    recordid:'',//如果是退款申请的话，还需要保存充电记录id
  },
  onLoad(option) {
    console.log(option.userid);
    var textsm='';
    if(option.type == 'sqtk'){
      textsm='退款申请说明：';
      this.setData({
        userid:option.userid,
        recordid:option.id,
        textsm:textsm
      })
    }else{
      textsm='投诉或者建议内容：';
      this.setData({
        userid:option.userid,
        textsm:textsm
      })
    }
    
  },
  chooseImage() {
    my.chooseImage({
      count: 1,
      success: res => {
        console.log('chooseImage', res);
        this.setData({
          tempFilePath: res.apFilePaths[0],
        });
      },
    });
  },

  previewImage(e){
    console.log(e);
    my.previewImage({
      current: 1,
      urls: [
        e.currentTarget.dataset.imsrc,
      ],
    });
  },

  bindTextAreaBlur: function(e) {
    this.setData({
      textareav:e.detail.value
    })
  },

  saveFile() {
    const textareav = this.data.textareav;
    const userid = this.data.userid;
    const recordid = this.data.recordid;
    var sm='';
    var url,baseparam;
    if(recordid != ''){
      sm = '退款申请';
      url = app.httpUrl + '/ebike-charge/workOrder/goSqtk.x';
      baseparam = {
        recordid:recordid,
        userid: userid,
        sm:encodeURI(textareav)
      }
    }else{
      sm = '投诉/建议';
      url = app.httpUrl + '/ebike-charge/workOrder/goTsjy.x';
      baseparam = {
        userid: userid,
        sm:encodeURI(textareav)
      }
    }
    if(textareav==''){
      my.alert({
        title:'亲',
        content:sm + '说明内容不能为空！'
      })

      return;
    }else if(textareav.length < 10){
      my.alert({
        title:'亲',
        content:sm + '说明内容不能少于10个字！'
      })

      return;
    }

    if(this.data.tempFilePath != ''){
      baseparam.hfile = '1';
      console.log(baseparam);
        my.uploadFile({
          url: url,
          headers: { 
            'Content-Type': 'multipart/form-data'
          },
          fileType: 'image',
          fileName: 'image',
          filePath: this.data.tempFilePath,
          formData: baseparam,
          success: (re) => {
            var dd = JSON.parse(re.data);
            console.log(dd.status);
            if(dd.status == '1'){
                my.alert({
                  title:'亲',
                  content:'您的'+ sm +'提交成功，请耐心等待反馈！',
                  success(){
                      my.navigateBack({
                          delta:1
                      });
                  }
                })   
            }else{
                my.alert({
                  title:'亲',
                  content:'保存失败，请联系管理员！',
              })
            }
          },
          fail: function(res) {
            my.alert({content: '上传失败！'});
          }
        });
    }else{
      baseparam.hfile = '0';
      // //保存到投诉建议表
      my.httpRequest({
        url: url, // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
        data: baseparam,
        method:'POST',
        success: (re) => {
          // 保存成功跳转到建议页面
          if(re.data.status == '1'){
              my.alert({
                title:'亲',
                content:'您的'+ sm +'提交成功，请耐心等待反馈！',
                success(){
                    my.navigateBack({
                        delta:1
                    });
                }
              })   
          }else{
              my.alert({
                title:'亲',
                content:'保存失败，请联系管理员！',
            })
          }
        },
        fail: () => {
        },
      });
    }
    
    // if (this.data.tempFilePath.length > 0) {
    //   const that = this;
    //   my.saveFile({
    //     apFilePath: this.data.tempFilePath,
    //     success(res) {
    //       console.log('saveFile', res);
    //       my.alert({
    //         title: '保存成功', // alert 框的标题
    //         content: '下次进入应用时，此文件仍可用',
    //       });
    //     },
    //   });
    // }
  },
  clear() {
    this.setData({
      tempFilePath: '',
    });
  },

  goTsjy(){
    console.log(22);
    my.navigateBack({
      delta: 1
    });
  }
});
