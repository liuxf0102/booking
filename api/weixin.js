var express = require('express');
var router = express.Router();
var https = require('https');
var querystring = require('querystring');
var WXBizDataCrypt = require('../lib/WXBizDataCrypt')

var log = require('log4js').getLogger("weixin");
log.level = "debug";


var appId = 'wx5699f282563037ea';
var secret='9f8dc89e304f4f0082598c60df5e1519';
var sessionKey = '';

router.post('/getUserInfo', function (req, res, next) {
    var js_code = req.body.js_code;
    log.debug("js_code:" + js_code);
    var response = [];
    var contents = querystring.stringify({
        appid: appId,
        secret: secret,
        js_code: js_code,
        grant_type: 'authorization_code'
    });

    var options = {
        host: 'api.weixin.qq.com',
        path: '/sns/jscode2session?' + contents,
        method: 'GET',

    };
    var req = https.request(options, function (resTmp) {
        resTmp.setEncoding('utf8');
        resTmp.on('data', function (data) {
            log.debug("data:", data);   //一段html代码
            response.push({'result': 'success', "data": data});

            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify(response));
        });
    });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });

    req.end();
    log.debug("end");


});

router.post('/getUnionid', function (req, res, next) {

    var sessionKey = req.body.sessionKey;
    log.debug("sessionKey:" + sessionKey);
    var iv= req.body.iv;
    var encryptedData= req.body.encryptedData;
    log.debug("iv:" + iv);
    log.debug("encryptedData:" + encryptedData);
    var response = [];
    var pc = new WXBizDataCrypt(appId, sessionKey)

    var data = pc.decryptData(encryptedData , iv);
    log.debug("data:"+JSON.stringify(data));
    //var jo=JSON.parse(data);
    log.debug("unionid:"+data.unionId);
    response.push({'result': 'success', "unionid": data.unionId});

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify(response));

    log.debug("end");


});

module.exports = router;

