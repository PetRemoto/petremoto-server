// var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Contato = require('../models/contato');


/*
  Adicionar um contato ao usuário.

  Parâmetros:
    - username
    - DDD
    - numero do telefone
    - Operadora
*/
router.post('/contact', function (req, res) {
  var rules = { 'username': req.body.username.toLowerCase() };

  User.findOne(rules).exec(function (err, user) {
    if (!err) {

      var contato = new Contato();

      contato.DDD = req.body.DDD;
      contato.numero = req.body.numero;
      contato.operadora = req.body.operadora.toLowerCase();

      contato.save(function (err) {
        if (err) {
          console.error(err.stack);
        } else {

          console.log(user, contato);

          user.contatos.push(contato._id);

          user.save(function (err) {
            if (err) {
              console.error(err.stack);
            } else {
              console.log('Contato adicionado', req.body);
              res.end('{status: success}');
            }
          });
        }
      });
    }
  });
});


/*
  Editar um contato.

  Parâmetros:
    - contato_id
    - DDD
    - Numero do Telefone
    - Operadora
*/
router.post('/contact/edit', function (req, res) {
  var update = {};

  if (req.body.DDD)
    update['DDD'] = req.body.DDD;

  if (req.body.numero)
    update['numero'] = req.body.numero.toLowerCase();

  if (req.body.operador)
    update['operador'] = req.body.operador.toLowerCase();


  Contato.findByIdAndUpdate(req.body.id, update, function (err, data) {
    if (err) {
      res.end(JSON.stringify({'status': 'failed', 'err': err.stack}));
    } else if (data) {
      res.end(JSON.stringify({'status': 'contact edited'}));
    } else {
      res.end(JSON.stringify({'status': 'failed', 'err': 'contact not found'}));
    }
  });
});


module.exports = router;