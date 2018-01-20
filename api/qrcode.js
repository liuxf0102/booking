const express = require('express');
const access_token = require('../lib/access_token');
const request = require('request');
const router = express.Router();
var log = require('log4js').getLogger("qrcode");

var urlQR = 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=';
router.post('/', function (req, res) {
    let response = [];
    res.setHeader('Content-Type', 'application/json');
    let userid1 = req.body.userid1;


    let scene = userid1;
    log.debug("scene:" + scene);
    if (scene.length > 32) {
        log.error("scene:" + scene);
        response.push({
            'result': 'error',
            'scene': 'scene is too long :' + scene.length + ":" + scene
        });
        res.status(200).send(JSON.stringify(response));
        return;
    }
    let qrcodeFullPath = scene + ".png";
    let qrcodeURL = getQRCodeURL(qrcodeFullPath);


    access_token((accessToken) => {

        console.log("accessToken:" + accessToken);


        var fs = require("fs");

        // set content-type header and data as json in args parameter


        let options = {
            method: 'post',
            url: urlQR + accessToken,
            json: true,
            headers: {
                "content-type": "application/json",
            },

            body: {
                'scene': scene,
                'page': 'page/booking/qrBookingNew'

            }
        };
        var qrCodePath = getQRCodePath(qrcodeFullPath);
        fs.exists(qrCodePath, function (exists) {
            if (!exists) {
                var writeStream = fs.createWriteStream(qrCodePath, {autoClose: true});

                request(options).pipe(writeStream);
                writeStream.on('finish', function () {

                    response.push({
                        'result': 'success',
                        'qrcode': qrcodeURL
                    });
                    res.status(200).send(JSON.stringify(response));
                })
            } else {
                response.push({
                    'result': 'success',
                    'qrcode': qrcodeURL
                });
                res.status(200).send(JSON.stringify(response));
            }
        })


    });


});


function getQRCodePath(imgName) {
    return "/home/felix/www-booking/public/qr/" + imgName;
}

function getQRCodeURL(imgName) {
    return "https://www.4exam.cn/qr/" + imgName;
}


module.exports = router;
