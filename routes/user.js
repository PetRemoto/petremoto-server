var _ = require('lodash');
var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Dispenser = require('../models/dispenser');

var dispenserRouter = require('./dispenser');


/*
    Contact Routers!
*/
router.use('/', dispenserRouter);


/*
    Criar um usuário.
    
    Inputs:
    - username
    - password
    - email
    - fisrtname
    - lastname
*/
router.post('/', function (req, res) {
    var user = new User();

    user.username = req.body.username.toLowerCase();
    user.password = req.body.password;
    user.email = req.body.email.toLowerCase();
    user.firstname = req.body.firstname.toLowerCase();
    user.lastname = req.body.lastname.toLowerCase();

    // var query = {"username": req.body.username.toLowerCase()}

    User.find({"username": req.body.username.toLowerCase()}).exec(function (err, users) {
        if (!err) {

            if (users.length > 0) {
                var result = {'status': 'failed', 'err': 'username already registered.'};
                res.end(JSON.stringify(result));
            } else {
                User.find({"email": req.body.email.toLowerCase()}).exec(function (err, users) {
                    if (!err) {

                        if (users.length > 0) {
                            var result = {'status': 'failed', 'err': 'email already registered.'};
                            res.end(JSON.stringify(result));
                        } else {
                            // Saving it to the database.
                            user.save(function (err) {
                                if (err) {
                                    var result = {'status': 'failed', 'err': err.stack};
                                } else {
                                    var result = {'status': 'success', 'msg': 'user created'};
                                }

                                res.end(JSON.stringify(result));
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
router.get('/', function (req, res) {

    User.findById(req.query.id).populate('dispensers').exec(function (err, users) {
        if (!err) {

            var result = {};
            result.users = users;

            res.send(result);
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
router.post('/edit', function (req, res) {
    // var query = { 'username': req.body.username.toLowerCase() };

    var update = {};

    if (req.body.password)
        update['password'] = req.body.password;

    if (req.body.email)
        update['email'] = req.body.email.toLowerCase();

    if (req.body.firstname)
        update['firstname'] = req.body.firstname.toLowerCase();

    if (req.body.lastname)
        update['lastname'] = req.body.lastname.toLowerCase();


    User.findByIdAndUpdate(req.body.id, update, function (err, data) {
        if (err) {
            res.end(JSON.stringify({'status': 'failed', 'err': err.stack}));
        } else if (data) {
            res.end(JSON.stringify({'status': 'success', 'msg': 'user edited'}));
        } else {
            res.end(JSON.stringify({'status': 'failed', 'err': 'user not found'}));
        }
    });

});

/*
    Login no sistema.
    
    Parâmetros:
    - username
    - password
*/
router.get('/login', function (req, res) {
    var rules = {'username': req.query.username, 'password': req.query.password};

    User.find(rules).exec(function (err, users) {
        if (!err) {
            var result = {};

            result.users = users;

            res.send(result);
        }
    });

});


/*
     Recuperar todas as informações dos usuários no servidor.
*/
router.get('/all', function (req, res) {

    User.find({}).populate('dispensers').exec(function (err, result) {
        if (!err) {
            var users = { 'users': result };

            res.send(users);
        }
    });

});


module.exports = router;
