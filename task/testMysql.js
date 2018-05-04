var query=require("./mysql_pool");

query("select * from bk_user where id=999", [1], function(err,results,fields){
    //do something
    console.log("eed");
});
console.log("eee");
process.exit();