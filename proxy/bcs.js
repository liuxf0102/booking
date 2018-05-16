var express = require('express');
var router = express.Router();
const request = require('request');

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

    let options = {
        method: 'get',
        url: "http://129.156.117.35:3011/api/v1/channels/borderer/summary?peerAddr=peer0.b.com&peerPort=7051&filterby=all",
        json: true,
        headers: {
            "content-type": "application/json",
        },

        body: {
        }
    };

    request(options, function (error, resBcs, body) {
        if(resBcs.statusCode===200){
            data=body;
        }
        response.push({
            'result': 'success',
            'data': data
        });
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(response));
    });

});

router.get('/getServerInfo', function (req, res, next) {
    var response = [];
    let data={
        "BCS_URL": "http://129.156.117.35:3019",
        "BCS_CONTROL": "http://129.156.117.35:3011",
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

