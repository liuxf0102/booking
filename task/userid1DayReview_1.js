var pool = require("../lib/mysql_pool");
var m_weixinMsg = require("../lib/weixinMsg");
var log = require('log4js').getLogger("lib/sysInfo");
log.level = "debug";
log.debug("task execute.");


let sendSysInfo= function(){


    let dayReview=new Map();
    let userid=999;

    var sqlPrepare = ["select id,userid1,status,year,month,day from bk_booking where (status=1) and year=date_format(now(),'%Y') and month=date_format(now(),'%m') and day=date_format(now(),'%e') "];
    var paramValue = [];


    var sql = sqlPrepare.join(" ");
    log.debug("sql:" + sql);
    log.debug("param :" + paramValue.join(" "));
    pool.conn(function (conn) {
        conn.query(sql, paramValue, function (err, result) {
            if (!err) {
                    for(let i=0;i<result.length;i++){
                        let tmpUserid=result[i].userid1;
                        let tmpStatus=result[i].status;
                        let msg={};
                        msg.sys_info="今天预约总结";
                        msg.status1=0;
                        msg.status4=0;
                        msg.status0=0;
                        if(dayReview.get(tmpUserid)){
                            msg=dayReview.get(tmpUserid);
                        }
                        if(tmpStatus==0){
                            msg.status0++;
                        }
                        if(tmpStatus==1){
                            msg.status1++;
                        }
                        if(tmpStatus==4){
                            msg.status4++;
                        }
                        dayReview.set(tmpUserid, msg);
                    }
                console.log(JSON.stringify([...dayReview]));

            } else {
                log.error("query user:"+err);
            }

        })
    });
    
};
sendSysInfo();




