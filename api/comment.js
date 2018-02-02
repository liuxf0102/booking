var express = require('express');
var router = express.Router();
var pool = require("../lib/mysql_pool");

var log = require('log4js').getLogger("rota");
log.level = "debug";

router.post('/list', function (req, res, next) {


    var response = [];
    let c_time = new Date().getTime() - 180 * 24 * 3600 * 1000;
    var sqlPrepare = ["select *  from bk_comment where  c_time >? "];
    var paramValue = [c_time];




    var sql = sqlPrepare.join(" ");
    log.debug("sql:" + sql);
    log.debug("param :" + paramValue.join(" "));

    pool.conn(function (conn) {
        conn.query(sql, paramValue, function (err, result) {
            if (!err) {
                var response = [];


                response.push({
                    'result': 'success',
                    'data': result
                });


                res.setHeader('Content-Type', 'application/json');
                res.status(200).send(JSON.stringify(response));
            } else {
                log.error("err:"+err);
                res.status(400).send(err);
            }

        })
    });


});
//modify user info
router.post('/create', function (req, res, next) {
    log.debug("req.body" + JSON.stringify(req.body));
    var appid = req.body.appid;

    if (typeof appid == 'undefined' || appid == '') {

        appid="0";
    }

    var userid2 = req.body.userid2;

    var comment = req.body.comment;
    var reply = req.body.reply;

    let c_time = new Date().getTime();
    res.setHeader('Content-Type', 'application/json');
    var response = [];

    var sqlPrepare = ["insert into bk_comment (appid,userid2,comment,c_time,m_time) values (?,?,?,?,?)"];
    var paramValue = [appid,userid2, comment,  c_time, c_time];

    var sql = sqlPrepare.join(" ");

    log.debug("sql:" + sql);
    log.debug("param:" + paramValue);

    pool.conn(function (conn) {
        conn.query(sql, paramValue, function (err, result) {
            if (!err) {


                if (result.affectedRows !== 0) {
                    response.push({
                        'result': 'success',
                        'data': result.insertId
                    });
                } else {
                    response.push({
                        'msg': 'create comment error :'
                    });
                }


                res.status(200).send(JSON.stringify(response));
            } else {

                log.error("create comment:" + err);
                response.push({
                    'result': 'error',
                    'data': err
                });
                res.status(400).send(JSON.stringify(response));
            }

        })
    });


});
//get comment by id
router.post('/byId', function (req, res, next) {
    var response = [];
    var id = req.body.id;
    log.debug("id:" + id);
    var sqlPrepare = ['select *,u.real_name,u.nick_name,u.mobile,u.icon,u.gender,u.job_location  from bk_comment b,bk_user u where'];

    sqlPrepare.push(" b.userid2 = u.userid");

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

//modify comment
router.put('/update', function (req, res, next) {
    var id = req.body.id;

    var response = [];

    var sqlPrepare = ["update bk_comment set id = ? "];
    var paramValue = [id];


    var reply = req.body.reply;
    if (typeof reply !== 'undefined' && reply !== '') {
        sqlPrepare.push(",reply = ?");
        paramValue.push(reply);
    }
    var status = req.body.status;
    if (typeof status !== 'undefined' && status !== '') {
        sqlPrepare.push(",status = ?");
        paramValue.push(status);
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

