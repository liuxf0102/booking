var mysql = require("mysql");
var pool = mysql.createPool({
    host: '192.168.139.111',
    user: 'root',
    password: '',
    database: 'booking',
    port: 3306
});
var dbPool = {};
dbPool.conn = function (callback) {   //callback是回调函数，连接建立后的connection作为其参数
    pool.getConnection(function (err, connection) {
        console.log("connect start...")
        if (err) {      //对异常进行处理
            throw err;  //抛出异常
        } else {
            callback(connection);   //如果正常的话，执行回调函数（即请求）
        }
        connection.release();   //释放连接
        console.log("connect end...")
    })
}
module.exports = dbPool;


