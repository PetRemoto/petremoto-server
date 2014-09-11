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
router.post('/user/:id/dispenser', function (req, res) {

    var dispenser = new Dispenser();

    dispenser.serial = req.param('serial');
    dispenser.name = req.param('name');

    dispenser.save(function (err) {
        if (err) {
            if (err.errors.serial) {
                res.status(400).json({'status': 'failed', 'err': 'serial already registered'});
            } else {
                res.status(400).json({'status': 'failed', 'err': err});
            }
        } else {

            User.findByIdAndUpdate(req.param('id'), { $addToSet: { dispensers: dispenser._id }}, function (err, user) {
                if (err) {
                    res.status(400).json({'status': 'failed', 'err': err.stack});
                } else {
                    res.status(200).json({'status': 'success', 'user': user});
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
router.get('/dispenser/:serial/check/:refresh', function (req, res) {
    var query = {'serial': req.param('serial').toUpperCase() };

    Dispenser.findOne(query).exec(function (err, dispenser) {
        if (!err) {

            if (!dispenser) {
                res.status(400).json({'status': 'failed', 'err': 'dispenser not registered'});
            } else {

                if (req.param('refresh'))
                    dispenser.last_time_check = new Date();

                dispenser.save(function (err) {
                    if (err) {
                        res.status(400).json({'status': 'failed', 'err': err.stack});
                    } else {
                        res.status(200).json({'status': 'success', 'feed': dispenser.feed});
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
router.put('/dispenser/:serial/feed/:feed', function (req, res) {
    var query = {'serial': req.param('serial').toUpperCase() };

    Dispenser.update(query, { $set: { feed: req.param('feed') } }, function (err, dispenser) {
        if (err) {
            res.status(400).json({'status': 'failed', 'err': err.stack});
        } else if (dispenser == 0) {
            res.status(400).json({'status': 'failed', 'err': 'any dispenser found'});
        } else if (dispenser > 1) {
            res.status(400).json({'status': 'failed', 'err': 'you should modified only 1 dispenser. current: ' + dispenser});
        } else {
            res.status(200).json({'status': 'success', 'msg': dispenser + ' dispenser updated'});
        }
    });
});

/*
 Setar o status do dispenser.

 Parâmetros:
 - serial
 - status Boolean
 */
router.put('/dispenser/:serial/status/:status', function (req, res) {
    var query = {'serial': req.param('serial').toUpperCase() };

    Dispenser.findOne(query).exec(function (err, dispenser) {
        if (err) {
            res.status(400).json({'status': 'failed', 'err': err.stack});
        } else {

            if (!dispenser) {
                res.status(200).json({'status': 'failed', 'err': 'dispenser not registered'});
            } else {
                dispenser.status = req.param('status').toUpperCase();

                dispenser.save(function (err) {
                    if (err) {
                        res.status(400).json({'status': 'failed', 'err': err.stack});
                    } else {
                        res.status(200).json({'status': 'success', 'msg': 'status setted'});
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
            res.status(200).json({ 'dispensers': result });
        }
    });

});


module.exports = router;