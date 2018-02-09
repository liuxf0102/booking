var fs = require('fs');
var qr = require('qr-image');
let moment = require('moment');

let createQr = function(content, callback){
    let t=moment(new Date()).format('YYYYMMDDHHmmss');
    var imgName = t+'-'+Math.ceil(Math.random()*89+10);
    if(content==null||content=="")
    {
        content=imgName;
    }
    var qr_png = qr.image(content, { type: 'png',size : 12,margin:0  });

    imgName = `/Xiaocx/www-booking/public/qrfood/${imgName}.png`;
    var qr_pipe = qr_png.pipe(fs.createWriteStream(imgName));
    qr_pipe.on('error', function(err){
        console.log(err);
        callback(err,null);
        return;
    })
    qr_pipe.on('finish', function(){
        callback(null,content);
    })
};

exports.createQr = createQr;