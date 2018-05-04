var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Booking' });
});

var user = require('../api/user');
router.use("/user",user);

var booking = require('../api/booking');
router.use("/booking",booking);

var rota = require('../api/rota');
router.use("/rota",rota);

var comment = require('../api/comment');
router.use("/comment",comment);


var weixin = require('../api/weixin');
router.use("/weixin",weixin);


var qrcode = require('../api/qrcode');
router.use("/qrcode",qrcode);



/*//////////////////////////////////////////////////////////*/
var weixin_1 = require('../api/weixin_1');
router.use("/weixin_1",weixin_1);
var weixin_jifen = require('../api/weixin_jifen');
router.use("/weixin_jifen",weixin_jifen);

var food = require('../api/food');
router.use("/food",food);


var jf_vendor = require('../api/jf_vendor');
router.use("/jf_vendor",jf_vendor);


var proxy = require('../proxy/bcs');
router.use("/proxy/bcs",proxy);


var config = require('../api/config');
router.use("/config",config);

/*//////////////////////////////////////////////////////////*/


module.exports = router;
