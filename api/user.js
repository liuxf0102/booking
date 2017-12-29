var express = require('express');
var router = express.Router();
var query = require("../lib/mysql_pool");

var log = require('log4js').getLogger("booking");
log.level = "debug";



var listSQL = "select *  from bk_dates where  id =? ";
var condSQL = "";
var orderSQL = " order by yearmd ";

router.get('/list/:user_id1/', function (req, res, next) {
    var user_id1 = req.params.user_id1;

    var response = [];

    var user_id2 = req.body.user_id2;
    var yearmd = req.body.yearmd;
    var hourms = req.body.hourms, is_first = req.body.is_first;
    var job_desc = req.body.job_desc, remark = req.body.remark;

    if (typeof yearmd !== 'undefined' && yearmd !== '') {
        condSQL = condSQL + " and (yearmd = '" + yearmd + "') ";
    }

    log.debug("querySql 3:" + listSQL + condSQL + orderSQL);

    query(listSQL + condSQL + orderSQL, [user_id1], function (err, rows, fields) {


        if (!err) {
            var response = [];

            if (rows.length !== 0) {
                response.push({
                    'result': 'success',
                    'data': rows
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
    });

});


module.exports = router;

