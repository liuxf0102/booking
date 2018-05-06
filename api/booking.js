var express = require('express');
var router = express.Router();
var pool = require("../lib/mysql_pool");
var m_weixinMsg = require("../lib/weixinMsg");
var m_weixinMsg1 = require("../lib/weixinMsg1");
var m_userInfo = require("../lib/userInfo");
var m_booking = require("../lib/booking");

var log = require('log4js').getLogger("booking");
log.level = "debug";

router.post('/list', function (req, res, next) {


    var response = [];
    let c_time = new Date().getTime() - 180 * 24 * 3600 * 1000;
    var sqlPrepare = ["select b.*,u.real_name,u.nick_name,u.mobile,u.icon,u.gender,u.job_location  from bk_booking b,bk_user u where  b.c_time >? and status >-1 "];
    var paramValue = [c_time];

    var linkedUserid = 'userid2';


    if (typeof req.body.linkedUserid !== 'undefined' && req.body.linkedUserid == 'userid1') {
        linkedUserid = 'userid1';
    }

    if (linkedUserid == 'userid1') {
        sqlPrepare.push("and b.userid1 = u.userid");
    }
    if (linkedUserid == 'userid2') {
        sqlPrepare.push("and b.userid2 = u.userid");
    }

    let useridIsReady = false;
    var userid = req.body.userid;
    if (typeof userid !== 'undefined' && userid !== '') {
        sqlPrepare.push("and userid1 = ?");
        paramValue.push(userid);
        useridIsReady = true;
    }
    let userid1IsReady = false;
    var userid1 = req.body.userid1;
    if (typeof userid1 !== 'undefined' && userid1 !== '') {
        //log.error("userid1 :"+userid1);
        sqlPrepare.push("and userid1 = ?");
        paramValue.push(userid1);
        userid1IsReady = true;
    }
    let userid2IsReady = false;
    var userid2 = req.body.userid2;
    if (typeof userid2 !== 'undefined' && userid2 !== '') {
        //log.error("userid2 :"+userid2);
        sqlPrepare.push("and userid2 = ?");
        paramValue.push(userid2);
        userid2IsReady = true;
    }
    if (!useridIsReady && !userid1IsReady && !userid2IsReady) {
        sqlPrepare.push("and userid1 = ?");
        paramValue.push('userid1');
        log.error("userid1 or userid2 is error");
    }


    var month = req.body.month;
    if (typeof month !== 'undefined' && month !== '') {
        sqlPrepare.push("and month = ?");
        paramValue.push(month);
    }

    var sql = sqlPrepare.join(" ");
    log.debug("sql:" + sql);
    log.debug("param :" + paramValue.join(" "));

    pool.conn(function (conn) {
        conn.query(sql, paramValue, function (err, result) {
            if (!err) {
                var response = [];

                //if (result.length !== 0) {
                response.push({
                    'result': 'success',
                    'data': result
                });
                //} else {
                // response.push({
                //     'result': 'success',
                //     'msg': 'No Results Found'
                // });
                //}

                res.setHeader('Content-Type', 'application/json');
                res.status(200).send(JSON.stringify(response));
            } else {
                res.status(400).send(err);
            }

        })
    });


});
//modify user info
router.post('/create', function (req, res, next) {
    log.debug("req.body" + JSON.stringify(req.body));
    var userid1 = req.body.userid1;
    if (typeof userid1 == 'undefined' || userid1 == '') {
        userid1 = "userid1";
        log.error("userid1 is error");
    }

    var userid2 = req.body.userid2;
    var status = req.body.status;
    var year = req.body.year;
    var month = req.body.month;
    var day = req.body.day;
    var weekday = req.body.weekday;
    var hour = req.body.hour;
    var minute = req.body.minute;
    var memo1 = req.body.memo1;
    if (typeof memo1 == 'undefined') {
        memo1 = "";
    }
    var memo2 = req.body.memo2;
    if (typeof memo2 == 'undefined') {
        memo2 = "";
    }
    var prop_class = req.body.prop_class;
    if (typeof prop_class == 'undefined') {
        prop_class = "";
    }
    let c_time = new Date().getTime();
    res.setHeader('Content-Type', 'application/json');
    var response = [];

    var sqlPrepare = ["insert into bk_booking (userid1,userid2,status,year,month,day,weekday,hour,minute,memo1,memo2,prop_class,c_time,m_time) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)"];
    var paramValue = [userid1, userid2, status, year, month, day, weekday, hour, minute, memo1, memo2, prop_class, c_time, c_time];

    var sql = sqlPrepare.join(" ");

    log.debug("sql:" + sql);
    log.debug("param:" + paramValue);

    pool.conn(function (conn) {
        conn.query(sql, paramValue, function (err, result) {
            if (!err) {


                if (result.affectedRows !== 0) {
                    response.push({
                        'result': 'success',
                        'id': result.insertId
                    });

                    if ("0" == status) {
                        //send msg to userid2
                        try {
                            m_userInfo.getUserInfo(userid1, function (userInfo) {
                                let msg = {};
                                msg.page = "page/booking/qrBookingDetails?bookingId=" + result.insertId;
                                msg.real_name = userInfo.real_name;
                                msg.status = "待审核";
                                msg.time_format = month + "月" + day + "号 " + hour + "点";
                                msg.job_location = userInfo.job_location;
                                m_weixinMsg1.sendMsg1(userid2, msg, function () {

                                });
                            });
                        } catch (e) {
                            log.error("send message:" + e);
                        }
                        //send msg to userid1
                        try {
                            m_userInfo.getUserInfo(userid1, function (userInfo) {
                                let msg = {};
                                msg.page = "page/booking/bookingDetails?bookingId=" + result.insertId;
                                msg.real_name = userInfo.real_name;
                                msg.status = "待审核";
                                msg.time_format = month + "月" + day + "号 " + hour + "点";
                                //msg.job_location =
                                msg.memo = memo2;
                                m_weixinMsg.sendMsg(userid1, msg, function () {

                                });
                            });
                        } catch (e) {
                            log.error("send message:" + e);
                        }
                    }


                } else {
                    response.push({
                        'msg': 'create booking error :'
                    });
                }


                res.status(200).send(JSON.stringify(response));
            } else {

                log.error("create booking:" + err);
                response.push({
                    'result': 'error',
                    'data': err
                });
                res.status(400).send(JSON.stringify(response));
            }

        })
    });


});
//get booking by id
router.post('/byId', function (req, res, next) {
    var response = [];
    var id = req.body.id;

    if (typeof id == 'undefined' || id == '') {
        id = "id";
        log.error("id is error");
    }

    log.debug("id:" + id);
    var sqlPrepare = ['select b.*,u.real_name,u.nick_name,u.mobile,u.icon,u.gender,u.job_location  from bk_booking b,bk_user u where'];
    var linkedUserid = 'userid2';


    if (typeof req.body.linkedUserid !== 'undefined' && req.body.linkedUserid == 'userid1') {
        linkedUserid = 'userid1';
    }

    if (linkedUserid == 'userid1') {
        sqlPrepare.push(" b.userid1 = u.userid");
    }
    if (linkedUserid == 'userid2') {
        sqlPrepare.push(" b.userid2 = u.userid");
    }
    sqlPrepare.push(" and id =? ");
    var sql = sqlPrepare.join(" ");
    res.setHeader('Content-Type', 'application/json');
    pool.conn(function (conn) {


        log.debug(sql);
        conn.query(sql, [id], function (err, result) {

            if (!err) {
                if (result.length === 1) {
                    log.debug("result:" + result[0].id);
                    //set userid
                    response.push({
                        'result': 'success',
                        'data': result[0]
                    });
                    res.status(200).send(JSON.stringify(response));
                } else if (result.length > 1) {
                    log.error("error result.length" + result.length);
                    response.push({
                        'result': 'error'
                    });
                    res.status(200).send(JSON.stringify(response));
                } else {
                    response.push({
                        'result': 'error',
                        'data': '{}'
                    });
                    res.status(200).send(JSON.stringify(response));
                }


            } else {
                res.status(400).send(err);
            }

        });


    });


});

//modify booking
router.put('/update', function (req, res, next) {
    var id = req.body.id;
    if (typeof id == 'undefined' || id == '') {
        id = "id";
        log.error("id is error");
    }

    var response = [];

    var sqlPrepare = ["update bk_booking set id = ? "];
    var paramValue = [id];


    var status = req.body.status;
    if (typeof status !== 'undefined' && status !== '') {
        sqlPrepare.push(",status = ?");
        paramValue.push(status);
    }

    var year = req.body.year;
    if (typeof year !== 'undefined' && year !== '') {
        sqlPrepare.push(",year = ?");
        paramValue.push(year);
    }
    var month = req.body.month;
    if (typeof month !== 'undefined' && month !== '') {
        sqlPrepare.push(",month = ?");
        paramValue.push(month);
    }
    var day = req.body.day;
    if (typeof day !== 'undefined' && day !== '') {
        sqlPrepare.push(",day = ?");
        paramValue.push(day);
    }
    var weekday = req.body.weekday;
    if (typeof weekday !== 'undefined' && weekday !== '') {
        sqlPrepare.push(",weekday = ?");
        paramValue.push(weekday);
    }
    var hour = req.body.hour;
    if (typeof hour !== 'undefined' && hour !== '') {
        sqlPrepare.push(",hour = ?");
        paramValue.push(hour);
    }
    var memo1 = req.body.memo1;
    if (typeof memo1 !== 'undefined' && memo1 !== '') {
        sqlPrepare.push(",memo1 = ?");
        paramValue.push(memo1);
    }
    var memo2 = req.body.memo2;
    if (typeof memo2 !== 'undefined' && memo2 !== '') {
        sqlPrepare.push(",memo2 = ?");
        paramValue.push(memo2);
    }
    var memo2_1 = req.body.memo2_1;
    if (typeof memo2_1 !== 'undefined' && memo2_1 !== '') {
        sqlPrepare.push(",memo2_1 = ?");
        paramValue.push(memo2_1);
    }

    var prop_class = req.body.prop_class;
    if (typeof prop_class !== 'undefined' && prop_class !== '') {
        sqlPrepare.push(",prop_class = ?");
        paramValue.push(prop_class);
    }

    sqlPrepare.push("where id=?");
    paramValue.push(id);

    var sql = sqlPrepare.join(" ");

    log.debug("sql:" + sql);
    log.debug("param:" + paramValue);

    pool.conn(function (conn) {
        conn.query(sql, paramValue, function (err, result) {
            if (!err) {
                var response = [];

                if (result.affectedRows !== 0) {
                    response.push({
                        'result': 'success',
                        'id': id
                    });

                    // booking approved send msg to userid2

                    //send msg
                    if ("1" == status || "-1" == status || "3" == status || "4" == status) {
                        m_booking.getBooking(id, function (booking) {
                            let userid1 = booking.userid1;
                            let tmpUserid2 = booking.userid2;

                            if ("1" == status) {
                                status = "审核通过";
                            } else if ("-1" == status) {
                                status = "取消预约";
                            } else if ("3" == status) {
                                status = "用户爽约";
                            } else if ("4" == status) {
                                status = "完成履约";
                            } else {
                                status = "未知";
                            }
                            try {
                                m_userInfo.getUserInfo(userid1, function (tmpUserInfo) {
                                    let msg = {};
                                    msg.page = "page/booking/qrBookingDetails?bookingId=" + id;
                                    msg.real_name = tmpUserInfo.real_name;
                                    msg.status = status;
                                    msg.time_format = booking.month + "月" + booking.day + "号 " + booking.hour + "点";
                                    msg.job_location = tmpUserInfo.job_location;

                                    log.debug("sendMsg:userid2" + tmpUserid2);

                                    m_weixinMsg1.sendMsg1(tmpUserid2, msg, function () {

                                    });

                                });
                            } catch (e) {
                                log.error("update send message " + e);
                            }
                        })


                    }

                } else {
                    response.push({
                        'result': 'error',
                        'msg': 'update  error id:' + id
                    });
                }

                res.setHeader('Content-Type', 'application/json');
                res.status(200).send(JSON.stringify(response));
            } else {
                res.status(400).send(err);
            }

        })
    });


});


module.exports = router;

