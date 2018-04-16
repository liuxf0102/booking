var express = require('express');
var router = express.Router();

var log = require('log4js').getLogger("api/jf_vendor");
log.level = "debug";

router.get('/getLedgerInfo', function (req, res, next) {
    var response = [];
    let data={
        "blocks": 222,
        "block_speed": 222,
        "transaction_activity": 295,
        "deployment": 2,
        "invokes": 293
    }
    response.push({
        'result': 'success',
        'data': data
    });

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify(response));
});

router.get('/getServerInfo', function (req, res, next) {
    var response = [];
    let data={
        "BCS_URL": "http://129.157.179.22:3019",
        "BCS_CHANNEL": "appdev1orderer",
        "BCS_VERSION":"medicine",
        "BCS_CHAINCODE":"v1"

    }
    response.push({
        'result': 'success',
        'data': data
    });

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify(response));
});



module.exports = router;

