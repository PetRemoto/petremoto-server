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

    dispenser.serial = req.param('serial');
    dispenser.name = req.param('name');

    dispenser.save(function (err) {
        if (err) {
            if (err.errors.serial) {
                res.json(400, {'status': 'failed', 'err': 'serial already registered'});
            } else {
                res.json(400, {'status': 'failed', 'err': err});
            }
        } else {

            User.findByIdAndUpdate(req.param('id'), { $addToSet: { dispensers: dispenser._id }}, function (err, user) {
                if (err) {
                    res.json(400, {'status': 'failed', 'err': err.stack});
                } else {
                    res.json(200, {'status': 'success', 'user': user});
                }
            });
        }
    });
});

/*
 Hora do ultimo check.

 Parâmetros:
 - serial
 - refresh (boolean)
 */
router.get('/dispenser/check', function (req, res) {
    var query = {'serial': req.param('serial').toUpperCase() };

    Dispenser.findOne(query).exec(function (err, dispenser) {
        if (!err) {

            if (!dispenser) {
                res.json(400, {'status': 'failed', 'err': 'dispenser not registered'});
            } else {

//                var feed = dispenser.feed;
                if (req.param('refresh'))
                    dispenser.last_time_check = new Date();

//                dispenser.feed = false;

                dispenser.save(function (err) {
                    if (err) {
                        res.json(400, {'status': 'failed', 'err': err.stack});
                    } else {
                        res.json(200, {'status': 'success', 'feed': dispenser.feed});
                    }
                });
            }
        }
    });
});


/*
 Setar um dispenser para alimentar ou não.

 Parâmetros:
 - serial
 - feed (boolean)
 */
router.post('/dispenser/feed', function (req, res) {
    var query = {'serial': req.param('serial').toUpperCase() };

    Dispenser.update(query, { $set: { feed: req.param('feed') } }, function (err, dispenser) {
        if (err) {
            res.json(400, {'status': 'failed', 'err': err.stack});
        } else if (dispenser == 0) {
            res.json(400, {'status': 'failed', 'err': 'any dispenser found'});
        } else if (dispenser > 1) {
            res.json(400, {'status': 'failed', 'err': 'you should modified only 1 dispenser. current: ' + dispenser});
        } else {
            res.json(200, {'status': 'success', 'msg': dispenser + ' dispenser updated'});
        }
    });
});

/*
 Setar o status do dispenser.

 Parâmetros:
 - serial
 - status Boolean
 */
router.post('/dispenser/status', function (req, res) {
    var query = {'serial': req.param('serial').toUpperCase() };

    Dispenser.findOne(query).exec(function (err, dispenser) {
        if (err) {
            res.json(400, {'status': 'failed', 'err': err.stack});
        } else {

            if (!dispenser) {
                res.json(200, {'status': 'failed', 'err': 'dispenser not registered'});
            } else {
                dispenser.status = req.param('status').toUpperCase();

                dispenser.save(function (err) {
                    if (err) {
                        res.json(400, {'status': 'failed', 'err': err.stack});
                    } else {
                        res.json(200, {'status': 'success', 'msg': 'status setted'});
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
            res.json(200, { 'dispensers': result });
        }
    });

});


module.exports = router;