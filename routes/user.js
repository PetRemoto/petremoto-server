var _  = require('lodash');
var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Contato = require('../models/contato');

var contactRouter = require('./contact');


/*
 Contact Routers!
 */
router.use('/', contactRouter);


/*
 Criar um usuário.

 Parâmetros:
 - username
 - password
 - email
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

    User.findById(req.query.id).populate('contatos').populate('requests').populate('friends').exec(function (err, users) {
        if (!err) {

            var result = {};
            result.users = users;

            res.send(result);
        }
    });
});




/*
 Editar um usuário.

 Parâmetros:
 - username
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
 Pesquisar usuários pelo username (CaseInsensitive)

 Parâmetros:
 - username
 */
router.get('/search', function (req, res) {
    var rules = { 'username': new RegExp('^' + req.query.username + '$', "i") };

    User.find(rules).populate('contatos').populate('requests').populate('friends').exec(function (err, users) {
        if (!err) {

            var result = {};
            result.users = users;

            res.send(result);
        }
    });

});


/*
 Request a friend.

 Parâmetros:
 - username id
 - friend id
 */
router.post('/request', function (req, res) {

    User.findById(req.body.friend).exec(function (err, user) {
        if (err) {
            res.end(JSON.stringify({'status': 'failed', 'err': err.stack}));
        } else {
            user.requests.push(req.body.id);

            user.save(function (err) {
                if (err) {
                    res.end(JSON.stringify({'status': 'failed', 'err': err.stack}));
                } else {
                    res.end(JSON.stringify({'status': 'success', 'msg': 'request sended'}));
                }
            });
        }
    });
});

/*
 Accept a friend request.

 Parâmetros:
 - user id
 - friend id
 */
router.post('/request/accept', function (req, res) {

    User.findById(req.body.id).exec(function (err, user) {
        if (err) {
            res.end(JSON.stringify({'status': 'failed', 'err': err.stack}));
        } else {

            var oldLength = user.requests.length;

            var evens = [];

            for (var i = 0; i < user.requests.length; i++) {
                if (user.requests[i] != req.body.friend) {
                    evens.push(user.requests[i]);
                }
            }

            if (oldLength != evens.length) {

                user.requests = evens;

                var hasFriend = _.contains(user.friends, req.body.friend);

                if (user.friends.indexOf(req.body.friend) == -1)
                    user.friends.push(req.body.friend);

                user.save(function (err) {
                    if (err) {
                        res.end(JSON.stringify({'status': 'failed', 'err': err.stack}));
                    } else {

                        User.findById(req.body.friend).exec(function (err, user) {
                            if (err) {
                                res.end(JSON.stringify({'status': 'failed', 'err': err.stack}));
                            } else {

                                var evens = [];

                                for (var i = 0; i < user.requests.length; i++) {
                                    if (user.requests[i] != req.body.id) {
                                        evens.push(user.requests[i]);
                                    }
                                }

                                user.requests = evens;

                                var hasFriend = _.contains(user.friends, req.body.id);

                                if (user.friends.indexOf(req.body.id) == -1)
                                    user.friends.push(req.body.id);

                                user.save(function (err) {
                                    if (err) {
                                        res.end(JSON.stringify({'status': 'failed', 'err': err.stack}));
                                    } else {
                                        res.end(JSON.stringify({'status': 'success', 'msg': 'request accepted'}));
                                    }

                                });

                            }
                        });

                        res.end(JSON.stringify({'status': 'success', 'msg': 'request accepted'}));
                    }

                });
            } else {
                res.end(JSON.stringify({'status': 'failed', 'err': 'you dont have this request'}));
            }

        }
    });
});



/*
 Reject a friend request.

 Parâmetros:
 - user id
 - friend id
 */
router.post('/request/remove', function (req, res) {

    User.findById(req.body.id).exec(function (err, user) {
        if (err) {
            res.end(JSON.stringify({'status': 'failed', 'err': err.stack}));
        } else {

            var oldLength = user.requests.length;

            var evens = [];

            for (var i = 0; i < user.requests.length; i++) {
                if (user.requests[i] != req.body.friend) {
                    evens.push(user.requests[i]);
                }
            }

            if (oldLength != evens.length) {
                user.requests = evens;

                user.save(function (err) {
                    if (err) {
                        res.end(JSON.stringify({'status': 'failed', 'err': err.stack}));
                    } else {
                        res.end(JSON.stringify({'status': 'success', 'msg': 'request removed'}));
                    }

                });
            } else {
                res.end(JSON.stringify({'status': 'failed', 'err': 'you dont have this request'}));
            }

        }
    });
});



/*
 Remove a friend.

 Parâmetros:
 - user id
 - friend id
 */
router.post('/friend/remove', function (req, res) {

    User.findById(req.body.id).exec(function (err, user) {
        if (err) {
            res.end(JSON.stringify({'status': 'failed', 'err': err.stack}));
        } else {

            var oldLength = user.friends.length;

            var evens = [];

            for (var i = 0; i < user.friends.length; i++) {
                if (user.friends[i] != req.body.friend) {
                    evens.push(user.friends[i]);
                }
            }

            if (oldLength != evens.length) {
                user.friends = evens;

                user.save(function (err) {
                    if (err) {
                        res.end(JSON.stringify({'status': 'failed', 'err': err.stack}));
                    } else {
                        res.end(JSON.stringify({'status': 'success', 'msg': 'friend removed'}));
                    }

                });
            } else {
                res.end(JSON.stringify({'status': 'failed', 'err': 'you dont have this friend'}));
            }

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

    User.find({}).populate('contatos').populate('requests').populate('friends').exec(function (err, result) {
        if (!err) {
            res.send(result);
        }
    });

});


module.exports = router;