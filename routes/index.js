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

var weixin = require('../api/weixin');
router.use("/weixin",weixin);

module.exports = router;
