var express = require('express');
var router = express.Router();
var pool = require("../lib/mysql_pool");

var log = require('log4js').getLogger("rota");
log.level = "debug";

router.post('/list', function (req, res, next) {


    var response = [];
    let c_time =new Date().getTime()-180*24*3600*1000;
    var sqlPrepare = ["select *  from bk_rota where  c_time >? "];
    var paramValue = [c_time];
    sqlPrepare.push("and userid = ?");
    var userid = req.body.userid;
    if (typeof userid !== 'undefined' && userid !== '') {
        paramValue.push(userid);
    }else{
        paramValue.push('userid');
    }


    var sql = sqlPrepare.join(" ");
    log.debug("sql:" + sql);
    log.debug("param :" + paramValue.join(" "));

    pool.conn(function (conn) {
        conn.query(sql, paramValue, function (err, result) {
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
    var userid = req.body.userid;

    var day = req.body.day;
    var flag = req.body.flag;

    let c_time = new Date().getTime();
    res.setHeader('Content-Type', 'application/json');
    var response = [];

    var sqlPrepare = ["insert into bk_rota (userid,day,flag,c_time,m_time) values (?,?,?,?,?)"];
    var paramValue = [userid,day, flag, c_time, c_time];

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
    var sqlPrepare = ['select *,u.real_name,u.nick_name,u.mobile,u.icon,u.gender,u.job_location  from bk_rota b,bk_user u where'];

        sqlPrepare.push(" b.userid = u.userid");

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

    var response = [];

    var sqlPrepare = ["update bk_rota set id = ? "];
    var paramValue = [id];


    var flag = req.body.flag;
    if (typeof flag !== 'undefined' && flag !== '') {
        sqlPrepare.push(",flag = ?");
        paramValue.push(flag);
    }

    var memo = req.body.memo;
    if (typeof memo !== 'undefined' && memo !== '') {
        sqlPrepare.push(",memo = ?");
        paramValue.push(memo);
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

router.put('/updateOrCreate', function (req, res, next) {
    var userid = req.body.userid;

    var response = [];

    var sqlPrepare = ["update bk_rota set userid = ? "];
    var paramValue = [userid];


    var flag = req.body.flag;
    if (typeof flag !== 'undefined' && flag !== '') {
        sqlPrepare.push(",flag = ?");
        paramValue.push(flag);
    }

    var memo = req.body.memo;
    if (typeof memo !== 'undefined' && memo !== '') {
        sqlPrepare.push(",memo = ?");
        paramValue.push(memo);
    }


    sqlPrepare.push("where userid=?");
    paramValue.push(userid);
    sqlPrepare.push("and day = ?");
    var day = req.body.day;
    if (typeof day !== 'undefined' && day !== '') {

        paramValue.push(day);
    }else{
        paramValue.push('day');
    }

    var sql = sqlPrepare.join(" ");

    log.debug("sql:" + sql);
    log.debug("param:" + paramValue);
    res.setHeader('Content-Type', 'application/json');
    pool.conn(function (conn) {
        conn.query(sql, paramValue, function (err, result) {
            if (!err) {
                var response = [];

                if (result.affectedRows !== 0) {
                    response.push({
                        'result': 'success'
                    });
                } else {

                    let c_time = new Date().getTime();
                    let sqlCreatePrepare = ["insert into bk_rota (userid,day,flag,c_time,m_time) values (?,?,?,?,?)"];
                    var paramCreateValue = [userid,day, flag, c_time, c_time];

                    var sqlCreate = sqlCreatePrepare.join(" ");

                    log.debug("sqlCreate:" + sqlCreate);
                    log.debug("param:" + paramCreateValue);
                    conn.query(sqlCreate, paramCreateValue, function (err, result) {
                        if (!err) {


                            if (result.affectedRows !== 0) {
                                response.push({
                                    'result': 'success',
                                    'id': result.insertId
                                });
                            } else {
                                response.push({
                                    'msg': 'create  error :'
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


                }


                res.status(200).send(JSON.stringify(response));
            } else {
                res.status(400).send(err);
            }

        })
    });


});

module.exports = router;

