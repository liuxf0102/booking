var express = require('express');
var router = express.Router();
var pool = require("../lib/mysql_pool");

var log = require('log4js').getLogger("booking");
log.level = "debug";

router.post('/list', function (req, res, next) {
    var userid = req.body.userid;

    var response = [];

    var sqlPrepare = ["select b.*,u.real_name,u.nick_name,u.mobile,u.icon,u.gender  from bk_booking b,bk_user u where b.userid2=u.userid and userid1 =? "];
    var paramValue = [userid];
    var month = req.body.month;
    if (typeof month !== 'undefined' && month !== '') {
        sqlPrepare.push("and month = ?");
        paramValue.push(month);
    }

    var sql = sqlPrepare.join(" ");
    log.debug("sql:" + sql);
    log.debug("param :" + paramValue.join(" "));

    pool.conn(function (conn) {
        conn.query(sql, [userid], function (err, result) {
            if (!err) {
                var response = [];

                if (result.length !== 0) {
                    response.push({
                        'result': 'success',
                        'data': result
                    });
                } else {
                    response.push({
                        'result': 'error',
                        'msg': 'No Results Found'
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
//modify user info
router.post('/create', function (req, res, next) {
    log.debug("req.body" + JSON.stringify(req.body));
    var userid1 = req.body.userid1;
    var userid2 = req.body.userid2;
    var status = req.body.status;
    var year = req.body.year;
    var month = req.body.month;
    var day = req.body.day;
    var weekday = req.body.weekday;
    var hour = req.body.hour;
    var minute = req.body.minute;
    let c_time = new Date().getTime();
    res.setHeader('Content-Type', 'application/json');
    var response = [];

    var sqlPrepare = ["insert into bk_booking (userid1,userid2,status,year,month,day,weekday,hour,minute,c_time,m_time) values (?,?,?,?,?,?,?,?,?,?,?)"];
    var paramValue = [userid1, userid2, status, year, month, day, weekday, hour, minute, c_time, c_time];

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
    log.debug("id:" + id);
    res.setHeader('Content-Type', 'application/json');
    pool.conn(function (conn) {

        var selectSQL = "select b.*,u.real_name,u.nick_name,u.mobile,u.icon,u.gender  from bk_booking b,bk_user u where b.userid2=u.userid and id =? ";
        log.debug(selectSQL);
        conn.query(selectSQL, [id], function (err, result) {

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
                } else {
                    response.push({
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

