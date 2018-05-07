var express = require('express');
var router = express.Router();
var pool = require("../lib/mysql_pool");
var userInfo = require("../lib/userInfo");

var log = require('log4js').getLogger("user");
log.level = "debug";

// getOrCreateUserInfoByUnionid
router.post('/getOrCreateUserInfoByUnionid', function (req, res, next) {
    var response = [];
    var openid = req.body.openid;
    var unionid = req.body.unionid;
    var nick_name = req.body.nick_name;
    var icon = req.body.icon;
    var gender = req.body.gender;


    if (typeof unionid == 'undefined' || unionid == '') {
        unionid = "unionid";
        log.error("userid is unionid");
    }
    let appid=req.body.appid;
    if (typeof appid == 'undefined' || appid == '') {
        appid=0;
    }
    //var openid = req.params.openid;
    let c_time = new Date().getTime();
    log.debug("openid:" + openid);
    log.debug("unionid:" + unionid);
    log.debug("nick_name:" + nick_name);

    res.setHeader('Content-Type', 'application/json');

    pool.conn(function (conn) {

        var selectSQL = "select * from bk_user where appid=? and  unionid = ?";
        log.debug(selectSQL);
        conn.query(selectSQL, [appid,unionid], function (err, result) {

            if (!err) {
                if (result.length === 1) {
                    log.debug("result:" + result[0].unionid);
                    //set userid
                    response.push({
                        'result': 'success',
                        'myInfo': result[0]
                    });
                    res.status(200).send(JSON.stringify(response));
                } else if (result.length > 1) {
                    log.error("userid error openid:" + openid);
                    response.push({
                        'msg': 'get userid error: ' + openid + ",result length:" + result.length
                    });
                    res.status(200).send(JSON.stringify(response));
                } else {
                    var insertSQL = "insert into bk_user (appid,unionid,openid,nick_name,icon,gender,c_time,m_time) values(?,?,?,?,?,?,?,?)";
                    log.debug(insertSQL);
                    conn.query(insertSQL, [appid,unionid, openid, nick_name, icon, gender, c_time, c_time], function (err, result) {

                        if (!err) {

                            if (result.affectedRows !== 0) {
                                conn.query(selectSQL, [appid,unionid], function (err, result) {

                                    if (!err) {
                                        if (result.length === 1) {
                                            log.debug("result:" + result[0].userid);
                                            //set userid
                                            response.push({
                                                'result': 'success',
                                                'myInfo': result[0]
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
// getOrCreateUserInfoByMobile
router.post('/getOrCreateUserInfoByMobile', function (req, res, next) {
    var response = [];
    var mobile = req.body.mobile;
    if (typeof mobile == 'undefined' || mobile == '') {
        mobile = "mobile";
        log.error("userid is mobile");
    }
    let appid=req.body.appid;
    if (typeof appid == 'undefined' || appid == '') {
        appid=0;
    }
    let c_time = new Date().getTime();
    log.debug("mobile:" + mobile);
    res.setHeader('Content-Type', 'application/json');
    pool.conn(function (conn) {

        var selectSQL = "select * from bk_user where appid=? and  mobile = ?";
        log.debug(selectSQL);
        conn.query(selectSQL, [appid,mobile], function (err, result) {

            if (!err) {
                if (result.length === 1) {
                    log.debug("result:" + result[0].userid);
                    //set userid
                    response.push({
                        'result': 'success',
                        'myInfo': result[0]
                    });
                    res.status(200).send(JSON.stringify(response));
                } else if (result.length > 1) {
                    log.error("userid error mobile:" + mobile);
                    response.push({
                        'msg': 'get userid error: ' + mobile + ",result length:" + result.length
                    });
                    res.status(200).send(JSON.stringify(response));
                } else {
                    var insertSQL = "insert into bk_user (appid,mobile,nick_name,real_name,c_time,m_time) values(?,?,'','',?,?)";
                    log.debug(insertSQL);
                    conn.query(insertSQL, [appid,mobile, c_time, c_time], function (err, result) {

                        if (!err) {

                            if (result.affectedRows !== 0) {
                                conn.query(selectSQL, [mobile], function (err, result) {

                                    if (!err) {
                                        if (result.length === 1) {
                                            log.debug("result:" + result[0].userid);
                                            //set userid
                                            response.push({
                                                'result': 'success',
                                                'myInfo': result[0]
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
                            log.error("create uesr:" + err);
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
// getUserid by mobile
router.post('/getUserInfoByMobile', function (req, res, next) {
    var response = [];
    var mobile = req.body.mobile;
    if (typeof mobile == 'undefined' || mobile == '') {
        mobile = "mobile";
        log.error("userid is mobile");
    }
    let appid=req.body.appid;
    if (typeof appid == 'undefined' || appid == '') {
        appid=0;
    }
    log.debug("mobile:" + mobile);
    res.setHeader('Content-Type', 'application/json');
    pool.conn(function (conn) {

        var selectSQL = "select * from bk_user where appid=? and mobile = ?";
        log.debug(selectSQL);
        conn.query(selectSQL, [appid,mobile], function (err, result) {

            if (!err) {
                if (result.length === 1) {
                    log.debug("result:" + result[0].userid);
                    //set userid
                    response.push({
                        'result': 'success',
                        'myInfo': result[0]
                    });
                    res.status(200).send(JSON.stringify(response));
                } else if (result.length > 1) {
                    log.error("userid error mobile:" + mobile + "result.length" + result.length);
                    response.push({
                        'result': 'error'
                    });
                    res.status(200).send(JSON.stringify(response));
                } else {
                    response.push({
                        'result': 'error',
                        'myInfo': '{}'
                    });
                    res.status(200).send(JSON.stringify(response));
                }


            } else {
                res.status(400).send(err);
            }

        });


    });


});
// getUserid by userid
router.post('/getUserInfoByUserid', function (req, res, next) {
    var response = [];
    var userid = req.body.userid;
    if (typeof userid == 'undefined' || userid == '') {
        userid = "userid";
        log.error("userid is error");
    }
    log.debug("userid:" + userid);
    res.setHeader('Content-Type', 'application/json');
    pool.conn(function (conn) {

        var selectSQL = "select * from bk_user where userid = ?";
        log.debug(selectSQL);
        conn.query(selectSQL, [userid], function (err, result) {

            if (!err) {
                if (result.length === 1) {
                    log.debug("result:" + result[0].userid);
                    //set userid
                    response.push({
                        'result': 'success',
                        'myInfo': result[0]
                    });
                    res.status(200).send(JSON.stringify(response));
                } else if (result.length > 1) {
                    log.error("userid error userid:" + result.length);
                    response.push({
                        'result': 'error'
                    });
                    res.status(200).send(JSON.stringify(response));
                } else {
                    response.push({
                        'result': 'error',
                        'myInfo': '{}'
                    });
                    res.status(200).send(JSON.stringify(response));
                }


            } else {
                res.status(400).send(err);
            }

        });


    });


});
//modify user info
router.put('/update', function (req, res, next) {
    var userid = req.body.userid;
    if (typeof userid == 'undefined' || userid == '') {
        userid = "userid";
        log.error("userid is error");
    }
    let m_time = new Date().getTime();
    var response = [];

    var sqlPrepare = ["update bk_user set m_time=?,userid = ? "];
    var paramValue = [m_time, userid];


    var nick_name = req.body.nick_name;
    if (typeof nick_name !== 'undefined' && nick_name !== '') {
        sqlPrepare.push(",nick_name = ?");
        paramValue.push(nick_name);
    }

    var real_name = req.body.real_name;
    if (typeof real_name !== 'undefined' && real_name !== '') {
        sqlPrepare.push(",real_name = ?");
        paramValue.push(real_name);
    }
    var mobile = req.body.mobile;
    if (typeof mobile !== 'undefined' && mobile !== '') {
        sqlPrepare.push(",mobile = ?");
        paramValue.push(mobile);
    }
    var job_title = req.body.job_title;
    if (typeof job_title !== 'undefined' && job_title !== '') {
        sqlPrepare.push(",job_title = ?");
        paramValue.push(job_title);
    }
    ;

    var job_location = req.body.job_location;
    if (typeof job_location !== 'undefined' && job_location !== '') {
        sqlPrepare.push(",job_location = ?");
        paramValue.push(job_location);
    }
    ;

    var job_office = req.body.job_office;
    if (typeof job_office !== 'undefined' && job_office !== '') {
        sqlPrepare.push(",job_office = ?");
        paramValue.push(job_office);
    }
    ;
    var version = req.body.version;
    if (typeof version !== 'undefined' && version !== '') {
        sqlPrepare.push(",version = ?");
        paramValue.push(version);
    }
    ;


    var memo = req.body.memo;
    if (typeof memo !== 'undefined' && memo !== '') {
        sqlPrepare.push(",memo = ?");
        paramValue.push(memo);
    }
    ;

    var icon = req.body.icon;
    if (typeof icon !== 'undefined' && icon !== '') {
        sqlPrepare.push(",icon = ?");
        paramValue.push(icon);
    }
    ;
    var gender = req.body.gender;
    if (typeof gender !== 'undefined' && gender !== '') {
        sqlPrepare.push(",gender = ?");
        paramValue.push(gender);
    };
    var config = req.body.config;
    if (typeof config !== 'undefined' && config !== '') {
        sqlPrepare.push(",config = ?");
        paramValue.push(config);
    };

    sqlPrepare.push("where userid=?");
    paramValue.push(userid);

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
                        'msg': 'update user error userid:' + userid
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

router.put('/appendFormids', function (req, res, next) {
    let userid = req.body.userid;
    if (typeof userid == 'undefined' || userid == '') {
        userid = "userid";
        log.error("userid is error");
    }
    let strFormidsNew = req.body.formids;
    log.debug("strFormidsNew:" + strFormidsNew);
    let formidsNew = [];
    if (typeof strFormidsNew !== 'undefined' && strFormidsNew !== '') {
        formidsNew = JSON.parse(strFormidsNew)
    }
    ;
    //get old fromIds from db
    userInfo.getUserInfo(userid, function (userInfo) {

        let strFormidsOld = userInfo.formids;
        let formidsOld = [];
        if (strFormidsOld == "") {
            formidsOld = [];
        } else {
            formidsOld = JSON.parse(strFormidsOld);
            //check whether the formId has expired
            let formidsOldCount = formidsOld.length;
            let expireCount = 0;
            for (let i = 0; i < formidsOldCount; i++) {
                //log.debug("formidsOld[]" + i + ":" + JSON.stringify(formidsOld[i].expire));
                try {

                    if (formidsOld[0].expire < new Date().getTime() ) {
                        expireCount++;
                    }
                } catch (e) {
                    log.error(e);
                }
            }

            for (let i = 0; i < expireCount; i++) {
                formidsOld.shift();
            }
            log.debug("formidsOld checked:" + JSON.stringify(formidsOld));
        }
        //log.debug("formids old:" +formidsOld.length+":"+JSON.stringify(formidsOld));
        //log.debug("formids new:" + JSON.stringify(formidsNew));
        for (let n = 0; n < formidsNew.length; n++) {
            formidsOld.push(formidsNew[n]);
        }


        //log.debug("formids appended:" + JSON.stringify(formidsOld));
        // Keep the latest 25 formids
        let formidsCount = formidsOld.length;
        for (let i = 25; i < formidsCount; i++) {
            formidsOld.shift();
        }


        let tmpStrFormids = JSON.stringify(formidsOld);
        //log.debug("fromIds to db:"+tmpStrFormids);
        let m_time = new Date().getTime();
        var response = [];

        var sqlPrepare = ["update bk_user set m_time=?,formids = ? "];
        var paramValue = [m_time, tmpStrFormids];

        sqlPrepare.push("where userid=?");
        paramValue.push(userid);

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
                            'msg': 'update user error userid:' + userid
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

});

//merge unionid userid 2 mobile userid
router.put('/mergeUnionid2mobileid', function (req, res, next) {
    var userid = req.body.userid;
    if (typeof userid == 'undefined' || userid == '') {
        userid = "userid";
        log.error("userid is error");
    }
    let m_time = new Date().getTime();
    var response = [];
    res.setHeader('Content-Type', 'application/json');
    var sqlPrepare = ["update bk_user set m_time=?,userid = ? "];
    var paramValue = [m_time, userid];


    var unionid = req.body.unionid;
    if (typeof unionid !== 'undefined' && unionid !== '') {
        sqlPrepare.push(",unionid = ?");
        paramValue.push(unionid);
    }

    var openid = req.body.openid;
    if (typeof openid !== 'undefined' && openid !== '') {
        sqlPrepare.push(",openid = ?");
        paramValue.push(openid);
    }
    var nick_name = req.body.nick_name;
    if (typeof nick_name !== 'undefined' && nick_name !== '') {
        sqlPrepare.push(",nick_name = ?");
        paramValue.push(nick_name);
    }

    var icon = req.body.icon;
    if (typeof icon !== 'undefined' && icon !== '') {
        sqlPrepare.push(",icon = ?");
        paramValue.push(icon);
    }

    var gender = req.body.gender;
    if (typeof gender !== 'undefined' && gender !== '') {
        sqlPrepare.push(",gender = ?");
        paramValue.push(gender);
    }
    let appid=req.body.appid;
    if (typeof appid == 'undefined' || appid == '') {
        appid=0;
    }

    sqlPrepare.push("where userid=?");
    paramValue.push(userid);

    var sql = sqlPrepare.join(" ");

    log.debug("sql:" + sql);
    log.debug("param:" + paramValue);

    let delSql = "delete  from bk_user where appid=? and unionid=? and userid <> ?"
    pool.conn(function (conn) {
        conn.query(sql, paramValue, function (err, result) {
            if (!err) {
                var response = [];

                if (result.affectedRows !== 0) {

                    conn.query(delSql, [appid,unionid, userid], function (err1, result) {
                        if (!err1) {
                            res.status(200).send(JSON.stringify(response));
                        } else {
                            log.error("delete user error unionid:" + unionid + ":" + err1);
                        }
                    });

                } else {
                    log.error("update user error userid:" + userid + ":" + err);
                    response.push({
                        'msg': 'update user error userid:' + userid
                    });
                    res.status(200).send(JSON.stringify(response));
                }


            } else {
                log.error(err);
                res.status(400).send(err);
            }

        })
    });


});

module.exports = router;

