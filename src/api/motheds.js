const params = {
  env: 1, //环境 --测试0/正式1/新增2
}

// 工具
function tools() {
  return {

    // 获取html名称
    pageName: function () {
      var a = location.href;
      var b = a.split("/");
      var c = b.slice(b.length - 1, b.length).toString(String).split(".");
      return c.slice(0, 1);
    },
    //判断是数组
    isArray(o) {
      return Object.prototype.toString.call(o) == '[object Array]';
    },
    //判断null
    isNull: function (exp) {
      if (!exp && typeof exp != "undefined" && exp != 0) {
        return true;
      } else if (exp == "null") {
        return true;
      }
      return false;
    },
    //删除地址栏参数
    delQueStr: function (url, ref) {
      var str = "";
      if (url.indexOf('?') != -1) {
        str = url.substr(url.indexOf('?') + 1);
      } else {
        return url;
      }
      var arr = "";
      var returnurl = "";
      var setparam = "";
      if (str.indexOf('&') != -1) {
        arr = str.split('&');
        for (i in arr) {
          if (arr[i].split('=')[0] != ref) {
            returnurl = returnurl + arr[i].split('=')[0] + "=" + arr[i].split('=')[1] + "&";
          }
        }
        return url.substr(0, url.indexOf('?')) + "?" + returnurl.substr(0, returnurl.length - 1);
      } else {
        arr = str.split('=');
        if (arr[0] == ref) {
          return url.substr(0, url.indexOf('?'));
        } else {
          return url;
        }
      }
    },

    /*
     * 深复制
     * params
     * -destination  被赋值的新对象
     * -source  取值的对象
     * -miss  忽略的对象
     * */
    deepCopy: function (destination, source, miss) {
      for (var p in source) {
        if ($.inArray(p, miss) > -1) {
          return;
        }
        if (getType(source[p]) == "array" || getType(source[p]) == "object") {
          destination[p] = getType(source[p]) == "array" ? [] : {};
          arguments.callee(destination[p], source[p]);
        } else {
          destination[p] = source[p];
        }
      }

      function getType(o) {
        var _t;
        return ((_t = typeof (o)) == "object" ? o == null && "null" || Object.prototype.toString.call(o).slice(8, -1) : _t).toLowerCase();
      }
    },
    getURLSearchParams: function (params) {
      if (!this.isArray(params)) return;
      let param = new URLSearchParams();
      for (let i = 0, len = params.length; i < len; i++) {
        param.append(params[i].name, params[i].val)
      }
      return param
    },
    //跳转
    navigateLink: (url, callback = {}, failback = {}) => {
      return new Promise((resolve, reject) => {
        wx.navigateTo({
          url: url,
          success: res => {
            resolve(callback)
          },
          fail: res => {
            reject(failback)
          }
        })
      }).then(function (resolve) {
        typeof resolve == "function" ? resolve(res) : ""
      }).catch(function (reject) {
        typeof reject == "function" ? reject(res) : ""
      })
    },
    
    // 设置本地储存
    setLocal: (name, value, type) => {
      var curTime = new Date().getTime();
      if (!type || type == 2) { //默认设置-之前存在则使用创建时间
        var data = wx.getStorageSync(name);
        if (!data || data == "null") {
          wx.setStorageSync(name, {
            data: value,
            time: curTime
          })
        } else {
          var setTime = data.time;
          wx.setStorageSync(name, {
            data: value,
            time: setTime
          })
        }
      } else if (type == 1) { //type:1重新创建
        wx.setStorageSync(name, {
          data: value,
          time: curTime
        })
      }
    },

    //获取本地储存
    getLocal: (name, exp) => {
      var data = wx.getStorageSync(name);
      if (!exp) {
        var exp = 1000 * 60 * 60 * 24 * 3;  //缓存存储时间 3天
      }
      if (data && new Date().getTime() - data.time > exp) {
        wx.removeStorageSync(name)
        console.log('信息已过期');
        return null;
      } else {
        var dataObjDatatoJson = !data ? null : data.data;
        return dataObjDatatoJson;
      }
    },

    //移除本地存储
    removeLocal: (name) => {
      wx.removeStorageSync(name);
    },

    //清除本地存储
    clearLocal: () => {
      wx.clearStorageSync();
    },

    //获取登录状态
    xcxLogin: function () {
      var self = this;
      return new Promise((resolve, reject) => {
        wx.checkSession({
          success: function (e) {
            //session 未过期，并且在本生命周期一直有效
            console.log('当前为登录状态')
          },
          fail: function (e) {
            wx.login({success: res => {  //登录
                var code = res.code;
                wx.getSetting({
                  success: res => {
                    if (!res.authSetting['scope.userInfo']) {  //授权获取用户信息 -- 微信已弃用
                      wx.authorize({
                        scope: 'scope.userInfo',
                        success() {
                          self.wxgetUserApi(code).then((data) => 
                            reject(data)
                          )
                        }
                      })
                    } else {
                      self.wxgetUserApi(code).then((data) => reject(data))
                    }
                  }
                });
              }
            })
          }
        })
      })
    },
    wxgetUserApi: function (code) {
      var self = this;
      return new Promise((resolve, reject) => {
        wx.getUserInfo({
          withCredentials: true,
          success: function (e) {
            var encryptedData = e.encryptedData;
            var iv = e.iv;
            var data = {
              encryptedData: encryptedData,
              iv: iv,
              code: code
            };
            resolve(data)
          }
        });
      })
    },

    //授权后获取用户信息方法
    wxgetUserInfo: function() {
      var self = this;
      // 查看是否授权
      return new Promise((resolve, reject) => {
        wx.getSetting({
            success: (res)=>{
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                    wx.getUserInfo({
                      withCredentials: true,
                      success: (res) => resolve(res),
                      fail:  (res) => reject(res)                          
                    })
                }
            }
        });
      })
    },

    //登录更新session_key,获取localSession
    wxLogin: function() {
      return new Promise((resolve, reject) => {
        wx.login({  //session_key登录态校验
          success:function(res){         
            resolve(res.code);  //传code到后台，前端不操作获取openid、session_key
          }  
        })
      })
    },

  }
}

//正则类
function regular() {
  return {
    //电话号码
    isPhone: function (phone) {
      var pattern = /^1[3,4,5,7,8]\d{9}$/;
      return pattern.test(phone);
    },
    //邮件
    isEmail: function (email) {
      var pattern = /^((([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})[; ,])*(([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})))$/;
      return pattern.test(email);
    },
    //姓名
    isName: function (val) {
      var pattern = /^[\u4e00-\u9fa5]{2,10}$|^[\w+\s]{1,20}$/;
      return pattern.test(val);
    },
    //邮编
    isZip: function (val) {
      var pattern = /^[0-9]\d{5}$/;
      return pattern.test(val);
    },
    //身份证
    issfz: function (val) {
      var pattern = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      return pattern.test(val);
    },
    //数字
    isNum: function (val) {
      var pattern = /([1-9]\d*\.?\d*)|(0\.\d*[1-9])/;
      return pattern.test(val);
    },
    //匹配中英文
    isChAndEn: function (val) {
      var pattern = /[a-zA-Z\u4e00-\u9fa5]+/g;
      return !pattern.test(val);
    },
    //获取身份证对应的性别和年龄
    getDateSex: function (num) {
      var UUserCard = num;
      var returns = {
        age: '',
        sex: ''
      }
      //获取出生日期
      UUserCard.substring(6, 10) + "-" + UUserCard.substring(10, 12) + "-" + UUserCard.substring(12, 14);
      //获取性别
      if (parseInt(UUserCard.substr(16, 1)) % 2 == 1) {
        //alert("男");
        returns.sex = 1;
      } else {
        //alert("女");
        returns.sex = 2;
      }
      //获取年龄
      var myDate = new Date();
      var month = myDate.getMonth() + 1;
      var day = myDate.getDate();
      var age = myDate.getFullYear() - UUserCard.substring(6, 10) - 1;
      if (UUserCard.substring(10, 12) < month || UUserCard.substring(10, 12) == month && UUserCard.substring(12, 14) <= day) {
        age++;
      }
      //alert(age);
      returns.age = age;
      return returns;
    }

  }
}


export default {
  tools,
  regular,
  params
}