// var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();

var userRouter = require('./user');
var dispenserRouter = require('./dispenser');
/*
 User Routers!
 */
router.use('/', userRouter);
router.use('/', dispenserRouter);


module.exports = router;