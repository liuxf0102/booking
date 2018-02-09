var m_qrcode = require("../lib/qrcode");
var log = require('log4js').getLogger("lib/qrcode");
log.level = "debug";
m_qrcode.createQr("",function (err,imgName) {
    log.debug(imgName);
})