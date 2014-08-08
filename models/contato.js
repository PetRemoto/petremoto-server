var mongoose = require('mongoose');

// define the schema for our user model
var contatoSchema = new mongoose.Schema({
  operadora: { type: String, trim: true, required: true, minlength: 1, maxlength: 10},
  DDD: { type: String, trim: true, required: true, minlength: 3, maxlength: 3},
  numero: {type: String, trim: true, required: true, minlength: 7, maxlength: 12}
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Contato', contatoSchema);