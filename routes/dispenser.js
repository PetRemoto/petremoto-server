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
*/
router.post('/dispenser', function (req, res) {

  User.findById(id).exec(function (err, user) {
    if (!err) {

      var dispenser = new Dispenser();

      dispenser.serial = req.body.serial;

      dispenser.save(function (err) {
        if (err) {
          console.error(err.stack);
        } else {

          console.log(user, dispenser);

          user.dispensers.push(dispenser._id);

          user.save(function (err) {
            if (err) {
              console.error(err.stack);
            } else {
              res.end(JSON.stringify({'status': 'failed', 'err': 'dispenser added'}));
            }
          });
        }
      });
    }
  });
});


module.exports = router;