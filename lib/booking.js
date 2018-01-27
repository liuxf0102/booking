var pool = require("../lib/mysql_pool");

var log = require('log4js').getLogger("lib/userInfo");
log.level = "debug";


let getBooking = function (id, callback) {
    log.debug("id:" + id);

    pool.conn(function (conn) {

        var selectSQL = "select * from bk_booking where id = ?";
        log.debug(selectSQL);
        conn.query(selectSQL, [id], function (err, result) {

            if (!err) {
                if (result.length === 1) {
                    //log.debug("result:" + result[0].memo);
                    log.debug("data:" + JSON.stringify(result[0]));
                    callback(result[0]);

                } else if (result.length > 1) {
                    log.error(" error id:" + result.length);
                    callback("");
                } else {
                    log.error("id:" + result.length);
                    callback("");
                }


            } else {
                log.error(err);

            }

        });


    });
}

exports.getBooking = getBooking;


