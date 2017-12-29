var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
var booking = require('../api/booking');

router.use("/booking",booking);

module.exports = router;
