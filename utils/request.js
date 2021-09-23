
function requestPostApi(url, params, sourceObj, successFun, failFun) {
    requestApi(url, params, 'POST', sourceObj, successFun, failFun)
}


function requestGetApi(url, params, sourceObj, successFun, failFun) {
    requestApi(url, params, 'GET', sourceObj, successFun, failFun)
}

 function requestApi(url, params, method, sourceObj, successFun, failFun) {
    wx.showLoading({
        mask: true,
    })
    if (wx.getStorageSync('openId')) {
        params["openId"] = wx.getStorageSync('openId');
        wx.request({
            url: url,
            method: method,
            data: params,
            header: {
                'Content-Type': "application/x-www-form-urlencoded",
            },
            success: function (res) {
                typeof successFun == 'function' && successFun(res.data, sourceObj);
            },
            fail: function (res) {
                typeof failFun == 'function' && failFun(res.data, sourceObj);
            },
            complete: function(res){
                wx.hideLoading();
            }
        })
    } else {
        console.log("无openId")
        wx.login({
            success: res => {
                console.log(res.code)
                wx.request({
                    url: "http://127.0.0.1:10521/api/wx/auth",//更改为你自己的服务端地址
                    method: "POST",
                    data: {
                        js_code: res.code
                    },
                    header: {
                        'Content-Type': "application/x-www-form-urlencoded",
                    },
                    success: function (res) {
                        wx.setStorageSync('openId', res.data.data);
                        params["openId"] = wx.getStorageSync('openId');
                        requestApi(url, params, method, sourceObj, successFun, failFun);
                    },
                    fail: function (res) {
                        console.error(res);
                    }
                })
            }
        })
    }
}

module.exports = {
    requestPostApi,
    requestGetApi
}