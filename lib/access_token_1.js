const request = require('request')
const guard_dog = require('guard_dog')
// 加载这个模块的时候给 ACCESS_TOKEN 这个键名初始化

    guard_dog.init('ACCESS_TOKEN_1', (handler) => {
    request.get({
        uri: 'https://api.weixin.qq.com/cgi-bin/token',
        json: true,
        qs: {
            grant_type: 'client_credential',
            appid: 'wx7c76d2fdd4f4b7db',    // APPID请换成你的 appid
            secret: 'f196005e4cd1ecfde88a81fd6a0c1431'    // APPSECRET请换成你的 appsecret
        }
    }, (err, res, body) => {
        if (err) {
            console.log(err)
            return
        }
        //console.log(body)
        if (body.errcode) {
            return
        }
        handler(body.access_token, 7200)
    })
})

// 只要向外暴露一个获取值的方法就可以了
module.exports = function (callback) {
    guard_dog.get('ACCESS_TOKEN_1', callback)
}
