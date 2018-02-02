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



var weixin = require('../api/weixin');
router.use("/weixin",weixin);


var qrcode = require('../api/qrcode');
router.use("/qrcode",qrcode);


/*//////////////////////////////////////////////////////////*/
var weixin_food = require('../api/weixin_food');
router.use("/weixin_food",weixin_food);

module.exports = router;
