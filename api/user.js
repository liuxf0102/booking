var express = require('express');
var router = express.Router();
var pool = require("../lib/mysql_pool");

var log = require('log4js').getLogger("user");
log.level = "debug";

// getUserid by openid
router.post('/getUserid', function (req, res, next) {
    var response = [];
    var openid = req.body.openid;
    var nick_name = req.body.nick_name;
    //var openid = req.params.openid;

    log.debug("openid:" + openid);

    res.setHeader('Content-Type', 'application/json');

    pool.conn(function (conn) {

        var selectSQL = "select userid from bk_user where openid = ?";
        log.debug(selectSQL);
        conn.query(selectSQL, [openid], function (err, result) {

            if (!err) {
                if (result.length === 1) {
                    log.debug("result:" + result[0].userid);
                    //set userid
                    response.push({
                        'result': 'success',
                        'data': result
                    });
                    res.status(200).send(JSON.stringify(response));
                } else if (result.length > 1) {
                    log.error("userid error openid:" + openid);
                    response.push({
                        'msg': 'get userid error: ' + openid + ",result length:" + result.length
                    });
                    res.status(200).send(JSON.stringify(response));
                } else {
                    var insertSQL = "insert into bk_user (openid,nick_name) values(?,?)";
                    log.debug(insertSQL);
                    conn.query(insertSQL, [openid,nick_name], function (err, result) {

                        if (!err) {

                            if (result.affectedRows !== 0) {
                                response.push({
                                    'result': 'success'
                                });
                                response.push({
                                    'userid': result.insertId
                                });
                            } else {
                                response.push({
                                    'msg': 'create userid error.'
                                });
                            }
                            res.status(200).send(JSON.stringify(response));

                        } else {
                            res.status(400).send(err);
                        }

                    })


                }


            } else {
                res.status(400).send(err);
            }

        });


    });


});

router.get('/:userid', function (req, res, next) {
    var userid = req.params.userid;

    var response = [];

    var sql = "select *  from bk_user where  userid =? ";
    var condSQL = "";
    var orderSQL = "  ";

    var user_id2 = req.body.user_id2;
    var yearmd = req.body.yearmd;
    var hourms = req.body.hourms, is_first = req.body.is_first;
    var job_desc = req.body.job_desc, remark = req.body.remark;

    if (typeof yearmd !== 'undefined' && yearmd !== '') {
        condSQL = condSQL + " and (yearmd = '" + yearmd + "') ";
    }

    log.debug("sql:" + sql);

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
router.put('/:userid', function (req, res, next) {
    var userid = req.params.userid;

    var response = [];


    var otherFields = " ";

    var nick_name = req.body.nick_name;
    if (typeof nick_name !== 'undefined' && nick_name !== '') {
        otherFields = otherFields + ",nick_name = '" + nick_name + "') ";
    }

    var real_name = req.body.real_name;
    if (typeof real_name !== 'undefined' && real_name !== '') {
        otherFields = otherFields + ",real_name = '" + real_name + "') ";
    }


    var sql = "update bk_user set userid=? " + otherFields + " where  userid =? ";


    log.debug("sql:" + sql);

    pool.conn(function (conn) {
        conn.query(sql, [userid], function (err, result) {
            if (!err) {
                var response = [];

                if (result.affectedRows !== 0) {
                    response.push({
                        'result': 'success'
                    });
                    response.push({
                        'userid': result.insertId
                    });
                } else {
                    response.push({
                        'msg': 'update user error:'+userid
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

