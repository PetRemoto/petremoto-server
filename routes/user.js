var _ = require('lodash');
var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Dispenser = require('../models/dispenser');

/*
 Criar um usuário.

 Inputs:
 - username
 - password
 - email
 - fisrtname
 - lastname
 */
router.post('/user', function (req, res) {
    var user = new User();

    user.username = req.param('username').toLowerCase();
    user.password = req.param('password');
    user.email = req.param('email').toLowerCase();
    user.firstname = req.param('firstname').toLowerCase();
    user.lastname = req.param('lastname').toLowerCase();

    User.find({"username": req.param('username').toLowerCase()}).exec(function (err, users) {
        if (!err) {

            if (users.length > 0) {
                res.status(400).json({'status': 'failed', 'err': 'username already registered.'});
            } else {
                User.find({"email": req.param('email').toLowerCase()}).exec(function (err, users) {
                    if (!err) {

                        if (users.length > 0) {
                            res.status(400).json({'status': 'failed', 'err': 'email already registered.'});
                        } else {
                            // Saving it to the database.
                            user.save(function (err) {
                                if (err) {
                                    res.status(400).json({'status': 'failed', 'err': err.stack});
                                } else {
                                    res.status(200).json({'status': 'success', 'msg': 'user created'});
                                }
                            });
                        }
                    }
                });
            }
        }
    });

});

/*
 Recuperar um usuário.

 Parâmetros:
 - id
 */
router.get('/user/:id', function (req, res) {
    User.findById(req.param('id')).populate('dispensers').exec(function (err, users) {
        if (!err) {
            res.status(200).json({ 'users': users });
        }
    });
});


/*
 Editar um usuário.

 Input:
 - id
 - password
 - email
 - firstname
 - lastname
 */
router.post('/user/:id/edit', function (req, res) {
    var update = {};

    if (req.param('password'))
        update['password'] = req.param('password');

    if (req.param('email'))
        update['email'] = req.param('email').toLowerCase();

    if (req.param('firstname'))
        update['firstname'] = req.param('firstname').toLowerCase();

    if (req.param('lastname'))
        update['lastname'] = req.param('lastname').toLowerCase();


    User.findByIdAndUpdate(req.param('id'), update, function (err, data) {
        if (err) {
            res.status(400).json({'status': 'failed', 'err': err.stack});
        } else if (data) {
            res.status(200).json({'status': 'success', 'msg': 'user edited'});
        } else {
            res.status(400).json({'status': 'failed', 'err': 'user not found'});
        }
    });

});

/*
 Login no sistema.

 Parâmetros:
 - username
 - password
 */
router.get('/user/login', function (req, res) {
    var rules = {'username': req.param('username'), 'password': req.param('password')};

    User.find(rules).exec(function (err, users) {
        if (!err) {
            res.status(200).json({ 'users': users });
        }
    });

});


/*
 Recuperar todas as informações dos usuários no servidor.
 */
router.get('/user/all', function (req, res) {

    User.find({}).populate('dispensers').exec(function (err, result) {
        if (!err) {
            res.status(200).json({ 'users': result });
        }
    });

});


module.exports = router;
