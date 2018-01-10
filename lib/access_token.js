const request = require('request')
const guard_dog = require('guard_dog')
// 加载这个模块的时候给 ACCESS_TOKEN 这个键名初始化
guard_dog.init('ACCESS_TOKEN', (handler) => {
    request.get({
        uri: 'https://api.weixin.qq.com/cgi-bin/token',
        json: true,
        qs: {
            grant_type: 'client_credential',
            appid: 'wx5699f282563037ea',    // APPID请换成你的 appid
            secret: '9f8dc89e304f4f0082598c60df5e1519'    // APPSECRET请换成你的 appsecret
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
        handler(body.access_token, body.expires_in-300)
    })
})
// 只要向外暴露一个获取值的方法就可以了
module.exports = function (callback) {
    guard_dog.get('ACCESS_TOKEN', callback)
}