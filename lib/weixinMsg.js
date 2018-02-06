const express = require('express');
const access_token = require('../lib/access_token');
var m_userInfo = require("../lib/userInfo");
const request = require('request');
const router = express.Router();
var log = require('log4js').getLogger("lib/weixinMsg");
log.level = "debug";

var urlQR = 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=';
let sendMsg = function (toUserid, msg, callback) {
    log.debug("toUserid :" + toUserid);
    m_userInfo.getUserInfo(toUserid, function (userInfo) {

        let openid = userInfo.openid;
        if (openid == "") {
            log.error("can't get openid :userid " + userid);
        } else {
            m_userInfo.getUserFormid(userInfo, function (formid) {
                log.debug("openid:" + openid);
                log.debug("formid:" + formid);

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
                            'page': 'page/booking/qrBookingDetails?bookingId=' + msg.bookingId,
                            'form_id': formid,
                            'data': {
                                keyword1: {
                                    value: msg.real_name ? msg.real_name : ""

                                },
                                keyword2: {
                                    value: msg.time_format ? msg.time_format : ""
                                },
                                keyword3: {
                                    value: msg.job_location ? msg.job_location : ""
                                },
                                keyword5: {
                                    value: msg.status ? msg.status : ""
                                }
                            }
                            ,
                            'emphasis_keyword': 'keyword5.DATA'

                        }
                    };
                    request(options, function (err, res1) {

                        if (!err && res1.body.errcode == 0) {
                            let errTmp = null;
                            callback(errTmp);
                        } else {
                            log.error("sendMsg:" + toUserid + " res:" + res1.body.errmsg);
                            let errTmp = {};
                            errTmp.msg = res1.body.errmsg;
                            errTmp.code=res1.body.errcode;
                            callback(errTmp);

                        }
                    })
                });


            });
        }

    });
};
let sendMsgSysInfo = function (toUserid, msg, callback) {
    log.debug("toUserid :" + toUserid);
    m_userInfo.getUserInfo(toUserid, function (userInfo) {

        let openid = userInfo.openid;
        if (openid == "") {
            log.error("can't get openid :userid " + userid);
        } else {
            m_userInfo.getUserFormid(userInfo, function (formid) {
                log.debug("openid:" + openid);
                log.debug("formid:" + formid);

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
                            'template_id': 'vajj6-TTME5Nny1_mTyu5zkA7CFZVRyrCUAy9w76GRo',
                            'page': 'page/booking/bookingList',
                            'form_id': formid,
                            'data': {
                                keyword1: {
                                    value: msg.sys_info ? msg.sys_info : ""

                                },
                                keyword2: {
                                    value: msg.tip ? msg.tip : ""
                                },
                                keyword3: {
                                    value: msg.memo ? msg.memo : ""
                                }
                            }
                            //,
                            //'emphasis_keyword': 'keyword1.DATA'

                        }
                    };
                    request(options, function (err, res1) {
                        log.debug("sendMsg:" + JSON.stringify(res1));

                        if (!err && res1.body.errcode == 0) {
                            let errTmp = null;
                            callback(errTmp);
                        } else {
                            log.error("sendMsg:" + toUserid + " res:" + res1.body.errmsg);
                            let errTmp = {};
                            errTmp.msg = res1.body.errmsg;
                            errTmp.code=res1.body.errcode;
                            callback(errTmp);
                        }
                    })
                });


            });
        }

    });
};

exports.sendMsg = sendMsg;
exports.sendMsgSysInfo = sendMsgSysInfo;
