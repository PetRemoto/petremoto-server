// var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();

var userRouter = require('./user');

/*
  User Routers!
*/
router.use('/user', userRouter);


module.exports = router;