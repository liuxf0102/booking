var express = require('express');
var router = express.Router();
var pool = require("../lib/mysql_pool");

var log = require('log4js').getLogger("booking");
log.level = "debug";

router.post('/list', function (req, res, next) {
    var userid = req.body.userid;

    var response = [];

    var sqlPrepare = ["select b.*,u.real_name,u.nick_name  from bk_booking b,bk_user u where b.userid2=u.userid and userid1 =? "];
    var paramValue=[userid];
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
    var year = req.body.year;
    var month = req.body.month;
    var day = req.body.day;
    var weekday = req.body.weekday;
    var hour = req.body.hour;
    var minute = req.body.minute;

    var response = [];

    var sqlPrepare = ["insert into bk_booking (userid1,userid2,year,month,day,weekday,hour,minute) values (?,?,?,?,?,?,?,?)"];
    var paramValue = [userid1, userid2, year, month, day, weekday, hour, minute];

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
                        'id': result.insertId
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


module.exports = router;

