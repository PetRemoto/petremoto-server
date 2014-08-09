// var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Dispenser = require('../models/dispenser');


/*
 Adicionar um dispenser ao usuário.

 Parâmetros:
 - id
 - serial
 - name
 */
router.post('/dispenser', function (req, res) {

    var dispenser = new Dispenser();

    dispenser.serial = req.body.serial;
    dispenser.name = req.body.name;

    dispenser.save(function (err) {
        if (err) {
            if (err.errors.serial) {
                res.end(JSON.stringify({'status': 'failed', 'err': 'serial already registered'}));
            } else {
                res.end(JSON.stringify({'status': 'failed', 'err': err}));
            }
        } else {

            User.findByIdAndUpdate(req.body.id, { $addToSet: { dispensers: dispenser._id }}, function (err, user) {
                if (err) {
                    res.end(JSON.stringify({'status': 'failed', 'err': err.stack}));
                } else {
                    res.end(JSON.stringify({'status': 'success', 'user': user}));
                }
            });
        }
    });
});

/*
 Hora do ultimo check.

 Parâmetros:
 - serial
 */
router.post('/dispenser/check', function (req, res) {
    var query = {'serial': req.body.serial.toUpperCase() };

    Dispenser.findOne(query).exec(function (err, dispenser) {
        if (!err) {

            if (!dispenser) {
                res.end(JSON.stringify({'status': 'failed', 'err': 'dispenser not registered'}));
            } else {

                var feed = dispenser.feed;

                dispenser.last_time_check = new Date();

                dispenser.feed = false;

                dispenser.save(function (err) {
                    if (err) {
                        res.end(JSON.stringify({'status': 'failed', 'err': err.stack}));
                    } else {
                        res.end(JSON.stringify({'status': 'success', 'feed': feed}));
                    }
                });
            }
        }
    });
});


/*
 Setar um dispenser para feed.

 Parâmetros:
 - serial
 */
router.post('/dispenser/feed', function (req, res) {
    var query = {'serial': req.body.serial.toUpperCase() };

    Dispenser.update(query, { $set: { feed: true } }, function (err, dispenser) {
        if (err) {
            res.end(JSON.stringify({'status': 'failed', 'err': err.stack}));
        } else if (dispenser == 0) {
            res.end(JSON.stringify({'status': 'failed', 'err': 'any dispenser found'}));
        } else if (dispenser > 1) {
            res.end(JSON.stringify({'status': 'failed', 'err': 'you should modified only 1 dispenser. current: ' + dispenser}));
        } else {
            res.end(JSON.stringify({'status': 'success', 'msg': dispenser + ' dispenser updated'}));
        }
    });
});

/*
 Setar o status do dispenser.

 Parâmetros:
 - serial
 */
router.post('/dispenser/status', function (req, res) {
    var query = {'serial': req.body.serial.toUpperCase() };

    Dispenser.findOne(query).exec(function (err, dispenser) {
        if (err) {
            res.end(JSON.stringify({'status': 'failed', 'err': err.stack}));
        } else {

            if (!dispenser) {
                res.end(JSON.stringify({'status': 'failed', 'err': 'dispenser not registered'}));
            } else {
                dispenser.status = req.body.status.toUpperCase();

                dispenser.save(function (err) {
                    if (err) {
                        res.end(JSON.stringify({'status': 'failed', 'err': err.stack}));
                    } else {
                        res.end(JSON.stringify({'status': 'success', 'msg': 'status setted'}));
                    }
                });
            }
        }
    });
});

/*
 Recuperar todas as informações dos dispensers no servidor.
 */
router.get('/dispenser/all', function (req, res) {

    Dispenser.find({}).exec(function (err, result) {
        if (!err) {
            var dispensers = { 'dispensers': result };

            res.send(dispensers);
        }
    });

});


module.exports = router;