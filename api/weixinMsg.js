const express = require('express');
const access_token = require('../lib/access_token');
var m_userInfo = require("../lib/userInfo");
const request = require('request');
const router = express.Router();
var log = require('log4js').getLogger("weixinMsg");

var urlQR = 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=';
router.post('/send', function (req, res) {
    let response = [];
    res.setHeader('Content-Type', 'application/json');
    let userid = req.body.userid;
    log.debug("userid:"+userid);
    m_userInfo.getUserInfo(userid,function (userInfo) {
        log.debug("openid:"+userInfo.openid);
        if(userInfo.openid!="") {
            m_userInfo.getUserFormid(userInfo, function (formid) {

                let real_name = userInfo.real_name;
                access_token((accessToken) => {
                    //let accessToken="";
                    console.log("accessToken:" + accessToken);
                    // set content-type header and data as json in args parameter


                    let options = {
                        method: 'post',
                        url: urlQR + accessToken,
                        json: true,
                        headers: {
                            "content-type": "application/json",
                        },

                        body: {
                            'touser': openid,
                            'template_id': 'NsqvikcYZztx8hAzastb7w4YynroPKe8Ugm4pEHdJLg',
                            'page': 'page/booking/qrBookingList',
                            'form_id': formid,
                            'data': {
                                keyword1: {
                                    value: real_name

                                },
                                keyword2: {
                                    value: '2017年3月24日'
                                },
                                keyword3: {
                                    value: '望京'
                                },
                                keyword5: {
                                    value: '待审核'
                                }
                            }
                            ,
                            'emphasis_keyword': 'keyword5.DATA'

                        }
                    };
                    request(options, function (err, res1) {
                        response.push({
                            'result': 'success',
                            'data': ''
                        });
                        res.status(200).send(JSON.stringify(response));
                    })
                });


            });
        }

    })





});

module.exports = router;
