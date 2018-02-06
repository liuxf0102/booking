var pool = require("../lib/mysql_pool");

var log = require('log4js').getLogger("lib/userInfo");
log.level = "debug";


let getUserInfo = function (userid, callback) {
    log.debug("userid:" + userid);

    pool.conn(function (conn) {

        var selectSQL = "select * from bk_user where userid = ?";
      //  log.debug(selectSQL);
        conn.query(selectSQL, [userid], function (err, result) {

            if (!err) {
                if (result.length === 1) {
                    //log.debug("result:" + result[0].memo);
                   // log.debug("userInfo:" + JSON.stringify(result[0]));
                    callback(result[0]);

                } else if (result.length > 1) {
                    log.error("userid error userid:" + result.length);
                    callback("");
                } else {
                    log.error("userid error userid:" + result.length);
                    callback("");
                }


            } else {
                log.error(err);

            }

        });


    });
}
let updateFormids = function (userid, formids, callback) {
  //  log.debug("userid:" + userid);

    pool.conn(function (conn) {

        var selectSQL = "update bk_user set formids=? where userid = ?";
   //     log.debug(selectSQL);
  //      log.debug("formids:" + formids + " userid:" + userid);
        conn.query(selectSQL, [formids, userid], function (err, result) {

            if (!err) {
                if (result.affectedRows === 1) {
                    //log.debug("result:" + result[0].memo);
                    log.debug("userInfo:" + JSON.stringify(result));
                    callback(result[0]);

                } else {
                    log.error("userid error userid:" + JSON.stringify(result));
                    callback("");
                }


            } else {
                log.error(err);

            }

        });


    });
}
let getUserFormid = function (userInfo, callback) {

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

                if (formidsOld[0].expire < (new Date().getTime())) {
                    expireCount++;
                }
            } catch (e) {
                log.error(e);
            }
        }

        for (let i = 0; i < expireCount; i++) {
            formidsOld.shift();
        }
        //log.debug("formidsOld checked:" + JSON.stringify(formidsOld));
        let formid = "";
        if (formidsOld.length > 0) {
            try {
                formid = formidsOld[0].formid;
            }catch (e){
                log.error("get formid error "+e);
            }
        }
        formidsOld.shift();
        //update formids
        updateFormids(userInfo.userid, JSON.stringify(formidsOld), function () {

        });
       // log.debug("formid:"+formid);
        callback(formid);
    }


}

exports.getUserInfo = getUserInfo;
exports.getUserFormid = getUserFormid;

