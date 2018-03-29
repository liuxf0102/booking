var express = require('express');
var router = express.Router();
var pool = require("../lib/mysql_pool");
let m_qrcode = require("../lib/qrcode");

var log = require('log4js').getLogger("api/jf_vendor");
log.level = "debug";

router.post('/list', function (req, res, next) {


    var response = [];
    let c_time = new Date().getTime() - 180 * 24 * 3600 * 1000;
    var sqlPrepare = ["select *  from jf_vendor where  c_time >? "];
    var paramValue = [c_time];
    sqlPrepare.push("and userid = ?");
    var userid = req.body.userid;
    if (typeof userid !== 'undefined' && userid !== '') {
        paramValue.push(userid);
    } else {
        paramValue.push('userid');
    }


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
                log.error("err:" + err);
                res.status(400).send(err);
            }

        })
    });


});


//modify user info
router.post('/create', function (req, res, next) {
    log.debug("req.body" + JSON.stringify(req.body));
    var userid = req.body.userid;
    res.setHeader('Content-Type', 'application/json');
    var response = [];

    var vendorid = req.body.vendorid;
    var content = req.body.content;

    var memo = req.body.memo;

    let c_time = new Date().getTime();


    var vendorid = req.body.vendorid;
    if (typeof vendorid !== 'undefined' && vendorid !== '') {
        var sqlPrepare = ["insert into jf_vendor (userid,vendorid,content,memo,c_time,m_time) values (?,?,?,?,?,?)"];
        var paramValue = [userid, vendorid, content, memo, c_time, c_time];

        var sql = sqlPrepare.join(" ");

        log.debug("sql:" + sql);
        log.debug("param:" + paramValue);
        pool.conn(function (conn) {
            conn.query(sql, paramValue, function (err, result) {
                if (!err) {


                    if (result.affectedRows !== 0) {
                        response.push({
                            'result': 'success',
                            'data': {id: result.insertId, vendorid: vendorid, c_time: c_time}
                        });
                    } else {
                        response.push({
                            'msg': 'create  error :'
                        });
                    }


                    res.status(200).send(JSON.stringify(response));
                } else {

                    log.error("create :" + err);
                    response.push({
                        'result': 'error',
                        'data': err
                    });
                    res.status(400).send(JSON.stringify(response));
                }

            })
        });

    }


});
//get booking by id
router.post('/byId', function (req, res, next) {
    var response = [];
    var id = req.body.id;
    log.debug("id:" + id);
    var sqlPrepare = ['select *,u.real_name,u.nick_name,u.mobile,u.icon,u.gender,u.job_location  from jf_vendor b,bk_user u where'];

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

router.put('/update', function (req, res, next) {
    var userid = req.body.userid;

    var vendorid=req.body.vendorid;

    var score=req.body.score;


    var response = [];

    var sqlPrepare = ["update jf_vendor set score = ? "];
    var paramValue = [score];

    var rank = req.body.rank;
    if (typeof rank !== 'undefined' && rank !== '') {
        sqlPrepare.push(",rank = ?");
        paramValue.push(rank);
    }


    var memo = req.body.memo;
    if (typeof memo !== 'undefined' && memo !== '') {
        sqlPrepare.push(",memo = ?");
        paramValue.push(memo);
    }

    sqlPrepare.push("where userid=? and vendorid=?");
    paramValue.push(userid);
    paramValue.push(vendorid);

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
                        'userid': userid
                    });
                } else {
                    response.push({
                        'msg': 'update  error :'                     });
                }

                res.setHeader('Content-Type', 'application/json');
                res.status(200).send(JSON.stringify(response));
            } else {
                res.status(400).send(err);
            }

        })
    });


});
router.post('/addScore', function (req, res, next) {
    var userid = req.body.userid;

    var vendorid=req.body.vendorid;

    var score=req.body.score;


    var response = [];

    var sqlPrepare = ["update jf_vendor set score = score+? "];
    var paramValue = [score];


    sqlPrepare.push("where userid=? and vendorid=?");
    paramValue.push(userid);
    paramValue.push(vendorid);

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
                        'userid': userid
                    });
                } else {
                    response.push({
                        'msg': 'update  error :'                     });
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

    var sqlPrepare = ["update jf_vendor set userid = ? "];
    var paramValue = [userid];


    var content = req.body.content;
    if (typeof content !== 'undefined' && content !== '') {
        sqlPrepare.push(",content = ?");
        paramValue.push(content);
    }

    var memo = req.body.memo;
    if (typeof memo !== 'undefined' && memo !== '') {
        sqlPrepare.push(",memo = ?");
        paramValue.push(memo);
    }


    sqlPrepare.push("where userid=?");
    paramValue.push(userid);


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
                    res.status(200).send(JSON.stringify(response));
                } else {

                    let c_time = new Date().getTime();
                    let sqlCreatePrepare = ["insert into jf_vendor (userid,content,c_time,m_time) values (?,?,?,?)"];
                    var paramCreateValue = [userid, content, c_time, c_time];

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


            } else {
                res.status(400).send(err);
            }

        })
    });


});
router.post('/getOrCreateVendorByUserid', function (req, res, next) {
    var response = [];
    var userid = req.body.userid;

    if (typeof userid == 'undefined' || userid == '') {
        userid = "userid";
        log.error("userid is userid");
    }

    var vendorid = req.body.vendorid;

    if (typeof vendorid == 'undefined' || vendorid == '') {
        vendorid = "vendorid";
        log.error("vendorid is vendorid");
    }

    var rank = req.body.rank;

    if (typeof rank == 'undefined' || rank == '') {
        rank = "";
        log.error("rank is empty");
    }
    var score = req.body.score;

    if (typeof score == 'undefined' || score == '') {
        score = "";
        log.error("score is empty");
    }
    let c_time = new Date().getTime();

    res.setHeader('Content-Type', 'application/json');

    pool.conn(function (conn) {

        var selectSQL = "select * from jf_vendor where userid=? and  vendorid = ?";
        log.debug(selectSQL);
        conn.query(selectSQL, [userid,vendorid], function (err, result) {

            if (!err) {
                if (result.length === 1) {
                    log.debug("result:" + result[0]);
                    //set userid
                    response.push({
                        'result': 'success',
                        'data': result[0]
                    });
                    res.status(200).send(JSON.stringify(response));
                } else if (result.length > 1) {
                    log.error("userid error :" + userid);
                    response.push({
                        'msg': 'get userid error: ' + userid + ",result length:" + result.length
                    });
                    res.status(200).send(JSON.stringify(response));
                } else {
                    var insertSQL = "insert into jf_vendor (userid,vendorid,rank,score,c_time,m_time) values(?,?,?,?,?,?)";
                    log.debug(insertSQL);
                    conn.query(insertSQL, [userid,vendorid, rank,score, c_time, c_time], function (err, result) {

                        if (!err) {

                            if (result.affectedRows !== 0) {
                                conn.query(selectSQL, [userid,vendorid], function (err, result) {

                                    if (!err) {
                                        if (result.length === 1) {
                                            log.debug("result:" + result[0]);
                                            //set userid
                                            response.push({
                                                'result': 'success',
                                                'data': result[0]
                                            });
                                            res.status(200).send(JSON.stringify(response));
                                        }
                                    }
                                });

                            } else {
                                response.push({
                                    'msg': 'create userid error.'
                                });
                                res.status(200).send(JSON.stringify(response));
                            }


                        } else {
                            log.error("insertSQL:"+err);
                            res.status(400).send(err);
                        }

                    })


                }


            } else {
                log.error(err);
                res.status(400).send(err);
            }

        });


    });


});

module.exports = router;

