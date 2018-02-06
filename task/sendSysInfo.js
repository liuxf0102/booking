var pool = require("../lib/mysql_pool");
var m_weixinMsg = require("../lib/weixinMsg");
var log = require('log4js').getLogger("lib/sysInfo");
log.level = "debug";
log.debug("task execute.");


let sendSysInfo= function(){

    let msg={};
    msg.sys_info="系统功能升级";
    msg.tip="添加预约类型自定义功能，个性化设置-预约类型:可以定义适合自己的预约类型，赶快去设置吧。"

    let userid=999;

    var sqlPrepare = ["select * from bk_user u where  userid= 999"];
    var paramValue = [];


    var sql = sqlPrepare.join(" ");
    log.debug("sql:" + sql);
    log.debug("param :" + paramValue.join(" "));

    pool.conn(function (conn) {
        conn.query(sql, paramValue, function (err, result) {
            if (!err) {
                    for(let i=0;i<result.length;i++){
                        let tmpUserid=result[i].userid;
                        m_weixinMsg.sendMsgSysInfo(tmpUserid,msg,function (err) {
                            if(!err)
                            {
                                log.debug("send msg ok userid :"+tmpUserid);
                            }else {
                                log.error("send msg error:"+err.msg);
                            }

                        })
                    }

            } else {
                log.error("query user:"+err);
            }

        })
    });

};
sendSysInfo();




